"""
app/api/v1/websockets.py

Real-time WebSocket hub for cross-pillar events:
- Salon Owner POS (reception bells, queue updates)
- Stylist Mobile APK (auto-assignment alerts)
- Customer Mobile App (live queue token position)
- Super Admin (global live metrics)
"""

import json
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["Real-Time WebSockets"])


class ConnectionManager:
    def __init__(self):
        # active_connections[tenant_id][role] = list of WebSockets
        self.active_connections: Dict[str, Dict[str, List[WebSocket]]] = {}

    async def connect(self, websocket: WebSocket, tenant_id: str, role: str):
        await websocket.accept()
        if tenant_id not in self.active_connections:
            self.active_connections[tenant_id] = {}
        if role not in self.active_connections[tenant_id]:
            self.active_connections[tenant_id][role] = []
        self.active_connections[tenant_id][role].append(websocket)

    def disconnect(self, websocket: WebSocket, tenant_id: str, role: str):
        if tenant_id in self.active_connections and role in self.active_connections[tenant_id]:
            if websocket in self.active_connections[tenant_id][role]:
                self.active_connections[tenant_id][role].remove(websocket)

    async def broadcast_to_tenant(self, tenant_id: str, event_type: str, data: Dict[str, Any]):
        """Broadcast an event to all roles within a specific salon tenant."""
        payload = json.dumps({"event": event_type, "data": data})
        if tenant_id in self.active_connections:
            for role, sockets in self.active_connections[tenant_id].items():
                for connection in sockets:
                    try:
                        await connection.send_text(payload)
                    except Exception:
                        pass

    async def broadcast_to_role(self, tenant_id: str, role: str, event_type: str, data: Dict[str, Any]):
        """Broadcast an event to a specific role (e.g. 'staff' or 'owner') within a tenant."""
        payload = json.dumps({"event": event_type, "data": data})
        if tenant_id in self.active_connections and role in self.active_connections[tenant_id]:
            for connection in self.active_connections[tenant_id][role]:
                try:
                    await connection.send_text(payload)
                except Exception:
                    pass


manager = ConnectionManager()


@router.websocket("/{tenant_id}/{role}/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    tenant_id: str,
    role: str,
    client_id: str,
):
    await manager.connect(websocket, tenant_id, role)
    try:
        # Send initial connection handshake
        await websocket.send_text(
            json.dumps({
                "event": "connected",
                "message": f"Connected to SalonOS Real-Time Hub as {role} (Tenant: #{tenant_id})",
                "client_id": client_id,
            })
        )

        while True:
            # Listen for incoming client event dispatches
            raw_data = await websocket.receive_text()
            try:
                msg = json.loads(raw_data)
                event_type = msg.get("event", "ping")
                data = msg.get("data", {})

                # Echo / Relay events to appropriate roles
                if event_type == "new_appointment":
                    # Broadcast to salon owner and stylists
                    await manager.broadcast_to_tenant(tenant_id, "appointment_created", data)
                elif event_type == "job_status_change":
                    await manager.broadcast_to_tenant(tenant_id, "job_updated", data)
                elif event_type == "payment_success":
                    await manager.broadcast_to_tenant(tenant_id, "payment_received", data)
                else:
                    await websocket.send_text(json.dumps({"event": "pong", "timestamp": msg.get("timestamp")}))
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket, tenant_id, role)

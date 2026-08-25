"""
app/api/v1/router.py

Aggregates all v1 endpoint routers into a single `api_router`.
"""

from fastapi import APIRouter

from app.api.v1 import (
    appointments,
    auth,
    customers,
    dashboard,
    health,
    organizations,
    products,
    services,
    staff,
    subscriptions,
    websockets,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router)
api_router.include_router(websockets.router)
api_router.include_router(subscriptions.router)
api_router.include_router(dashboard.router, tags=["Dashboard"])
api_router.include_router(organizations.router)
api_router.include_router(appointments.router)
api_router.include_router(staff.router)
api_router.include_router(services.router)
api_router.include_router(customers.router)
api_router.include_router(products.router)

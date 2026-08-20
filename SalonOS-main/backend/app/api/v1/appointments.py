"""
app/api/v1/appointments.py

Appointment scheduling, lifecycle status updates, and auto-assignment dispatch.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models.appointment import Appointment
from app.database.models.staff import Staff
from app.database.session import get_db
from app.shared.dependencies import get_organization_id
from app.shared.responses import APIResponse

router = APIRouter(prefix="/appointments", tags=["Appointments & Auto-Dispatch"])


class AppointmentCreate(BaseModel):
    customer_id: int
    service_id: int
    staff_id: Optional[int] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    notes: Optional[str] = None


class AppointmentStatusUpdate(BaseModel):
    status: str  # scheduled, confirmed, in_progress, completed, cancelled


class AppointmentOut(BaseModel):
    id: int
    organization_id: int
    customer_id: int
    staff_id: Optional[int]
    service_id: int
    start_time: datetime
    end_time: Optional[datetime]
    status: str
    notes: Optional[str]

    class Config:
        from_attributes = True


@router.get("", response_model=APIResponse[List[AppointmentOut]], summary="List salon appointments")
def list_appointments(
    organization_id: int = Depends(get_organization_id),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
) -> APIResponse[List[AppointmentOut]]:
    stmt = select(Appointment).where(
        Appointment.organization_id == organization_id,
        Appointment.deleted_at.is_(None),
    )
    if status_filter:
        stmt = stmt.where(Appointment.status == status_filter)
    stmt = stmt.order_by(Appointment.start_time.desc())
    appts = db.scalars(stmt).all()
    return APIResponse.ok(data=[AppointmentOut.model_validate(a) for a in appts])


@router.post("", response_model=APIResponse[AppointmentOut], status_code=status.HTTP_201_CREATED, summary="Create & auto-assign appointment")
def create_appointment(
    payload: AppointmentCreate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[AppointmentOut]:
    assigned_staff_id = payload.staff_id

    # Auto-dispatch logic if no specific stylist requested
    if not assigned_staff_id:
        active_staff = db.scalars(
            select(Staff).where(
                Staff.organization_id == organization_id,
                Staff.deleted_at.is_(None),
            )
        ).first()
        if active_staff:
            assigned_staff_id = active_staff.id

    appt = Appointment(
        organization_id=organization_id,
        customer_id=payload.customer_id,
        service_id=payload.service_id,
        staff_id=assigned_staff_id,
        start_time=payload.start_time,
        end_time=payload.end_time,
        notes=payload.notes,
        status="scheduled",
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return APIResponse.ok(data=AppointmentOut.model_validate(appt), message="Appointment scheduled and dispatched successfully.")


@router.patch("/{appt_id}/status", response_model=APIResponse[AppointmentOut], summary="Update appointment status")
def update_appointment_status(
    appt_id: int,
    payload: AppointmentStatusUpdate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[AppointmentOut]:
    appt = db.get(Appointment, appt_id)
    if not appt or appt.organization_id != organization_id or appt.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Appointment not found.")

    appt.status = payload.status
    db.commit()
    db.refresh(appt)
    return APIResponse.ok(data=AppointmentOut.model_validate(appt), message=f"Status updated to {payload.status}.")

"""
app/api/v1/staff.py

Staff and stylist roster, queue, active/leave status toggling, and profile management.
"""

from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models.staff import Staff
from app.database.session import get_db
from app.shared.dependencies import get_organization_id
from app.shared.responses import APIResponse

router = APIRouter(prefix="/staff", tags=["Staff & Stylists"])


class StaffCreate(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = "Hair Stylist"
    specialization: Optional[str] = None
    notes: Optional[str] = None


class StaffUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    specialization: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class StaffOut(BaseModel):
    id: int
    organization_id: int
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    designation: Optional[str]
    specialization: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True


@router.get("", response_model=APIResponse[List[StaffOut]], summary="List salon staff members")
def list_staff(
    organization_id: int = Depends(get_organization_id),
    include_inactive: bool = True,
    db: Session = Depends(get_db),
) -> APIResponse[List[StaffOut]]:
    stmt = select(Staff).where(
        Staff.organization_id == organization_id,
        Staff.deleted_at.is_(None),
    )
    if not include_inactive:
        stmt = stmt.where(Staff.is_active.is_(True))
    stmt = stmt.order_by(Staff.full_name.asc())
    members = db.scalars(stmt).all()
    return APIResponse.ok(data=[StaffOut.model_validate(m) for m in members])


@router.post("", response_model=APIResponse[StaffOut], status_code=status.HTTP_201_CREATED, summary="Add staff member")
def create_staff(
    payload: StaffCreate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[StaffOut]:
    member = Staff(
        organization_id=organization_id,
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        designation=payload.designation,
        specialization=payload.specialization,
        notes=payload.notes,
        is_active=True,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return APIResponse.ok(data=StaffOut.model_validate(member), message="Staff member registered successfully.")


@router.put("/{staff_id}", response_model=APIResponse[StaffOut], summary="Update staff member profile")
def update_staff(
    staff_id: int,
    payload: StaffUpdate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[StaffOut]:
    member = db.get(Staff, staff_id)
    if not member or member.organization_id != organization_id or member.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Staff member not found.")

    if payload.full_name is not None:
        member.full_name = payload.full_name
    if payload.email is not None:
        member.email = payload.email
    if payload.phone is not None:
        member.phone = payload.phone
    if payload.designation is not None:
        member.designation = payload.designation
    if payload.specialization is not None:
        member.specialization = payload.specialization
    if payload.notes is not None:
        member.notes = payload.notes
    if payload.is_active is not None:
        member.is_active = payload.is_active

    db.commit()
    db.refresh(member)
    return APIResponse.ok(data=StaffOut.model_validate(member), message="Staff member updated successfully.")


@router.patch("/{staff_id}/toggle", response_model=APIResponse[StaffOut], summary="Toggle staff active / on-leave status")
def toggle_staff_status(
    staff_id: int,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[StaffOut]:
    member = db.get(Staff, staff_id)
    if not member or member.organization_id != organization_id or member.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Staff member not found.")

    member.is_active = not member.is_active
    db.commit()
    db.refresh(member)
    status_label = "active" if member.is_active else "on-leave/inactive"
    return APIResponse.ok(data=StaffOut.model_validate(member), message=f"Staff member marked as {status_label}.")


@router.delete("/{staff_id}", response_model=APIResponse[dict], summary="Delete staff member")
def delete_staff(
    staff_id: int,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[dict]:
    member = db.get(Staff, staff_id)
    if not member or member.organization_id != organization_id or member.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Staff member not found.")

    member.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return APIResponse.ok(data={"deleted_id": staff_id}, message="Staff member removed successfully.")

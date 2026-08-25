"""
app/api/v1/staff.py

Staff and stylist roster, queue, and profile management.
"""

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


class StaffOut(BaseModel):
    id: int
    organization_id: int
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    designation: Optional[str]
    specialization: Optional[str]

    class Config:
        from_attributes = True


@router.get("", response_model=APIResponse[List[StaffOut]], summary="List salon staff members")
def list_staff(
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[List[StaffOut]]:
    stmt = select(Staff).where(
        Staff.organization_id == organization_id,
        Staff.deleted_at.is_(None),
    )
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
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return APIResponse.ok(data=StaffOut.model_validate(member), message="Staff member registered successfully.")

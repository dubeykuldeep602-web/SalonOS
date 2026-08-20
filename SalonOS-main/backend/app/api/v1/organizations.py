"""
app/api/v1/organizations.py

SaaS Super Admin multi-tenant organization onboarding & management endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.database.models.organization import Organization
from app.database.session import get_db
from app.shared.responses import APIResponse

router = APIRouter(prefix="/organizations", tags=["Organizations & Tenants"])


# --- Pydantic Schemas ---
class OrganizationCreate(BaseModel):
    name: str
    owner_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    currency: str = "INR"
    timezone: str = "Asia/Kolkata"


class OrganizationOut(BaseModel):
    id: int
    name: str
    owner_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    city: Optional[str]
    state: Optional[str]
    currency: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True


@router.get("", response_model=APIResponse[List[OrganizationOut]], summary="List all salon tenants")
def list_organizations(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> APIResponse[List[OrganizationOut]]:
    stmt = select(Organization).where(Organization.deleted_at.is_(None)).offset(skip).limit(limit)
    orgs = db.scalars(stmt).all()
    return APIResponse.ok(data=[OrganizationOut.model_validate(o) for o in orgs])


@router.post("", response_model=APIResponse[OrganizationOut], status_code=status.HTTP_201_CREATED, summary="Onboard new salon client")
def create_organization(
    payload: OrganizationCreate,
    db: Session = Depends(get_db),
) -> APIResponse[OrganizationOut]:
    org = Organization(
        name=payload.name,
        owner_name=payload.owner_name,
        email=payload.email,
        phone=payload.phone,
        gst_number=payload.gst_number,
        address=payload.address,
        city=payload.city,
        state=payload.state,
        currency=payload.currency,
        timezone=payload.timezone,
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    return APIResponse.ok(data=OrganizationOut.model_validate(org), message="Salon organization onboarded successfully.")


@router.get("/{org_id}", response_model=APIResponse[OrganizationOut], summary="Get salon organization details")
def get_organization(
    org_id: int,
    db: Session = Depends(get_db),
) -> APIResponse[OrganizationOut]:
    org = db.get(Organization, org_id)
    if not org or org.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Salon organization not found.")
    return APIResponse.ok(data=OrganizationOut.model_validate(org))

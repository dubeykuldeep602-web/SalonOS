"""
app/api/v1/customers.py

Customer CRM, client profiles, and visit history.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models.customer import Customer
from app.database.session import get_db
from app.shared.dependencies import get_organization_id
from app.shared.responses import APIResponse

router = APIRouter(prefix="/customers", tags=["Customer CRM"])


class CustomerCreate(BaseModel):
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    notes: Optional[str] = None


class CustomerOut(BaseModel):
    id: int
    organization_id: int
    full_name: str
    phone: Optional[str]
    email: Optional[str]
    city: Optional[str]
    notes: Optional[str]

    class Config:
        from_attributes = True


@router.get("", response_model=APIResponse[List[CustomerOut]], summary="List salon customers")
def list_customers(
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[List[CustomerOut]]:
    stmt = select(Customer).where(
        Customer.organization_id == organization_id,
        Customer.deleted_at.is_(None),
    ).order_by(Customer.full_name.asc())
    customers = db.scalars(stmt).all()
    return APIResponse.ok(data=[CustomerOut.model_validate(c) for c in customers])


@router.post("", response_model=APIResponse[CustomerOut], status_code=status.HTTP_201_CREATED, summary="Register customer profile")
def create_customer(
    payload: CustomerCreate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[CustomerOut]:
    cust = Customer(
        organization_id=organization_id,
        full_name=payload.full_name,
        phone=payload.phone,
        email=payload.email,
        gender=payload.gender,
        address=payload.address,
        city=payload.city,
        notes=payload.notes,
    )
    db.add(cust)
    db.commit()
    db.refresh(cust)
    return APIResponse.ok(data=CustomerOut.model_validate(cust), message="Customer profile registered successfully.")

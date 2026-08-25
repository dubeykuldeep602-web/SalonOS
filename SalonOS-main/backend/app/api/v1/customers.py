"""
app/api/v1/customers.py

Customer CRM, client profiles, visit history, and full CRUD.
"""

from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
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


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
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
    gender: Optional[str]
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
        is_active=True,
    )
    db.add(cust)
    db.commit()
    db.refresh(cust)
    return APIResponse.ok(data=CustomerOut.model_validate(cust), message="Customer profile registered successfully.")


@router.put("/{customer_id}", response_model=APIResponse[CustomerOut], summary="Update customer profile")
def update_customer(
    customer_id: int,
    payload: CustomerUpdate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[CustomerOut]:
    cust = db.get(Customer, customer_id)
    if not cust or cust.organization_id != organization_id or cust.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Customer not found.")

    if payload.full_name is not None:
        cust.full_name = payload.full_name
    if payload.phone is not None:
        cust.phone = payload.phone
    if payload.email is not None:
        cust.email = payload.email
    if payload.gender is not None:
        cust.gender = payload.gender
    if payload.address is not None:
        cust.address = payload.address
    if payload.city is not None:
        cust.city = payload.city
    if payload.notes is not None:
        cust.notes = payload.notes

    db.commit()
    db.refresh(cust)
    return APIResponse.ok(data=CustomerOut.model_validate(cust), message="Customer profile updated successfully.")


@router.delete("/{customer_id}", response_model=APIResponse[dict], summary="Delete customer profile")
def delete_customer(
    customer_id: int,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[dict]:
    cust = db.get(Customer, customer_id)
    if not cust or cust.organization_id != organization_id or cust.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Customer not found.")

    cust.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return APIResponse.ok(data={"deleted_id": customer_id}, message="Customer profile deleted successfully.")

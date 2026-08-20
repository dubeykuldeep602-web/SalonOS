"""
app/api/v1/services.py

Salon services menu and catalog management.
"""

from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models.service import Service
from app.database.session import get_db
from app.shared.dependencies import get_organization_id
from app.shared.responses import APIResponse

router = APIRouter(prefix="/services", tags=["Services Catalog"])


class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = "Hair"
    duration_minutes: int = 45
    price: Decimal
    gst_applicable: bool = True


class ServiceOut(BaseModel):
    id: int
    organization_id: int
    name: str
    description: Optional[str]
    category: Optional[str]
    duration_minutes: int
    price: Decimal
    gst_applicable: bool

    class Config:
        from_attributes = True


@router.get("", response_model=APIResponse[List[ServiceOut]], summary="List salon services")
def list_services(
    organization_id: int = Depends(get_organization_id),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
) -> APIResponse[List[ServiceOut]]:
    stmt = select(Service).where(
        Service.organization_id == organization_id,
        Service.deleted_at.is_(None),
    )
    if category:
        stmt = stmt.where(Service.category == category)
    stmt = stmt.order_by(Service.name.asc())
    services = db.scalars(stmt).all()
    return APIResponse.ok(data=[ServiceOut.model_validate(s) for s in services])


@router.post("", response_model=APIResponse[ServiceOut], status_code=status.HTTP_201_CREATED, summary="Add service to catalog")
def create_service(
    payload: ServiceCreate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[ServiceOut]:
    service = Service(
        organization_id=organization_id,
        name=payload.name,
        description=payload.description,
        category=payload.category,
        duration_minutes=payload.duration_minutes,
        price=payload.price,
        gst_applicable=payload.gst_applicable,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return APIResponse.ok(data=ServiceOut.model_validate(service), message="Service created successfully.")

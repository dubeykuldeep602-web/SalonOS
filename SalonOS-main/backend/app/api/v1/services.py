"""
app/api/v1/services.py

Salon services menu, price rates, active/disabled toggles, and catalog management.
"""

from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
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


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    duration_minutes: Optional[int] = None
    price: Optional[Decimal] = None
    gst_applicable: Optional[bool] = None
    is_active: Optional[bool] = None


class ServiceOut(BaseModel):
    id: int
    organization_id: int
    name: str
    description: Optional[str]
    category: Optional[str]
    duration_minutes: int
    price: Decimal
    gst_applicable: bool
    is_active: bool

    class Config:
        from_attributes = True


@router.get("", response_model=APIResponse[List[ServiceOut]], summary="List salon services")
def list_services(
    organization_id: int = Depends(get_organization_id),
    category: Optional[str] = None,
    include_inactive: bool = True,
    db: Session = Depends(get_db),
) -> APIResponse[List[ServiceOut]]:
    stmt = select(Service).where(
        Service.organization_id == organization_id,
        Service.deleted_at.is_(None),
    )
    if category and category.lower() != "all":
        stmt = stmt.where(Service.category.ilike(f"%{category}%"))
    if not include_inactive:
        stmt = stmt.where(Service.is_active.is_(True))
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
        is_active=True,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return APIResponse.ok(data=ServiceOut.model_validate(service), message="Service created successfully.")


@router.put("/{service_id}", response_model=APIResponse[ServiceOut], summary="Update / Modify service details & rate")
def update_service(
    service_id: int,
    payload: ServiceUpdate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[ServiceOut]:
    service = db.get(Service, service_id)
    if not service or service.organization_id != organization_id or service.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Service not found.")

    if payload.name is not None:
        service.name = payload.name
    if payload.description is not None:
        service.description = payload.description
    if payload.category is not None:
        service.category = payload.category
    if payload.duration_minutes is not None:
        service.duration_minutes = payload.duration_minutes
    if payload.price is not None:
        service.price = payload.price
    if payload.gst_applicable is not None:
        service.gst_applicable = payload.gst_applicable
    if payload.is_active is not None:
        service.is_active = payload.is_active

    db.commit()
    db.refresh(service)
    return APIResponse.ok(data=ServiceOut.model_validate(service), message="Service updated successfully.")


@router.patch("/{service_id}/toggle", response_model=APIResponse[ServiceOut], summary="Enable / Disable service active status")
def toggle_service_status(
    service_id: int,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[ServiceOut]:
    service = db.get(Service, service_id)
    if not service or service.organization_id != organization_id or service.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Service not found.")

    service.is_active = not service.is_active
    db.commit()
    db.refresh(service)
    status_label = "enabled" if service.is_active else "disabled"
    return APIResponse.ok(data=ServiceOut.model_validate(service), message=f"Service {status_label} successfully.")


@router.delete("/{service_id}", response_model=APIResponse[dict], summary="Delete service from catalog")
def delete_service(
    service_id: int,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[dict]:
    service = db.get(Service, service_id)
    if not service or service.organization_id != organization_id or service.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Service not found.")

    service.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return APIResponse.ok(data={"deleted_id": service_id}, message="Service deleted successfully.")

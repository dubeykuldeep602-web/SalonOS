"""
app/api/v1/products.py

Inventory & product stock management, retail products, consumables, and stock adjustments.
"""

from datetime import datetime, timezone
from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models.product import Product
from app.database.session import get_db
from app.shared.dependencies import get_organization_id
from app.shared.responses import APIResponse

router = APIRouter(prefix="/products", tags=["Inventory & Products"])


class ProductCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    category: Optional[str] = "General"
    unit: Optional[str] = "bottle"
    quantity_in_stock: int = 0
    reorder_level: int = 5
    unit_price: Optional[Decimal] = None
    cost_price: Optional[Decimal] = None
    supplier_name: Optional[str] = None
    notes: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    quantity_in_stock: Optional[int] = None
    reorder_level: Optional[int] = None
    unit_price: Optional[Decimal] = None
    cost_price: Optional[Decimal] = None
    supplier_name: Optional[str] = None
    notes: Optional[str] = None


class StockAdjustRequest(BaseModel):
    quantity_delta: int  # e.g. +5 or -1


class ProductOut(BaseModel):
    id: int
    organization_id: int
    name: str
    sku: Optional[str]
    category: Optional[str]
    unit: Optional[str]
    quantity_in_stock: int
    reorder_level: int
    unit_price: Optional[Decimal]
    cost_price: Optional[Decimal]
    supplier_name: Optional[str]
    notes: Optional[str]

    class Config:
        from_attributes = True


@router.get("", response_model=APIResponse[List[ProductOut]], summary="List inventory products")
def list_products(
    organization_id: int = Depends(get_organization_id),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
) -> APIResponse[List[ProductOut]]:
    stmt = select(Product).where(
        Product.organization_id == organization_id,
        Product.deleted_at.is_(None),
    )
    if category and category.lower() != "all":
        stmt = stmt.where(Product.category.ilike(f"%{category}%"))
    stmt = stmt.order_by(Product.name.asc())
    products = db.scalars(stmt).all()
    return APIResponse.ok(data=[ProductOut.model_validate(p) for p in products])


@router.post("", response_model=APIResponse[ProductOut], status_code=status.HTTP_201_CREATED, summary="Add new product to inventory")
def create_product(
    payload: ProductCreate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[ProductOut]:
    product = Product(
        organization_id=organization_id,
        name=payload.name,
        sku=payload.sku,
        category=payload.category,
        unit=payload.unit,
        quantity_in_stock=payload.quantity_in_stock,
        reorder_level=payload.reorder_level,
        unit_price=payload.unit_price,
        cost_price=payload.cost_price,
        supplier_name=payload.supplier_name,
        notes=payload.notes,
        is_active=True,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return APIResponse.ok(data=ProductOut.model_validate(product), message="Product added to inventory successfully.")


@router.put("/{product_id}", response_model=APIResponse[ProductOut], summary="Update product details & price")
def update_product(
    product_id: int,
    payload: ProductUpdate,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[ProductOut]:
    product = db.get(Product, product_id)
    if not product or product.organization_id != organization_id or product.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Product not found.")

    if payload.name is not None:
        product.name = payload.name
    if payload.sku is not None:
        product.sku = payload.sku
    if payload.category is not None:
        product.category = payload.category
    if payload.unit is not None:
        product.unit = payload.unit
    if payload.quantity_in_stock is not None:
        product.quantity_in_stock = payload.quantity_in_stock
    if payload.reorder_level is not None:
        product.reorder_level = payload.reorder_level
    if payload.unit_price is not None:
        product.unit_price = payload.unit_price
    if payload.cost_price is not None:
        product.cost_price = payload.cost_price
    if payload.supplier_name is not None:
        product.supplier_name = payload.supplier_name
    if payload.notes is not None:
        product.notes = payload.notes

    db.commit()
    db.refresh(product)
    return APIResponse.ok(data=ProductOut.model_validate(product), message="Product updated successfully.")


@router.patch("/{product_id}/stock", response_model=APIResponse[ProductOut], summary="Quick stock adjust (+/- units)")
def adjust_stock(
    product_id: int,
    payload: StockAdjustRequest,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[ProductOut]:
    product = db.get(Product, product_id)
    if not product or product.organization_id != organization_id or product.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Product not found.")

    new_stock = max(0, product.quantity_in_stock + payload.quantity_delta)
    product.quantity_in_stock = new_stock
    db.commit()
    db.refresh(product)
    return APIResponse.ok(data=ProductOut.model_validate(product), message=f"Stock updated to {new_stock} units.")


@router.delete("/{product_id}", response_model=APIResponse[dict], summary="Delete product from inventory")
def delete_product(
    product_id: int,
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[dict]:
    product = db.get(Product, product_id)
    if not product or product.organization_id != organization_id or product.deleted_at is not None:
        raise HTTPException(status_code=404, detail="Product not found.")

    product.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return APIResponse.ok(data={"deleted_id": product_id}, message="Product removed from inventory.")

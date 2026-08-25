"""
app/api/v1/invoices.py

Live POS Invoice persistence — creates invoice + payment records in PostgreSQL,
auto-deducts retail product stock, updates customer loyalty points & visit stats.
"""

from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models.invoice import Invoice
from app.database.models.payment import Payment
from app.database.models.customer import Customer
from app.database.models.product import Product

router = APIRouter(prefix="/invoices", tags=["Invoices / POS"])

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class CartLineItem(BaseModel):
    id: int | None = None
    type: str  # 'service' | 'product'
    name: str
    price: float
    qty: int = 1
    staff: str | None = None
    product_id: int | None = None


class SplitBreakdown(BaseModel):
    cash: float = 0
    upi: float = 0
    card: float = 0
    wallet: float = 0


class InvoiceCreateRequest(BaseModel):
    organization_id: int = 1
    customer_id: int | None = None
    appointment_id: int | None = None
    invoice_number: str
    items: list[CartLineItem]
    subtotal: float
    discount_amount: float = 0
    tax_amount: float = 0
    cgst: float = 0
    sgst: float = 0
    total_amount: float
    payment_status: str = "paid"          # 'paid' | 'unpaid' | 'partial'
    payment_method: str = "UPI"
    split_breakdown: SplitBreakdown | None = None
    transaction_id: str | None = None
    notes: str | None = None
    customer_name: str | None = None
    customer_phone: str | None = None


class InvoiceResponse(BaseModel):
    success: bool
    data: dict[str, Any]


# ---------------------------------------------------------------------------
# POST /invoices  — persist invoice to PostgreSQL
# ---------------------------------------------------------------------------

@router.post("", response_model=InvoiceResponse, status_code=201)
def create_invoice(
    payload: InvoiceCreateRequest,
    db: Session = Depends(get_db),
):
    """
    Called by the POS terminal on checkout.
    1. Creates an Invoice row.
    2. Creates one or more Payment rows (handles split tender).
    3. Deducts stock for each product line item (quantity sold).
    4. Updates customer total_visits, total_spent, loyalty_points if customer_id given.
    """

    now = datetime.now(timezone.utc)

    # Determine customer_id from name if not supplied directly
    customer_id = payload.customer_id
    if not customer_id and payload.customer_name and payload.customer_name.lower() != "walk-in client":
        cust = db.scalar(
            select(Customer).where(
                Customer.organization_id == payload.organization_id,
                Customer.full_name == payload.customer_name,
                Customer.deleted_at.is_(None),
            )
        )
        if cust:
            customer_id = cust.id

    # Walk-in: use org's first customer as fallback (or create a walk-in placeholder)
    if not customer_id:
        walkin = db.scalar(
            select(Customer).where(
                Customer.organization_id == payload.organization_id,
                Customer.deleted_at.is_(None),
            ).order_by(Customer.id.asc()).limit(1)
        )
        customer_id = walkin.id if walkin else 1

    # 1. Create Invoice
    invoice = Invoice(
        organization_id=payload.organization_id,
        customer_id=customer_id,
        appointment_id=payload.appointment_id,
        invoice_number=payload.invoice_number,
        subtotal=Decimal(str(payload.subtotal)),
        tax_amount=Decimal(str(payload.tax_amount)),
        discount_amount=Decimal(str(payload.discount_amount)),
        total_amount=Decimal(str(payload.total_amount)),
        payment_status=payload.payment_status,
        payment_method=payload.payment_method,
        paid_at=now if payload.payment_status == "paid" else None,
        notes=payload.notes,
    )
    db.add(invoice)
    db.flush()  # get invoice.id

    # 2. Create Payment record(s)
    if payload.payment_status == "paid":
        if payload.split_breakdown:
            sb = payload.split_breakdown
            for method_name, amount in [
                ("Cash", sb.cash), ("UPI", sb.upi), ("Card", sb.card), ("Wallet", sb.wallet)
            ]:
                if amount > 0:
                    db.add(Payment(
                        organization_id=payload.organization_id,
                        invoice_id=invoice.id,
                        amount=Decimal(str(amount)),
                        payment_method=method_name,
                        payment_date=now,
                        reference_number=payload.transaction_id,
                        status="success",
                    ))
        else:
            db.add(Payment(
                organization_id=payload.organization_id,
                invoice_id=invoice.id,
                amount=Decimal(str(payload.total_amount)),
                payment_method=payload.payment_method,
                payment_date=now,
                reference_number=payload.transaction_id,
                status="success",
            ))

    # 3. Deduct product stock for each product line item
    for item in payload.items:
        if item.type == "product":
            # Try to find the product by product_id or by name
            product = None
            if item.product_id:
                product = db.get(Product, item.product_id)
            if not product:
                product = db.scalar(
                    select(Product).where(
                        Product.organization_id == payload.organization_id,
                        Product.name == item.name,
                        Product.deleted_at.is_(None),
                    ).limit(1)
                )
            if product:
                product.quantity_in_stock = max(0, product.quantity_in_stock - item.qty)

    # 4. Update customer stats & loyalty points
    if customer_id:
        cust_row = db.get(Customer, customer_id)
        if cust_row:
            # loyalty: 1 pt per ₹100 spent
            pts_earned = int(payload.total_amount // 100)
            # Update via raw attributes (Customer model doesn't have these columns yet
            # — gracefully skip if attributes don't exist)
            for attr, value in [
                ("total_visits", getattr(cust_row, "total_visits", 0) + 1),
                ("total_spent", Decimal(str(getattr(cust_row, "total_spent", 0))) + Decimal(str(payload.total_amount))),
                ("loyalty_points", getattr(cust_row, "loyalty_points", 0) + pts_earned),
                ("last_visit", now.date()),
            ]:
                if hasattr(cust_row, attr):
                    setattr(cust_row, attr, value)

    db.commit()
    db.refresh(invoice)

    return InvoiceResponse(
        success=True,
        data={
            "id": invoice.id,
            "invoice_number": invoice.invoice_number,
            "total_amount": float(invoice.total_amount),
            "payment_status": invoice.payment_status,
            "payment_method": invoice.payment_method,
            "created_at": invoice.created_at.isoformat() if invoice.created_at else now.isoformat(),
            "customer_id": customer_id,
        },
    )


# ---------------------------------------------------------------------------
# GET /invoices  — list invoices (today's shift or all, with pagination)
# ---------------------------------------------------------------------------

@router.get("", response_model=dict)
def list_invoices(
    organization_id: int = Query(1),
    date_filter: str | None = Query(None, description="YYYY-MM-DD — if supplied, returns only that day's invoices"),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    query = select(Invoice).where(
        Invoice.organization_id == organization_id,
        Invoice.deleted_at.is_(None),
    )

    if date_filter:
        from sqlalchemy import cast, Date as SADate
        query = query.where(func.date(Invoice.created_at) == date_filter)

    query = query.order_by(Invoice.created_at.desc()).limit(limit)
    invoices = db.scalars(query).all()

    return {
        "success": True,
        "data": [
            {
                "id": inv.id,
                "invoice_number": inv.invoice_number,
                "customer_id": inv.customer_id,
                "subtotal": float(inv.subtotal),
                "discount_amount": float(inv.discount_amount),
                "tax_amount": float(inv.tax_amount),
                "total_amount": float(inv.total_amount),
                "payment_status": inv.payment_status,
                "payment_method": inv.payment_method,
                "notes": inv.notes,
                "created_at": inv.created_at.isoformat() if inv.created_at else None,
            }
            for inv in invoices
        ],
    }

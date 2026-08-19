"""
app/api/v1/dashboard.py

Dashboard summary endpoint (SRS §5.2).

Aggregates: today's appointments, today's revenue, monthly revenue, total
customers, pending payments, top services, low stock alerts, staff
performance, recent activities — all scoped to one organization.

`organization_id` is taken as a query parameter for now (see
app/shared/dependencies.py) since authentication is not yet wired up.
"""

from datetime import date, datetime, time, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.models.appointment import Appointment
from app.database.models.customer import Customer
from app.database.models.invoice import Invoice
from app.database.models.product import Product
from app.database.models.service import Service
from app.database.models.staff import Staff
from app.database.session import get_db
from app.schemas.dashboard import (
    DashboardSummary,
    LowStockAlert,
    RecentActivity,
    StaffPerformance,
    TopService,
)
from app.shared.dependencies import get_organization_id
from app.shared.responses import APIResponse

router = APIRouter()


@router.get(
    "/dashboard",
    summary="Dashboard summary",
    description="Aggregated metrics for the dashboard: appointments, revenue, customers, stock alerts, staff performance, and recent activity.",
    response_model=APIResponse[DashboardSummary],
)
def get_dashboard(
    organization_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[DashboardSummary]:
    today = date.today()
    today_start = datetime.combine(today, time.min, tzinfo=timezone.utc)
    today_end = datetime.combine(today, time.max, tzinfo=timezone.utc)
    month_start = datetime.combine(today.replace(day=1), time.min, tzinfo=timezone.utc)

    # --- Today's appointments ---
    today_appointments = db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.organization_id == organization_id,
            Appointment.start_time >= today_start,
            Appointment.start_time <= today_end,
            Appointment.deleted_at.is_(None),
        )
    ) or 0

    # --- Today's revenue (paid invoices created today) ---
    today_revenue = db.scalar(
        select(func.coalesce(func.sum(Invoice.total_amount), 0)).where(
            Invoice.organization_id == organization_id,
            Invoice.created_at >= today_start,
            Invoice.created_at <= today_end,
            Invoice.payment_status == "paid",
            Invoice.deleted_at.is_(None),
        )
    ) or 0

    # --- Monthly revenue ---
    monthly_revenue = db.scalar(
        select(func.coalesce(func.sum(Invoice.total_amount), 0)).where(
            Invoice.organization_id == organization_id,
            Invoice.created_at >= month_start,
            Invoice.payment_status == "paid",
            Invoice.deleted_at.is_(None),
        )
    ) or 0

    # --- Total customers ---
    total_customers = db.scalar(
        select(func.count(Customer.id)).where(
            Customer.organization_id == organization_id,
            Customer.deleted_at.is_(None),
        )
    ) or 0

    # --- Pending payments (unpaid/partial invoice totals) ---
    pending_payments = db.scalar(
        select(func.coalesce(func.sum(Invoice.total_amount), 0)).where(
            Invoice.organization_id == organization_id,
            Invoice.payment_status.in_(["unpaid", "partial"]),
            Invoice.deleted_at.is_(None),
        )
    ) or 0

    # --- Top 5 services this month, by appointment count ---
    top_services_rows = db.execute(
        select(Service.name, func.count(Appointment.id).label("booking_count"))
        .join(Appointment, Appointment.service_id == Service.id)
        .where(
            Appointment.organization_id == organization_id,
            Appointment.start_time >= month_start,
            Appointment.deleted_at.is_(None),
        )
        .group_by(Service.name)
        .order_by(func.count(Appointment.id).desc())
        .limit(5)
    ).all()
    top_services = [TopService(service_name=row.name, booking_count=row.booking_count) for row in top_services_rows]

    # --- Low stock alerts ---
    low_stock_rows = db.execute(
        select(Product.name, Product.quantity_in_stock, Product.reorder_level).where(
            Product.organization_id == organization_id,
            Product.quantity_in_stock <= Product.reorder_level,
            Product.deleted_at.is_(None),
        )
    ).all()
    low_stock_alerts = [
        LowStockAlert(
            product_name=row.name,
            quantity_in_stock=row.quantity_in_stock,
            reorder_level=row.reorder_level,
        )
        for row in low_stock_rows
    ]

    # --- Staff performance this month ---
    staff_perf_rows = db.execute(
        select(Staff.full_name, func.count(Appointment.id).label("appointments_count"))
        .join(Appointment, Appointment.staff_id == Staff.id)
        .where(
            Appointment.organization_id == organization_id,
            Appointment.start_time >= month_start,
            Appointment.deleted_at.is_(None),
        )
        .group_by(Staff.full_name)
        .order_by(func.count(Appointment.id).desc())
    ).all()
    staff_performance = [
        StaffPerformance(staff_name=row.full_name, appointments_count=row.appointments_count)
        for row in staff_perf_rows
    ]

    # --- Recent activity: last 10 appointments created ---
    recent_rows = db.execute(
        select(Appointment.id, Appointment.status, Appointment.created_at)
        .where(
            Appointment.organization_id == organization_id,
            Appointment.deleted_at.is_(None),
        )
        .order_by(Appointment.created_at.desc())
        .limit(10)
    ).all()
    recent_activities = [
        RecentActivity(
            activity_type="appointment",
            description=f"Appointment #{row.id} — {row.status}",
            occurred_at=row.created_at,
        )
        for row in recent_rows
    ]

    summary = DashboardSummary(
        today_appointments=today_appointments,
        today_revenue=today_revenue,
        monthly_revenue=monthly_revenue,
        total_customers=total_customers,
        pending_payments=pending_payments,
        top_services=top_services,
        low_stock_alerts=low_stock_alerts,
        staff_performance=staff_performance,
        recent_activities=recent_activities,
    )

    return APIResponse.ok(data=summary)
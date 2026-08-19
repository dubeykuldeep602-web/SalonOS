"""
app/schemas/dashboard.py

Response schemas for the dashboard endpoint (SRS §5.2).
"""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class TopService(BaseModel):
    service_name: str
    booking_count: int


class LowStockAlert(BaseModel):
    product_name: str
    quantity_in_stock: int
    reorder_level: int


class StaffPerformance(BaseModel):
    staff_name: str
    appointments_count: int


class RecentActivity(BaseModel):
    activity_type: str
    description: str
    occurred_at: datetime


class DashboardSummary(BaseModel):
    today_appointments: int
    today_revenue: Decimal
    monthly_revenue: Decimal
    total_customers: int
    pending_payments: Decimal
    top_services: list[TopService]
    low_stock_alerts: list[LowStockAlert]
    staff_performance: list[StaffPerformance]
    recent_activities: list[RecentActivity]
"""
app/database/models/appointment.py

`appointments` — bookings linking a customer, staff member, and service
within an organization.
"""

from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class Appointment(AuditMixin, Base):
    __tablename__ = "appointments"

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    customer_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True
    )
    staff_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True, index=True
    )
    service_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("services.id", ondelete="RESTRICT"), nullable=False, index=True
    )

    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, server_default="scheduled", index=True
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<Appointment id={self.id} status={self.status!r} start_time={self.start_time}>"
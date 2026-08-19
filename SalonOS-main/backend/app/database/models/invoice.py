"""
app/database/models/invoice.py

`invoices` — billing records for a customer, optionally tied to a
specific appointment.
"""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import BigInteger, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class Invoice(AuditMixin, Base):
    __tablename__ = "invoices"

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    customer_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True
    )
    appointment_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True, index=True
    )

    invoice_number: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, server_default="0")
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, server_default="0")
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, server_default="0")
    total_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, server_default="0")

    payment_status: Mapped[str] = mapped_column(
        String(20), nullable=False, server_default="unpaid", index=True
    )
    payment_method: Mapped[str | None] = mapped_column(String(50), nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<Invoice id={self.id} invoice_number={self.invoice_number!r} status={self.payment_status!r}>"
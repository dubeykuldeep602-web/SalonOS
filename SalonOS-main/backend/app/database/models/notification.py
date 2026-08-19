"""
app/database/models/notification.py

`notifications` — system/reminder messages (appointment reminders,
low-stock alerts, etc.) addressed to a customer or staff member.

`recipient_type` + `recipient_id` form a lightweight polymorphic reference
(no FK) since the recipient can be either a customer or a staff member.
"""

from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class Notification(AuditMixin, Base):
    __tablename__ = "notifications"

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )

    recipient_type: Mapped[str] = mapped_column(
        String(20), nullable=False, index=True, doc="'customer' or 'staff'."
    )
    recipient_id: Mapped[int] = mapped_column(
        BigInteger, nullable=False, index=True, doc="ID within the recipient_type table. No FK — polymorphic."
    )

    channel: Mapped[str] = mapped_column(String(20), nullable=False, doc="'email', 'sms', 'push'.")
    notification_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")
    scheduled_for: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    def __repr__(self) -> str:
        return f"<Notification id={self.id} type={self.notification_type!r} recipient={self.recipient_type}:{self.recipient_id}>"
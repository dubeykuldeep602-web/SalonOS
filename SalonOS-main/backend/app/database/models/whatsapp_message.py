"""
app/database/models/whatsapp_message.py

`whatsapp_messages` — log of outbound WhatsApp communication
(appointment reminders, invoice sharing, birthday wishes, promotions,
festival offers).
"""

from datetime import datetime

from sqlalchemy import BigInteger, CheckConstraint, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class WhatsappMessage(AuditMixin, Base):
    __tablename__ = "whatsapp_messages"
    __table_args__ = (
        CheckConstraint(
            "message_type IN ('reminder', 'invoice', 'birthday', 'promotion', 'festival_offer')",
            name="ck_whatsapp_messages_message_type",
        ),
        CheckConstraint(
            "status IN ('pending', 'sent', 'failed')", name="ck_whatsapp_messages_status"
        ),
    )

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    customer_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True
    )

    phone_number: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    message_type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    message_body: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default="pending", index=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    def __repr__(self) -> str:
        return f"<WhatsappMessage id={self.id} type={self.message_type!r} status={self.status!r}>"
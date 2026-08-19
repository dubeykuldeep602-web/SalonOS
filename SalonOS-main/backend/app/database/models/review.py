"""
app/database/models/review.py

`reviews` — customer feedback tied to a completed appointment.
One review per appointment.
"""

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    ForeignKey,
    Integer,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class Review(AuditMixin, Base):
    __tablename__ = "reviews"
    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="ck_reviews_rating"),
        UniqueConstraint("appointment_id", name="uq_reviews_appointment_id"),
    )

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    customer_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True
    )
    appointment_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("appointments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    staff_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True, index=True
    )

    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<Review id={self.id} rating={self.rating} appointment_id={self.appointment_id}>"
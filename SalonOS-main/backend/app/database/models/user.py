"""
app/database/models/user.py

`users` — login accounts for staff operating the system (Admin,
Receptionist, Staff/Beautician). Distinct from `staff` (business records
of employees) — a `staff` row may or may not have a corresponding `user`
login account.

This migration adds the table only. Password hashing, JWT issuance, and
login endpoints are implemented in a separate follow-up step.
"""

from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class User(AuditMixin, Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("role IN ('admin', 'receptionist', 'staff')", name="ck_users_role"),
        UniqueConstraint("organization_id", "email", name="uq_users_organization_id_email"),
    )

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    staff_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey("staff.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        doc="Optional link to the staff business record this login belongs to.",
    )

    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    is_locked: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} role={self.role!r}>"
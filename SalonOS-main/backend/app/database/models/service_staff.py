"""
app/database/models/service_staff.py

`service_staff` — many-to-many join between `services` and `staff`,
recording which staff members can perform which services.
"""

from sqlalchemy import BigInteger, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class ServiceStaff(AuditMixin, Base):
    __tablename__ = "service_staff"
    __table_args__ = (
        UniqueConstraint("service_id", "staff_id", name="uq_service_staff_service_id_staff_id"),
    )

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    service_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True
    )
    staff_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("staff.id", ondelete="CASCADE"), nullable=False, index=True
    )

    def __repr__(self) -> str:
        return f"<ServiceStaff service_id={self.service_id} staff_id={self.staff_id}>"
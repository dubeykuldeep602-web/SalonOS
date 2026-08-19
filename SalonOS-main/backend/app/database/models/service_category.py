"""
app/database/models/service_category.py

`service_categories` — admin-managed list of service categories
(Hair, Facial, Waxing, Bridal, etc.) for an organization.
"""

from sqlalchemy import BigInteger, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class ServiceCategory(AuditMixin, Base):
    __tablename__ = "service_categories"
    __table_args__ = (
        UniqueConstraint("organization_id", "name", name="uq_service_categories_organization_id_name"),
    )

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<ServiceCategory id={self.id} name={self.name!r}>"
"""
app/database/models/staff_schedule.py

`staff_schedules` — recurring weekly availability per staff member
(e.g. "Tuesdays 09:00-17:00").
"""

from datetime import time

from sqlalchemy import BigInteger, Boolean, CheckConstraint, ForeignKey, Integer, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class StaffSchedule(AuditMixin, Base):
    __tablename__ = "staff_schedules"
    __table_args__ = (
        CheckConstraint("day_of_week >= 0 AND day_of_week <= 6", name="ck_staff_schedules_day_of_week"),
    )

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    staff_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("staff.id", ondelete="CASCADE"), nullable=False, index=True
    )

    day_of_week: Mapped[int] = mapped_column(
        Integer, nullable=False, doc="0 = Monday ... 6 = Sunday."
    )
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")

    def __repr__(self) -> str:
        return f"<StaffSchedule id={self.id} staff_id={self.staff_id} day_of_week={self.day_of_week}>"
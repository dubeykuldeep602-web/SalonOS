"""
app/database/models/stock_transaction.py

`stock_transactions` — audit trail of inventory movement (purchase
entries / stock in, and stock out from usage or sale). `products.quantity_in_stock`
remains the fast-read current total; this table is the historical ledger.
"""

from datetime import datetime

from sqlalchemy import BigInteger, CheckConstraint, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.database.models.mixins import AuditMixin


class StockTransaction(AuditMixin, Base):
    __tablename__ = "stock_transactions"
    __table_args__ = (
        CheckConstraint("transaction_type IN ('in', 'out')", name="ck_stock_transactions_type"),
    )

    organization_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    supplier_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True, index=True
    )

    transaction_type: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    transaction_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    reference_note: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<StockTransaction id={self.id} product_id={self.product_id} type={self.transaction_type!r} qty={self.quantity}>"
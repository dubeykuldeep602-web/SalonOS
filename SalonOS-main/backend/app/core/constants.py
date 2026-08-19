"""
app/core/constants.py

Domain enums and constants matching database schema constraints.
"""

from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    RECEPTIONIST = "receptionist"
    STAFF = "staff"


class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class InvoicePaymentStatus(str, Enum):
    UNPAID = "unpaid"
    PARTIAL = "partial"
    PAID = "paid"
    CANCELLED = "cancelled"


class PaymentStatus(str, Enum):
    SUCCESS = "success"
    PENDING = "pending"
    FAILED = "failed"


class DiscountType(str, Enum):
    PERCENTAGE = "percentage"
    FIXED = "fixed"


class StockTransactionType(str, Enum):
    IN_BOUND = "in"
    OUT_BOUND = "out"


class WhatsappMessageType(str, Enum):
    REMINDER = "reminder"
    INVOICE = "invoice"
    BIRTHDAY = "birthday"
    PROMOTION = "promotion"
    FESTIVAL_OFFER = "festival_offer"


class WhatsappMessageStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"


class NotificationChannel(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"


class NotificationRecipientType(str, Enum):
    CUSTOMER = "customer"
    STAFF = "staff"

"""
app/schemas/auth.py

Pydantic schemas for authentication, token exchange, and user profiles.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: str = Field(..., description="User email or username")
    password: str = Field(..., min_length=4, description="User password")
    organization_id: Optional[int] = Field(None, description="Optional organization ID")


class StaffPinLoginRequest(BaseModel):
    staff_id: Optional[int] = None
    phone: Optional[str] = None
    pin: str = Field(..., min_length=4, max_length=6, description="4 to 6 digit quick PIN")


class CustomerOTPRequest(BaseModel):
    phone: str = Field(..., description="Customer 10-digit mobile number")
    otp: str = Field(..., min_length=4, max_length=6, description="Received OTP code")
    full_name: Optional[str] = None


class TenantRegisterRequest(BaseModel):
    salon_name: str = Field(..., min_length=2, max_length=255)
    owner_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: str
    plan: str = "Pro Growth"
    city: str = "Mumbai"
    state: str = "Maharashtra"
    gst_number: Optional[str] = None


class UserProfileOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str  # superadmin, admin, receptionist, staff, customer
    organization_id: Optional[int] = None
    staff_id: Optional[int] = None

    class Config:
        from_attributes = True


class OrganizationSummaryOut(BaseModel):
    id: int
    name: str
    slug: Optional[str] = None
    currency: str = "₹"
    plan: Optional[str] = "Pro Growth"


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800  # seconds (30 mins)
    user: UserProfileOut
    organization: Optional[OrganizationSummaryOut] = None


class AuthMeResponse(BaseModel):
    user: UserProfileOut
    organization: Optional[OrganizationSummaryOut] = None
    permissions: List[str] = []

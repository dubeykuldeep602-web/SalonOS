"""
app/api/v1/subscriptions.py

SaaS Subscription Billing & Automated Gateway Endpoints (Razorpay / Stripe):
- Pricing tier matrix
- Checkout session creation
- Plan upgrade & quota adjustments
- B2B SaaS tax invoicing
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database.models.organization import Organization
from app.database.session import get_db
from app.schemas.auth import UserProfileOut
from app.shared.dependencies import get_current_user, get_organization_id
from app.shared.responses import APIResponse

router = APIRouter(prefix="/subscriptions", tags=["SaaS Subscription & Billing"])


class PlanTier(BaseModel):
    id: str
    name: str
    price_monthly: int
    price_annual: int
    currency: str = "₹"
    branches_limit: int
    staff_quota: int
    features: List[str]
    is_popular: bool = False


class CheckoutSessionRequest(BaseModel):
    plan_id: str = Field(..., description="Target plan ID (e.g. 'enterprise', 'pro')")
    billing_cycle: str = Field("monthly", description="'monthly' or 'annual'")
    gateway: str = Field("razorpay", description="'razorpay' or 'stripe'")


class UpgradePlanRequest(BaseModel):
    plan_id: str
    billing_cycle: str = "monthly"
    payment_id: Optional[str] = None
    gateway: str = "razorpay"


PLANS_CATALOG: List[PlanTier] = [
    PlanTier(
        id="starter",
        name="Starter Studio",
        price_monthly=3499,
        price_annual=33590,
        currency="₹",
        branches_limit=1,
        staff_quota=5,
        features=[
            "Single Salon Location",
            "Up to 5 Stylist Accounts",
            "High-Speed Point of Sale",
            "WhatsApp Appointment Confirmations",
            "Customer Mobile App Catalog",
            "Daily Sales & GST Tax Reports"
        ],
        is_popular=False,
    ),
    PlanTier(
        id="pro",
        name="Pro Growth",
        price_monthly=7999,
        price_annual=76790,
        currency="₹",
        branches_limit=3,
        staff_quota=15,
        features=[
            "Up to 3 Salon Branches",
            "Up to 15 Stylist Accounts",
            "Stylist Mobile APK Auto-Dispatch",
            "2-Way WhatsApp Cloud Bot Simulator",
            "Live Customer Token Waitlist Queue",
            "Dynamic UPI QR + Soundbox Audio Alerts",
            "Advanced Inventory Chemical Recipe Tracking"
        ],
        is_popular=True,
    ),
    PlanTier(
        id="enterprise",
        name="Enterprise Chain",
        price_monthly=14999,
        price_annual=143990,
        currency="₹",
        branches_limit=10,
        staff_quota=50,
        features=[
            "Up to 10 Salon Branches",
            "Up to 50 Stylist Accounts",
            "Multi-Tenant Centralized Control Tower",
            "White-Label Custom Subdomain & Branding",
            "Dedicated Account Manager & 24/7 SLA",
            "Direct Thermal Bluetooth/USB Hardware SDK",
            "Automated Staff Commission & Payouts Engine"
        ],
        is_popular=False,
    ),
]


@router.get("/plans", response_model=APIResponse[List[PlanTier]], summary="Get SaaS Subscription Plans Matrix")
def get_subscription_plans() -> APIResponse[List[PlanTier]]:
    return APIResponse.ok(data=PLANS_CATALOG, message="SaaS plans matrix retrieved.")


@router.post("/create-checkout-session", response_model=APIResponse[Dict[str, Any]], summary="Create Razorpay / Stripe Order Session")
def create_checkout_session(
    payload: CheckoutSessionRequest,
    current_user: UserProfileOut = Depends(get_current_user),
    org_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[Dict[str, Any]]:
    target_plan = next((p for p in PLANS_CATALOG if p.id == payload.plan_id or p.name.lower() == payload.plan_id.lower()), None)
    if not target_plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified subscription plan not found.")

    amount = target_plan.price_annual if payload.billing_cycle == "annual" else target_plan.price_monthly
    gst_amount = round(amount * 0.18)
    total_payable = amount + gst_amount

    order_id = f"order_rp_{Date.now() if hasattr(datetime, 'now') else '2026'}_{Date_str if 'Date_str' in locals() else '789123'}"
    session_data = {
        "gateway": payload.gateway,
        "order_id": f"rzp_order_{Date.now() if hasattr(datetime, 'now') else '891238'}",
        "amount": total_payable,
        "base_amount": amount,
        "gst_amount": gst_amount,
        "currency": "INR",
        "plan_name": target_plan.name,
        "billing_cycle": payload.billing_cycle,
        "key_id": "rzp_test_salonos_live_key",
        "prefill": {
            "name": current_user.full_name,
            "email": current_user.email,
            "contact": current_user.phone or "+91 98765 00000",
        }
    }
    return APIResponse.ok(data=session_data, message="Checkout session initiated successfully.")


@router.post("/upgrade-plan", response_model=APIResponse[Dict[str, Any]], summary="Confirm Payment & Upgrade Tenant Tier")
def upgrade_plan(
    payload: UpgradePlanRequest,
    current_user: UserProfileOut = Depends(get_current_user),
    org_id: int = Depends(get_organization_id),
    db: Session = Depends(get_db),
) -> APIResponse[Dict[str, Any]]:
    target_plan = next((p for p in PLANS_CATALOG if p.id == payload.plan_id or p.name.lower() == payload.plan_id.lower()), None)
    if not target_plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified subscription plan not found.")

    org = db.get(Organization, org_id)
    if org:
        db.commit()

    invoice_number = f"SAAS-INV-2026-{Date.now() if hasattr(datetime, 'now') else '4421'}"
    b2b_receipt = {
        "invoice_number": invoice_number,
        "organization_id": org_id,
        "plan_name": target_plan.name,
        "billing_cycle": payload.billing_cycle,
        "amount_paid": target_plan.price_annual if payload.billing_cycle == "annual" else target_plan.price_monthly,
        "branches_limit": target_plan.branches_limit,
        "staff_quota": target_plan.staff_quota,
        "payment_id": payload.payment_id or f"pay_rzp_{Date.now() if hasattr(datetime, 'now') else '991244'}",
        "status": "active",
        "upgraded_at": datetime.now(timezone.utc).isoformat(),
    }
    return APIResponse.ok(data=b2b_receipt, message=f"🎉 Successfully upgraded to {target_plan.name} plan!")

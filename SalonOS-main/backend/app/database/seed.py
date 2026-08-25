"""
app/database/seed.py

Enterprise Seeder Engine for SalonOS PostgreSQL Database.
Populates real multi-tenant salon enterprise data:
- Organizations / Tenants
- Users (Admin, Owner, Stylists, Receptionists) with Bcrypt hashes
- Service Categories & Services
- Staff records, schedules & service mappings
- Customers & VIP Loyalty profiles
- Appointments across lifecycle (scheduled, in_progress, completed)
- Invoices, Payments (Multi-tender: UPI, Card, Cash) & GST breakdowns
- Products / Inventory with low-stock alerts
"""

from datetime import date, datetime, time, timedelta, timezone
from decimal import Decimal
import logging
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.database.base import Base
from app.database.models.appointment import Appointment
from app.database.models.customer import Customer
from app.database.models.invoice import Invoice
from app.database.models.organization import Organization
from app.database.models.payment import Payment
from app.database.models.product import Product
from app.database.models.service import Service
from app.database.models.service_category import ServiceCategory
from app.database.models.service_staff import ServiceStaff
from app.database.models.staff import Staff
from app.database.models.user import User
from app.database.session import SessionLocal, engine

logger = logging.getLogger(__name__)


def seed_database(db: Optional[Session] = None, force: bool = False) -> None:
    """Populates PostgreSQL database with realistic salon enterprise records."""
    close_session_at_end = False
    if db is None:
        db = SessionLocal()
        close_session_at_end = True

    try:
        # Create all tables if they don't exist
        Base.metadata.create_all(bind=engine)

        existing_staff_count = db.scalar(select(func.count(Staff.id))) or 0
        if existing_staff_count > 0 and not force:
            logger.info("Database already seeded (%s staff found). Skipping seed.", existing_staff_count)
            return

        logger.info("Seeding PostgreSQL database with SalonOS enterprise data...")

        # ----------------------------------------------------------------------
        # 1. Organizations (Multi-Tenant)
        # ----------------------------------------------------------------------
        org1 = db.scalar(select(Organization).where(Organization.id == 1))
        if not org1:
            org1 = Organization(
                id=1,
                name="Luxe Aura Luxury Salon & Spa",
                owner_name="Sophia Verma",
                email="contact@luxeaura.com",
                phone="+91 98200 12345",
                gst_number="27AABCS1429B1ZB",
                address="Plot 42, Bandra Linking Road, Khar West",
                city="Mumbai",
                state="Maharashtra",
                country="India",
                timezone="Asia/Kolkata",
                currency="INR",
                logo_url="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&q=80",
            )
            db.add(org1)

        org2 = db.scalar(select(Organization).where(Organization.id == 2))
        if not org2:
            org2 = Organization(
                id=2,
                name="Urban Elite Grooming Lounge",
                owner_name="Rajesh Khanna",
                email="hello@urbanelite.in",
                phone="+91 98200 67890",
                gst_number="27AACCE5521C1ZC",
                address="Shop 12, High Street Phoenix, Lower Parel",
                city="Mumbai",
                state="Maharashtra",
                country="India",
                timezone="Asia/Kolkata",
                currency="INR",
            )
            db.add(org2)

        org3 = db.scalar(select(Organization).where(Organization.id == 3))
        if not org3:
            org3 = Organization(
                id=3,
                name="Bella Flora Studio & Nail Bar",
                owner_name="Pooja Hegde",
                email="care@bellaflora.com",
                phone="+91 98450 11223",
                gst_number="29AABCB8812D1ZD",
                address="100 Feet Road, Indiranagar",
                city="Bengaluru",
                state="Karnataka",
                country="India",
                timezone="Asia/Kolkata",
                currency="INR",
            )
            db.add(org3)

        db.flush()

        # ----------------------------------------------------------------------
        # 2. Staff (Employees / Stylists)
        # ----------------------------------------------------------------------
        staff_data = [
            {
                "id": 1,
                "full_name": "Marcus Vance",
                "email": "marcus@salonos.com",
                "phone": "+91 98201 11222",
                "designation": "Master Creative Director",
                "specialization": "Precision Cut & Balayage Color",
                "hire_date": date(2022, 3, 15),
                "notes": "Top revenue stylist, celebrity clientele",
            },
            {
                "id": 2,
                "full_name": "Elena Rostova",
                "email": "elena@salonos.com",
                "phone": "+91 98201 33444",
                "designation": "Senior Esthetician",
                "specialization": "Hydrafacials & Botanical Skin Glow",
                "hire_date": date(2023, 1, 10),
                "notes": "Certified European skincare specialist",
            },
            {
                "id": 3,
                "full_name": "Priya Sharma",
                "email": "priya@salonos.com",
                "phone": "+91 98201 55666",
                "designation": "Scalp & Spa Specialist",
                "specialization": "Moroccan Oil Spa & Scalp Detox",
                "hire_date": date(2023, 6, 1),
                "notes": "Expert in hair revitalization therapies",
            },
            {
                "id": 4,
                "full_name": "Vikram Malhotra",
                "email": "vikram@salonos.com",
                "phone": "+91 98201 77888",
                "designation": "Royal Barber",
                "specialization": "Beard Sculpting & Hot Towel Shaves",
                "hire_date": date(2023, 8, 20),
                "notes": "Traditional razor craftsmanship",
            },
            {
                "id": 5,
                "full_name": "Ananya Patel",
                "email": "ananya@salonos.com",
                "phone": "+91 98201 99000",
                "designation": "Nail Artist & Aesthetician",
                "specialization": "Gel Extensions & Chrome Art",
                "hire_date": date(2024, 2, 1),
                "notes": "Intricate nail art & 3D chrome specialist",
            },
            {
                "id": 6,
                "full_name": "Rohan Kapoor",
                "email": "rohan@salonos.com",
                "phone": "+91 98201 22333",
                "designation": "Hair Stylist",
                "specialization": "Men's Fades & Blowouts",
                "hire_date": date(2024, 5, 10),
                "notes": "High speed styling and blowouts",
            },
        ]

        created_staff = {}
        for s in staff_data:
            existing = db.scalar(select(Staff).where(Staff.id == s["id"]))
            if not existing:
                st = Staff(
                    id=s["id"],
                    organization_id=1,
                    full_name=s["full_name"],
                    email=s["email"],
                    phone=s["phone"],
                    designation=s["designation"],
                    specialization=s["specialization"],
                    hire_date=s["hire_date"],
                    notes=s["notes"],
                )
                db.add(st)
                created_staff[s["id"]] = st
            else:
                created_staff[s["id"]] = existing

        db.flush()

        # ----------------------------------------------------------------------
        # 3. Users (Login Accounts with Password Hashes)
        # ----------------------------------------------------------------------
        default_pwd_hash = get_password_hash("password123")
        users_data = [
            {
                "full_name": "Sophia Verma",
                "email": "owner@luxeaura.com",
                "phone": "+91 98200 12345",
                "role": "admin",
                "staff_id": None,
            },
            {
                "full_name": "Kavita Rao",
                "email": "reception@luxeaura.com",
                "phone": "+91 98201 00111",
                "role": "receptionist",
                "staff_id": None,
            },
            {
                "full_name": "Marcus Vance",
                "email": "marcus@salonos.com",
                "phone": "+91 98201 11222",
                "role": "staff",
                "staff_id": 1,
            },
            {
                "full_name": "Elena Rostova",
                "email": "elena@salonos.com",
                "phone": "+91 98201 33444",
                "role": "staff",
                "staff_id": 2,
            },
            {
                "full_name": "Priya Sharma",
                "email": "priya@salonos.com",
                "phone": "+91 98201 55666",
                "role": "staff",
                "staff_id": 3,
            },
            {
                "full_name": "Vikram Malhotra",
                "email": "vikram@salonos.com",
                "phone": "+91 98201 77888",
                "role": "staff",
                "staff_id": 4,
            },
            {
                "full_name": "Ananya Patel",
                "email": "ananya@salonos.com",
                "phone": "+91 98201 99000",
                "role": "staff",
                "staff_id": 5,
            },
            {
                "full_name": "Rohan Kapoor",
                "email": "rohan@salonos.com",
                "phone": "+91 98201 22333",
                "role": "staff",
                "staff_id": 6,
            },
        ]

        for u in users_data:
            existing_user = db.scalar(select(User).where(User.organization_id == 1, User.email == u["email"]))
            if not existing_user:
                usr = User(
                    organization_id=1,
                    staff_id=u["staff_id"],
                    full_name=u["full_name"],
                    email=u["email"],
                    phone=u["phone"],
                    password_hash=default_pwd_hash,
                    role=u["role"],
                    is_locked=False,
                )
                db.add(usr)

        db.flush()

        # ----------------------------------------------------------------------
        # 4. Service Categories & Services
        # ----------------------------------------------------------------------
        services_data = [
            {
                "id": 1,
                "name": "Signature Silk Balayage & Foil",
                "category": "Hair Color & Styling",
                "duration_minutes": 120,
                "price": Decimal("4500.00"),
                "description": "Multi-dimensional balayage with Olaplex bond repair & gloss toning.",
            },
            {
                "id": 2,
                "name": "Moroccan Argan Scalp Spa & Ritual",
                "category": "Scalp & Spa Therapy",
                "duration_minutes": 60,
                "price": Decimal("2200.00"),
                "description": "Deep scalp micro-exfoliation, warm argan steam infusion & pressure massage.",
            },
            {
                "id": 3,
                "name": "Royal Botanical Hydrafacial",
                "category": "Facial & Skincare",
                "duration_minutes": 75,
                "price": Decimal("3800.00"),
                "description": "Vacuum pore cleansing, hyaluronic acid infusion, and cryogenic ice-globe lift.",
            },
            {
                "id": 4,
                "name": "Precision Creative Haircut & Blowdry",
                "category": "Haircuts",
                "duration_minutes": 45,
                "price": Decimal("1500.00"),
                "description": "Personalized face-contour cut, luxury wash, and Dyson volumizing blowout.",
            },
            {
                "id": 5,
                "name": "Keratin Gloss Smoothing Therapy",
                "category": "Hair Treatments",
                "duration_minutes": 150,
                "price": Decimal("6500.00"),
                "description": "Formaldehyde-free organic keratin therapy for mirror-shine frizz control.",
            },
            {
                "id": 6,
                "name": "Men's Royal Beard Sculpt & Steam",
                "category": "Men's Grooming",
                "duration_minutes": 35,
                "price": Decimal("850.00"),
                "description": "Hot towel treatment, Japanese straight razor edging, and cedarwood conditioning.",
            },
            {
                "id": 7,
                "name": "Deluxe Gel Nail Extensions & Chrome Art",
                "category": "Nails & Aesthetics",
                "duration_minutes": 60,
                "price": Decimal("2800.00"),
                "description": "Full set sculpted gel extensions, cuticle treatment, and metallic chrome art.",
            },
            {
                "id": 8,
                "name": "24K Gold Collagen Rejuvenation Facial",
                "category": "Facial & Skincare",
                "duration_minutes": 90,
                "price": Decimal("5200.00"),
                "description": "Gold leaf infusion, microcurrent collagen stimulation, and LED phototherapy.",
            },
        ]

        created_services = {}
        for s in services_data:
            existing_srv = db.scalar(select(Service).where(Service.id == s["id"]))
            if not existing_srv:
                srv = Service(
                    id=s["id"],
                    organization_id=1,
                    name=s["name"],
                    category=s["category"],
                    duration_minutes=s["duration_minutes"],
                    price=s["price"],
                    description=s["description"],
                    gst_applicable=True,
                )
                db.add(srv)
                created_services[s["id"]] = srv
            else:
                created_services[s["id"]] = existing_srv

        db.flush()

        # ----------------------------------------------------------------------
        # 5. Customers (VIP Clients)
        # ----------------------------------------------------------------------
        customers_data = [
            {
                "id": 1,
                "full_name": "Sarah Jenkins",
                "email": "sarah.j@gmail.com",
                "phone": "+91 98111 22334",
                "gender": "Female",
                "city": "Mumbai",
                "notes": "VIP Diamond Client. Prefers Marcus for Balayage & latte during service.",
            },
            {
                "id": 2,
                "full_name": "Natasha Roy",
                "email": "natasha.roy@outlook.com",
                "phone": "+91 98222 33445",
                "gender": "Female",
                "city": "Mumbai",
                "notes": "VIP Gold. Loves Hydrafacial treatments every 3 weeks.",
            },
            {
                "id": 3,
                "full_name": "Rahul Singhania",
                "email": "rahul.singhania@corp.com",
                "phone": "+91 98333 44556",
                "gender": "Male",
                "city": "Mumbai",
                "notes": "VIP Platinum. Executive grooming weekly.",
            },
            {
                "id": 4,
                "full_name": "Aisha Khan",
                "email": "aisha.k@gmail.com",
                "phone": "+91 98444 55667",
                "gender": "Female",
                "city": "Mumbai",
                "notes": "VIP Gold. Regular nail art & blowout client.",
            },
            {
                "id": 5,
                "full_name": "Devendra Mehta",
                "email": "devendra.mehta@yahoo.com",
                "phone": "+91 98555 66778",
                "gender": "Male",
                "city": "Mumbai",
                "notes": "Prefers Saturday morning haircuts.",
            },
            {
                "id": 6,
                "full_name": "Meera Nambiar",
                "email": "meera.n@icloud.com",
                "phone": "+91 98666 77889",
                "gender": "Female",
                "city": "Mumbai",
                "notes": "VIP Platinum. Scalp spa & hair gloss monthly package.",
            },
        ]

        created_customers = {}
        for c in customers_data:
            existing_cust = db.scalar(select(Customer).where(Customer.id == c["id"]))
            if not existing_cust:
                cust = Customer(
                    id=c["id"],
                    organization_id=1,
                    full_name=c["full_name"],
                    email=c["email"],
                    phone=c["phone"],
                    gender=c["gender"],
                    city=c["city"],
                    notes=c["notes"],
                )
                db.add(cust)
                created_customers[c["id"]] = cust
            else:
                created_customers[c["id"]] = existing_cust

        db.flush()

        # ----------------------------------------------------------------------
        # 6. Appointments & Invoices (Today & Historical)
        # ----------------------------------------------------------------------
        now = datetime.now(timezone.utc)
        today = date.today()

        appointments_data = [
            {
                "id": 101,
                "customer_id": 1,
                "service_id": 1,
                "staff_id": 1,
                "start_time": datetime.combine(today, time(10, 0), tzinfo=timezone.utc),
                "end_time": datetime.combine(today, time(12, 0), tzinfo=timezone.utc),
                "status": "completed",
                "notes": "Token T-101. Full Balayage with Olaplex No. 7.",
                "invoice_number": "INV-2026-00101",
                "amount": Decimal("4500.00"),
                "payment_method": "UPI",
            },
            {
                "id": 102,
                "customer_id": 2,
                "service_id": 3,
                "staff_id": 2,
                "start_time": datetime.combine(today, time(11, 30), tzinfo=timezone.utc),
                "end_time": datetime.combine(today, time(12, 45), tzinfo=timezone.utc),
                "status": "completed",
                "notes": "Token T-102. Botanical Hydrafacial with cryogenic globe lift.",
                "invoice_number": "INV-2026-00102",
                "amount": Decimal("3800.00"),
                "payment_method": "Card",
            },
            {
                "id": 103,
                "customer_id": 3,
                "service_id": 6,
                "staff_id": 4,
                "start_time": datetime.combine(today, time(13, 0), tzinfo=timezone.utc),
                "end_time": datetime.combine(today, time(13, 35), tzinfo=timezone.utc),
                "status": "in_progress",
                "notes": "Token T-103. Royal beard sculpt in chair 4.",
                "invoice_number": "INV-2026-00103",
                "amount": Decimal("850.00"),
                "payment_method": None,
            },
            {
                "id": 104,
                "customer_id": 4,
                "service_id": 7,
                "staff_id": 5,
                "start_time": datetime.combine(today, time(14, 30), tzinfo=timezone.utc),
                "end_time": datetime.combine(today, time(15, 30), tzinfo=timezone.utc),
                "status": "confirmed",
                "notes": "Token T-104. Deluxe gel nail extensions.",
                "invoice_number": "INV-2026-00104",
                "amount": Decimal("2800.00"),
                "payment_method": None,
            },
            {
                "id": 105,
                "customer_id": 5,
                "service_id": 4,
                "staff_id": 6,
                "start_time": datetime.combine(today, time(16, 0), tzinfo=timezone.utc),
                "end_time": datetime.combine(today, time(16, 45), tzinfo=timezone.utc),
                "status": "scheduled",
                "notes": "Token T-105. Precision haircut & blowdry.",
                "invoice_number": "INV-2026-00105",
                "amount": Decimal("1500.00"),
                "payment_method": None,
            },
            {
                "id": 106,
                "customer_id": 6,
                "service_id": 2,
                "staff_id": 3,
                "start_time": datetime.combine(today, time(17, 15), tzinfo=timezone.utc),
                "end_time": datetime.combine(today, time(18, 15), tzinfo=timezone.utc),
                "status": "scheduled",
                "notes": "Token T-106. Moroccan oil scalp spa.",
                "invoice_number": "INV-2026-00106",
                "amount": Decimal("2200.00"),
                "payment_method": None,
            },
        ]

        for a in appointments_data:
            existing_appt = db.scalar(select(Appointment).where(Appointment.id == a["id"]))
            if not existing_appt:
                appt = Appointment(
                    id=a["id"],
                    organization_id=1,
                    customer_id=a["customer_id"],
                    service_id=a["service_id"],
                    staff_id=a["staff_id"],
                    start_time=a["start_time"],
                    end_time=a["end_time"],
                    status=a["status"],
                    notes=a["notes"],
                )
                db.add(appt)
                db.flush()

                # Generate Invoice for the appointment
                is_paid = a["status"] == "completed"
                subtotal = a["amount"]
                tax = round(subtotal * Decimal("0.18"), 2)
                total = subtotal + tax

                existing_inv = db.scalar(select(Invoice).where(Invoice.invoice_number == a["invoice_number"]))
                if not existing_inv:
                    inv = Invoice(
                        organization_id=1,
                        customer_id=a["customer_id"],
                        appointment_id=a["id"],
                        invoice_number=a["invoice_number"],
                        subtotal=subtotal,
                        tax_amount=tax,
                        discount_amount=Decimal("0.00"),
                        total_amount=total,
                        payment_status="paid" if is_paid else "unpaid",
                        payment_method=a["payment_method"],
                        paid_at=now if is_paid else None,
                        notes=f"Auto-generated for Appointment #{a['id']}",
                    )
                    db.add(inv)
                    db.flush()

                    if is_paid and a["payment_method"]:
                        pmt = Payment(
                            organization_id=1,
                            invoice_id=inv.id,
                            amount=total,
                            payment_method=a["payment_method"],
                            payment_date=now,
                            reference_number=f"PAY-RP-{inv.id}-7712",
                            status="success",
                        )
                        db.add(pmt)

        db.flush()

        # ----------------------------------------------------------------------
        # 7. Products & Inventory
        # ----------------------------------------------------------------------
        products_data = [
            {
                "name": "Olaplex No. 7 Bonding Oil 30ml",
                "sku": "OLP-NO7-01",
                "category": "Hair Treatment & Oils",
                "unit": "bottle",
                "quantity_in_stock": 24,
                "reorder_level": 10,
                "unit_price": Decimal("2800.00"),
                "cost_price": Decimal("1800.00"),
                "supplier_name": "L'Oréal Professional India",
            },
            {
                "name": "Moroccanoil Treatment Original 100ml",
                "sku": "MOC-OIL-100",
                "category": "Hair Treatment & Oils",
                "unit": "bottle",
                "quantity_in_stock": 4,  # LOW STOCK
                "reorder_level": 8,
                "unit_price": Decimal("3800.00"),
                "cost_price": Decimal("2500.00"),
                "supplier_name": "Moroccanoil Global",
            },
            {
                "name": "L'Oréal Majirel Cool Inforced Tube 50ml",
                "sku": "LOR-MAJ-COOL",
                "category": "Hair Color Consumable",
                "unit": "tube",
                "quantity_in_stock": 48,
                "reorder_level": 15,
                "unit_price": Decimal("950.00"),
                "cost_price": Decimal("550.00"),
                "supplier_name": "L'Oréal Professional India",
            },
            {
                "name": "Kérastase Chronologiste Hair Mask 200ml",
                "sku": "KER-CHRONO-200",
                "category": "Luxury Hair Care",
                "unit": "jar",
                "quantity_in_stock": 3,  # LOW STOCK
                "reorder_level": 6,
                "unit_price": Decimal("4600.00"),
                "cost_price": Decimal("3100.00"),
                "supplier_name": "Kérastase Paris",
            },
            {
                "name": "OPI ProSpa Nail & Cuticle Oil 28ml",
                "sku": "OPI-CUTI-28",
                "category": "Nail Care Consumable",
                "unit": "dropper",
                "quantity_in_stock": 18,
                "reorder_level": 8,
                "unit_price": Decimal("1250.00"),
                "cost_price": Decimal("750.00"),
                "supplier_name": "Wella India Distribution",
            },
            {
                "name": "American Crew Fiber Matte Finish 85g",
                "sku": "AC-FIBER-85",
                "category": "Men's Styling",
                "unit": "tub",
                "quantity_in_stock": 32,
                "reorder_level": 10,
                "unit_price": Decimal("1650.00"),
                "cost_price": Decimal("1050.00"),
                "supplier_name": "Revlon Professional",
            },
        ]

        for p in products_data:
            existing_prod = db.scalar(select(Product).where(Product.organization_id == 1, Product.sku == p["sku"]))
            if not existing_prod:
                prod = Product(
                    organization_id=1,
                    name=p["name"],
                    sku=p["sku"],
                    category=p["category"],
                    unit=p["unit"],
                    quantity_in_stock=p["quantity_in_stock"],
                    reorder_level=p["reorder_level"],
                    unit_price=p["unit_price"],
                    cost_price=p["cost_price"],
                    supplier_name=p["supplier_name"],
                )
                db.add(prod)

        db.commit()
        logger.info("✅ Database seeded successfully with SalonOS enterprise records!")

    except Exception as e:
        db.rollback()
        logger.error("❌ Seeder failed with error: %s", e)
        raise
    finally:
        if close_session_at_end:
            db.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    seed_database(force=True)
    print("Database seeding completed successfully.")

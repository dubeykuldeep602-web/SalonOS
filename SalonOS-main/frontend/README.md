# SalonOS Frontend Application

Next-generation, luxury web application for SalonOS built with React 18, Vite, and a custom modern Vanilla CSS Design System.

## Features

- **Executive Dashboard**: Live KPIs (appointments, revenue, customer growth, pending payments), live queue feed, low stock alerts.
- **Appointments & Booking Timeline**: Daily appointments, filter by status, fast stylist assignment, 1-click status update.
- **POS & Billing Terminal**: Itemized checkout for services and retail items, automatic GST calculation, custom discounts, and printable luxury receipts.
- **Customer CRM & Loyalty**: Client profiles, visit history, loyalty reward points, direct WhatsApp link.
- **Services Catalog**: Categorized services with duration, pricing, and GST indicators.
- **Staff & Stylists Roster**: Team members, specializations, ratings, active bookings.
- **Inventory & Stock Management**: Product catalog, stock levels, reorder threshold alerts, quick stock adjustments.
- **WhatsApp Automation Hub**: Automated reminders, digital invoices, birthday wishes, and festive promo campaign simulators.
- **Settings & Theme Engine**: Salon business configuration, currency selector, and multi-theme experience (Dark Luxury, Rose Gold Glam, Pearl Crisp Light).

## Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will start at `http://localhost:5173`.

### 3. Connect with Backend
Start the FastAPI backend simultaneously on port 8000:
```bash
cd ../backend
uvicorn app.main:app --reload
```
Vite is pre-configured to proxy `/api` requests directly to `http://127.0.0.1:8000`.

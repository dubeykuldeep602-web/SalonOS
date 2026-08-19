import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AppContext = createContext();

// Sample initial data for full immediate interactive prototyping
const initialOrg = {
  id: 1,
  name: 'Luxe Aura Hair & Spa Lounge',
  owner_name: 'Sophia Verma',
  email: 'contact@luxeaura.com',
  phone: '+91 98765 43210',
  gst_number: '27AABCL1234F1Z5',
  address: 'Shop 4-5, Emerald Heights, MG Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  currency: '₹',
  timezone: 'Asia/Kolkata',
  gstRate: 18,
};

const initialServices = [
  { id: 1, name: 'Royal Keratin Hair Treatment', category: 'Hair', duration: 90, price: 4500, gst_applicable: true, description: 'Deep nourishing protein restoration treatment.' },
  { id: 2, name: 'Balayage & Hair Glossing', category: 'Hair', duration: 120, price: 6500, gst_applicable: true, description: 'Hand-painted dimensional color with shine gloss.' },
  { id: 3, name: 'Signature Diamond Glow Facial', category: 'Facial', duration: 60, price: 2800, gst_applicable: true, description: 'Micro-exfoliation and intense hydration.' },
  { id: 4, name: 'Aroma Hot Stone Spa Massage', category: 'Spa', duration: 75, price: 3200, gst_applicable: true, description: 'Full body tension relief with essential oils.' },
  { id: 5, name: 'Gel Nail Extensions & Chrome Art', category: 'Nails', duration: 60, price: 2200, gst_applicable: true, description: 'Long-lasting extensions with custom nail art.' },
  { id: 6, name: 'Bridal HD Makeup & Draping', category: 'Bridal', duration: 150, price: 15000, gst_applicable: true, description: 'Full high-definition bridal styling and draping.' },
  { id: 7, name: 'Classic Beard Sculpt & Styling', category: 'Grooming', duration: 30, price: 650, gst_applicable: true, description: 'Precision razor trimming and hot towel care.' },
  { id: 8, name: 'Detoxifying Organic Hair Spa', category: 'Hair', duration: 45, price: 1800, gst_applicable: true, description: 'Scalp cleansing and deep steam infusion.' },
];

const initialStaff = [
  { id: 1, full_name: 'Aarav Sharma', designation: 'Senior Hair Specialist', specialization: 'Balayage & Treatments', phone: '+91 98111 22334', rating: 4.9, active_bookings: 5, hire_date: '2023-01-15' },
  { id: 2, full_name: 'Priya Nair', designation: 'Lead Esthetician', specialization: 'Bridal & Advanced Facials', phone: '+91 98222 33445', rating: 4.8, active_bookings: 4, hire_date: '2023-03-20' },
  { id: 3, full_name: 'Rohan Mehta', designation: 'Master Stylist & Barber', specialization: 'Precision Cuts & Styling', phone: '+91 98333 44556', rating: 4.7, active_bookings: 6, hire_date: '2022-11-01' },
  { id: 4, full_name: 'Ananya Roy', designation: 'Nail Artist & Technician', specialization: 'Gel Extensions & 3D Art', phone: '+91 98444 55667', rating: 5.0, active_bookings: 3, hire_date: '2024-02-10' },
];

const initialCustomers = [
  { id: 1, full_name: 'Neha Kapoor', phone: '+91 98765 11223', email: 'neha.k@gmail.com', total_visits: 12, total_spent: 34500, loyalty_points: 450, last_visit: '2026-08-14', notes: 'Prefers ammonia-free hair dyes. Loves herbal green tea.' },
  { id: 2, full_name: 'Vikram Malhotra', phone: '+91 98765 22334', email: 'vikram.m@outlook.com', total_visits: 8, total_spent: 18200, loyalty_points: 220, last_visit: '2026-08-18', notes: 'Always books with Stylist Aarav.' },
  { id: 3, full_name: 'Simran Kaur', phone: '+91 98765 33445', email: 'simran.kaur@yahoo.com', total_visits: 19, total_spent: 68400, loyalty_points: 890, last_visit: '2026-08-19', notes: 'VIP Gold Member. Bridal party booking upcoming in Nov.' },
  { id: 4, full_name: 'Rahul Deshmukh', phone: '+91 98765 44556', email: 'rahul.d@gmail.com', total_visits: 4, total_spent: 5600, loyalty_points: 80, last_visit: '2026-08-10', notes: 'Monthly regular haircut & beard trim.' },
  { id: 5, full_name: 'Tanya Sen', phone: '+91 98765 55667', email: 'tanya.sen@gmail.com', total_visits: 6, total_spent: 19800, loyalty_points: 310, last_visit: '2026-08-17', notes: 'Sensitive skin. Use hypoallergenic face products.' },
];

const initialProducts = [
  { id: 1, name: 'Moroccan Argan Hair Serum 100ml', sku: 'PRD-ARG-01', category: 'Haircare', quantity_in_stock: 18, reorder_level: 5, unit_price: 1850, cost_price: 1100, supplier_name: 'Luxe Botanicals Ltd.' },
  { id: 2, name: 'Kerastase Nutritive Mask 200ml', sku: 'PRD-KER-02', category: 'Haircare', quantity_in_stock: 4, reorder_level: 8, unit_price: 3400, cost_price: 2200, supplier_name: 'Luxe Botanicals Ltd.' },
  { id: 3, name: 'OPI Pro Nail Lacquer - Ruby Red', sku: 'PRD-OPI-03', category: 'Nails', quantity_in_stock: 24, reorder_level: 6, unit_price: 850, cost_price: 450, supplier_name: 'Glamour Cosmetics' },
  { id: 4, name: 'Pure Hyaluronic Glow Essence 50ml', sku: 'PRD-HYA-04', category: 'Skincare', quantity_in_stock: 3, reorder_level: 6, unit_price: 2400, cost_price: 1400, supplier_name: 'DermaCare Essentials' },
  { id: 5, name: 'Organic Lavender Massage Oil 500ml', sku: 'PRD-LAV-05', category: 'Spa Supplies', quantity_in_stock: 12, reorder_level: 4, unit_price: 1200, cost_price: 700, supplier_name: 'Aroma Ayurveda' },
];

const initialAppointments = [
  { id: 101, customer_name: 'Neha Kapoor', customer_phone: '+91 98765 11223', service_name: 'Royal Keratin Hair Treatment', staff_name: 'Aarav Sharma', start_time: '10:30 AM', date: '2026-08-20', status: 'in_progress', price: 4500 },
  { id: 102, customer_name: 'Vikram Malhotra', customer_phone: '+91 98765 22334', service_name: 'Classic Beard Sculpt & Styling', staff_name: 'Rohan Mehta', start_time: '12:00 PM', date: '2026-08-20', status: 'confirmed', price: 650 },
  { id: 103, customer_name: 'Simran Kaur', customer_phone: '+91 98765 33445', service_name: 'Signature Diamond Glow Facial', staff_name: 'Priya Nair', start_time: '02:00 PM', date: '2026-08-20', status: 'scheduled', price: 2800 },
  { id: 104, customer_name: 'Tanya Sen', customer_phone: '+91 98765 55667', service_name: 'Gel Nail Extensions & Chrome Art', staff_name: 'Ananya Roy', start_time: '03:30 PM', date: '2026-08-20', status: 'scheduled', price: 2200 },
  { id: 105, customer_name: 'Rahul Deshmukh', customer_phone: '+91 98765 44556', service_name: 'Detoxifying Organic Hair Spa', staff_name: 'Aarav Sharma', start_time: '05:00 PM', date: '2026-08-20', status: 'scheduled', price: 1800 },
];

const initialInvoices = [
  { id: 1001, invoice_number: 'INV-2026-0881', customer_name: 'Neha Kapoor', subtotal: 4500, tax_amount: 810, discount_amount: 500, total_amount: 4810, payment_status: 'paid', payment_method: 'UPI', created_at: '2026-08-19 18:30' },
  { id: 1002, invoice_number: 'INV-2026-0882', customer_name: 'Simran Kaur', subtotal: 9700, tax_amount: 1746, discount_amount: 1000, total_amount: 10446, payment_status: 'paid', payment_method: 'Card', created_at: '2026-08-19 19:45' },
  { id: 1003, invoice_number: 'INV-2026-0883', customer_name: 'Vikram Malhotra', subtotal: 1850, tax_amount: 333, discount_amount: 0, total_amount: 2183, payment_status: 'unpaid', payment_method: 'Cash', created_at: '2026-08-20 11:15' },
];

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('salonos_theme') || 'dark');
  const [org, setOrg] = useState(initialOrg);
  const [services, setServices] = useState(initialServices);
  const [staff, setStaff] = useState(initialStaff);
  const [customers, setCustomers] = useState(initialCustomers);
  const [products, setProducts] = useState(initialProducts);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveBackendConnected, setLiveBackendConnected] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('salonos_theme', theme);
  }, [theme]);

  // Check live health check on startup
  useEffect(() => {
    async function checkHealth() {
      const res = await apiClient.get('/health');
      if (res && res.status === 'healthy') {
        setLiveBackendConnected(true);
      }
      
      const dash = await apiClient.get('/dashboard');
      if (dash && dash.data) {
        setDashboardData(dash.data);
      }
    }
    checkHealth();
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAppointment = (appt) => {
    const newId = appointments.length ? Math.max(...appointments.map(a => a.id)) + 1 : 101;
    const newAppt = { ...appt, id: newId, date: appt.date || new Date().toISOString().split('T')[0] };
    setAppointments((prev) => [newAppt, ...prev]);
    addToast(`Appointment scheduled for ${newAppt.customer_name}!`);
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    addToast(`Appointment #${id} updated to ${status.replace('_', ' ')}.`);
  };

  const addCustomer = (customer) => {
    const newId = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const newCust = {
      ...customer,
      id: newId,
      total_visits: 1,
      total_spent: 0,
      loyalty_points: 50,
      last_visit: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    addToast(`Customer ${newCust.full_name} registered!`);
    return newCust;
  };

  const addInvoice = (inv) => {
    const newId = invoices.length ? Math.max(...invoices.map(i => i.id)) + 1 : 1001;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(newId).padStart(4, '0')}`;
    const newInvoice = {
      ...inv,
      id: newId,
      invoice_number: invoiceNumber,
      created_at: new Date().toLocaleString(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    addToast(`Invoice ${invoiceNumber} created successfully!`);
    return newInvoice;
  };

  const addProduct = (prod) => {
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { ...prod, id: newId };
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Product ${prod.name} added to inventory!`);
  };

  const updateStock = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, quantity_in_stock: Math.max(0, p.quantity_in_stock + delta) }
          : p
      )
    );
    addToast(`Stock level adjusted.`);
  };

  const addService = (srv) => {
    const newId = services.length ? Math.max(...services.map(s => s.id)) + 1 : 1;
    const newService = { ...srv, id: newId };
    setServices((prev) => [...prev, newService]);
    addToast(`Service ${srv.name} added!`);
  };

  const addStaff = (member) => {
    const newId = staff.length ? Math.max(...staff.map(s => s.id)) + 1 : 1;
    const newMember = { ...member, id: newId, rating: 5.0, active_bookings: 0 };
    setStaff((prev) => [...prev, newMember]);
    addToast(`Staff member ${member.full_name} added!`);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        org,
        setOrg,
        services,
        staff,
        customers,
        products,
        appointments,
        invoices,
        activeTab,
        setActiveTab,
        toasts,
        addToast,
        removeToast,
        addAppointment,
        updateAppointmentStatus,
        addCustomer,
        addInvoice,
        addProduct,
        updateStock,
        addService,
        addStaff,
        liveBackendConnected,
        dashboardData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

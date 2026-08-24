import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { notificationAudio } from '../utils/notificationAudio';

const AppContext = createContext();

// Multiple Salon Tenants (for SaaS Multi-Tenancy)
const initialTenants = [
  {
    id: 1,
    name: 'Luxe Aura Hair & Spa Lounge',
    slug: 'luxe-aura',
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
    plan: 'Enterprise Chain',
    plan_price: '₹14,999/mo',
    status: 'active',
    branches: 3,
    staff_quota: 25,
    monthly_bookings: 1420,
    created_at: '2025-10-12',
    logo_letter: 'L',
    color_accent: '#d97706',
  },
  {
    id: 2,
    name: 'Royal Velvet Salon & Studio',
    slug: 'royal-velvet',
    owner_name: 'Kabir Malhotra',
    email: 'hello@royalvelvetsalon.com',
    phone: '+91 98111 55667',
    gst_number: '07AABCR9876P1Z2',
    address: 'Plot 22, Connaught Place, Inner Circle',
    city: 'New Delhi',
    state: 'Delhi',
    currency: '₹',
    timezone: 'Asia/Kolkata',
    gstRate: 18,
    plan: 'Pro Growth',
    plan_price: '₹7,999/mo',
    status: 'active',
    branches: 1,
    staff_quota: 12,
    monthly_bookings: 680,
    created_at: '2026-01-08',
    logo_letter: 'R',
    color_accent: '#8b5cf6',
  },
  {
    id: 3,
    name: 'Urban Blade Barbershop & Grooming',
    slug: 'urban-blade',
    owner_name: 'Arjun Nambiar',
    email: 'cuts@urbanblade.in',
    phone: '+91 98450 12345',
    gst_number: '29AABCU4321Q1Z8',
    address: '100ft Road, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    currency: '₹',
    timezone: 'Asia/Kolkata',
    gstRate: 18,
    plan: 'Starter Studio',
    plan_price: '₹3,499/mo',
    status: 'active',
    branches: 1,
    staff_quota: 6,
    monthly_bookings: 390,
    created_at: '2026-03-15',
    logo_letter: 'U',
    color_accent: '#10b981',
  },
];

const initialServices = [
  { id: 1, name: 'Royal Keratin Hair Treatment', category: 'Hair', duration: 90, price: 4500, gst_applicable: true, image: '💇‍♀️', description: 'Deep nourishing protein restoration treatment for silky frizz-free hair.' },
  { id: 2, name: 'Balayage & Hair Glossing', category: 'Hair', duration: 120, price: 6500, gst_applicable: true, image: '✨', description: 'Hand-painted dimensional color with high-shine protective gloss.' },
  { id: 3, name: 'Signature Diamond Glow Facial', category: 'Facial', duration: 60, price: 2800, gst_applicable: true, image: '💎', description: 'Micro-exfoliation, vacuum pore cleansing and intense hyaluronic hydration.' },
  { id: 4, name: 'Aroma Hot Stone Spa Massage', category: 'Spa', duration: 75, price: 3200, gst_applicable: true, image: '🪨', description: 'Full body tension relief with volcanic basalt stones and organic essential oils.' },
  { id: 5, name: 'Gel Nail Extensions & Chrome Art', category: 'Nails', duration: 60, price: 2200, gst_applicable: true, image: '💅', description: 'Long-lasting lightweight extensions with custom chrome metallic finish.' },
  { id: 6, name: 'Bridal HD Makeup & Draping', category: 'Bridal', duration: 150, price: 15000, gst_applicable: true, image: '👰', description: 'Full high-definition bridal styling, airbrush makeup, and precision draping.' },
  { id: 7, name: 'Classic Beard Sculpt & Styling', category: 'Grooming', duration: 30, price: 650, gst_applicable: true, image: '🧔', description: 'Precision razor contouring, hot steam towel, and cedarwood conditioning oil.' },
  { id: 8, name: 'Detoxifying Organic Hair Spa', category: 'Hair', duration: 45, price: 1800, gst_applicable: true, image: '🌿', description: 'Scalp detoxification, ozone steam infusion, and deep stress-relief massage.' },
];

const initialStaff = [
  { id: 1, full_name: 'Aarav Sharma', designation: 'Senior Hair Specialist', specialization: 'Balayage & Treatments', phone: '+91 98111 22334', rating: 4.9, active_bookings: 5, hire_date: '2023-01-15', avatar: 'AS', commissionRate: 15, is_clocked_in: true, today_tips: 850, today_services_done: 4, today_revenue: 14500 },
  { id: 2, full_name: 'Priya Nair', designation: 'Lead Esthetician', specialization: 'Bridal & Advanced Facials', phone: '+91 98222 33445', rating: 4.8, active_bookings: 4, hire_date: '2023-03-20', avatar: 'PN', commissionRate: 18, is_clocked_in: true, today_tips: 1200, today_services_done: 3, today_revenue: 21600 },
  { id: 3, full_name: 'Rohan Mehta', designation: 'Master Stylist & Barber', specialization: 'Precision Cuts & Styling', phone: '+91 98333 44556', rating: 4.7, active_bookings: 6, hire_date: '2022-11-01', avatar: 'RM', commissionRate: 12, is_clocked_in: true, today_tips: 450, today_services_done: 5, today_revenue: 6850 },
  { id: 4, full_name: 'Ananya Roy', designation: 'Nail Artist & Technician', specialization: 'Gel Extensions & 3D Art', phone: '+91 98444 55667', rating: 5.0, active_bookings: 3, hire_date: '2024-02-10', avatar: 'AR', commissionRate: 15, is_clocked_in: false, today_tips: 600, today_services_done: 2, today_revenue: 4400 },
];

const initialCustomers = [
  { id: 1, full_name: 'Neha Kapoor', phone: '+91 98765 11223', email: 'neha.k@gmail.com', total_visits: 12, total_spent: 34500, loyalty_points: 450, wallet_balance: 3200, last_visit: '2026-08-14', notes: 'Prefers ammonia-free hair dyes. Loves herbal green tea.' },
  { id: 2, full_name: 'Vikram Malhotra', phone: '+91 98765 22334', email: 'vikram.m@outlook.com', total_visits: 8, total_spent: 18200, loyalty_points: 220, wallet_balance: 850, last_visit: '2026-08-18', notes: 'Always books with Stylist Aarav.' },
  { id: 3, full_name: 'Simran Kaur', phone: '+91 98765 33445', email: 'simran.kaur@yahoo.com', total_visits: 19, total_spent: 68400, loyalty_points: 890, wallet_balance: 5600, last_visit: '2026-08-19', notes: 'VIP Gold Member. Bridal party booking upcoming in Nov.' },
  { id: 4, full_name: 'Rahul Deshmukh', phone: '+91 98765 44556', email: 'rahul.d@gmail.com', total_visits: 4, total_spent: 5600, loyalty_points: 80, wallet_balance: 0, last_visit: '2026-08-10', notes: 'Monthly regular haircut & beard trim.' },
  { id: 5, full_name: 'Tanya Sen', phone: '+91 98765 55667', email: 'tanya.sen@gmail.com', total_visits: 6, total_spent: 19800, loyalty_points: 310, wallet_balance: 1400, last_visit: '2026-08-17', notes: 'Sensitive skin. Use hypoallergenic face products.' },
];

const initialProducts = [
  { id: 1, name: 'Moroccan Argan Hair Serum 100ml', sku: 'PRD-ARG-01', category: 'Haircare', quantity_in_stock: 18, reorder_level: 5, unit_price: 1850, cost_price: 1100, supplier_name: 'Luxe Botanicals Ltd.' },
  { id: 2, name: 'Kerastase Nutritive Mask 200ml', sku: 'PRD-KER-02', category: 'Haircare', quantity_in_stock: 4, reorder_level: 8, unit_price: 3400, cost_price: 2200, supplier_name: 'Luxe Botanicals Ltd.' },
  { id: 3, name: 'OPI Pro Nail Lacquer - Ruby Red', sku: 'PRD-OPI-03', category: 'Nails', quantity_in_stock: 24, reorder_level: 6, unit_price: 850, cost_price: 450, supplier_name: 'Glamour Cosmetics' },
  { id: 4, name: 'Pure Hyaluronic Glow Essence 50ml', sku: 'PRD-HYA-04', category: 'Skincare', quantity_in_stock: 3, reorder_level: 6, unit_price: 2400, cost_price: 1400, supplier_name: 'DermaCare Essentials' },
  { id: 5, name: 'Organic Lavender Massage Oil 500ml', sku: 'PRD-LAV-05', category: 'Spa Supplies', quantity_in_stock: 12, reorder_level: 4, unit_price: 1200, cost_price: 700, supplier_name: 'Aroma Ayurveda' },
];

const initialAppointments = [
  { id: 101, customer_name: 'Neha Kapoor', customer_phone: '+91 98765 11223', service_name: 'Royal Keratin Hair Treatment', staff_name: 'Aarav Sharma', staff_id: 1, start_time: '10:30 AM', date: '2026-08-20', status: 'in_progress', price: 4500, token_number: 'T-101', notes: 'Client requested extra steam massage.' },
  { id: 102, customer_name: 'Vikram Malhotra', customer_phone: '+91 98765 22334', service_name: 'Classic Beard Sculpt & Styling', staff_name: 'Rohan Mehta', staff_id: 3, start_time: '12:00 PM', date: '2026-08-20', status: 'confirmed', price: 650, token_number: 'T-102', notes: 'Beard trim + scalp massage.' },
  { id: 103, customer_name: 'Simran Kaur', customer_phone: '+91 98765 33445', service_name: 'Signature Diamond Glow Facial', staff_name: 'Priya Nair', staff_id: 2, start_time: '02:00 PM', date: '2026-08-20', status: 'scheduled', price: 2800, token_number: 'T-103', notes: 'Allergy: No sulfur products.' },
  { id: 104, customer_name: 'Tanya Sen', customer_phone: '+91 98765 55667', service_name: 'Gel Nail Extensions & Chrome Art', staff_name: 'Ananya Roy', staff_id: 4, start_time: '03:30 PM', date: '2026-08-20', status: 'scheduled', price: 2200, token_number: 'T-104', notes: 'Rose gold chrome finish.' },
  { id: 105, customer_name: 'Rahul Deshmukh', customer_phone: '+91 98765 44556', service_name: 'Detoxifying Organic Hair Spa', staff_name: 'Aarav Sharma', staff_id: 1, start_time: '05:00 PM', date: '2026-08-20', status: 'scheduled', price: 1800, token_number: 'T-105', notes: 'First-time spa visitor.' },
];

const initialInvoices = [
  {
    id: 1001,
    invoice_number: 'INV-2026-0881',
    customer_name: 'Neha Kapoor',
    customer_phone: '+91 98765 11223',
    items: [
      { name: 'Royal Keratin Hair Treatment', type: 'Service', price: 4500, qty: 1 },
      { name: 'Moroccan Argan Hair Serum 100ml', type: 'Product', price: 1850, qty: 1 }
    ],
    subtotal: 6350,
    tax_amount: 1143,
    discount_amount: 500,
    total_amount: 6993,
    payment_status: 'paid',
    payment_method: 'UPI',
    staff_name: 'Aarav Sharma',
    created_at: '2026-08-20 10:45',
  },
  {
    id: 1002,
    invoice_number: 'INV-2026-0882',
    customer_name: 'Simran Kaur',
    customer_phone: '+91 98765 33445',
    items: [
      { name: 'Signature Diamond Glow Facial', type: 'Service', price: 2800, qty: 1 },
      { name: 'Pure Hyaluronic Glow Essence 50ml', type: 'Product', price: 2400, qty: 1 }
    ],
    subtotal: 5200,
    tax_amount: 936,
    discount_amount: 600,
    total_amount: 5536,
    payment_status: 'paid',
    payment_method: 'Card',
    staff_name: 'Priya Nair',
    created_at: '2026-08-20 12:15',
  },
  {
    id: 1003,
    invoice_number: 'INV-2026-0883',
    customer_name: 'Vikram Malhotra',
    customer_phone: '+91 98765 22334',
    items: [
      { name: 'Classic Beard Sculpt & Styling', type: 'Service', price: 650, qty: 1 }
    ],
    subtotal: 650,
    tax_amount: 117,
    discount_amount: 0,
    total_amount: 767,
    payment_status: 'unpaid',
    payment_method: 'Cash',
    staff_name: 'Rohan Mehta',
    created_at: '2026-08-20 14:00',
  },
  {
    id: 1004,
    invoice_number: 'INV-2026-0884',
    customer_name: 'Tanya Sen',
    customer_phone: '+91 98765 55667',
    items: [
      { name: 'Gel Nail Extensions & Chrome Art', type: 'Service', price: 2200, qty: 1 },
      { name: 'OPI Pro Nail Lacquer - Ruby Red', type: 'Product', price: 850, qty: 2 }
    ],
    subtotal: 3900,
    tax_amount: 702,
    discount_amount: 300,
    total_amount: 4302,
    payment_status: 'paid',
    payment_method: 'Wallet',
    staff_name: 'Ananya Roy',
    created_at: '2026-08-19 16:30',
  },
  {
    id: 1005,
    invoice_number: 'INV-2026-0885',
    customer_name: 'Rahul Deshmukh',
    customer_phone: '+91 98765 44556',
    items: [
      { name: 'Detoxifying Organic Hair Spa', type: 'Service', price: 1800, qty: 1 },
      { name: 'Classic Beard Sculpt & Styling', type: 'Service', price: 650, qty: 1 }
    ],
    subtotal: 2450,
    tax_amount: 441,
    discount_amount: 0,
    total_amount: 2891,
    payment_status: 'partial',
    payment_method: 'Split (Cash+UPI)',
    staff_name: 'Aarav Sharma',
    created_at: '2026-08-18 17:15',
  },
];

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('salonos_theme') || 'dark');
  
  // Multi-Tenant & Role System
  const [tenants, setTenants] = useState(initialTenants);
  const [activeTenantId, setActiveTenantId] = useState(1);
  const [activeRole, setActiveRole] = useState('owner'); // 'superadmin' | 'owner' | 'customer' | 'staff'

  // Salon-specific data
  const [services, setServices] = useState(initialServices);
  const [staff, setStaff] = useState(initialStaff);
  const [customers, setCustomers] = useState(initialCustomers);
  const [products, setProducts] = useState(initialProducts);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [invoices, setInvoices] = useState(initialInvoices);

  // Navigation & UI
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveBackendConnected, setLiveBackendConnected] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Active Simulated Customer & Staff
  const [activeCustomerId, setActiveCustomerId] = useState(1);
  const [activeStaffId, setActiveStaffId] = useState(1);

  // WhatsApp Interactive Preview Modal State
  const [whatsappPreview, setWhatsappPreview] = useState(null);

  // Incoming Dispatch notification for Staff App (sound/visual pulse)
  const [incomingJobAlert, setIncomingJobAlert] = useState(null);

  // Computed Active Tenant
  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];
  const org = activeTenant;

  // Active Customer profile
  const activeCustomer = customers.find((c) => c.id === activeCustomerId) || customers[0];

  // Active Staff profile
  const activeStaffMember = staff.find((s) => s.id === activeStaffId) || staff[0];

  // Authentication & Session State
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('salonos_token') || 'demo_token_xyz');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('salonos_user');
      return saved ? JSON.parse(saved) : {
        id: 2,
        full_name: 'Sophia Verma',
        email: 'contact@luxeaura.com',
        role: 'admin',
        organization_id: 1,
      };
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('salonos_theme', theme);
  }, [theme]);

  // Sync token & user to localStorage
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('salonos_token', authToken);
    } else {
      localStorage.removeItem('salonos_token');
    }
    if (currentUser) {
      localStorage.setItem('salonos_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('salonos_user');
    }
  }, [authToken, currentUser]);

  // Check live health check on startup
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await apiClient.get('/health');
        if (res && res.status === 'healthy') {
          setLiveBackendConnected(true);
        }
        const dash = await apiClient.get('/dashboard');
        if (dash && dash.data) {
          setDashboardData(dash.data);
        }
      } catch (err) {
        // Fallback to local high-speed interactive mock
      }
    }
    checkHealth();
  }, []);

  // Real-Time WebSocket Hub Connection
  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;

    function connectWS() {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname || 'localhost';
        const wsUrl = `${protocol}//${host}:8000/api/v1/ws/${activeTenantId}/${activeRole}/client_${Date.now()}`;

        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setLiveBackendConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === 'appointment_created') {
              notificationAudio.playBookingBell();
            } else if (data.event === 'job_dispatched') {
              notificationAudio.playJobDispatchAlert();
            }
          } catch (e) {}
        };

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connectWS, 6000);
        };
      } catch (e) {
        // High-speed fallback
      }
    }

    connectWS();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [activeTenantId, activeRole]);

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

  // ============================================================================
  // SaaS Super Admin Actions
  // ============================================================================
  const onboardTenant = (newTenantData) => {
    const newId = tenants.length ? Math.max(...tenants.map((t) => t.id)) + 1 : 1;
    const newTenant = {
      id: newId,
      name: newTenantData.name || 'New Elite Salon',
      slug: (newTenantData.name || 'new-salon').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      owner_name: newTenantData.owner_name || 'Salon Manager',
      email: newTenantData.email || 'contact@newsalon.com',
      phone: newTenantData.phone || '+91 99999 88888',
      gst_number: newTenantData.gst_number || '27AABCS9999P1Z1',
      address: newTenantData.address || 'Commercial Center, Main Blvd',
      city: newTenantData.city || 'Mumbai',
      state: newTenantData.state || 'Maharashtra',
      currency: '₹',
      timezone: 'Asia/Kolkata',
      gstRate: 18,
      plan: newTenantData.plan || 'Pro Growth',
      plan_price: newTenantData.plan === 'Enterprise Chain' ? '₹14,999/mo' : newTenantData.plan === 'Starter Studio' ? '₹3,499/mo' : '₹7,999/mo',
      status: 'active',
      branches: Number(newTenantData.branches) || 1,
      staff_quota: Number(newTenantData.staff_quota) || 10,
      monthly_bookings: 0,
      created_at: new Date().toISOString().split('T')[0],
      logo_letter: (newTenantData.name || 'S').charAt(0).toUpperCase(),
      color_accent: '#f59e0b',
    };

    setTenants((prev) => [newTenant, ...prev]);
    addToast(`🎉 Successfully onboarded new tenant: "${newTenant.name}"!`);
    return newTenant;
  };

  const updateTenantStatus = (id, newStatus) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    addToast(`Tenant #${id} status updated to ${newStatus}.`);
  };

  const updateTenantPlan = (id, newPlan) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, plan: newPlan } : t))
    );
    addToast(`Subscription plan updated to ${newPlan}.`);
  };

  // ============================================================================
  // Authentication & Role Management
  // ============================================================================
  const login = async (role, credentials = {}) => {
    let userObj = null;
    const generatedToken = `jwt_${role}_${Date.now()}`;

    if (role === 'superadmin') {
      userObj = {
        id: 1,
        full_name: 'Platform Super Admin',
        email: credentials.email || 'admin@salonos.com',
        role: 'superadmin',
        organization_id: null,
      };
      setActiveRole('superadmin');
    } else if (role === 'owner') {
      userObj = {
        id: 2,
        full_name: org.owner_name || 'Sophia Verma',
        email: credentials.email || org.email || 'contact@luxeaura.com',
        role: 'admin',
        organization_id: activeTenantId,
      };
      setActiveRole('owner');
    } else if (role === 'staff') {
      const selectedStaff = staff.find((s) => s.id === (credentials.staff_id || activeStaffId)) || staff[0];
      userObj = {
        id: 100 + selectedStaff.id,
        full_name: credentials.staff_name || selectedStaff.full_name,
        email: `staff.${selectedStaff.id}@salonos.com`,
        role: 'staff',
        organization_id: activeTenantId,
        staff_id: selectedStaff.id,
      };
      setActiveStaffId(selectedStaff.id);
      setActiveRole('staff');
    } else if (role === 'customer') {
      const selectedCust = customers.find((c) => c.id === (credentials.customer_id || activeCustomerId)) || customers[0];
      userObj = {
        id: 500 + selectedCust.id,
        full_name: credentials.customer_name || selectedCust.full_name,
        phone: credentials.phone || selectedCust.phone,
        role: 'customer',
        organization_id: activeTenantId,
        customer_id: selectedCust.id,
      };
      setActiveCustomerId(selectedCust.id);
      setActiveRole('customer');
    }

    setCurrentUser(userObj);
    setAuthToken(generatedToken);
    localStorage.setItem('salonos_token', generatedToken);
    localStorage.setItem('salonos_user', JSON.stringify(userObj));
    addToast(`👋 Welcome back, ${userObj.full_name}! (${userObj.role.toUpperCase()})`);
    return userObj;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('salonos_token');
    localStorage.removeItem('salonos_user');
    addToast('Logged out of SalonOS session.', 'info');
  };

  const registerTenant = async (formData) => {
    const newTenant = onboardTenant({
      name: formData.salon_name,
      owner_name: formData.owner_name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      plan: formData.plan,
    });

    setActiveTenantId(newTenant.id);
    const userObj = {
      id: 200 + newTenant.id,
      full_name: formData.owner_name,
      email: formData.email,
      role: 'admin',
      organization_id: newTenant.id,
    };
    setCurrentUser(userObj);
    const generatedToken = `jwt_admin_${Date.now()}`;
    setAuthToken(generatedToken);
    setActiveRole('owner');
    addToast(`🎉 Workspace launched for "${newTenant.name}"!`);
    return newTenant;
  };

  // ============================================================================
  // Appointment & Auto-Assignment Engine
  // ============================================================================
  const addAppointment = (appt) => {
    const newId = appointments.length ? Math.max(...appointments.map((a) => a.id)) + 1 : 101;
    const tokenNumber = `T-${newId}`;
    
    // Auto-resolve staff if "auto" or unselected
    let assignedStaff = staff.find((s) => s.id === Number(appt.staff_id) || s.full_name === appt.staff_name);
    if (!assignedStaff) {
      // Round-robin or lowest active booking assignment
      assignedStaff = [...staff].sort((a, b) => (a.active_bookings || 0) - (b.active_bookings || 0))[0] || staff[0];
    }

    const newAppt = {
      ...appt,
      id: newId,
      token_number: tokenNumber,
      staff_name: assignedStaff.full_name,
      staff_id: assignedStaff.id,
      date: appt.date || new Date().toISOString().split('T')[0],
      status: appt.status || 'scheduled',
      price: appt.price || 1500,
    };

    setAppointments((prev) => [newAppt, ...prev]);

    // Trigger instant incoming alert and sound for assigned stylist & POS bell
    notificationAudio.playBookingBell();
    notificationAudio.playJobDispatchAlert();

    setIncomingJobAlert({
      appointmentId: newId,
      customer_name: newAppt.customer_name,
      service_name: newAppt.service_name,
      time: newAppt.start_time,
      price: newAppt.price,
      staff_id: assignedStaff.id,
      staff_name: assignedStaff.full_name,
    });

    addToast(`Appointment scheduled for ${newAppt.customer_name} with ${assignedStaff.full_name}! (Token: ${tokenNumber})`);
    return newAppt;
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    addToast(`Appointment #${id} updated to ${status.replace('_', ' ')}.`);
  };

  // ============================================================================
  // Stylist / Staff Mobile Workflow
  // ============================================================================
  const staffAcceptJob = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'confirmed');
    setIncomingJobAlert(null);
    addToast(`Stylist accepted Appointment #${appointmentId}! Client notified.`);
  };

  const staffStartJob = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'in_progress');
    addToast(`Stylist started service for Appointment #${appointmentId}. Live timer started.`);
  };

  const staffCompleteJob = (appointmentId, tipAmount = 100) => {
    const appt = appointments.find((a) => a.id === appointmentId);
    updateAppointmentStatus(appointmentId, 'completed');
    notificationAudio.playQueueTurnAlert();
    
    // Update stylist daily performance ledger
    if (appt) {
      setStaff((prev) =>
        prev.map((s) =>
          s.full_name === appt.staff_name
            ? {
                ...s,
                today_services_done: (s.today_services_done || 0) + 1,
                today_revenue: (s.today_revenue || 0) + (appt.price || 0),
                today_tips: (s.today_tips || 0) + tipAmount,
              }
            : s
        )
      );

      // Auto-create pending invoice on POS
      const newInvId = invoices.length ? Math.max(...invoices.map((i) => i.id)) + 1 : 1001;
      const gstAmt = Math.round((appt.price || 0) * (org.gstRate / 100));
      const newInvoice = {
        id: newInvId,
        invoice_number: `INV-${new Date().getFullYear()}-${String(newInvId).padStart(4, '0')}`,
        customer_name: appt.customer_name,
        subtotal: appt.price || 0,
        tax_amount: gstAmt,
        discount_amount: 0,
        total_amount: (appt.price || 0) + gstAmt,
        payment_status: 'unpaid',
        payment_method: 'Cash',
        staff_name: appt.staff_name,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      setInvoices((prev) => [newInvoice, ...prev]);
    }

    addToast(`Service marked COMPLETED! Ready for checkout on POS.`);
  };

  const toggleStaffClockIn = (staffId) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const nextState = !s.is_clocked_in;
          addToast(`${s.full_name} is now ${nextState ? 'CLOCKED IN 🟢' : 'CLOCKED OUT 🔴'}`);
          return { ...s, is_clocked_in: nextState };
        }
        return s;
      })
    );
  };

  // ============================================================================
  // Customer App Actions
  // ============================================================================
  const bookCustomerAppointment = ({ serviceId, staffId, date, time, notes }) => {
    const srv = services.find((s) => s.id === Number(serviceId)) || services[0];
    const newAppt = addAppointment({
      customer_name: activeCustomer.full_name,
      customer_phone: activeCustomer.phone,
      service_name: srv.name,
      service_id: srv.id,
      staff_id: staffId,
      date: date || new Date().toISOString().split('T')[0],
      start_time: time || '03:00 PM',
      price: srv.price,
      notes: notes || '',
      status: 'scheduled',
    });

    // Reward loyalty points on booking
    const earnedPoints = Math.round(srv.price / 50);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === activeCustomerId
          ? {
              ...c,
              total_visits: c.total_visits + 1,
              loyalty_points: c.loyalty_points + earnedPoints,
            }
          : c
      )
    );

    return newAppt;
  };

  const topupCustomerWallet = (amount) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === activeCustomerId
          ? { ...c, wallet_balance: (c.wallet_balance || 0) + Number(amount) }
          : c
      )
    );
    addToast(`Wallet topped up by ${org.currency}${amount}! New Balance: ${org.currency}${(activeCustomer.wallet_balance || 0) + Number(amount)}`);
  };

  // ============================================================================
  // POS & Catalog Actions
  // ============================================================================
  const addCustomer = (customer) => {
    const newId = customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1;
    const newCust = {
      ...customer,
      id: newId,
      total_visits: 1,
      total_spent: 0,
      loyalty_points: 50,
      wallet_balance: 0,
      last_visit: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    addToast(`Customer ${newCust.full_name} registered!`);
    return newCust;
  };

  const addInvoice = (inv) => {
    const newId = invoices.length ? Math.max(...invoices.map((i) => i.id)) + 1 : 1001;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(newId).padStart(4, '0')}`;
    const newInvoice = {
      ...inv,
      id: newId,
      invoice_number: invoiceNumber,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      payment_status: 'paid',
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Update customer spend & loyalty
    if (inv.customer_name) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.full_name.toLowerCase() === inv.customer_name.toLowerCase()) {
            return {
              ...c,
              total_visits: c.total_visits + 1,
              total_spent: c.total_spent + (inv.total_amount || 0),
              loyalty_points: c.loyalty_points + Math.round((inv.total_amount || 0) / 100),
              last_visit: new Date().toISOString().split('T')[0],
            };
          }
          return c;
        })
      );
    }

    addToast(`Invoice ${invoiceNumber} created and marked PAID!`);
    return newInvoice;
  };

  const addService = (srv) => {
    const newId = services.length ? Math.max(...services.map((s) => s.id)) + 1 : 1;
    const newService = { ...srv, id: newId, image: '✨' };
    setServices((prev) => [...prev, newService]);
    addToast(`Service "${newService.name}" added to menu!`);
  };

  const addStaff = (stf) => {
    const newId = staff.length ? Math.max(...staff.map((s) => s.id)) + 1 : 1;
    const newMember = {
      ...stf,
      id: newId,
      rating: 5.0,
      active_bookings: 0,
      avatar: stf.full_name ? stf.full_name.slice(0, 2).toUpperCase() : 'ST',
      hire_date: new Date().toISOString().split('T')[0],
      commissionRate: 15,
      is_clocked_in: true,
      today_tips: 0,
      today_services_done: 0,
      today_revenue: 0,
    };
    setStaff((prev) => [...prev, newMember]);
    addToast(`Staff member "${newMember.full_name}" registered!`);
  };

  const addProduct = (prd) => {
    const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct = { ...prd, id: newId };
    setProducts((prev) => [...prev, newProduct]);
    addToast(`Product "${newProduct.name}" added to inventory!`);
  };

  const updateProductStock = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity_in_stock: Math.max(0, p.quantity_in_stock + delta) } : p))
    );
  };

  // WhatsApp Simulation Trigger
  const triggerWhatsApp = (type, data) => {
    setWhatsappPreview({ type, data, timestamp: new Date().toLocaleTimeString() });
  };

  const closeWhatsApp = () => setWhatsappPreview(null);

  const value = {
    theme,
    setTheme,
    // Authentication & Current User
    currentUser,
    authToken,
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    logout,
    registerTenant,
    // Multi-tenant & Role
    tenants,
    setTenants,
    activeTenantId,
    setActiveTenantId,
    activeTenant,
    org,
    activeRole,
    setActiveRole,
    onboardTenant,
    updateTenantStatus,
    updateTenantPlan,
    // Salon Resources
    services,
    staff,
    customers,
    products,
    appointments,
    invoices,
    toasts,
    activeTab,
    setActiveTab,
    liveBackendConnected,
    dashboardData,
    // Workflows
    addAppointment,
    updateAppointmentStatus,
    addCustomer,
    addInvoice,
    addService,
    addStaff,
    addProduct,
    updateProductStock,
    addToast,
    removeToast,
    // Staff App
    activeStaffId,
    setActiveStaffId,
    activeStaffMember,
    staffAcceptJob,
    staffStartJob,
    staffCompleteJob,
    toggleStaffClockIn,
    incomingJobAlert,
    setIncomingJobAlert,
    // Customer App
    activeCustomerId,
    setActiveCustomerId,
    activeCustomer,
    bookCustomerAppointment,
    topupCustomerWallet,
    // WhatsApp preview modal
    whatsappPreview,
    triggerWhatsApp,
    closeWhatsApp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

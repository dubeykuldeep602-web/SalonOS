import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Modal from './components/common/Modal';
import Toast from './components/common/Toast';
import WhatsAppModal from './components/common/WhatsAppModal';

// 4-Pillar Core Pages
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import CustomerApp from './pages/customer/CustomerApp';
import StaffApp from './pages/staff/StaffApp';

// Salon Owner POS & Operations Pages
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import BillingPOS from './pages/BillingPOS';
import Customers from './pages/Customers';
import Services from './pages/Services';
import Staff from './pages/Staff';
import Inventory from './pages/Inventory';
import Marketing from './pages/Marketing';
import Settings from './pages/Settings';

export default function App() {
  const { 
    activeTab, 
    setActiveTab, 
    activeRole,
    services, 
    staff, 
    customers, 
    addAppointment, 
    addCustomer,
    addService,
    addStaff,
    addProduct,
    org
  } = useApp();

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Cross-page data pass (e.g. Appointment -> POS checkout)
  const [incomingPOSItem, setIncomingPOSItem] = useState(null);

  // New Booking Form State
  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    customer_phone: '',
    service_id: '',
    staff_id: '',
    start_time: '11:00 AM',
    date: new Date().toISOString().split('T')[0],
  });

  // New Client Form State
  const [clientForm, setClientForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    notes: '',
  });

  // New Service Form State
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Hair',
    duration: 60,
    price: 1500,
    gst_applicable: true,
    description: '',
  });

  // New Staff Form State
  const [staffForm, setStaffForm] = useState({
    full_name: '',
    designation: 'Hair Stylist',
    specialization: 'Cuts & Treatments',
    phone: '',
  });

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    sku: 'PRD-001',
    category: 'Haircare',
    quantity_in_stock: 10,
    reorder_level: 5,
    unit_price: 1200,
    cost_price: 800,
    supplier_name: 'Luxe Suppliers',
  });

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const srv = services.find((s) => String(s.id) === String(bookingForm.service_id)) || services[0];
    const stf = staff.find((s) => String(s.id) === String(bookingForm.staff_id)) || staff[0];

    addAppointment({
      customer_name: bookingForm.customer_name || 'Walk-in Client',
      customer_phone: bookingForm.customer_phone || '+91 99999 00000',
      service_name: srv ? srv.name : 'Salon Service',
      staff_name: stf ? stf.full_name : 'Lead Stylist',
      staff_id: stf ? stf.id : 1,
      start_time: bookingForm.start_time,
      date: bookingForm.date,
      status: 'scheduled',
      price: srv ? srv.price : 1000,
    });

    setIsBookingModalOpen(false);
    setBookingForm({
      customer_name: '',
      customer_phone: '',
      service_id: '',
      staff_id: '',
      start_time: '11:00 AM',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    addCustomer(clientForm);
    setIsCustomerModalOpen(false);
    setClientForm({ full_name: '', phone: '', email: '', notes: '' });
  };

  const handleCreateService = (e) => {
    e.preventDefault();
    addService(serviceForm);
    setIsServiceModalOpen(false);
    setServiceForm({ name: '', category: 'Hair', duration: 60, price: 1500, gst_applicable: true, description: '' });
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    addStaff(staffForm);
    setIsStaffModalOpen(false);
    setStaffForm({ full_name: '', designation: 'Hair Stylist', specialization: 'Cuts & Treatments', phone: '' });
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    addProduct(productForm);
    setIsProductModalOpen(false);
    setProductForm({ name: '', sku: 'PRD-001', category: 'Haircare', quantity_in_stock: 10, reorder_level: 5, unit_price: 1200, cost_price: 800, supplier_name: 'Luxe Suppliers' });
  };

  const handleSendAppointmentToPOS = (appt) => {
    setIncomingPOSItem(appt);
    setActiveTab('billing');
  };

  return (
    <div className="app-container">
      {/* Sidebar only appears in Salon Owner POS mode */}
      {activeRole === 'owner' && <Sidebar />}

      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onOpenNewBooking={() => setIsBookingModalOpen(true)} />

        <main className="page-wrapper" style={{ flex: 1, padding: activeRole === 'owner' ? '2rem' : '1.5rem 2rem' }}>
          {/* Pillar 1: SaaS Super Admin Portal */}
          {activeRole === 'superadmin' && <SuperAdminDashboard />}

          {/* Pillar 3: Stylist / Barber Mobile APK Simulator */}
          {activeRole === 'staff' && <StaffApp />}

          {/* Pillar 4: Customer Mobile Booking App Simulator */}
          {activeRole === 'customer' && <CustomerApp />}

          {/* Pillar 2: Salon Owner Backoffice & POS Suite */}
          {activeRole === 'owner' && (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard 
                  onOpenNewBooking={() => setIsBookingModalOpen(true)} 
                  onOpenNewClient={() => setIsCustomerModalOpen(true)} 
                />
              )}

              {activeTab === 'appointments' && (
                <Appointments 
                  onOpenNewBooking={() => setIsBookingModalOpen(true)} 
                  onSendToPOS={handleSendAppointmentToPOS}
                />
              )}

              {activeTab === 'billing' && (
                <BillingPOS 
                  incomingCartItem={incomingPOSItem}
                  onClearIncomingItem={() => setIncomingPOSItem(null)}
                />
              )}

              {activeTab === 'customers' && (
                <Customers onOpenNewClient={() => setIsCustomerModalOpen(true)} />
              )}

              {activeTab === 'services' && (
                <Services onOpenNewService={() => setIsServiceModalOpen(true)} />
              )}

              {activeTab === 'staff' && (
                <Staff onOpenNewStaff={() => setIsStaffModalOpen(true)} />
              )}

              {activeTab === 'inventory' && (
                <Inventory onOpenNewProduct={() => setIsProductModalOpen(true)} />
              )}

              {activeTab === 'marketing' && <Marketing />}

              {activeTab === 'settings' && <Settings />}
            </>
          )}
        </main>
      </div>

      <Toast />
      <WhatsAppModal />

      {/* New Appointment Modal */}
      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Book New Appointment">
        <form onSubmit={handleCreateAppointment}>
          <div className="form-group">
            <label className="form-label">Client Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Sharma"
              value={bookingForm.customer_name}
              onChange={(e) => setBookingForm({ ...bookingForm, customer_name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98765 43210"
              value={bookingForm.customer_phone}
              onChange={(e) => setBookingForm({ ...bookingForm, customer_phone: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Service Required</label>
            <select
              value={bookingForm.service_id}
              onChange={(e) => setBookingForm({ ...bookingForm, service_id: e.target.value })}
              className="form-select"
              required
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration}m — {org.currency}{s.price})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Stylist</label>
            <select
              value={bookingForm.staff_id}
              onChange={(e) => setBookingForm({ ...bookingForm, staff_id: e.target.value })}
              className="form-select"
            >
              <option value="">⚡ Any Available Stylist (Auto-Dispatch)</option>
              {staff.map((stf) => (
                <option key={stf.id} value={stf.id}>
                  {stf.full_name} ({stf.designation})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot</label>
              <select
                value={bookingForm.start_time}
                onChange={(e) => setBookingForm({ ...bookingForm, start_time: e.target.value })}
                className="form-select"
              >
                {['10:00 AM', '11:00 AM', '12:00 PM', '01:30 PM', '02:30 PM', '03:30 PM', '05:00 PM', '06:30 PM'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsBookingModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm & Dispatch
            </button>
          </div>
        </form>
      </Modal>

      {/* New Client Modal */}
      <Modal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} title="Register New Client">
        <form onSubmit={handleCreateCustomer}>
          <div className="form-group">
            <label className="form-label">Client Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Malhotra"
              value={clientForm.full_name}
              onChange={(e) => setClientForm({ ...clientForm, full_name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 00000"
                value={clientForm.phone}
                onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="client@gmail.com"
                value={clientForm.email}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Style / Allergy Notes</label>
            <textarea
              rows="3"
              placeholder="e.g. Prefers ammonia-free hair color, sensitive skin"
              value={clientForm.notes}
              onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Client Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* New Service Modal */}
      <Modal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} title="Add Service to Menu">
        <form onSubmit={handleCreateService}>
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Botanical Hair Scalp Spa"
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={serviceForm.category}
                onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                className="form-select"
              >
                <option value="Hair">Hair</option>
                <option value="Facial">Facial & Skin</option>
                <option value="Spa">Spa & Massage</option>
                <option value="Nails">Nails & Art</option>
                <option value="Bridal">Bridal & Makeup</option>
                <option value="Grooming">Men's Grooming</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration (Minutes)</label>
              <input
                type="number"
                min="10"
                step="5"
                value={serviceForm.duration}
                onChange={(e) => setServiceForm({ ...serviceForm, duration: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Price ({org.currency})</label>
            <input
              type="number"
              min="0"
              required
              value={serviceForm.price}
              onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
              className="form-input"
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsServiceModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Service
            </button>
          </div>
        </form>
      </Modal>

      {/* New Staff Modal */}
      <Modal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} title="Register Staff Stylist">
        <form onSubmit={handleCreateStaff}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sneha Patel"
              value={staffForm.full_name}
              onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                placeholder="Senior Colorist"
                value={staffForm.designation}
                onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                type="tel"
                placeholder="+91 98000 00000"
                value={staffForm.phone}
                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input
              type="text"
              placeholder="e.g. Balayage, Keratin, Organic Spas"
              value={staffForm.specialization}
              onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsStaffModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Stylist
            </button>
          </div>
        </form>
      </Modal>

      {/* New Product Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Add Inventory Product">
        <form onSubmit={handleCreateProduct}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Olaplex No. 3 Hair Perfector 100ml"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">SKU</label>
              <input
                type="text"
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Current Stock Qty</label>
              <input
                type="number"
                min="0"
                value={productForm.quantity_in_stock}
                onChange={(e) => setProductForm({ ...productForm, quantity_in_stock: Number(e.target.value) })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reorder Level Alert</label>
              <input
                type="number"
                min="0"
                value={productForm.reorder_level}
                onChange={(e) => setProductForm({ ...productForm, reorder_level: Number(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Retail Price ({org.currency})</label>
              <input
                type="number"
                min="0"
                value={productForm.unit_price}
                onChange={(e) => setProductForm({ ...productForm, unit_price: Number(e.target.value) })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Supplier Name</label>
              <input
                type="text"
                value={productForm.supplier_name}
                onChange={(e) => setProductForm({ ...productForm, supplier_name: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

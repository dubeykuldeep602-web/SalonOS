import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Calendar,
  Clock,
  User,
  Star,
  Plus,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  Tag,
  ChevronRight,
  Flame,
  Gift,
  Search,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function CustomerApp() {
  const {
    org,
    services,
    staff,
    customers,
    appointments,
    invoices,
    activeCustomerId,
    setActiveCustomerId,
    activeCustomer,
    bookCustomerAppointment,
    topupCustomerWallet,
    triggerWhatsApp,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'queue' | 'wallet' | 'invoices'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal in Mobile
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('auto');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [clientNotes, setClientNotes] = useState('');

  // Top-up Modal
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState(1000);

  const categories = ['All', 'Hair', 'Facial', 'Spa', 'Nails', 'Bridal', 'Grooming'];

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase()) || (srv.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Check active booking for the customer
  const customerAppointments = appointments.filter(
    (a) => a.customer_name.toLowerCase() === activeCustomer.full_name.toLowerCase()
  );
  const activeBooking = customerAppointments.find((a) => a.status === 'in_progress' || a.status === 'confirmed' || a.status === 'scheduled');

  const customerInvoices = invoices.filter(
    (inv) => inv.customer_name.toLowerCase() === activeCustomer.full_name.toLowerCase()
  );

  const handleStartBooking = (srv) => {
    setSelectedService(srv);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedService) return;

    const newAppt = bookCustomerAppointment({
      serviceId: selectedService.id,
      staffId: selectedStaffId === 'auto' ? undefined : selectedStaffId,
      date: selectedDate,
      time: selectedTime,
      notes: clientNotes,
    });

    setIsBookingOpen(false);
    setSelectedService(null);
    setClientNotes('');
    setActiveTab('queue');

    // Trigger WhatsApp notification preview
    triggerWhatsApp('booking_confirm', {
      customer_name: activeCustomer.full_name,
      service_name: selectedService.name,
      staff_name: newAppt.staff_name,
      start_time: selectedTime,
      id: newAppt.id,
    });
  };

  const handleTopupSubmit = (e) => {
    e.preventDefault();
    topupCustomerWallet(topupAmount);
    setIsTopupOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Top Customer Simulator Bar */}
      <div className="glass-card" style={{ width: '100%', maxWidth: '850px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-gold), #f59e0b)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
            {activeCustomer.full_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '700', fontSize: '0.9375rem' }}>Customer Mobile Experience</span>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Logged in as {activeCustomer.full_name}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Simulates the iOS / Android Customer App with instant cross-pillar sync.
            </div>
          </div>
        </div>

        {/* Client Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>Switch Client:</span>
          <select
            className="form-select"
            style={{ width: '160px', height: '2rem', fontSize: '0.75rem', padding: '2px 8px' }}
            value={activeCustomerId}
            onChange={(e) => setActiveCustomerId(Number(e.target.value))}
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modern Smartphone Mockup Frame */}
      <div
        style={{
          width: '100%',
          maxWidth: '410px',
          background: '#090d16',
          borderRadius: '42px',
          padding: '12px',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 30px rgba(217, 119, 6, 0.2)',
          border: '4px solid #232d3f',
          position: 'relative',
        }}
      >
        {/* Inner Phone Screen */}
        <div
          style={{
            background: 'var(--bg-primary)',
            borderRadius: '32px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '740px',
            position: 'relative',
          }}
        >
          {/* Dynamic Island / Status Bar */}
          <div
            style={{
              padding: '8px 18px 4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--text-main)',
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-subtle)',
              zIndex: 30,
            }}
          >
            <span>9:41</span>
            <div
              style={{
                width: '90px',
                height: '18px',
                background: '#000',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></div>
              <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>SalonOS</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span>5G</span>
              <div style={{ width: '18px', height: '9px', border: '1px solid currentColor', borderRadius: '2px', padding: '1px' }}>
                <div style={{ width: '80%', height: '100%', background: 'currentColor' }}></div>
              </div>
            </div>
          </div>

          {/* Salon App Header */}
          <div
            style={{
              padding: '0.875rem 1rem',
              background: 'linear-gradient(180deg, var(--bg-secondary) 0%, rgba(17, 24, 39, 0.6) 100%)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--accent-gold), #f59e0b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: '#000',
                  fontSize: '0.875rem',
                }}
              >
                {org.logo_letter || 'S'}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2' }}>
                  {org.name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span>📍 {org.city}</span>
                  <span>•</span>
                  <span>⭐ 4.9 (480+ reviews)</span>
                </div>
              </div>
            </div>

            {/* Loyalty Pill */}
            <div
              onClick={() => setActiveTab('wallet')}
              style={{
                background: 'var(--bg-tertiary)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--accent-gold-glow)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={12} color="var(--accent-gold)" />
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--accent-gold-light)' }}>
                {activeCustomer.loyalty_points || 0} pts
              </span>
            </div>
          </div>

          {/* Scrollable Main Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {activeTab === 'explore' && (
              <>
                {/* Promotional Banner Carousel */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #78350f 0%, #1e1b4b 100%)',
                    borderRadius: '16px',
                    padding: '1rem',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(217, 119, 6, 0.4)',
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(217, 119, 6, 0.3)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    <Flame size={12} color="#fbbf24" />
                    <span>WEEKDAY HAPPY HOURS (12 - 4 PM)</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', lineHeight: '1.25', marginBottom: '0.25rem' }}>
                    Flat 20% OFF on Luxury Hair & Skin Spas
                  </h4>
                  <p style={{ fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                    Use code <strong style={{ color: '#fbbf24' }}>GLOW20</strong> on your booking.
                  </p>
                  <button
                    onClick={() => {
                      const s = services.find((srv) => srv.category === 'Hair') || services[0];
                      handleStartBooking(s);
                    }}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.7rem', padding: '0.35rem 0.75rem' }}
                  >
                    <span>Book Happy Hour Slot</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Live Queue Banner if active booking exists */}
                {activeBooking && (
                  <div
                    onClick={() => setActiveTab('queue')}
                    style={{
                      background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.2) 100%)',
                      border: '1px solid var(--color-success)',
                      borderRadius: '14px',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-success)', animation: 'pulse 1.5s infinite' }}></div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          Active Booking: {activeBooking.service_name}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-success)' }}>
                          Token {activeBooking.token_number || '#T-101'} • {activeBooking.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--color-success)" />
                  </div>
                )}

                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search haircut, facial, keratin, massage..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ height: '2.25rem', paddingLeft: '32px', fontSize: '0.75rem', borderRadius: '12px' }}
                  />
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '2px' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: 'none',
                        background: selectedCategory === cat ? 'var(--accent-gold)' : 'var(--bg-tertiary)',
                        color: selectedCategory === cat ? '#000' : 'var(--text-muted)',
                        fontWeight: '700',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Service Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Featured Services ({filteredServices.length})</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold-light)' }}>Instant Auto-Assign</span>
                  </div>

                  {filteredServices.map((srv) => (
                    <div
                      key={srv.id}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '14px',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '0.625rem' }}>
                          <div style={{ fontSize: '1.5rem', width: '38px', height: '38px', background: 'var(--bg-tertiary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {srv.image || '✨'}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>{srv.name}</h4>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>⏱️ {srv.duration} mins</span>
                              <span>•</span>
                              <span>🏷️ {srv.category}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--accent-gold-light)' }}>
                            {org.currency}{srv.price}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                        {srv.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <ShieldCheck size={12} />
                          <span>Sanitized & Certified Stylists</span>
                        </div>
                        <button
                          onClick={() => handleStartBooking(srv)}
                          className="btn btn-sm btn-primary"
                          style={{ fontSize: '0.7rem', padding: '0.25rem 0.65rem', height: '1.75rem' }}
                        >
                          <Plus size={12} />
                          <span>Book Slot</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Queue & Active Token Tab */}
            {activeTab === 'queue' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
                  <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '50%', background: 'var(--accent-gold-glow)', color: 'var(--accent-gold-light)', marginBottom: '0.5rem' }}>
                    <Clock size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '800' }}>Live Token Waitlist Tracker</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Real-time chair and stylist availability monitor.
                  </p>
                </div>

                {activeBooking ? (
                  <div
                    style={{
                      background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
                      border: '1px solid var(--accent-gold)',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.875rem',
                      boxShadow: '0 0 20px rgba(217, 119, 6, 0.15)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                        TOKEN #{activeBooking.token_number || 'T-101'}
                      </span>
                      <span className={`badge ${activeBooking.status === 'in_progress' ? 'badge-purple' : 'badge-success'}`}>
                        {activeBooking.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Estimated Wait Time</div>
                      <div style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--accent-gold-light)' }}>
                        {activeBooking.status === 'in_progress' ? '0 mins' : '~14 mins'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '600' }}>
                        {activeBooking.status === 'in_progress' ? '✂️ In Chair with Stylist' : '🟢 2nd In Queue Ahead'}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Service:</span>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{activeBooking.service_name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Stylist:</span>
                        <span style={{ fontWeight: '700', color: 'var(--accent-gold-light)' }}>{activeBooking.staff_name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Scheduled Time:</span>
                        <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{activeBooking.start_time}</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        triggerWhatsApp('booking_confirm', {
                          customer_name: activeCustomer.full_name,
                          service_name: activeBooking.service_name,
                          staff_name: activeBooking.staff_name,
                          start_time: activeBooking.start_time,
                          id: activeBooking.id,
                        })
                      }
                      className="btn btn-sm btn-secondary"
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <MessageSquare size={14} color="#25d366" />
                      <span>View WhatsApp Confirmation</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                    <CheckCircle size={36} color="var(--text-dim)" style={{ margin: '0 auto 0.5rem' }} />
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: '700' }}>No Active Token in Queue</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                      Schedule a service or walk-in to get an instant digital queue pass.
                    </p>
                    <button onClick={() => setActiveTab('explore')} className="btn btn-sm btn-primary">
                      Browse Menu
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wallet & Loyalty Tab */}
            {activeTab === 'wallet' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    border: '1px solid var(--accent-gold)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Digital Salon Pass & Wallet
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.25rem 0 0.75rem' }}>
                    {org.currency}{(activeCustomer.wallet_balance || 0).toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={14} />
                      <span>{activeCustomer.loyalty_points || 0} Reward Points</span>
                    </div>
                    <button
                      onClick={() => setIsTopupOpen(true)}
                      className="btn btn-sm btn-primary"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.65rem' }}
                    >
                      <Plus size={12} />
                      <span>Top Up Wallet</span>
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  VIP Member Benefits
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Gift size={20} color="var(--accent-gold)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>1 Pt per ₹50 Spent</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Redeemable directly at checkout on any service.</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag size={20} color="var(--color-success)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>Birthday Month: Complimentary Spa</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Free aromatic hair spa on your birthday week.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices & Receipts Tab */}
            {activeTab === 'invoices' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: '700' }}>Past Invoices & Receipts ({customerInvoices.length})</h4>
                {customerInvoices.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.8125rem' }}>
                    No invoice receipts yet.
                  </div>
                ) : (
                  customerInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      style={{
                        background: 'var(--bg-secondary)',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {inv.invoice_number}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                          {inv.created_at} • {inv.payment_method}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--color-success)' }}>
                          {org.currency}{inv.total_amount}
                        </div>
                        <button
                          onClick={() => triggerWhatsApp('invoice_receipt', inv)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#25d366',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <MessageSquare size={10} />
                          <span>WhatsApp Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Bottom App Navigation Bar */}
          <div
            style={{
              padding: '8px 12px',
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              zIndex: 30,
            }}
          >
            {[
              { id: 'explore', label: 'Services', icon: ShoppingBag },
              { id: 'queue', label: 'Live Queue', icon: Clock },
              { id: 'wallet', label: 'Wallet', icon: CreditCard },
              { id: 'invoices', label: 'Past Bills', icon: Tag },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    color: isActive ? 'var(--accent-gold-light)' : 'var(--text-dim)',
                    cursor: 'pointer',
                    fontSize: '0.65rem',
                    fontWeight: isActive ? '700' : '500',
                  }}
                >
                  <Icon size={18} color={isActive ? 'var(--accent-gold)' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Booking Modal (Slide-up Sheet) */}
          {isBookingOpen && selectedService && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(4px)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'flex-end',
              }}
              onClick={() => setIsBookingOpen(false)}
            >
              <div
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  borderRadius: '24px 24px 0 0',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                  maxHeight: '85%',
                  overflowY: 'auto',
                  borderTop: '1px solid var(--accent-gold)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Schedule Appointment</h3>
                    <p style={{ fontSize: '0.7rem', color: 'var(--accent-gold-light)' }}>
                      {selectedService.name} • {org.currency}{selectedService.price}
                    </p>
                  </div>
                  <button onClick={() => setIsBookingOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '1.1rem', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>

                <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Preferred Stylist</label>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.75rem', height: '2.25rem' }}
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                    >
                      <option value="auto">⚡ Any Available Stylist (Fastest Queue)</option>
                      {staff.map((stf) => (
                        <option key={stf.id} value={stf.id}>
                          {stf.full_name} ({stf.designation} • ⭐{stf.rating})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Date</label>
                      <input
                        type="date"
                        className="form-input"
                        style={{ fontSize: '0.75rem', height: '2.25rem' }}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Time Slot</label>
                      <select
                        className="form-select"
                        style={{ fontSize: '0.75rem', height: '2.25rem' }}
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        {['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'].map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Special Allergy / Style Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Sensitive scalp, herbal shampoo only"
                      className="form-input"
                      style={{ fontSize: '0.75rem', height: '2.25rem' }}
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.25rem', height: '2.5rem' }}>
                    <Sparkles size={16} />
                    <span>Confirm Booking ({org.currency}{selectedService.price})</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Top-up Sheet */}
          {isTopupOpen && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(4px)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'flex-end',
              }}
              onClick={() => setIsTopupOpen(false)}
            >
              <div
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  borderRadius: '24px 24px 0 0',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Top Up Salon Wallet</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`btn btn-sm ${topupAmount === amt ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, fontSize: '0.75rem' }}
                    >
                      {org.currency}{amt}
                    </button>
                  ))}
                </div>
                <button onClick={handleTopupSubmit} className="btn btn-primary" style={{ width: '100%' }}>
                  Proceed to Pay {org.currency}{topupAmount} (UPI/Card)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import { 
  DollarSign, 
  CalendarCheck, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Plus, 
  Receipt,
  UserPlus,
  Scissors,
  Info,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  FileText,
  ChevronDown,
  X,
  Tag
} from 'lucide-react';

export default function Dashboard({ onOpenNewBooking, onOpenNewClient }) {
  const { 
    org, 
    appointments, 
    invoices, 
    customers, 
    products, 
    services, 
    staff,
    setActiveTab,
    triggerWhatsApp,
    addToast 
  } = useApp();

  // Aggregate stats
  const todayAppointments = appointments.length;
  const totalRevenue = invoices.filter(i => i.payment_status === 'paid').reduce((acc, curr) => acc + curr.total_amount, 0);
  const pendingPayments = invoices.filter(i => i.payment_status !== 'paid').reduce((acc, curr) => acc + curr.total_amount, 0);
  const totalClients = customers.length;
  const lowStockItems = products.filter(p => p.quantity_in_stock <= p.reorder_level);

  // Info header state for Today's Scheduled Clients section
  const [showScheduleInfo, setShowScheduleInfo] = useState(false);

  // Orders Ledger Filter State
  const [orderSearch, setOrderSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'yesterday' | 'week' | 'month'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'paid' | 'unpaid' | 'partial'
  const [methodFilter, setMethodFilter] = useState('all'); // 'all' | 'UPI' | 'Card' | 'Cash' | 'Wallet' | 'Split'
  const [staffFilter, setStaffFilter] = useState('all');

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter Orders
  const filteredOrders = invoices.filter((inv) => {
    // Search match
    const searchLower = orderSearch.toLowerCase();
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchLower) ||
      inv.customer_name.toLowerCase().includes(searchLower) ||
      (inv.customer_phone || '').toLowerCase().includes(searchLower) ||
      (inv.staff_name || '').toLowerCase().includes(searchLower) ||
      (inv.items || []).some(item => item.name.toLowerCase().includes(searchLower));

    // Status match
    const matchesStatus = statusFilter === 'all' || inv.payment_status === statusFilter;

    // Method match
    const matchesMethod = methodFilter === 'all' || (inv.payment_method || '').toLowerCase().includes(methodFilter.toLowerCase());

    // Staff match
    const matchesStaff = staffFilter === 'all' || inv.staff_name === staffFilter;

    // Date range match
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = (inv.created_at || '').includes('2026-08-20');
    } else if (dateFilter === 'yesterday') {
      matchesDate = (inv.created_at || '').includes('2026-08-19');
    }

    return matchesSearch && matchesStatus && matchesMethod && matchesStaff && matchesDate;
  });

  const filteredTotalSum = filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  // Export to CSV Feature
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      addToast('No orders to export in current filter.', 'danger');
      return;
    }

    const headers = ['Invoice #', 'Date & Time', 'Customer Name', 'Contact Phone', 'Items / Services', 'Assigned Stylist', 'Subtotal', 'Tax (GST)', 'Discount', 'Total Amount', 'Status', 'Payment Method'];
    
    const rows = filteredOrders.map((inv) => [
      `"${inv.invoice_number}"`,
      `"${inv.created_at}"`,
      `"${inv.customer_name}"`,
      `"${inv.customer_phone || 'N/A'}"`,
      `"${(inv.items || []).map(i => `${i.name} (x${i.qty || 1})`).join('; ') || 'Salon Service'}"`,
      `"${inv.staff_name || 'General'}"`,
      inv.subtotal || inv.total_amount,
      inv.tax_amount || 0,
      inv.discount_amount || 0,
      inv.total_amount,
      `"${inv.payment_status.toUpperCase()}"`,
      `"${inv.payment_method || 'Cash'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SalonOS_Orders_${org.slug || 'orders'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Exported ${filteredOrders.length} orders to CSV spreadsheet!`);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* Welcome Banner */}
      <div 
        className="glass-card" 
        style={{
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(30, 41, 59, 0.7) 100%)',
          border: '1px solid var(--border-accent)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.75rem 2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={18} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Salon Manager Command Center
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
            Welcome back, {org.owner_name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Live performance, chair allocations, and financial order ledger for <strong style={{ color: 'var(--text-main)' }}>{org.name}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('billing')} className="btn btn-secondary">
            <Receipt size={16} />
            <span>Open POS Terminal</span>
          </button>
          <button onClick={onOpenNewBooking} className="btn btn-primary">
            <Plus size={16} />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid with Interactive Info Inside */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
      }}>
        <StatCard
          title="Today's Scheduled Clients"
          value={todayAppointments}
          icon={CalendarCheck}
          trend="up"
          trendValue="+14%"
          subtitle="vs. yesterday"
          infoTitle="Today's Scheduled Clients"
          infoDetails="Real-time capacity of appointments booked across all chairs & stylists for today."
          infoBreakdown={[
            { label: 'In-Service', value: '1 client', color: 'var(--color-purple)' },
            { label: 'Confirmed', value: '1 client', color: 'var(--color-info)' },
            { label: 'Scheduled', value: '3 clients', color: 'var(--accent-gold)' },
            { label: 'Chair Occupancy', value: '82%', color: 'var(--color-success)' }
          ]}
        />
        <StatCard
          title="Total Monthly Revenue"
          value={`${org.currency}${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+22%"
          subtitle="target on track"
          infoTitle="Monthly Gross Revenue"
          infoDetails="Total collections from settled service bookings, package memberships, and retail sales."
          infoBreakdown={[
            { label: 'Services Share', value: '84%', color: 'var(--color-success)' },
            { label: 'Product Retail', value: '16%', color: 'var(--color-info)' },
            { label: 'Average Ticket Size', value: `${org.currency}2,450`, color: 'var(--accent-gold-light)' }
          ]}
        />
        <StatCard
          title="Active Registered Clients"
          value={totalClients}
          icon={Users}
          trend="up"
          trendValue="+8 new"
          subtitle="this month"
          infoTitle="Client CRM & Retention"
          infoDetails="Total profiles in your database with visit history, preferences, and loyalty points."
          infoBreakdown={[
            { label: 'VIP Gold Tier', value: '2 clients', color: 'var(--accent-gold)' },
            { label: 'Repeat Visit Rate', value: '78%', color: 'var(--color-success)' },
            { label: 'Total Points Accrued', value: '1,950 pts', color: 'var(--color-info)' }
          ]}
        />
        <StatCard
          title="Pending Invoices"
          value={`${org.currency}${pendingPayments.toLocaleString()}`}
          icon={CreditCard}
          trend="down"
          trendValue="2 uncollected"
          subtitle="requires checkout"
          infoTitle="Unsettled Orders & Tab"
          infoDetails="Services completed or in progress that have not yet been fully paid at POS."
          infoBreakdown={[
            { label: 'Unpaid Invoices', value: '1 bill', color: 'var(--color-danger)' },
            { label: 'Partial Settled', value: '1 bill', color: 'var(--color-warning)' },
            { label: 'Average Aging', value: '< 2 hours', color: 'var(--text-dim)' }
          ]}
        />
      </div>

      {/* Main 2-Column Section: Live Appointments Timeline & Top Services */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Left Column: Live Appointments Timeline with Info */}
        <div className="glass-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.125rem' }}>Today's Scheduled Clients</h3>
                  <button
                    type="button"
                    onClick={() => setShowScheduleInfo(!showScheduleInfo)}
                    style={{
                      background: showScheduleInfo ? 'var(--accent-gold)' : 'transparent',
                      border: 'none',
                      color: showScheduleInfo ? '#000' : 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '2px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Live Queue & Chair Analytics"
                  >
                    <Info size={14} />
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Live chair queue & stylist auto-dispatches</p>
              </div>
            </div>

            <button onClick={() => setActiveTab('appointments')} className="btn btn-outline btn-sm">
              View Calendar
            </button>
          </div>

          {/* Schedule Info Popover */}
          {showScheduleInfo && (
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--accent-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div>
                <span style={{ fontWeight: '700', color: 'var(--accent-gold-light)' }}>ℹ️ Chair Utilization: 85%</span>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Average service turnaround: 55 mins • 4 Stylists on Duty</div>
              </div>
              <button
                onClick={() => setShowScheduleInfo(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {appointments.map((appt) => {
              let badgeColor = 'badge-gold';
              if (appt.status === 'in_progress') badgeColor = 'badge-purple';
              if (appt.status === 'completed') badgeColor = 'badge-success';
              if (appt.status === 'confirmed') badgeColor = 'badge-info';

              return (
                <div
                  key={appt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      padding: '0.5rem 0.625rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      color: 'var(--accent-gold-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}>
                      <Clock size={13} />
                      {appt.start_time}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{appt.customer_name}</span>
                        <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>{appt.token_number || '#T-101'}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {appt.service_name} • Stylist: <span style={{ color: 'var(--accent-gold-light)' }}>{appt.staff_name}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>{org.currency}{appt.price}</span>
                    <span className={`badge ${badgeColor}`}>
                      {appt.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Top Services & Low Stock Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Services */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem' }}>Top Popular Services</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Most requested this month</p>
              </div>
              <button onClick={() => setActiveTab('services')} className="btn btn-outline btn-sm">
                Menu
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {services.slice(0, 4).map((s, idx) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: idx === 0 ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                      color: idx === 0 ? '#000' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{s.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{s.category} • {s.duration} mins</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: '700', color: 'var(--text-gold)', fontSize: '0.875rem' }}>{org.currency}{s.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning Alert Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="var(--color-warning)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Inventory Reorder Alerts</h4>
              </div>
              <span className="badge badge-warning">{lowStockItems.length} Products Low</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lowStockItems.map((prod) => (
                <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <span>{prod.name}</span>
                  <span style={{ color: 'var(--color-danger)', fontWeight: '700' }}>
                    {prod.quantity_in_stock} left (reorder threshold {prod.reorder_level})
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveTab('inventory')} className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '0.75rem' }}>
              Manage Stock Inventory
            </button>
          </div>
        </div>
      </div>

      {/* ==============================================================================
          NEW SECTION: All Orders & Invoices (Live Ledger with Filters & Export)
          ============================================================================== */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>All Orders & Invoices (Live Ledger)</h2>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                {filteredOrders.length} Orders
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-success)', fontWeight: '700' }}>
                Total: {org.currency}{filteredTotalSum.toLocaleString()}
              </span>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>
              Filter by date, payment status, payment method, or stylist. Export directly to CSV/Excel.
            </p>
          </div>

          {/* Export and Print Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleExportCSV} 
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Download CSV spreadsheet of filtered orders"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={handlePrintSummary} 
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Print orders summary"
            >
              <Printer size={14} />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          background: 'var(--bg-tertiary)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Row 1: Search & Date Presets */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
              <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by customer, phone, invoice #, service..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="form-input"
                style={{ height: '2.25rem', paddingLeft: '32px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            {/* Date Preset Buttons */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDateFilter(d.id)}
                  className={`btn btn-sm ${dateFilter === d.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Dropdown Filters (Status, Method, Staff) */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <Filter size={13} />
              <span>Filters:</span>
            </div>

            {/* Payment Status Dropdown */}
            <select
              className="form-select"
              style={{ width: '140px', height: '2rem', fontSize: '0.75rem', padding: '2px 8px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid 🟢</option>
              <option value="unpaid">Unpaid 🔴</option>
              <option value="partial">Partial 🟡</option>
            </select>

            {/* Payment Method Dropdown */}
            <select
              className="form-select"
              style={{ width: '140px', height: '2rem', fontSize: '0.75rem', padding: '2px 8px' }}
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="UPI">UPI / QR</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Wallet">Salon Wallet</option>
              <option value="Split">Split Payment</option>
            </select>

            {/* Staff Filter Dropdown */}
            <select
              className="form-select"
              style={{ width: '160px', height: '2rem', fontSize: '0.75rem', padding: '2px 8px' }}
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
            >
              <option value="all">All Stylists</option>
              {staff.map((stf) => (
                <option key={stf.id} value={stf.full_name}>
                  {stf.full_name}
                </option>
              ))}
            </select>

            {/* Reset Filters button */}
            {(orderSearch || dateFilter !== 'all' || statusFilter !== 'all' || methodFilter !== 'all' || staffFilter !== 'all') && (
              <button
                onClick={() => {
                  setOrderSearch('');
                  setDateFilter('all');
                  setStatusFilter('all');
                  setMethodFilter('all');
                  setStaffFilter('all');
                }}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.7rem', padding: '3px 8px', color: 'var(--accent-gold-light)' }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Order / Invoice #</th>
                <th style={{ padding: '0.75rem 1rem' }}>Client Details</th>
                <th style={{ padding: '0.75rem 1rem' }}>Items & Services</th>
                <th style={{ padding: '0.75rem 1rem' }}>Stylist</th>
                <th style={{ padding: '0.75rem 1rem' }}>Subtotal & Taxes</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Paid</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Method</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-dim)' }}>
                    <Receipt size={36} color="var(--text-dim)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: '600' }}>No orders found matching the filter criteria.</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Try clearing filters or search for another customer.</div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  let statusBadge = 'badge-success';
                  if (order.payment_status === 'unpaid') statusBadge = 'badge-danger';
                  if (order.payment_status === 'partial') statusBadge = 'badge-warning';

                  return (
                    <tr 
                      key={order.id} 
                      style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }} 
                      className="table-row-hover"
                    >
                      {/* Invoice # and Date */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontWeight: '700', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FileText size={13} />
                          <span>{order.invoice_number}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {order.created_at}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{order.customer_name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{order.customer_phone || '+91 98765 00000'}</div>
                      </td>

                      {/* Items & Services */}
                      <td style={{ padding: '0.875rem 1rem', maxWidth: '240px' }}>
                        {order.items && order.items.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {order.items.map((item, iIdx) => (
                              <span key={iIdx} style={{ fontSize: '0.75rem', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-gold)' }}></span>
                                <strong>{item.qty || 1}x</strong> {item.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salon Service Treatment</span>
                        )}
                      </td>

                      {/* Stylist */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: '600' }}>
                          {order.staff_name || 'General Stylist'}
                        </div>
                      </td>

                      {/* Financial Breakdown */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          Sub: {org.currency}{order.subtotal || order.total_amount}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          Tax: +{org.currency}{order.tax_amount || 0} • Disc: -{org.currency}{order.discount_amount || 0}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-success)' }}>
                          {org.currency}{order.total_amount.toLocaleString()}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span className={`badge ${statusBadge}`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                          {order.payment_status}
                        </span>
                      </td>

                      {/* Method */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {order.payment_method || 'Cash'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          {/* View Details Button */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            title="View Full Invoice Breakdown"
                          >
                            <Eye size={13} />
                          </button>

                          {/* WhatsApp Invoice Dispatch */}
                          <button
                            onClick={() => triggerWhatsApp('invoice_receipt', order)}
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#25d366', borderColor: 'rgba(37, 211, 102, 0.3)' }}
                            title="Send PDF Invoice via WhatsApp"
                          >
                            <MessageSquare size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==============================================================================
          ORDER DETAILS & TAX INVOICE MODAL
          ============================================================================== */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '1.75rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--accent-gold)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                  Official Tax Invoice
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginTop: '0.25rem' }}>
                  {selectedOrder.invoice_number}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Created on {selectedOrder.created_at} • {org.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            {/* Salon & Customer Meta Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-tertiary)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem' }}>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Billed To:</div>
                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{selectedOrder.customer_name}</div>
                <div style={{ color: 'var(--text-dim)' }}>{selectedOrder.customer_phone || '+91 98765 00000'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Stylist & Service Provider:</div>
                <div style={{ fontWeight: '700', color: 'var(--accent-gold-light)' }}>{selectedOrder.staff_name || 'General Specialist'}</div>
                <div style={{ color: 'var(--text-dim)' }}>Payment: {selectedOrder.payment_method}</div>
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Itemized Services & Retail Products
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(selectedOrder.items || [{ name: 'Salon Service Treatment', type: 'Service', price: selectedOrder.subtotal || selectedOrder.total_amount, qty: 1 }]).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.625rem 0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Type: {item.type || 'Service'} • Qty: {item.qty || 1}</div>
                    </div>
                    <div style={{ fontWeight: '700', color: 'var(--text-gold)' }}>
                      {org.currency}{(item.price * (item.qty || 1)).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal Base:</span>
                <span>{org.currency}{(selectedOrder.subtotal || selectedOrder.total_amount).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>GST Tax ({org.gstRate}%):</span>
                <span>+{org.currency}{(selectedOrder.tax_amount || 0).toLocaleString()}</span>
              </div>
              {selectedOrder.discount_amount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Discount Applied:</span>
                  <span>-{org.currency}{selectedOrder.discount_amount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: '800', color: 'var(--color-success)', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-strong)' }}>
                <span>Grand Total Paid:</span>
                <span>{org.currency}{selectedOrder.total_amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => {
                  triggerWhatsApp('invoice_receipt', selectedOrder);
                  setSelectedOrder(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1, background: '#25d366', color: '#000', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <MessageSquare size={16} />
                <span>Send WhatsApp Receipt</span>
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={15} />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

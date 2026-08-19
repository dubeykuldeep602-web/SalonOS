import React from 'react';
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
  Scissors
} from 'lucide-react';

export default function Dashboard({ onOpenNewBooking, onOpenNewClient }) {
  const { org, appointments, invoices, customers, products, services, setActiveTab } = useApp();

  // Aggregate stats
  const todayAppointments = appointments.length;
  const totalRevenue = invoices.filter(i => i.payment_status === 'paid').reduce((acc, curr) => acc + curr.total_amount, 0);
  const pendingPayments = invoices.filter(i => i.payment_status !== 'paid').reduce((acc, curr) => acc + curr.total_amount, 0);
  const totalClients = customers.length;
  const lowStockItems = products.filter(p => p.quantity_in_stock <= p.reorder_level);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
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
            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salon Manager Dashboard</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
            Welcome back, {org.owner_name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Here is what's happening at <strong style={{ color: 'var(--text-main)' }}>{org.name}</strong> today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
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

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
      }}>
        <StatCard
          title="Today's Appointments"
          value={todayAppointments}
          icon={CalendarCheck}
          trend="up"
          trendValue="+14%"
          subtitle="vs. yesterday"
        />
        <StatCard
          title="Total Revenue (Month)"
          value={`${org.currency}${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+22%"
          subtitle="target on track"
        />
        <StatCard
          title="Total Active Clients"
          value={totalClients}
          icon={Users}
          trend="up"
          trendValue="+8 new"
          subtitle="this month"
        />
        <StatCard
          title="Pending Invoices"
          value={`${org.currency}${pendingPayments.toLocaleString()}`}
          icon={CreditCard}
          trend="down"
          trendValue="3 unpaid"
          subtitle="requires follow-up"
        />
      </div>

      {/* Main 2-Column Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Left Column: Live Appointments Timeline */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>Today's Scheduled Clients</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Live queue & stylist allocations</p>
            </div>
            <button onClick={() => setActiveTab('appointments')} className="btn btn-outline btn-sm">
              View Calendar
            </button>
          </div>

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
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{appt.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {appt.service_name} • Stylist: <span style={{ color: 'var(--text-main)' }}>{appt.staff_name}</span>
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
    </div>
  );
}

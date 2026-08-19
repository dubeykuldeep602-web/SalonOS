import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Users,
  Scissors,
  UserCheck,
  Package,
  MessageSquare,
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, org, appointments, products } = useApp();

  const lowStockCount = products.filter(p => p.quantity_in_stock <= p.reorder_level).length;
  const todayAppointmentsCount = appointments.length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: todayAppointmentsCount },
    { id: 'billing', label: 'POS & Billing', icon: CreditCard },
    { id: 'customers', label: 'Clients & CRM', icon: Users },
    { id: 'services', label: 'Services Menu', icon: Scissors },
    { id: 'staff', label: 'Staff & Team', icon: UserCheck },
    { id: 'inventory', label: 'Inventory Stock', icon: Package, badge: lowStockCount ? `${lowStockCount} low` : null, badgeType: 'warning' },
    { id: 'marketing', label: 'WhatsApp Hub', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--accent-gold) 0%, #f59e0b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          boxShadow: '0 0 15px var(--accent-gold-glow)',
        }}>
          <Scissors size={22} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
              Salon<span style={{ color: 'var(--accent-gold)' }}>OS</span>
            </h2>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              padding: '1px 5px',
              borderRadius: '4px',
              background: 'var(--accent-gold-glow)',
              color: 'var(--accent-gold-light)',
            }}>PRO</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Enterprise Beauty Suite</p>
        </div>
      </div>

      {/* Nav List */}
      <nav style={{
        flex: 1,
        padding: '1rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        overflowY: 'auto',
      }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', padding: '0.5rem 0.75rem' }}>
          Operations & Desk
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(217, 119, 6, 0.18) 0%, rgba(217, 119, 6, 0.05) 100%)' : 'transparent',
                color: isActive ? 'var(--accent-gold-light)' : 'var(--text-muted)',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                borderLeft: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? 'var(--accent-gold)' : 'currentColor'} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`badge ${item.badgeType === 'warning' ? 'badge-danger' : 'badge-gold'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Salon Location / Multi-tenant Badge */}
      <div style={{
        padding: '1rem',
        margin: '0.75rem',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Sparkles size={14} color="var(--accent-gold)" />
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-gold)', textTransform: 'uppercase' }}>Active Salon</span>
        </div>
        <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {org.name}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{org.city}, {org.state}</div>
      </div>
    </aside>
  );
}

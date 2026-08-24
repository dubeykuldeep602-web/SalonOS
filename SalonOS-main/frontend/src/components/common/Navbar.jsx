import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  PlusCircle,
  Moon,
  Sun,
  Sparkles,
  Bell,
  CheckCircle2,
  Server,
  Scissors,
  Shield,
  Smartphone,
  Users,
  Store,
  MessageSquare,
  ChevronDown,
  LogIn,
  LogOut,
  UserCheck,
  Key
} from 'lucide-react';

export default function Navbar({ onOpenNewBooking }) {
  const {
    theme,
    setTheme,
    org,
    tenants,
    activeTenantId,
    setActiveTenantId,
    activeRole,
    setActiveRole,
    currentUser,
    logout,
    setIsAuthModalOpen,
    appointments,
    triggerWhatsApp,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const pendingAppointments = appointments.filter(
    (a) => a.status === 'scheduled' || a.status === 'in_progress'
  );

  const roles = [
    { id: 'superadmin', label: 'SaaS Super Admin', icon: Shield, color: '#f59e0b' },
    { id: 'owner', label: 'Salon Owner POS', icon: Store, color: '#d97706' },
    { id: 'staff', label: 'Stylist APK', icon: Scissors, color: '#a855f7' },
    { id: 'customer', label: 'Customer App', icon: Smartphone, color: '#10b981' },
  ];

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      {/* 4-Pillar Interactive Role Switcher */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = activeRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: isActive
                  ? `linear-gradient(135deg, ${r.color} 0%, rgba(217, 119, 6, 0.8) 100%)`
                  : 'transparent',
                color: isActive ? '#000' : 'var(--text-muted)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? `0 0 15px ${r.color}66` : 'none',
              }}
            >
              <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Center / Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Salon Tenant Switcher (Active in Owner, Staff, Customer modes) */}
        {activeRole !== 'superadmin' && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--accent-gold-glow)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: '800',
                }}
              >
                {org.logo_letter || 'S'}
              </div>
              <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {org.name}
              </span>
              <ChevronDown size={14} color="var(--text-dim)" />
            </button>

            {isTenantDropdownOpen && (
              <div
                className="glass-card"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '260px',
                  padding: '0.5rem',
                  zIndex: 50,
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', padding: '4px 8px' }}>
                  Switch Active Salon Tenant
                </div>
                {tenants.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTenantId(t.id);
                      setIsTenantDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: t.id === activeTenantId ? 'var(--bg-tertiary)' : 'transparent',
                      color: t.id === activeTenantId ? 'var(--accent-gold-light)' : 'var(--text-main)',
                      fontSize: '0.8125rem',
                      fontWeight: t.id === activeTenantId ? '700' : '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                    }}
                  >
                    <div>
                      <div>{t.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{t.city} • {t.plan}</div>
                    </div>
                    {t.id === activeTenantId && <CheckCircle2 size={14} color="var(--accent-gold)" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WhatsApp Cloud Bot Simulation Trigger */}
        <button
          onClick={() =>
            triggerWhatsApp('reengagement', {
              customer_name: 'Neha Kapoor',
            })
          }
          className="btn btn-secondary"
          style={{
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            padding: '0.4rem 0.75rem',
            border: '1px solid rgba(37, 211, 102, 0.3)',
            color: '#25d366',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
          title="Simulate WhatsApp 2-Way Bot"
        >
          <MessageSquare size={14} />
          <span>WhatsApp Bot</span>
        </button>

        {/* Quick New Booking Button (Owner mode) */}
        {activeRole === 'owner' && (
          <button
            onClick={onOpenNewBooking}
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', padding: '0.4rem 0.85rem' }}
          >
            <PlusCircle size={15} />
            <span>New Booking</span>
          </button>
        )}

        {/* Theme Switcher */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', padding: '3px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setTheme('dark')}
            title="Dark Theme"
            style={{
              background: theme === 'dark' ? 'var(--accent-gold)' : 'transparent',
              color: theme === 'dark' ? '#000' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Moon size={13} />
          </button>
          <button
            onClick={() => setTheme('rosegold')}
            title="Rose Gold Theme"
            style={{
              background: theme === 'rosegold' ? 'var(--accent-gold)' : 'transparent',
              color: theme === 'rosegold' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Sparkles size={13} />
          </button>
          <button
            onClick={() => setTheme('light')}
            title="Light Theme"
            style={{
              background: theme === 'light' ? 'var(--accent-gold)' : 'transparent',
              color: theme === 'light' ? '#000' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Sun size={13} />
          </button>
        </div>

        {/* Notifications Icon */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative', borderRadius: 'var(--radius-full)', width: '32px', height: '32px', padding: 0 }}
          >
            <Bell size={16} />
            {pendingAppointments.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  background: 'var(--accent-gold)',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px var(--accent-gold)',
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              className="glass-card"
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                width: '300px',
                padding: '1rem',
                zIndex: 50,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700' }}>Live Salon Events</h4>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{pendingAppointments.length} Active</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                {pendingAppointments.map((a) => (
                  <div key={a.id} style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{a.customer_name} — {a.service_name}</div>
                    <div style={{ color: 'var(--accent-gold-light)', fontSize: '0.7rem' }}>Stylist: {a.staff_name} • {a.start_time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Auth Profile & Menu */}
        {currentUser ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.65rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: activeRole === 'superadmin' ? '#f59e0b' : activeRole === 'staff' ? '#a855f7' : activeRole === 'customer' ? '#10b981' : 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontWeight: '800',
                  fontSize: '0.7rem',
                }}
              >
                {currentUser.full_name ? currentUser.full_name.charAt(0) : 'U'}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>
                {currentUser.full_name}
              </span>
              <ChevronDown size={13} color="var(--text-dim)" />
            </button>

            {isProfileMenuOpen && (
              <div
                className="glass-card"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '220px',
                  padding: '0.75rem',
                  zIndex: 50,
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>{currentUser.full_name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{currentUser.email || currentUser.phone}</div>
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem', marginTop: '4px', textTransform: 'uppercase' }}>
                    Role: {currentUser.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Key size={14} />
                  <span>Switch Auth Role</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-danger)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px',
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}

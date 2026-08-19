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
  Scissors
} from 'lucide-react';

export default function Navbar({ onOpenNewBooking }) {
  const { theme, setTheme, org, liveBackendConnected, appointments } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingAppointments = appointments.filter(a => a.status === 'scheduled' || a.status === 'in_progress');

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '400px', width: '100%' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            placeholder="Search clients, phone, invoice #, services..." 
            className="form-input"
            style={{ paddingLeft: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-full)' }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Backend Status indicator */}
        <div 
          title={liveBackendConnected ? "FastAPI live backend connected on port 8000" : "Running on local interactive demo storage"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: liveBackendConnected ? 'var(--color-success-bg)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${liveBackendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            fontSize: '0.75rem',
            fontWeight: '600',
            color: liveBackendConnected ? 'var(--color-success)' : 'var(--color-warning)',
          }}
        >
          <Server size={14} />
          <span>{liveBackendConnected ? 'FastAPI Live' : 'Demo Mode'}</span>
        </div>

        {/* Quick New Booking Button */}
        <button 
          onClick={onOpenNewBooking}
          className="btn btn-primary"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <PlusCircle size={16} />
          <span>New Appointment</span>
        </button>

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
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Moon size={14} />
          </button>
          <button 
            onClick={() => setTheme('rosegold')}
            title="Rose Gold Theme"
            style={{
              background: theme === 'rosegold' ? 'var(--accent-gold)' : 'transparent',
              color: theme === 'rosegold' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Sparkles size={14} />
          </button>
          <button 
            onClick={() => setTheme('light')}
            title="Light Theme"
            style={{
              background: theme === 'light' ? 'var(--accent-gold)' : 'transparent',
              color: theme === 'light' ? '#000' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Sun size={14} />
          </button>
        </div>

        {/* Notifications Icon with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative', borderRadius: 'var(--radius-full)' }}
          >
            <Bell size={18} />
            {pendingAppointments.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '10px',
                height: '10px',
                background: 'var(--accent-gold)',
                borderRadius: '50%',
                boxShadow: '0 0 8px var(--accent-gold)',
              }} />
            )}
          </button>

          {showNotifications && (
            <div 
              className="glass-card"
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                width: '320px',
                padding: '1rem',
                zIndex: 50,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem' }}>Activity & Reminders</h4>
                <span className="badge badge-gold">{pendingAppointments.length} Active</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                {pendingAppointments.map(a => (
                  <div key={a.id} style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{a.customer_name} — {a.service_name}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>With {a.staff_name} at {a.start_time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 0.85rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-gold), #818cf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: '700',
            fontSize: '0.75rem',
          }}>
            SV
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600' }}>{org.owner_name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Salon Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
}

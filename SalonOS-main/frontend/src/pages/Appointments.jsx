import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  CheckCircle2, 
  PlayCircle, 
  XCircle, 
  CreditCard,
  User,
  Filter,
  Scissors
} from 'lucide-react';

export default function Appointments({ onOpenNewBooking, onSendToPOS }) {
  const { appointments, org, updateAppointmentStatus, setActiveTab } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch = 
      a.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.staff_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Appointments & Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage daily schedule, client arrivals, and stylist assignments.
          </p>
        </div>
        <button onClick={onOpenNewBooking} className="btn btn-primary">
          <Plus size={16} />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ width: '260px' }}>
          <input
            type="text"
            placeholder="Search by client, service, stylist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ height: '2.25rem', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* Appointments List / Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filteredAppointments.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem' }}>
            <CalendarIcon size={40} color="var(--text-dim)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>No appointments found</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Try changing the filter or schedule a new appointment.
            </p>
            <button onClick={onOpenNewBooking} className="btn btn-primary btn-sm">
              Schedule First Appointment
            </button>
          </div>
        ) : (
          filteredAppointments.map((appt) => {
            let statusBadge = 'badge-gold';
            if (appt.status === 'in_progress') statusBadge = 'badge-purple';
            if (appt.status === 'completed') statusBadge = 'badge-success';
            if (appt.status === 'confirmed') statusBadge = 'badge-info';
            if (appt.status === 'cancelled') statusBadge = 'badge-danger';

            return (
              <div 
                key={appt.id} 
                className="glass-card glass-card-interactive" 
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.8125rem',
                      fontWeight: '700',
                      color: 'var(--accent-gold-light)',
                      background: 'var(--bg-tertiary)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <Clock size={14} />
                      <span>{appt.start_time}</span>
                      <span style={{ color: 'var(--text-dim)' }}>• {appt.date}</span>
                    </div>

                    <span className={`badge ${statusBadge}`}>
                      {appt.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{appt.customer_name}</h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{appt.customer_phone}</div>
                  </div>

                  <div style={{
                    padding: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Service:</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{appt.service_name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Stylist:</span>
                      <span style={{ fontWeight: '600', color: 'var(--accent-gold-light)' }}>{appt.staff_name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Estimated:</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-gold)' }}>{org.currency}{appt.price}</span>
                    </div>
                  </div>
                </div>

                {/* Workflow Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                  {appt.status === 'scheduled' && (
                    <button 
                      onClick={() => updateAppointmentStatus(appt.id, 'confirmed')} 
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <CheckCircle2 size={14} color="var(--color-info)" />
                      <span>Confirm</span>
                    </button>
                  )}

                  {appt.status === 'confirmed' && (
                    <button 
                      onClick={() => updateAppointmentStatus(appt.id, 'in_progress')} 
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <PlayCircle size={14} color="var(--color-purple)" />
                      <span>Start Service</span>
                    </button>
                  )}

                  {appt.status === 'in_progress' && (
                    <button 
                      onClick={() => updateAppointmentStatus(appt.id, 'completed')} 
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Complete</span>
                    </button>
                  )}

                  <button 
                    onClick={() => onSendToPOS(appt)} 
                    className="btn btn-outline btn-sm"
                    title="Transfer to Point of Sale for Checkout"
                  >
                    <CreditCard size={14} />
                    <span>Checkout</span>
                  </button>

                  {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                    <button 
                      onClick={() => updateAppointmentStatus(appt.id, 'cancelled')} 
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Cancel Appointment"
                    >
                      <XCircle size={14} color="var(--color-danger)" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

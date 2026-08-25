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
  Scissors,
  Edit,
  Trash2,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function Appointments({ onOpenNewBooking, onSendToPOS }) {
  const {
    appointments,
    services,
    staff,
    customers,
    org,
    updateAppointmentStatus,
    editAppointment,
    deleteAppointment,
    addAppointment,
    setActiveTab
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [editingAppt, setEditingAppt] = useState(null);
  const [editForm, setEditForm] = useState({
    customer_name: '',
    customer_phone: '',
    service_id: '',
    staff_id: '',
    date: '',
    start_time: '',
    notes: '',
    status: 'scheduled',
  });

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch =
      (a.customer_name && a.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.service_name && a.service_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.staff_name && a.staff_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleOpenEdit = (appt) => {
    setEditingAppt(appt);
    setEditForm({
      customer_name: appt.customer_name,
      customer_phone: appt.customer_phone || '',
      service_id: appt.service_id || (services.find(s => s.name === appt.service_name)?.id || services[0]?.id || 1),
      staff_id: appt.staff_id || (staff.find(s => s.full_name === appt.staff_name)?.id || staff[0]?.id || 1),
      date: appt.date || new Date().toISOString().split('T')[0],
      start_time: appt.start_time || '10:00 AM',
      notes: appt.notes || '',
      status: appt.status || 'scheduled',
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingAppt) {
      const selectedService = services.find(s => s.id === Number(editForm.service_id));
      const selectedStaff = staff.find(s => s.id === Number(editForm.staff_id));

      editAppointment(editingAppt.id, {
        customer_name: editForm.customer_name,
        customer_phone: editForm.customer_phone,
        service_id: Number(editForm.service_id),
        service_name: selectedService ? selectedService.name : editingAppt.service_name,
        price: selectedService ? selectedService.price : editingAppt.price,
        staff_id: Number(editForm.staff_id),
        staff_name: selectedStaff ? selectedStaff.full_name : editingAppt.staff_name,
        date: editForm.date,
        start_time: editForm.start_time,
        notes: editForm.notes,
        status: editForm.status,
      });
      setEditingAppt(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>Appointment Master</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
              {appointments.filter(a => a.status === 'in_progress' || a.status === 'scheduled').length} In Queue Today
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Appointments & Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage daily schedule, client arrivals, stylist reassignments, and edit booking slots.
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge ${statusBadge}`}>
                        {appt.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{appt.customer_name}</h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{appt.customer_phone || '+91 98200 00000'}</div>
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
                      <span style={{ color: 'var(--text-dim)' }}>Price Rate:</span>
                      <span style={{ fontWeight: '700', color: 'var(--text-gold)' }}>{org.currency}{appt.price}</span>
                    </div>
                    {appt.notes && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>
                        📝 {appt.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Workflow Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                  </div>

                  {/* Admin Edit / Delete Toolbar */}
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', paddingTop: '4px' }}>
                    <button
                      onClick={() => handleOpenEdit(appt)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Edit / Reschedule Appointment"
                    >
                      <Edit size={12} />
                      <span>Reschedule</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to cancel & delete appointment #${appt.id}?`)) {
                          deleteAppointment(appt.id);
                        }
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', color: 'var(--color-danger)' }}
                      title="Delete / Cancel Appointment"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / Reschedule Appointment Modal */}
      {editingAppt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setEditingAppt(null)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '1.75rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--accent-gold)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit size={18} color="var(--accent-gold)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit / Reschedule Appointment #{editingAppt.id}</h2>
              </div>
              <button onClick={() => setEditingAppt(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  required
                  value={editForm.customer_name}
                  onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Service</label>
                  <select
                    value={editForm.service_id}
                    onChange={(e) => setEditForm({ ...editForm, service_id: e.target.value })}
                    className="form-input"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({org.currency}{s.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Assigned Stylist</label>
                  <select
                    value={editForm.staff_id}
                    onChange={(e) => setEditForm({ ...editForm, staff_id: e.target.value })}
                    className="form-input"
                  >
                    {staff.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.full_name} ({st.designation || st.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Booking Date</label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Start Time Slot</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Lifecycle Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="form-input"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress (Chair Active)</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="form-label">Special Notes / Preferences</label>
                <textarea
                  rows="2"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="form-input"
                  placeholder="Client requests, tea/coffee preference, formula notes..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingAppt(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Plus,
  Star,
  Phone,
  Calendar,
  Award,
  Scissors,
  Edit,
  Trash2,
  Power,
  X,
  Sparkles,
  CheckCircle,
  Mail
} from 'lucide-react';

export default function Staff({ onOpenNewStaff }) {
  const { staff, appointments, org, addStaff, editStaff, toggleStaffStatus, deleteStaff } = useApp();

  // Modal States
  const [editingStaff, setEditingStaff] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    full_name: '',
    designation: 'Master Stylist',
    specialization: 'Hair Cut & Balayage',
    phone: '',
    email: '',
    notes: '',
  });

  const handleOpenEdit = (member) => {
    setEditingStaff(member);
    setStaffForm({
      full_name: member.full_name,
      designation: member.designation || member.role || 'Hair Stylist',
      specialization: member.specialization || '',
      phone: member.phone || '',
      email: member.email || '',
      notes: member.notes || '',
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      editStaff(editingStaff.id, {
        full_name: staffForm.full_name,
        designation: staffForm.designation,
        specialization: staffForm.specialization,
        phone: staffForm.phone,
        email: staffForm.email,
        notes: staffForm.notes,
      });
      setEditingStaff(null);
    }
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    addStaff({
      full_name: staffForm.full_name,
      designation: staffForm.designation,
      specialization: staffForm.specialization,
      phone: staffForm.phone,
      email: staffForm.email,
      notes: staffForm.notes,
    });
    setIsAddModalOpen(false);
    setStaffForm({
      full_name: '',
      designation: 'Master Stylist',
      specialization: 'Hair Cut & Balayage',
      phone: '',
      email: '',
      notes: '',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>Team & Stylist Roster</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
              {staff.filter(s => s.is_active !== false).length} Active Team Members
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Staff & Stylists Roster</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Full control for Salon Owners & Super Admin: Edit profiles, assign specializations, toggle on-leave/active statuses, and add stylists.
          </p>
        </div>
        <button
          onClick={() => {
            if (onOpenNewStaff) onOpenNewStaff();
            else setIsAddModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {staff.map((member) => {
          const currentBookings = appointments.filter(a => a.staff_name === member.full_name).length;
          const isActive = member.is_active !== false;

          return (
            <div
              key={member.id}
              className="glass-card glass-card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                opacity: isActive ? 1 : 0.65,
                border: isActive ? '1px solid var(--border-subtle)' : '1px dashed var(--border-subtle)',
                background: isActive ? 'var(--bg-secondary)' : 'rgba(15, 23, 42, 0.4)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-gold), #f59e0b)',
                      color: '#000',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                    }}>
                      {member.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{member.full_name}</h3>
                        {!isActive && (
                          <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>On Leave</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', fontWeight: '600' }}>
                        {member.designation || member.role}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(245, 158, 11, 0.15)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', color: 'var(--accent-gold-light)', fontSize: '0.75rem', fontWeight: '700' }}>
                    <Star size={13} fill="currentColor" />
                    <span>{member.rating || '4.9'}</span>
                  </div>
                </div>

                <div style={{
                  padding: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Specialization:</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{member.specialization || 'All Rounder'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Contact Phone:</span>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>{member.phone || '+91 98200 00000'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Active Bookings Today:</span>
                    <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>{currentBookings} clients</span>
                  </div>
                </div>
              </div>

              <div>
                {/* Working Hours Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.625rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginBottom: '0.75rem',
                }}>
                  <span>Weekly Shift: Tue - Sun</span>
                  <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
                    {isActive ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {/* Admin Management Toolbar */}
                <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    title="Edit Staff Profile"
                  >
                    <Edit size={13} />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => toggleStaffStatus(member.id)}
                    className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ padding: '6px 10px' }}
                    title={isActive ? 'Mark On-Leave' : 'Mark Active'}
                  >
                    <Power size={14} color={isActive ? 'var(--color-danger)' : 'var(--color-success)'} />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove "${member.full_name}" from the staff roster?`)) {
                        deleteStaff(member.id);
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px', color: 'var(--color-danger)' }}
                    title="Delete Staff Member"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
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
          onClick={() => setEditingStaff(null)}
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit Staff Profile</h2>
              </div>
              <button onClick={() => setEditingStaff(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={staffForm.full_name}
                  onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Designation / Role</label>
                  <input
                    type="text"
                    required
                    value={staffForm.designation}
                    onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    required
                    value={staffForm.specialization}
                    onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Notes & Bio</label>
                <textarea
                  rows="2"
                  value={staffForm.notes}
                  onChange={(e) => setStaffForm({ ...staffForm, notes: e.target.value })}
                  className="form-input"
                  placeholder="Stylist strengths, certifications, or custom commission tiers..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingStaff(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddModalOpen && (
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
          onClick={() => setIsAddModalOpen(false)}
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
                <Plus size={18} color="var(--accent-gold)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Register New Staff Member</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Sterling"
                  value={staffForm.full_name}
                  onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Designation / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="Master Stylist"
                    value={staffForm.designation}
                    onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    required
                    placeholder="Color & Balayage"
                    value={staffForm.specialization}
                    onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 00000"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="liam@salonos.com"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Notes & Bio</label>
                <textarea
                  rows="2"
                  value={staffForm.notes}
                  onChange={(e) => setStaffForm({ ...staffForm, notes: e.target.value })}
                  className="form-input"
                  placeholder="Stylist strengths, certifications, or custom commission tiers..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Onboard Stylist</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

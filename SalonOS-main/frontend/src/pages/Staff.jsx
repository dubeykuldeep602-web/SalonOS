import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Plus, Star, Phone, Calendar, Award, Scissors } from 'lucide-react';

export default function Staff({ onOpenNewStaff }) {
  const { staff, appointments, org } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Staff & Stylists Roster</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Team member schedules, performance ratings, and client bookings.
          </p>
        </div>
        <button onClick={onOpenNewStaff} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {staff.map((member) => {
          const currentBookings = appointments.filter(a => a.staff_name === member.full_name).length;

          return (
            <div key={member.id} className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
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
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{member.full_name}</h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)', fontWeight: '600' }}>
                        {member.designation}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(245, 158, 11, 0.15)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', color: 'var(--accent-gold-light)', fontSize: '0.75rem', fontWeight: '700' }}>
                    <Star size={13} fill="currentColor" />
                    <span>{member.rating}</span>
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
                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{member.specialization}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Contact:</span>
                    <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>{member.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Active Bookings Today:</span>
                    <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>{currentBookings} clients</span>
                  </div>
                </div>
              </div>

              {/* Working Hours Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
              }}>
                <span>Weekly Shift: Tue - Sun (10 AM - 7 PM)</span>
                <span className="badge badge-success">Available</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scissors,
  Clock,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Award,
  User,
  Phone,
  Sparkles,
  Zap,
  Bell,
  ChevronRight,
  ShieldCheck,
  Coffee,
  CheckCircle2
} from 'lucide-react';

export default function StaffApp() {
  const {
    org,
    staff,
    appointments,
    activeStaffId,
    setActiveStaffId,
    activeStaffMember,
    staffAcceptJob,
    staffStartJob,
    staffCompleteJob,
    toggleStaffClockIn,
    incomingJobAlert,
    setIncomingJobAlert,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'earnings' | 'schedule'
  const [tipInput, setTipInput] = useState(150);

  // Stylist-specific appointments
  const staffAppointments = appointments.filter(
    (a) => a.staff_name === activeStaffMember.full_name || a.staff_id === activeStaffMember.id
  );

  const activeJob = staffAppointments.find(
    (a) => a.status === 'in_progress' || a.status === 'confirmed' || a.status === 'scheduled'
  );

  const completedToday = staffAppointments.filter((a) => a.status === 'completed');

  // Simulated live service timer
  const [timerSeconds, setTimerSeconds] = useState(1420);
  useEffect(() => {
    let interval;
    if (activeJob && activeJob.status === 'in_progress') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeJob]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const calculatedCommission = Math.round(
    (activeStaffMember.today_revenue || 0) * ((activeStaffMember.commissionRate || 15) / 100)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Top Stylist Simulator Controls */}
      <div className="glass-card" style={{ width: '100%', maxWidth: '850px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-gold), #f59e0b)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
            {activeStaffMember.avatar || 'ST'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '700', fontSize: '0.9375rem' }}>Staff & Stylist Mobile APK</span>
              <span className={`badge ${activeStaffMember.is_clocked_in ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                {activeStaffMember.is_clocked_in ? '🟢 Clocked In' : '🔴 Off Shift'}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {activeStaffMember.designation} • {activeStaffMember.specialization}
            </div>
          </div>
        </div>

        {/* Switch Stylist & Clock In */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            className="form-select"
            style={{ width: '160px', height: '2.1rem', fontSize: '0.75rem', padding: '2px 8px' }}
            value={activeStaffId}
            onChange={(e) => setActiveStaffId(Number(e.target.value))}
          >
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name} ({s.designation.split(' ')[0]})
              </option>
            ))}
          </select>

          <button
            onClick={() => toggleStaffClockIn(activeStaffMember.id)}
            className={`btn btn-sm ${activeStaffMember.is_clocked_in ? 'btn-secondary' : 'btn-primary'}`}
            style={{ fontSize: '0.75rem', height: '2.1rem' }}
          >
            {activeStaffMember.is_clocked_in ? 'Clock Out' : 'Clock In'}
          </button>
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
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 30px rgba(168, 85, 247, 0.2)',
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
          {/* Status Bar */}
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
            <span>10:30</span>
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
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7' }}></div>
              <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Stylist Pro</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span>5G</span>
              <div style={{ width: '18px', height: '9px', border: '1px solid currentColor', borderRadius: '2px', padding: '1px' }}>
                <div style={{ width: '90%', height: '100%', background: '#22c55e' }}></div>
              </div>
            </div>
          </div>

          {/* Stylist App Header */}
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
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-gold), #f59e0b)',
                  color: '#000',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                }}
              >
                {activeStaffMember.avatar}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2' }}>
                  {activeStaffMember.full_name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{activeStaffMember.designation}</span>
                  <span>•</span>
                  <span>⭐ {activeStaffMember.rating}</span>
                </div>
              </div>
            </div>

            {/* Quick Shift Status Pill */}
            <div
              style={{
                background: activeStaffMember.is_clocked_in ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${activeStaffMember.is_clocked_in ? 'var(--color-success)' : 'var(--color-danger)'}`,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.65rem',
                fontWeight: '700',
                color: activeStaffMember.is_clocked_in ? 'var(--color-success)' : 'var(--color-danger)',
              }}
            >
              {activeStaffMember.is_clocked_in ? 'On Duty' : 'Off Duty'}
            </div>
          </div>

          {/* Incoming Job Auto-Dispatch Banner */}
          {incomingJobAlert && (
            <div
              style={{
                background: 'linear-gradient(135deg, #7e22ce 0%, #3b0764 100%)',
                padding: '0.875rem',
                borderBottom: '2px solid #c084fc',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                animation: 'pulse 1.8s infinite',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '800', color: '#f3e8ff' }}>
                  <Zap size={14} color="#facc15" />
                  <span>⚡ NEW AUTO-ASSIGNED CLIENT DISPATCH</span>
                </div>
                <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Token #{incomingJobAlert.appointmentId}</span>
              </div>

              <div style={{ fontSize: '0.8125rem', color: '#fff' }}>
                <strong>{incomingJobAlert.customer_name}</strong> booked <strong>{incomingJobAlert.service_name}</strong> for <strong>{incomingJobAlert.time}</strong>.
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2px' }}>
                <button
                  onClick={() => staffAcceptJob(incomingJobAlert.appointmentId)}
                  className="btn btn-sm btn-primary"
                  style={{ flex: 1, fontSize: '0.75rem', background: '#22c55e', border: 'none', color: '#000', fontWeight: '800' }}
                >
                  <CheckCircle size={14} />
                  <span>Accept Job</span>
                </button>
                <button
                  onClick={() => setIncomingJobAlert(null)}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.75rem', color: '#f3e8ff' }}
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* Main Scrollable Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {activeTab === 'queue' && (
              <>
                {/* Active Service Workbench Card */}
                {activeJob ? (
                  <div
                    style={{
                      background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
                      border: '1px solid var(--border-accent)',
                      borderRadius: '18px',
                      padding: '1.125rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.875rem',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                        CHAIR ASSIGNED • {activeJob.token_number || '#T-101'}
                      </span>
                      <span className={`badge ${activeJob.status === 'in_progress' ? 'badge-purple' : 'badge-info'}`}>
                        {activeJob.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>
                        {activeJob.service_name}
                      </h3>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <User size={13} />
                        <span>Client: <strong style={{ color: 'var(--text-main)' }}>{activeJob.customer_name}</strong></span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        Scheduled: {activeJob.start_time} • Value: {org.currency}{activeJob.price}
                      </div>
                    </div>

                    {/* Client Notes / Allergies Alert */}
                    {activeJob.notes && (
                      <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid var(--accent-gold)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-gold)' }}>
                        ⚠️ <strong>Client Note:</strong> {activeJob.notes}
                      </div>
                    )}

                    {/* Live Service Timer */}
                    {activeJob.status === 'in_progress' && (
                      <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '0.875rem', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Live Service Timer
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-purple)', letterSpacing: '2px' }}>
                          {formatTimer(timerSeconds)}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', animation: 'pulse 1s infinite' }}></span>
                          Service actively in progress
                        </div>
                      </div>
                    )}

                    {/* Workflow Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                      {activeJob.status === 'scheduled' && (
                        <button
                          onClick={() => staffAcceptJob(activeJob.id)}
                          className="btn btn-primary"
                          style={{ width: '100%', height: '2.5rem', fontSize: '0.8125rem' }}
                        >
                          <CheckCircle size={16} />
                          <span>Accept & Call Client to Chair</span>
                        </button>
                      )}

                      {activeJob.status === 'confirmed' && (
                        <button
                          onClick={() => staffStartJob(activeJob.id)}
                          className="btn btn-primary"
                          style={{ width: '100%', height: '2.5rem', fontSize: '0.8125rem', background: '#a855f7', border: 'none' }}
                        >
                          <PlayCircle size={16} />
                          <span>Start Service (Begin Timer)</span>
                        </button>
                      )}

                      {activeJob.status === 'in_progress' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-primary)', padding: '6px 10px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Tip Received:</span>
                            <input
                              type="number"
                              className="form-input"
                              style={{ width: '80px', height: '1.75rem', fontSize: '0.75rem', padding: '2px 6px' }}
                              value={tipInput}
                              onChange={(e) => setTipInput(Number(e.target.value))}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{org.currency}</span>
                          </div>

                          <button
                            onClick={() => staffCompleteJob(activeJob.id, tipInput)}
                            className="btn btn-primary"
                            style={{ width: '100%', height: '2.5rem', fontSize: '0.8125rem', background: 'var(--color-success)', border: 'none' }}
                          >
                            <CheckCircle2 size={16} />
                            <span>Complete & Send to POS Billing</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                    <Scissors size={36} color="var(--text-dim)" style={{ margin: '0 auto 0.5rem' }} />
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: '700' }}>No Active Job in Chair</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      You are in the dispatch rotation. New client appointments will ring automatically.
                    </p>
                  </div>
                )}

                {/* Today's Queue Timeline */}
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    Your Schedule Today ({staffAppointments.length})
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {staffAppointments.map((appt) => (
                      <div
                        key={appt.id}
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
                            {appt.service_name}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                            {appt.start_time} • {appt.customer_name}
                          </div>
                        </div>

                        <span className={`badge ${appt.status === 'completed' ? 'badge-success' : appt.status === 'in_progress' ? 'badge-purple' : 'badge-gold'}`} style={{ fontSize: '0.65rem' }}>
                          {appt.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Earnings & Daily Tips Tab */}
            {activeTab === 'earnings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    border: '1px solid var(--color-purple)',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Today's Est. Total Payout
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#c084fc', margin: '0.25rem 0' }}>
                    {org.currency}{(calculatedCommission + (activeStaffMember.today_tips || 0)).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Commission ({activeStaffMember.commissionRate || 15}%) + 100% Tips Settled
                  </div>
                </div>

                {/* Earnings Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="glass-card" style={{ padding: '0.875rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Services Done</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                      {activeStaffMember.today_services_done || 0} clients
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '0.875rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Gross Sales</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-success)', marginTop: '2px' }}>
                      {org.currency}{(activeStaffMember.today_revenue || 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '0.875rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Commission Accrued</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-gold-light)', marginTop: '2px' }}>
                      {org.currency}{calculatedCommission.toLocaleString()}
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '0.875rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Daily Tips (Logged)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
                      {org.currency}{(activeStaffMember.today_tips || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Transparency Notice */}
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  💡 <strong>Direct Tip Payout:</strong> All digital tips recorded through the SalonOS POS are disbursed daily to your linked bank account.
                </div>
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
              { id: 'queue', label: 'My Workbench', icon: Scissors },
              { id: 'earnings', label: 'Daily Earnings', icon: DollarSign },
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
        </div>
      </div>
    </div>
  );
}

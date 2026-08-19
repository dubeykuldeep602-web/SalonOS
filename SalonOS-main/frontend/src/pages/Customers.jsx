import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  Award, 
  Calendar, 
  MessageSquare, 
  Sparkles,
  FileText
} from 'lucide-react';

export default function Customers({ onOpenNewClient }) {
  const { customers, org } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Clients & CRM Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Client history, loyalty reward balances, and contact profiles.
          </p>
        </div>
        <button onClick={onOpenNewClient} className="btn btn-primary">
          <UserPlus size={16} />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by client name, mobile number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((customer) => {
          const isVip = customer.total_spent > 30000;

          return (
            <div
              key={customer.id}
              className="glass-card glass-card-interactive"
              onClick={() => setSelectedCustomer(customer)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-gold), #6366f1)',
                      color: '#000',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                    }}>
                      {customer.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{customer.full_name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.phone}</span>
                    </div>
                  </div>

                  {isVip && (
                    <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Sparkles size={11} /> VIP Gold
                    </span>
                  )}
                </div>

                <div style={{
                  padding: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  marginBottom: '0.75rem',
                }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Total Spent</span>
                    <div style={{ fontWeight: '700', color: 'var(--text-gold)', fontSize: '0.9rem' }}>
                      {org.currency}{customer.total_spent.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Visits & Points</span>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {customer.total_visits} visits • {customer.loyalty_points} pts
                    </div>
                  </div>
                </div>

                {customer.notes && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-dim)',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    lineHeight: 1.4,
                  }}>
                    💡 {customer.notes}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <a
                  href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageSquare size={13} color="var(--color-success)" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCustomer(customer);
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Profile Drawer Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Client Profile</h3>
              <button onClick={() => setSelectedCustomer(null)} className="btn btn-secondary btn-sm">Close</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-gold), #818cf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.25rem',
                  color: '#000',
                }}>
                  {selectedCustomer.full_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{selectedCustomer.full_name}</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedCustomer.phone} • {selectedCustomer.email || 'No email provided'}</div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                padding: '1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Total Spent</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-gold)' }}>
                    {org.currency}{selectedCustomer.total_spent.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Total Visits</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{selectedCustomer.total_visits}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Reward Points</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-gold-light)' }}>
                    {selectedCustomer.loyalty_points}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.35rem' }}>Personal Preferences & Notes</h4>
                <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                  {selectedCustomer.notes || 'No specific preferences recorded.'}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <a
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <MessageSquare size={16} />
                <span>Send WhatsApp Message</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

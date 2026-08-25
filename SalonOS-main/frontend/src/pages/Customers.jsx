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
  FileText,
  Edit,
  Trash2,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function Customers({ onOpenNewClient }) {
  const { customers, org, addCustomer, editCustomer, deleteCustomer } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Modal States
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    tier: 'VIP Silver',
    notes: '',
    gender: 'Female',
    city: 'Mumbai',
  });

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery)) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenEdit = (cust, e) => {
    if (e) e.stopPropagation();
    setEditingCustomer(cust);
    setCustomerForm({
      full_name: cust.full_name,
      phone: cust.phone || '',
      email: cust.email || '',
      tier: cust.tier || 'VIP Silver',
      notes: cust.notes || '',
      gender: cust.gender || 'Female',
      city: cust.city || 'Mumbai',
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      editCustomer(editingCustomer.id, {
        full_name: customerForm.full_name,
        phone: customerForm.phone,
        email: customerForm.email,
        tier: customerForm.tier,
        notes: customerForm.notes,
        gender: customerForm.gender,
        city: customerForm.city,
      });
      setEditingCustomer(null);
    }
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    addCustomer({
      full_name: customerForm.full_name,
      phone: customerForm.phone,
      email: customerForm.email,
      tier: customerForm.tier,
      notes: customerForm.notes,
      gender: customerForm.gender,
      city: customerForm.city,
    });
    setIsAddModalOpen(false);
    setCustomerForm({
      full_name: '',
      phone: '',
      email: '',
      tier: 'VIP Silver',
      notes: '',
      gender: 'Female',
      city: 'Mumbai',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>CRM & Client Master</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
              {customers.length} Registered VIP Clients
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Clients & CRM Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Full control for Salon Owners & Super Admin: Edit client profiles, manage VIP loyalty tiers, view visit histories, and add clients.
          </p>
        </div>
        <button
          onClick={() => {
            if (onOpenNewClient) onOpenNewClient();
            else setIsAddModalOpen(true);
          }}
          className="btn btn-primary"
        >
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((customer) => {
          const isVip = (customer.total_spent > 15000) || customer.tier === 'VIP Diamond' || customer.tier === 'VIP Platinum';

          return (
            <div
              key={customer.id}
              className="glass-card glass-card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
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
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.phone || '+91 98200 00000'}</span>
                    </div>
                  </div>

                  <span className={`badge ${customer.tier?.includes('Diamond') ? 'badge-purple' : (customer.tier?.includes('Gold') ? 'badge-gold' : 'badge-info')}`}>
                    {customer.tier || (isVip ? 'VIP Gold' : 'VIP Client')}
                  </span>
                </div>

                <div style={{
                  padding: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Total Spent:</span>
                    <span style={{ fontWeight: '700', color: 'var(--accent-gold-light)' }}>
                      {org.currency}{(customer.total_spent || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Loyalty Points:</span>
                    <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>
                      {customer.loyalty_points || 50} pts
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Total Visits:</span>
                    <span style={{ fontWeight: '600' }}>{customer.total_visits || 1} appointments</span>
                  </div>
                  {customer.notes && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>
                      📝 {customer.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Management Toolbar */}
              <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <button
                  onClick={(e) => handleOpenEdit(customer, e)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  title="Edit Customer Profile & Notes"
                >
                  <Edit size={13} />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete client "${customer.full_name}"?`)) {
                      deleteCustomer(customer.id);
                    }
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 10px', color: 'var(--color-danger)' }}
                  title="Delete Client"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Customer Modal */}
      {editingCustomer && (
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
          onClick={() => setEditingCustomer(null)}
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit Client Profile</h2>
              </div>
              <button onClick={() => setEditingCustomer(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  required
                  value={customerForm.full_name}
                  onChange={(e) => setCustomerForm({ ...customerForm, full_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">VIP Tier</label>
                  <select
                    value={customerForm.tier}
                    onChange={(e) => setCustomerForm({ ...customerForm, tier: e.target.value })}
                    className="form-input"
                  >
                    <option value="VIP Silver">VIP Silver (Standard)</option>
                    <option value="VIP Gold">VIP Gold (Priority)</option>
                    <option value="VIP Platinum">VIP Platinum (Executive)</option>
                    <option value="VIP Diamond">VIP Diamond (Celebrity)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={customerForm.city}
                    onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Preferences & Formula Notes</label>
                <textarea
                  rows="2"
                  value={customerForm.notes}
                  onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                  className="form-input"
                  placeholder="Hair color codes, allergies, preferred beverage..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingCustomer(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  <span>Save Client Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
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
                <UserPlus size={18} color="var(--accent-gold)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Register New Client Profile</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Client Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Natasha Roy"
                  value={customerForm.full_name}
                  onChange={(e) => setCustomerForm({ ...customerForm, full_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 00000"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">VIP Tier</label>
                  <select
                    value={customerForm.tier}
                    onChange={(e) => setCustomerForm({ ...customerForm, tier: e.target.value })}
                    className="form-input"
                  >
                    <option value="VIP Silver">VIP Silver (Standard)</option>
                    <option value="VIP Gold">VIP Gold (Priority)</option>
                    <option value="VIP Platinum">VIP Platinum (Executive)</option>
                    <option value="VIP Diamond">VIP Diamond (Celebrity)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="natasha@example.com"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={customerForm.city}
                    onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Preferences & Formula Notes</label>
                <textarea
                  rows="2"
                  value={customerForm.notes}
                  onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                  className="form-input"
                  placeholder="Hair color codes, allergies, preferred beverage..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Register Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

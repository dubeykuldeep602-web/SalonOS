import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Plus,
  Users,
  CreditCard,
  Activity,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  Layers,
  ArrowUpRight,
  Sparkles,
  Search,
  LogIn,
  MoreVertical,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const {
    tenants,
    onboardTenant,
    updateTenantStatus,
    updateTenantPlan,
    setActiveTenantId,
    setActiveRole,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // New Tenant Form State
  const [tenantForm, setTenantForm] = useState({
    name: '',
    owner_name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    plan: 'Pro Growth',
    branches: 1,
    staff_quota: 10,
    gst_number: '',
  });

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!tenantForm.name || !tenantForm.owner_name) {
      addToast('Please enter Salon Name and Owner Name', 'danger');
      return;
    }

    onboardTenant(tenantForm);
    setIsOnboardModalOpen(false);
    setTenantForm({
      name: '',
      owner_name: '',
      email: '',
      phone: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      plan: 'Pro Growth',
      branches: 1,
      staff_quota: 10,
      gst_number: '',
    });
  };

  const handleSwitchToSalon = (tenantId) => {
    setActiveTenantId(tenantId);
    setActiveRole('owner');
    addToast(`Switched active workspace to Salon #${tenantId}`);
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || t.plan.toLowerCase().includes(filterPlan.toLowerCase());
    return matchesSearch && matchesPlan;
  });

  // Calculate Global Platform Metrics
  const totalSalons = tenants.length;
  const activeSalons = tenants.filter((t) => t.status === 'active').length;
  const totalMonthlyRevenue = tenants.reduce((acc, t) => {
    const price = parseInt((t.plan_price || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return acc + price;
  }, 0);
  const totalBookingsNetwork = tenants.reduce((acc, t) => acc + (t.monthly_bookings || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Top Banner / Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Super Admin
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }}></span>
              Multi-Tenant Engine Online
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            SaaS Tenant Control Tower
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '650px' }}>
            Onboard new salon businesses, provision multi-branch tenants, configure SaaS subscription quotas, and monitor platform recurring revenue.
          </p>
        </div>

        <button onClick={() => setIsOnboardModalOpen(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
          <Plus size={18} />
          <span>Onboard New Salon Client</span>
        </button>
      </div>

      {/* Global SaaS Platform KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', fontWeight: '600' }}>Active Salon Tenants</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--accent-gold-glow)', color: 'var(--accent-gold-light)' }}>
              <Building2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text-main)' }}>{activeSalons} <span style={{ fontSize: '0.9375rem', color: 'var(--text-dim)', fontWeight: '500' }}>/ {totalSalons} total</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} />
            <span>100% Platform retention rate</span>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', fontWeight: '600' }}>Platform MRR</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--color-success)' }}>
            ₹{totalMonthlyRevenue.toLocaleString()} <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontWeight: '500' }}>/month</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
            Recurring SaaS subscription licenses
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', fontWeight: '600' }}>Network Monthly Bookings</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--color-info)' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {totalBookingsNetwork.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-info)', marginTop: '0.5rem' }}>
            Processed across all client salons
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', fontWeight: '600' }}>System SLA & Health</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--color-purple)' }}>
              <Shield size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text-main)' }}>99.98%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.5rem' }}>
            All tenant databases isolated & encrypted
          </div>
        </div>
      </div>

      {/* Onboarded Salons Management Table */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Onboarded Salon Clients (Tenants)</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>
              Manage subscription quotas, status, and one-click login as salon owner.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
              {['all', 'starter', 'pro', 'enterprise'].map((plan) => (
                <button
                  key={plan}
                  onClick={() => setFilterPlan(plan)}
                  className={`btn btn-sm ${filterPlan === plan ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
                >
                  {plan}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search salon, owner, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '220px', height: '2.25rem', fontSize: '0.8125rem' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.875rem 1rem' }}>Salon Business</th>
                <th style={{ padding: '0.875rem 1rem' }}>Owner / Contact</th>
                <th style={{ padding: '0.875rem 1rem' }}>Subscription Plan</th>
                <th style={{ padding: '0.875rem 1rem' }}>Branches & Staff</th>
                <th style={{ padding: '0.875rem 1rem' }}>Monthly Volume</th>
                <th style={{ padding: '0.875rem 1rem' }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => {
                let badgeClass = 'badge-gold';
                if (tenant.plan.includes('Enterprise')) badgeClass = 'badge-purple';
                if (tenant.plan.includes('Starter')) badgeClass = 'badge-info';

                return (
                  <tr key={tenant.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)' }} className="table-row-hover">
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: `linear-gradient(135deg, ${tenant.color_accent || 'var(--accent-gold)'}, #111827)`,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '1rem',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {tenant.logo_letter || tenant.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{tenant.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-light)' }}>{tenant.slug}.salonos.app</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{tenant.owner_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{tenant.phone} • {tenant.city}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${badgeClass}`} style={{ marginBottom: '4px', display: 'inline-block' }}>
                        {tenant.plan}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tenant.plan_price}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                        {tenant.branches} Branch{tenant.branches > 1 ? 'es' : ''}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Staff Quota: max {tenant.staff_quota}
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '700', color: 'var(--color-info)' }}>
                        {tenant.monthly_bookings || 0} bookings
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Since {tenant.created_at}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => updateTenantStatus(tenant.id, tenant.status === 'active' ? 'suspended' : 'active')}
                        className={`badge ${tenant.status === 'active' ? 'badge-success' : 'badge-danger'}`}
                        style={{ cursor: 'pointer', border: 'none', padding: '4px 10px' }}
                        title="Click to toggle status"
                      >
                        {tenant.status === 'active' ? '🟢 Active' : '🔴 Suspended'}
                      </button>
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleSwitchToSalon(tenant.id)}
                          className="btn btn-sm btn-primary"
                          style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Open Salon Owner POS & Dashboard"
                        >
                          <LogIn size={13} />
                          <span>Open POS</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SaaS Feature Pricing & Monetization Packages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>STARTER STUDIO</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.5rem' }}>₹3,499<span style={{ fontSize: '0.875rem', color: 'var(--text-dim)', fontWeight: '400' }}>/mo</span></h3>
            </div>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Best for independent barber shops, nail studios, and boutique salons.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> 1 Single Branch</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Up to 6 Stylist Seats</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Fast Web POS & Billing</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Basic Staff Mobile App</li>
          </ul>
        </div>

        <div className="glass-card" style={{ border: '1px solid var(--accent-gold)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-gold)', color: '#000', fontSize: '0.65rem', fontWeight: '800', padding: '2px 10px', borderRadius: '0 0 0 8px' }}>
            MOST POPULAR
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>PRO GROWTH</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--accent-gold-light)' }}>₹7,999<span style={{ fontSize: '0.875rem', color: 'var(--text-dim)', fontWeight: '400' }}>/mo</span></h3>
            </div>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            For high-volume salons seeking auto-assignment, customer apps, and WhatsApp marketing.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Up to 2 Branches</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Up to 15 Stylist Seats</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Auto-Assignment Queue Engine</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> WhatsApp 2-Way Bot & Digital Receipts</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Recipe Chemical Stock Deduction</li>
          </ul>
        </div>

        <div className="glass-card" style={{ border: '1px solid rgba(168, 85, 247, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>ENTERPRISE CHAIN</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--color-purple)' }}>₹14,999<span style={{ fontSize: '0.875rem', color: 'var(--text-dim)', fontWeight: '400' }}>/mo</span></h3>
            </div>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            For multi-location luxury salon chains, franchises, and spa resorts.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Unlimited Branches & Multi-City</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Up to 50 Staff Seats Included</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> White-label Branded Customer Apps</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Centralized Multi-Branch Inventory Sync</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}><CheckCircle size={14} color="var(--color-success)" /> Dedicated Account Executive</li>
          </ul>
        </div>
      </div>

      {/* Onboarding Modal */}
      {isOnboardModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem',
          }}
          onClick={() => setIsOnboardModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--accent-gold)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Onboard New Salon Tenant</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  Instantly provision a new multi-tenant salon client database and credentials.
                </p>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Salon Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Luxe Salon & Spa"
                  className="form-input"
                  value={tenantForm.name}
                  onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Khurana"
                    className="form-input"
                    value={tenantForm.owner_name}
                    onChange={(e) => setTenantForm({ ...tenantForm, owner_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Owner Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98000 11223"
                    className="form-input"
                    value={tenantForm.phone}
                    onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Owner Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@salon.com"
                    className="form-input"
                    value={tenantForm.email}
                    onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">City / State</label>
                  <input
                    type="text"
                    placeholder="Mumbai, MH"
                    className="form-input"
                    value={tenantForm.city}
                    onChange={(e) => setTenantForm({ ...tenantForm, city: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Subscription Tier</label>
                  <select
                    className="form-select"
                    value={tenantForm.plan}
                    onChange={(e) => setTenantForm({ ...tenantForm, plan: e.target.value })}
                  >
                    <option value="Starter Studio">Starter Studio (₹3,499/mo)</option>
                    <option value="Pro Growth">Pro Growth (₹7,999/mo)</option>
                    <option value="Enterprise Chain">Enterprise Chain (₹14,999/mo)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Initial Staff Quota</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="form-input"
                    value={tenantForm.staff_quota}
                    onChange={(e) => setTenantForm({ ...tenantForm, staff_quota: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">GSTIN / Tax ID (Optional)</label>
                <input
                  type="text"
                  placeholder="27AABCS1234F1Z9"
                  className="form-input"
                  value={tenantForm.gst_number}
                  onChange={(e) => setTenantForm({ ...tenantForm, gst_number: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsOnboardModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Provision & Launch Salon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

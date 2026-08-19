import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, Save, Building, Moon, Sun, Sparkles, Shield, DollarSign } from 'lucide-react';

export default function Settings() {
  const { org, setOrg, theme, setTheme, addToast } = useApp();

  const [formData, setFormData] = useState({ ...org });

  const handleSave = (e) => {
    e.preventDefault();
    setOrg(formData);
    addToast('Salon settings & tax preferences saved successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Salon & System Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Configure multi-tenant brand identity, GST rates, currency, and theme preferences.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Salon Brand Profile */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <Building size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Salon Business Identity</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Salon / Brand Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Owner / Managing Director</label>
              <input
                type="text"
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Contact Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Customer Support Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">GSTIN / Tax ID</label>
              <input
                type="text"
                value={formData.gst_number}
                onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address & Landmark</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax Configuration */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <DollarSign size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Financial & Billing Configuration</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Currency Symbol</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default GST Rate (%)</label>
              <input
                type="number"
                value={formData.gstRate || 18}
                onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <input
                type="text"
                value={formData.timezone || 'Asia/Kolkata'}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Theme & Display Options */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <Sparkles size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Visual Theme Experience</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { id: 'dark', label: 'Luxury Dark (Default)', icon: Moon, desc: 'Deep Obsidian & Amber Gold' },
              { id: 'rosegold', label: 'Rose Gold Glam', icon: Sparkles, desc: 'Velvet Plum & Crimson Glamour' },
              { id: 'light', label: 'Pearl Crisp Light', icon: Sun, desc: 'Clean White & Champagne Gold' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={18} color={isSelected ? 'var(--accent-gold)' : 'currentColor'} />
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{t.label}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start' }}>
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
}

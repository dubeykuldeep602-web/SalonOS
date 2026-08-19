import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, Plus, Clock, Sparkles, Check, Tag } from 'lucide-react';

export default function Services({ onOpenNewService }) {
  const { services, org } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Hair', 'Facial', 'Spa', 'Nails', 'Bridal', 'Grooming'];

  const filtered = services.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Services & Treatments Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Bookable salon services, pricing structures, and duration schedules.
          </p>
        </div>
        <button onClick={onOpenNewService} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ width: '250px' }}>
          <input
            type="text"
            placeholder="Search service name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ height: '2.25rem', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((srv) => (
          <div key={srv.id} className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{srv.category}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-gold-light)' }}>
                  {org.currency}{srv.price}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.35rem' }}>{srv.name}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                {srv.description || 'Professional luxury salon service tailored to client requirements.'}
              </p>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.625rem 0.75rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={13} />
                <span>{srv.duration} mins duration</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: srv.gst_applicable ? 'var(--color-success)' : 'var(--text-dim)' }}>
                <Check size={13} />
                <span>{srv.gst_applicable ? 'GST 18% Applicable' : 'Tax Exempt'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

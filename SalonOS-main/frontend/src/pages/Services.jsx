import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  Plus,
  Clock,
  Sparkles,
  Check,
  Tag,
  Edit,
  Trash2,
  Power,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Services({ onOpenNewService }) {
  const { services, org, editService, toggleServiceStatus, deleteService, addService } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [editingService, setEditingService] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Hair',
    price: 1500,
    duration_minutes: 45,
    description: '',
    gst_applicable: true,
  });

  const categories = ['All', 'Hair', 'Facial', 'Spa', 'Nails', 'Bridal', 'Grooming', 'Skincare'];

  const filtered = services.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || (s.category && s.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setServiceForm({
      name: srv.name,
      category: srv.category || 'Hair',
      price: srv.price,
      duration_minutes: srv.duration_minutes || parseInt(srv.duration) || 45,
      description: srv.description || '',
      gst_applicable: srv.gst_rate > 0 || srv.gst_applicable !== false,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingService) {
      editService(editingService.id, {
        name: serviceForm.name,
        category: serviceForm.category,
        price: Number(serviceForm.price),
        duration_minutes: Number(serviceForm.duration_minutes),
        description: serviceForm.description,
        gst_applicable: serviceForm.gst_applicable,
      });
      setEditingService(null);
    }
  };

  const handleCreateService = (e) => {
    e.preventDefault();
    addService({
      name: serviceForm.name,
      category: serviceForm.category,
      price: Number(serviceForm.price),
      duration_minutes: Number(serviceForm.duration_minutes),
      description: serviceForm.description,
      gst_applicable: serviceForm.gst_applicable,
    });
    setIsAddModalOpen(false);
    setServiceForm({
      name: '',
      category: 'Hair',
      price: 1500,
      duration_minutes: 45,
      description: '',
      gst_applicable: true,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>Menu & Rate Master</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
              {services.filter(s => s.is_active !== false).length} Active Services
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Services & Treatments Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Full control for Salon Owners & Super Admin: Modify rates, change descriptions, toggle active/disabled states, and add new services.
          </p>
        </div>
        <button
          onClick={() => {
            if (onOpenNewService) onOpenNewService();
            else setIsAddModalOpen(true);
          }}
          className="btn btn-primary"
        >
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((srv) => {
          const isActive = srv.is_active !== false;

          return (
            <div
              key={srv.id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{srv.category}</span>
                    {!isActive && (
                      <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>Disabled</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--accent-gold-light)' }}>
                      {org.currency}{srv.price}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.35rem' }}>{srv.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                  {srv.description || 'Professional luxury salon service tailored to client requirements.'}
                </p>
              </div>

              <div>
                {/* Meta details */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginBottom: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={13} />
                    <span>{srv.duration_minutes || srv.duration || 45} mins</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: (srv.gst_applicable !== false) ? 'var(--color-success)' : 'var(--text-dim)' }}>
                    <Check size={13} />
                    <span>{(srv.gst_applicable !== false) ? 'GST 18%' : 'Tax Exempt'}</span>
                  </div>
                </div>

                {/* Admin Management Toolbar */}
                <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    title="Edit Service Details & Change Price Rate"
                  >
                    <Edit size={13} />
                    <span>Edit & Rate</span>
                  </button>

                  <button
                    onClick={() => toggleServiceStatus(srv.id)}
                    className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ padding: '6px 10px' }}
                    title={isActive ? 'Disable Service' : 'Enable Service'}
                  >
                    <Power size={14} color={isActive ? 'var(--color-danger)' : 'var(--color-success)'} />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${srv.name}"?`)) {
                        deleteService(srv.id);
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px', color: 'var(--color-danger)' }}
                    title="Delete Service"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Service & Rate Modal */}
      {editingService && (
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
          onClick={() => setEditingService(null)}
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit Service & Pricing Rate</h2>
              </div>
              <button onClick={() => setEditingService(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="Hair">Hair Styling & Cut</option>
                    <option value="Facial">Facial & Skincare</option>
                    <option value="Spa">Scalp & Spa Therapy</option>
                    <option value="Nails">Nails & Aesthetics</option>
                    <option value="Grooming">Men's Grooming</option>
                    <option value="Bridal">Bridal Package</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Price Rate ({org.currency})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    step="5"
                    value={serviceForm.duration_minutes}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">GST Tax Setting</label>
                  <select
                    value={serviceForm.gst_applicable ? 'true' : 'false'}
                    onChange={(e) => setServiceForm({ ...serviceForm, gst_applicable: e.target.value === 'true' })}
                    className="form-input"
                  >
                    <option value="true">GST 18% Applicable</option>
                    <option value="false">Tax Exempt (0%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Description / Procedure Details</label>
                <textarea
                  rows="3"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="form-input"
                  placeholder="Describe treatment steps, key organic ingredients, or client experience..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingService(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  <span>Save & Update Rate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Service Modal */}
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Add New Service to Menu</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateService} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24K Gold Collagen Spa"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="Hair">Hair Styling & Cut</option>
                    <option value="Facial">Facial & Skincare</option>
                    <option value="Spa">Scalp & Spa Therapy</option>
                    <option value="Nails">Nails & Aesthetics</option>
                    <option value="Grooming">Men's Grooming</option>
                    <option value="Bridal">Bridal Package</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Price Rate ({org.currency})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    placeholder="1500"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    min="5"
                    step="5"
                    placeholder="45"
                    value={serviceForm.duration_minutes}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">GST Tax Setting</label>
                  <select
                    value={serviceForm.gst_applicable ? 'true' : 'false'}
                    onChange={(e) => setServiceForm({ ...serviceForm, gst_applicable: e.target.value === 'true' })}
                    className="form-input"
                  >
                    <option value="true">GST 18% Applicable</option>
                    <option value="false">Tax Exempt (0%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Description / Procedure Details</label>
                <textarea
                  rows="3"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="form-input"
                  placeholder="Describe treatment steps, key organic ingredients, or client experience..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Create & Publish Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

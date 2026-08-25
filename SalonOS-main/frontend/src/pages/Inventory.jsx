import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Plus,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  ShoppingBag,
  Edit,
  Trash2,
  X,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function Inventory({ onOpenNewProduct }) {
  const { products, org, addProduct, editProduct, deleteProduct, updateStock } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'Hair Care',
    unit: 'bottle',
    quantity_in_stock: 10,
    reorder_level: 5,
    unit_price: 1500,
    cost_price: 900,
    supplier_name: '',
    notes: '',
  });

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      sku: prod.sku || '',
      category: prod.category || 'Hair Care',
      unit: prod.unit || 'bottle',
      quantity_in_stock: prod.quantity_in_stock || 0,
      reorder_level: prod.reorder_level || 5,
      unit_price: prod.unit_price || 0,
      cost_price: prod.cost_price || 0,
      supplier_name: prod.supplier_name || '',
      notes: prod.notes || '',
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      editProduct(editingProduct.id, {
        name: productForm.name,
        sku: productForm.sku,
        category: productForm.category,
        unit: productForm.unit,
        quantity_in_stock: Number(productForm.quantity_in_stock),
        reorder_level: Number(productForm.reorder_level),
        unit_price: Number(productForm.unit_price),
        cost_price: Number(productForm.cost_price),
        supplier_name: productForm.supplier_name,
        notes: productForm.notes,
      });
      setEditingProduct(null);
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    addProduct({
      name: productForm.name,
      sku: productForm.sku,
      category: productForm.category,
      unit: productForm.unit,
      quantity_in_stock: Number(productForm.quantity_in_stock),
      reorder_level: Number(productForm.reorder_level),
      unit_price: Number(productForm.unit_price),
      cost_price: Number(productForm.cost_price),
      supplier_name: productForm.supplier_name,
      notes: productForm.notes,
    });
    setIsAddModalOpen(false);
    setProductForm({
      name: '',
      sku: '',
      category: 'Hair Care',
      unit: 'bottle',
      quantity_in_stock: 10,
      reorder_level: 5,
      unit_price: 1500,
      cost_price: 900,
      supplier_name: '',
      notes: '',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>Inventory & Stock Master</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
              {products.length} Products Tracked
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Inventory & Stock Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Full control for Salon Owners & Super Admin: Edit retail & cost prices, reorder thresholds, update stock counts, and add products.
          </p>
        </div>
        <button
          onClick={() => {
            if (onOpenNewProduct) onOpenNewProduct();
            else setIsAddModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by product name, SKU, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Retail Price</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Stock Adjust</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => {
                const isLow = prod.quantity_in_stock <= prod.reorder_level;
                const isOut = prod.quantity_in_stock === 0;

                return (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Supplier: {prod.supplier_name || 'Direct Wholesale'}</div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{prod.category}</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {prod.sku || 'SKU-GEN'}
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--text-gold)' }}>
                      {org.currency}{prod.unit_price}
                    </td>
                    <td>
                      <span style={{ fontWeight: '800', fontSize: '1rem', color: isLow ? 'var(--color-danger)' : 'var(--text-main)' }}>
                        {prod.quantity_in_stock}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '4px' }}>
                        (min: {prod.reorder_level})
                      </span>
                    </td>
                    <td>
                      {isOut ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : isLow ? (
                        <span className="badge badge-warning">Reorder Alert</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => updateStock(prod.id, -1)}
                          disabled={prod.quantity_in_stock <= 0}
                          className="btn btn-secondary btn-sm"
                          title="Record Stock-Out / Usage (-1 unit)"
                          style={{ padding: '4px 8px' }}
                        >
                          -1 Usage
                        </button>
                        <button
                          onClick={() => updateStock(prod.id, 5)}
                          className="btn btn-secondary btn-sm"
                          title="Record Stock-In / Purchase (+5 units)"
                          style={{ padding: '4px 8px' }}
                        >
                          +5 Stock
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Product & Pricing"
                          style={{ padding: '4px 8px' }}
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${prod.name}" from inventory?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          title="Delete Product"
                          style={{ padding: '4px 8px', color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={13} />
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

      {/* Edit Product Modal */}
      {editingProduct && (
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
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '540px',
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit Product & Pricing</h2>
              </div>
              <button onClick={() => setEditingProduct(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Retail Price ({org.currency})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="10"
                    value={productForm.unit_price}
                    onChange={(e) => setProductForm({ ...productForm, unit_price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Cost Price ({org.currency})</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={productForm.cost_price}
                    onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Current Stock Count</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.quantity_in_stock}
                    onChange={(e) => setProductForm({ ...productForm, quantity_in_stock: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Reorder Alert Threshold</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.reorder_level}
                    onChange={(e) => setProductForm({ ...productForm, reorder_level: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Supplier / Distributor</label>
                <input
                  type="text"
                  value={productForm.supplier_name}
                  onChange={(e) => setProductForm({ ...productForm, supplier_name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. L'Oréal Professional India"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} />
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
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
              maxWidth: '540px',
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Add Product to Inventory</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Olaplex No. 7 Bonding Oil"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="OLP-NO7-30ML"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Hair Treatment & Oils"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Retail Price ({org.currency})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="10"
                    placeholder="2800"
                    value={productForm.unit_price}
                    onChange={(e) => setProductForm({ ...productForm, unit_price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Cost Price ({org.currency})</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    placeholder="1800"
                    value={productForm.cost_price}
                    onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Initial Stock Count</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="20"
                    value={productForm.quantity_in_stock}
                    onChange={(e) => setProductForm({ ...productForm, quantity_in_stock: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Reorder Alert Level</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="5"
                    value={productForm.reorder_level}
                    onChange={(e) => setProductForm({ ...productForm, reorder_level: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Supplier / Distributor</label>
                <input
                  type="text"
                  placeholder="e.g. Moroccanoil Global"
                  value={productForm.supplier_name}
                  onChange={(e) => setProductForm({ ...productForm, supplier_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Add to Inventory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Plus, AlertTriangle, ArrowDownRight, ArrowUpRight, Search, ShoppingBag } from 'lucide-react';

export default function Inventory({ onOpenNewProduct }) {
  const { products, org, updateStock } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Inventory & Stock Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Retail merchandise, consumable salon supplies, and automated reorder alerts.
          </p>
        </div>
        <button onClick={onOpenNewProduct} className="btn btn-primary">
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
                <th style={{ textAlign: 'right' }}>Quick Adjust</th>
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Supplier: {prod.supplier_name}</div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{prod.category}</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {prod.sku}
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
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => updateStock(prod.id, -1)}
                          disabled={prod.quantity_in_stock <= 0}
                          className="btn btn-secondary btn-sm"
                          title="Record Stock-Out / Usage"
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

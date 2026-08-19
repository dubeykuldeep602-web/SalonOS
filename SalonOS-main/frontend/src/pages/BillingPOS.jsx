import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  Receipt, 
  Search,
  Percent,
  Sparkles,
  ShoppingBag,
  Scissors
} from 'lucide-react';

export default function BillingPOS({ incomingCartItem, onClearIncomingItem }) {
  const { org, services, products, customers, invoices, addInvoice, addCustomer } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [discountType, setDiscountType] = useState('flat');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);

  // If redirected from Appointments page with an appointment item
  useEffect(() => {
    if (incomingCartItem) {
      const matchCustomer = customers.find(c => c.full_name === incomingCartItem.customer_name);
      if (matchCustomer) {
        setSelectedCustomerId(String(matchCustomer.id));
      }
      setCartItems([
        {
          id: Date.now(),
          type: 'service',
          name: incomingCartItem.service_name,
          staff: incomingCartItem.staff_name,
          price: incomingCartItem.price,
          qty: 1,
        }
      ]);
      onClearIncomingItem && onClearIncomingItem();
    }
  }, [incomingCartItem]);

  const addServiceToCart = (service) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'service',
        name: service.name,
        staff: 'Any Available Stylist',
        price: service.price,
        qty: 1,
      },
    ]);
  };

  const addProductToCart = (product) => {
    const existing = cartItems.find((item) => item.type === 'product' && item.name === product.name);
    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === existing.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'product',
          name: product.name,
          price: product.unit_price || 500,
          qty: 1,
        },
      ]);
    }
  };

  const removeCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const discountAmount =
    discountType === 'percentage'
      ? (subtotal * Number(discountValue || 0)) / 100
      : Number(discountValue || 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * (org.gstRate || 18)) / 100);
  const grandTotal = taxableAmount + taxAmount;

  const handleCheckout = (status = 'paid') => {
    if (cartItems.length === 0) {
      alert('Please add services or products to checkout.');
      return;
    }

    const customer = customers.find((c) => String(c.id) === String(selectedCustomerId));
    const customerName = customer ? customer.full_name : 'Walk-in Client';

    const newInv = addInvoice({
      customer_name: customerName,
      customer_phone: customer ? customer.phone : 'N/A',
      items: cartItems,
      subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      total_amount: grandTotal,
      payment_status: status,
      payment_method: paymentMethod,
      notes,
    });

    setActiveReceipt(newInv);
    setCartItems([]);
    setDiscountValue(0);
    setNotes('');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Point of Sale & Billing Terminal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Instant itemized checkout, GST receipts, and split payments.
          </p>
        </div>
      </div>

      {/* POS Grid: Catalog on left, Cart & Checkout on right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Side: Services & Retail Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Service Buttons */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Scissors size={18} color="var(--accent-gold)" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Salon Services</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {services.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => addServiceToCart(srv)}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0.75rem',
                    textAlign: 'left',
                    height: 'auto',
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>{srv.name}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{srv.duration}m</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-gold)' }}>{org.currency}{srv.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Retail Products */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <ShoppingBag size={18} color="var(--accent-gold)" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Retail Products & Aftercare</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {products.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => addProductToCart(prod)}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0.75rem',
                    textAlign: 'left',
                    height: 'auto',
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>{prod.name}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Stock: {prod.quantity_in_stock}</span>
                    <span style={{ fontWeight: '700', color: 'var(--accent-gold-light)' }}>{org.currency}{prod.unit_price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Current Checkout Bill */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'fit-content' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={20} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Invoice Summary</h3>
              </div>
              <span className="badge badge-gold">{cartItems.length} Items</span>
            </div>

            {/* Client Picker */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Client / Member</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="form-select"
              >
                <option value="">Walk-in Client (No profile)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.phone}) — {c.loyalty_points} pts
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Table */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                  No services or products selected yet.<br/>Click items on the left catalog to add to bill.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.75rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          {item.type === 'service' ? `Service • ${item.staff}` : 'Retail Product'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ padding: '2px 6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>-</button>
                          <span style={{ padding: '0 4px', fontWeight: '600', fontSize: '0.75rem' }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ padding: '2px 6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>+</button>
                        </div>
                        <span style={{ fontWeight: '700', minWidth: '60px', textAlign: 'right' }}>
                          {org.currency}{item.price * item.qty}
                        </span>
                        <button onClick={() => removeCartItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', display: 'flex' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discount & Payment Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Discount ({org.currency} or %)</label>
                <input
                  type="number"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="form-input"
                  placeholder="0"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Payment Tender</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-select"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Card">Credit/Debit Card (POS)</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Split">Split Payment</option>
                </select>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div style={{
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>{org.currency}{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Discount</span>
                  <span>- {org.currency}{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>GST ({org.gstRate || 18}%)</span>
                <span>+ {org.currency}{taxAmount.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--accent-gold-light)',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.5rem',
                marginTop: '0.25rem',
              }}>
                <span>Total Amount</span>
                <span>{org.currency}{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => handleCheckout('unpaid')}
              disabled={cartItems.length === 0}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Save as Unpaid
            </button>
            <button
              onClick={() => handleCheckout('paid')}
              disabled={cartItems.length === 0}
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              <CreditCard size={16} />
              <span>Complete & Pay ({org.currency}{grandTotal})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal if active */}
      {activeReceipt && (
        <div className="modal-overlay" onClick={() => setActiveReceipt(null)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Tax Invoice & Receipt</h3>
              <button onClick={() => setActiveReceipt(null)} className="btn btn-secondary btn-sm">Close</button>
            </div>
            <div className="modal-body" id="printable-receipt" style={{ padding: '1.5rem', background: '#fff', color: '#000', borderRadius: '4px' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#000' }}>{org.name}</h2>
                <div style={{ fontSize: '0.75rem', color: '#555' }}>{org.address}, {org.city}</div>
                <div style={{ fontSize: '0.75rem', color: '#555' }}>GSTIN: {org.gst_number} | Tel: {org.phone}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', marginTop: '0.5rem' }}>{activeReceipt.invoice_number}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Date: {activeReceipt.created_at}</div>
              </div>

              <div style={{ borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '0.5rem 0', margin: '0.5rem 0', fontSize: '0.8rem' }}>
                <div><strong>Client:</strong> {activeReceipt.customer_name}</div>
                <div><strong>Tender:</strong> {activeReceipt.payment_method} ({activeReceipt.payment_status.toUpperCase()})</div>
              </div>

              <div style={{ margin: '0.75rem 0' }}>
                <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: '4px 0' }}>Item</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeReceipt.items || []).map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px dotted #f0f0f0' }}>
                        <td style={{ padding: '4px 0' }}>{it.name} x{it.qty}</td>
                        <td style={{ textAlign: 'right' }}>{org.currency}{it.price * it.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>{org.currency}{activeReceipt.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>GST ({org.gstRate || 18}%)</span>
                  <span>{org.currency}{activeReceipt.tax_amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1rem', marginTop: '0.25rem' }}>
                  <span>Grand Total</span>
                  <span>{org.currency}{activeReceipt.total_amount}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#666' }}>
                Thank you for pampering yourself with us! ✨
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handlePrintReceipt} className="btn btn-primary" style={{ width: '100%' }}>
                <Printer size={16} />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

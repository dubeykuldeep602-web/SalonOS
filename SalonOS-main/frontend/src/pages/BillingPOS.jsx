import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import UPIQRModal from '../components/pos/UPIQRModal';
import { soundbox } from '../utils/soundbox';
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
  Scissors,
  QrCode,
  Volume2,
  DollarSign,
  Wallet,
  MessageSquare,
  FileText,
  Clock,
  User,
  Zap,
  Split
} from 'lucide-react';

export default function BillingPOS({ incomingCartItem, onClearIncomingItem }) {
  const { org, services, products, customers, invoices, addInvoice, addCustomer, triggerWhatsApp, addToast } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [discountType, setDiscountType] = useState('flat'); // 'flat' | 'percentage'
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card' | 'Cash' | 'Wallet'
  const [notes, setNotes] = useState('');
  
  // Multi-Split Payment Builder State
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitTenders, setSplitTenders] = useState({
    cash: 0,
    upi: 0,
    card: 0,
    wallet: 0,
  });

  // Dynamic UPI QR Modal & Receipt Modal States
  const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);
  const [pendingCheckoutData, setPendingCheckoutData] = useState(null);
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

  // Financial Calculations
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const discountAmount =
    discountType === 'percentage'
      ? (subtotal * Number(discountValue || 0)) / 100
      : Number(discountValue || 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * (org.gstRate || 18)) / 100);
  const cgst = Math.round(taxAmount / 2);
  const sgst = taxAmount - cgst;
  const grandTotal = taxableAmount + taxAmount;

  // Split calculation
  const splitTotal = Number(splitTenders.cash || 0) + Number(splitTenders.upi || 0) + Number(splitTenders.card || 0) + Number(splitTenders.wallet || 0);
  const splitRemaining = grandTotal - splitTotal;

  const handleAutoFillSplit = (tenderKey) => {
    const currentOthers = Object.keys(splitTenders)
      .filter((k) => k !== tenderKey)
      .reduce((sum, k) => sum + Number(splitTenders[k] || 0), 0);
    const needed = Math.max(0, grandTotal - currentOthers);
    setSplitTenders((prev) => ({ ...prev, [tenderKey]: needed }));
  };

  // Main Checkout Flow
  const handleInitiateCheckout = (status = 'paid') => {
    if (cartItems.length === 0) {
      addToast('Please add services or products to checkout.', 'danger');
      return;
    }

    if (isSplitPayment && splitRemaining > 0 && status === 'paid') {
      addToast(`Split payment is incomplete. ₹${splitRemaining} remaining.`, 'danger');
      return;
    }

    const customer = customers.find((c) => String(c.id) === String(selectedCustomerId));
    const customerName = customer ? customer.full_name : 'Walk-in Client';
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(1000 + invoices.length + 1).toString().slice(-4)}`;

    let finalPaymentMethod = paymentMethod;
    if (isSplitPayment) {
      const parts = [];
      if (splitTenders.cash > 0) parts.push(`Cash ₹${splitTenders.cash}`);
      if (splitTenders.upi > 0) parts.push(`UPI ₹${splitTenders.upi}`);
      if (splitTenders.card > 0) parts.push(`Card ₹${splitTenders.card}`);
      if (splitTenders.wallet > 0) parts.push(`Wallet ₹${splitTenders.wallet}`);
      finalPaymentMethod = `Split (${parts.join(' + ')})`;
    }

    const invoicePayload = {
      invoice_number: invoiceNumber,
      customer_name: customerName,
      customer_phone: customer ? customer.phone : '+91 98765 00000',
      items: cartItems,
      subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      cgst,
      sgst,
      total_amount: grandTotal,
      payment_status: status,
      payment_method: finalPaymentMethod,
      split_breakdown: isSplitPayment ? { ...splitTenders } : null,
      notes,
      created_at: new Date().toLocaleString(),
    };

    // If UPI is chosen (or split includes UPI > 0) and status is 'paid', trigger Dynamic UPI QR Modal!
    const isUPIRequired = (!isSplitPayment && paymentMethod === 'UPI') || (isSplitPayment && splitTenders.upi > 0);

    if (isUPIRequired && status === 'paid') {
      const upiAmount = isSplitPayment ? splitTenders.upi : grandTotal;
      setPendingCheckoutData({ invoicePayload, upiAmount });
      setIsUPIModalOpen(true);
    } else {
      finalizeCheckout(invoicePayload);
    }
  };

  const finalizeCheckout = (invoicePayload) => {
    const newInv = addInvoice(invoicePayload);

    // If Cash / Card / Wallet, announce via Soundbox!
    if (invoicePayload.payment_status === 'paid' && !invoicePayload.payment_method.includes('UPI')) {
      soundbox.announcePayment(invoicePayload.total_amount, invoicePayload.payment_method.split(' ')[0]);
    }

    setActiveReceipt(newInv || invoicePayload);
    setCartItems([]);
    setDiscountValue(0);
    setNotes('');
    setIsSplitPayment(false);
    setSplitTenders({ cash: 0, upi: 0, card: 0, wallet: 0 });
    setIsUPIModalOpen(false);
    addToast(`🎉 Invoice ${invoicePayload.invoice_number} settled successfully!`);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Salon POS Billing Terminal
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
            High-Speed Checkout & UPI Terminal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Instant touch catalog, dynamic UPI QR, soundbox voice alerts, and multi-split settlements.
          </p>
        </div>

        {/* Soundbox Speaker Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.5rem 1rem',
          background: 'rgba(37, 211, 102, 0.12)',
          border: '1px solid rgba(37, 211, 102, 0.3)',
          borderRadius: 'var(--radius-full)',
          color: '#25d366',
          fontSize: '0.75rem',
          fontWeight: '700'
        }}>
          <Volume2 size={16} />
          <span>SalonOS Soundbox Voice Active 🔊</span>
        </div>
      </div>

      {/* POS Grid: Catalog on left, Cart & Checkout on right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Side: Services & Retail Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Service Buttons */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scissors size={18} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Salon Services Menu</h3>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{services.length} Services</span>
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
                    border: '1px solid var(--border-subtle)',
                    transition: 'all var(--transition-fast)',
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={18} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Retail Products & Aftercare</h3>
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{products.length} Products</span>
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
                    border: '1px solid var(--border-subtle)',
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
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'fit-content', border: '1px solid var(--accent-gold)' }}>
          <div>
            {/* Cart Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={18} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '800' }}>Active Order Bill</h3>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                {cartItems.reduce((sum, it) => sum + it.qty, 0)} Items
              </span>
            </div>

            {/* Select Customer */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Client Account (Loyalty CRM)</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="form-select"
                style={{ height: '2.4rem', fontSize: '0.8125rem' }}
              >
                <option value="">Walk-in Guest Client</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.phone}) — {c.loyalty_points || 0} pts
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Table */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
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
                        border: '1px solid var(--border-subtle)',
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

            {/* Discount & Payment Method Modes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Discount ({org.currency} or %)</label>
                <input
                  type="number"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="form-input"
                  placeholder="0"
                  style={{ height: '2.25rem', fontSize: '0.8125rem' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: 0 }}>Payment Mode</label>
                  <button
                    type="button"
                    onClick={() => setIsSplitPayment(!isSplitPayment)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isSplitPayment ? 'var(--accent-gold)' : 'var(--text-dim)',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <Split size={11} />
                    <span>{isSplitPayment ? 'Split Mode ON' : 'Split Bill?'}</span>
                  </button>
                </div>

                {!isSplitPayment ? (
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-select"
                    style={{ height: '2.25rem', fontSize: '0.8125rem' }}
                  >
                    <option value="UPI">📱 UPI / Dynamic QR</option>
                    <option value="Card">💳 Credit/Debit Card</option>
                    <option value="Cash">💵 Cash at Counter</option>
                    <option value="Wallet">👛 Loyalty Wallet</option>
                  </select>
                ) : (
                  <span className="badge badge-gold" style={{ width: '100%', height: '2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                    Multi-Split Tender Active
                  </span>
                )}
              </div>
            </div>

            {/* Multi-Split Payment Builder Breakdown */}
            {isSplitPayment && (
              <div
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--accent-gold)',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                  <span style={{ fontWeight: '700', color: 'var(--accent-gold-light)' }}>Multi-Tender Breakdown:</span>
                  <span style={{ color: splitRemaining === 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: '800' }}>
                    {splitRemaining === 0 ? '✓ Balanced' : `₹${splitRemaining} Remaining`}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {/* Cash Split */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
                      <span>💵 Cash</span>
                      <span onClick={() => handleAutoFillSplit('cash')} style={{ color: 'var(--accent-gold-light)', cursor: 'pointer', fontWeight: '700' }}>Fill</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={splitTenders.cash || ''}
                      onChange={(e) => setSplitTenders({ ...splitTenders, cash: Number(e.target.value) })}
                      className="form-input"
                      placeholder="0"
                      style={{ height: '2rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* UPI Split */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
                      <span>📱 UPI / QR</span>
                      <span onClick={() => handleAutoFillSplit('upi')} style={{ color: 'var(--accent-gold-light)', cursor: 'pointer', fontWeight: '700' }}>Fill</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={splitTenders.upi || ''}
                      onChange={(e) => setSplitTenders({ ...splitTenders, upi: Number(e.target.value) })}
                      className="form-input"
                      placeholder="0"
                      style={{ height: '2rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* Card Split */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
                      <span>💳 Card</span>
                      <span onClick={() => handleAutoFillSplit('card')} style={{ color: 'var(--accent-gold-light)', cursor: 'pointer', fontWeight: '700' }}>Fill</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={splitTenders.card || ''}
                      onChange={(e) => setSplitTenders({ ...splitTenders, card: Number(e.target.value) })}
                      className="form-input"
                      placeholder="0"
                      style={{ height: '2rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* Wallet Split */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
                      <span>👛 Wallet</span>
                      <span onClick={() => handleAutoFillSplit('wallet')} style={{ color: 'var(--accent-gold-light)', cursor: 'pointer', fontWeight: '700' }}>Fill</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={splitTenders.wallet || ''}
                      onChange={(e) => setSplitTenders({ ...splitTenders, wallet: Number(e.target.value) })}
                      className="form-input"
                      placeholder="0"
                      style={{ height: '2rem', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

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
                <span>GST Tax (CGST 9% + SGST 9%)</span>
                <span>+ {org.currency}{taxAmount.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: '900',
                color: 'var(--color-success)',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.5rem',
                marginTop: '0.25rem',
              }}>
                <span>Total Amount Due</span>
                <span>{org.currency}{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => handleInitiateCheckout('unpaid')}
              disabled={cartItems.length === 0}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.85rem' }}
            >
              Save as Unpaid
            </button>
            <button
              onClick={() => handleInitiateCheckout('paid')}
              disabled={cartItems.length === 0}
              className="btn btn-primary"
              style={{ flex: 2, fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {(!isSplitPayment && paymentMethod === 'UPI') || (isSplitPayment && splitTenders.upi > 0) ? (
                <QrCode size={18} />
              ) : (
                <CreditCard size={18} />
              )}
              <span>Complete & Pay ({org.currency}{grandTotal.toLocaleString()})</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC UPI QR CODE MODAL
          ========================================================================= */}
      <UPIQRModal
        isOpen={isUPIModalOpen}
        onClose={() => setIsUPIModalOpen(false)}
        amount={pendingCheckoutData?.upiAmount || grandTotal}
        invoiceData={pendingCheckoutData?.invoicePayload}
        onPaymentSuccess={(upiDetails) => {
          if (pendingCheckoutData?.invoicePayload) {
            finalizeCheckout({
              ...pendingCheckoutData.invoicePayload,
              transaction_id: upiDetails.transaction_id,
            });
          }
        }}
      />

      {/* =========================================================================
          80MM THERMAL RECEIPT MODAL
          ========================================================================= */}
      {activeReceipt && (
        <div className="modal-overlay" onClick={() => setActiveReceipt(null)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>80mm Thermal Receipt</h3>
              <button onClick={() => setActiveReceipt(null)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            {/* 80mm Thermal Receipt Layout */}
            <div
              id="printable-receipt"
              style={{
                padding: '1.5rem',
                background: '#ffffff',
                color: '#000000',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '0.8rem',
                lineHeight: '1.4',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              {/* Salon Brand Header */}
              <div style={{ textAlign: 'center', marginBottom: '0.875rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#000', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                  {org.name}
                </h2>
                <div style={{ fontSize: '0.72rem', color: '#333', marginTop: '2px' }}>{org.address}, {org.city}</div>
                <div style={{ fontSize: '0.72rem', color: '#333' }}>GSTIN: {org.gst_number || '27AABCS1429B1Z8'}</div>
                <div style={{ fontSize: '0.72rem', color: '#333' }}>Phone: {org.phone}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', marginTop: '0.5rem', borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '3px 0' }}>
                  TAX INVOICE — {activeReceipt.invoice_number}
                </div>
              </div>

              {/* Meta details */}
              <div style={{ fontSize: '0.72rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Date: {activeReceipt.created_at || new Date().toLocaleString()}</span>
                  <span>Cashier: POS-1</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Client: <strong>{activeReceipt.customer_name}</strong></span>
                  <span>{activeReceipt.customer_phone}</span>
                </div>
                <div>Tender: <strong>{activeReceipt.payment_method}</strong></div>
              </div>

              {/* Line Items */}
              <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '0.4rem 0', margin: '0.5rem 0' }}>
                <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #000' }}>
                      <th style={{ paddingBottom: '3px' }}>ITEM / SERVICE</th>
                      <th style={{ textAlign: 'center', paddingBottom: '3px' }}>QTY</th>
                      <th style={{ textAlign: 'right', paddingBottom: '3px' }}>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeReceipt.items || []).map((it, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '3px 0' }}>{it.name}</td>
                        <td style={{ textAlign: 'center', padding: '3px 0' }}>{it.qty || 1}</td>
                        <td style={{ textAlign: 'right', padding: '3px 0' }}>₹{it.price * (it.qty || 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Breakup */}
              <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal Base:</span>
                  <span>₹{activeReceipt.subtotal}</span>
                </div>
                {activeReceipt.discount_amount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Discount:</span>
                    <span>-₹{activeReceipt.discount_amount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>CGST (9.0%):</span>
                  <span>+₹{activeReceipt.cgst || Math.round((activeReceipt.tax_amount || 0) / 2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>SGST (9.0%):</span>
                  <span>+₹{activeReceipt.sgst || Math.round((activeReceipt.tax_amount || 0) / 2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1rem', borderTop: '1px solid #000', paddingTop: '4px', marginTop: '4px' }}>
                  <span>NET TOTAL:</span>
                  <span>₹{activeReceipt.total_amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '0.5rem', borderTop: '1px dashed #000', fontSize: '0.7rem' }}>
                <div>✨ Thank you for choosing {org.name}! ✨</div>
                <div style={{ color: '#555', marginTop: '2px' }}>Powered by SalonOS Cloud Platform</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-footer" style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => triggerWhatsApp('invoice_receipt', activeReceipt)}
                className="btn btn-secondary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#25d366' }}
              >
                <MessageSquare size={15} />
                <span>Send WhatsApp</span>
              </button>
              <button
                onClick={handlePrintReceipt}
                className="btn btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={15} />
                <span>Print 80mm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

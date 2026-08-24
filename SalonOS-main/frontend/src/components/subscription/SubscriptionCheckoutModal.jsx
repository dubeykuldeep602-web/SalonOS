import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  Crown,
  Building2,
  Sparkles,
  Shield,
  CreditCard,
  Smartphone,
  ChevronRight,
  Star,
  ArrowRight
} from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter Studio',
    icon: '✂️',
    price_monthly: 3499,
    price_annual: 33590,
    branches: 1,
    staff: 5,
    color: 'var(--text-muted)',
    accent: 'rgba(100,116,139,0.15)',
    border: 'rgba(100,116,139,0.3)',
    badge: null,
    features: [
      'Single Salon Location',
      'Up to 5 Stylist Accounts',
      'High-Speed Point of Sale',
      'WhatsApp Appointment Confirmations',
      'Customer Mobile App Catalog',
      'Daily Sales & GST Tax Reports',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Growth',
    icon: '💎',
    price_monthly: 7999,
    price_annual: 76790,
    branches: 3,
    staff: 15,
    color: '#f59e0b',
    accent: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.5)',
    badge: 'Most Popular',
    features: [
      'Up to 3 Salon Branches',
      'Up to 15 Stylist Accounts',
      'Stylist Mobile APK Auto-Dispatch',
      'Real-Time WebSocket Notifications',
      'Dynamic UPI QR + Soundbox Alerts',
      'Advanced Inventory Tracking',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Chain',
    icon: '🏆',
    price_monthly: 14999,
    price_annual: 143990,
    branches: 10,
    staff: 50,
    color: '#a855f7',
    accent: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.4)',
    badge: 'Full Power',
    features: [
      'Up to 10 Salon Branches',
      'Up to 50 Stylist Accounts',
      'White-Label Custom Subdomain',
      'Dedicated 24/7 SLA Support',
      'Direct Thermal Hardware SDK',
      'Automated Commission & Payouts',
    ],
  },
];

export default function SubscriptionCheckoutModal({ isOpen, onClose, currentPlan = 'starter', onUpgrade }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState('plans'); // 'plans' | 'checkout' | 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!isOpen) return null;

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setCheckoutStep('checkout');
  };

  const getPrice = (plan) =>
    billingCycle === 'annual' ? Math.round(plan.price_annual / 12) : plan.price_monthly;

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsProcessing(false);
    setCheckoutStep('success');
    if (onUpgrade) onUpgrade(selectedPlan);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: checkoutStep === 'plans' ? '860px' : '500px',
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(245,158,11,0.15)',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          transition: 'max-width 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', zIndex: 10 }}
        >
          <X size={20} />
        </button>

        {/* === STEP 1: Plans Selector === */}
        {checkoutStep === 'plans' && (
          <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Crown size={20} color="#f59e0b" />
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  SaaS Subscription Plans
                </span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                Choose Your Salon Empire Plan
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
                Scale from a boutique studio to a multi-city chain. All plans include the full SalonOS POS, analytics, and Stylist APK.
              </p>

              {/* Billing Toggle */}
              <div
                style={{
                  display: 'inline-flex',
                  background: 'var(--bg-tertiary)',
                  padding: '3px',
                  borderRadius: '10px',
                  marginTop: '1.25rem',
                  gap: '2px',
                }}
              >
                <button
                  onClick={() => setBillingCycle('monthly')}
                  style={{
                    padding: '6px 18px',
                    borderRadius: '7px',
                    border: 'none',
                    background: billingCycle === 'monthly' ? 'var(--bg-secondary)' : 'transparent',
                    color: billingCycle === 'monthly' ? 'var(--text-main)' : 'var(--text-muted)',
                    fontWeight: '700',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  style={{
                    padding: '6px 18px',
                    borderRadius: '7px',
                    border: 'none',
                    background: billingCycle === 'annual' ? 'var(--accent-gold)' : 'transparent',
                    color: billingCycle === 'annual' ? '#000' : 'var(--text-muted)',
                    fontWeight: '700',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  Annual
                  <span style={{ background: billingCycle === 'annual' ? '#000' : 'rgba(245,158,11,0.2)', color: billingCycle === 'annual' ? '#f59e0b' : 'var(--accent-gold)', borderRadius: '4px', padding: '1px 5px', fontSize: '0.65rem', fontWeight: '800' }}>
                    20% OFF
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {PLANS.map((plan) => {
                const isCurrent = plan.id === currentPlan;
                const price = getPrice(plan);
                return (
                  <div
                    key={plan.id}
                    style={{
                      background: plan.accent,
                      border: `1.5px solid ${plan.border}`,
                      borderRadius: '16px',
                      padding: '1.5rem',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      cursor: isCurrent ? 'default' : 'pointer',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={(e) => { if (!isCurrent) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.4)`; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {plan.badge && (
                      <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#000', borderRadius: '20px', padding: '2px 12px', fontSize: '0.7rem', fontWeight: '800', whiteSpace: 'nowrap' }}>
                        ⭐ {plan.badge}
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{plan.icon}</div>
                      <div style={{ fontWeight: '800', fontSize: '1.05rem', color: plan.color }}>{plan.name}</div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: '900', color: 'var(--text-main)' }}>₹{price.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>/mo</span>
                        {billingCycle === 'annual' && (
                          <div style={{ fontSize: '0.7rem', color: plan.color, marginTop: '2px' }}>
                            Billed ₹{plan.price_annual.toLocaleString('en-IN')}/yr — Save ₹{((plan.price_monthly * 12) - plan.price_annual).toLocaleString('en-IN')}!
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                        {plan.branches} branch{plan.branches > 1 ? 'es' : ''} · {plan.staff} stylists
                      </div>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                      {plan.features.map((f) => (
                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                          <Check size={13} color={plan.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <div style={{ textAlign: 'center', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        ✓ Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '10px',
                          border: `1.5px solid ${plan.border}`,
                          background: plan.accent,
                          color: plan.color,
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = plan.border; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = plan.accent; e.currentTarget.style.color = plan.color; }}
                      >
                        Upgrade to {plan.name} <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '1.5rem' }}>
              🔒 Secured by 256-bit SSL · Razorpay PCI-DSS Certified Gateway · Cancel anytime
            </p>
          </div>
        )}

        {/* === STEP 2: Checkout Form === */}
        {checkoutStep === 'checkout' && selectedPlan && (
          <div style={{ padding: '2rem' }}>
            <button
              onClick={() => setCheckoutStep('plans')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              ← Back to Plans
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem' }}>{selectedPlan.icon}</span>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Upgrade to {selectedPlan.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  Confirm your subscription and unlock new features instantly.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text-dim)' }}>Order Summary</div>
              {[
                { label: selectedPlan.name + ' Plan (' + (billingCycle === 'annual' ? 'Annual' : 'Monthly') + ')', value: '₹' + (billingCycle === 'annual' ? selectedPlan.price_annual : selectedPlan.price_monthly).toLocaleString('en-IN') },
                { label: 'GST @ 18%', value: '₹' + Math.round((billingCycle === 'annual' ? selectedPlan.price_annual : selectedPlan.price_monthly) * 0.18).toLocaleString('en-IN') },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontWeight: '600' }}>{value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1rem' }}>
                <span>Total Payable</span>
                <span style={{ color: selectedPlan.color }}>
                  ₹{Math.round((billingCycle === 'annual' ? selectedPlan.price_annual : selectedPlan.price_monthly) * 1.18).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: '700', fontSize: '0.8125rem', marginBottom: '0.625rem', color: 'var(--text-dim)' }}>Payment Method</div>
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                {[
                  { id: 'card', label: '💳 Card / NetBanking' },
                  { id: 'upi', label: '📱 UPI / GPay' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: `1.5px solid ${paymentMethod === m.id ? selectedPlan.border : 'var(--border-subtle)'}`,
                      background: paymentMethod === m.id ? selectedPlan.accent : 'transparent',
                      color: paymentMethod === m.id ? selectedPlan.color : 'var(--text-muted)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              id="confirm-subscription-btn"
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: isProcessing ? 'var(--bg-tertiary)' : `linear-gradient(135deg, ${selectedPlan.color} 0%, ${selectedPlan.border} 100%)`,
                color: isProcessing ? 'var(--text-muted)' : '#000',
                fontWeight: '900',
                fontSize: '1rem',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                letterSpacing: '-0.01em',
                transition: 'all 0.2s',
              }}
            >
              {isProcessing ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Confirm & Activate {selectedPlan.name}
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
              Powered by Razorpay · Secured Gateway · Instant Activation
            </p>
          </div>
        )}

        {/* === STEP 3: Success === */}
        {checkoutStep === 'success' && selectedPlan && (
          <div style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `linear-gradient(135deg, ${selectedPlan.color}, ${selectedPlan.border})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              {selectedPlan.icon}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
              🎉 Plan Activated!
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '360px', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Your salon is now on the <strong style={{ color: selectedPlan.color }}>{selectedPlan.name}</strong> plan.
              You now have access to <strong>{selectedPlan.branches} branches</strong> and <strong>{selectedPlan.staff} stylist accounts</strong>. A B2B GST tax invoice has been sent to your registered email.
            </p>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '1rem', width: '100%', maxWidth: '320px' }}>
              {[
                { label: 'Plan', value: selectedPlan.name },
                { label: 'Billing', value: billingCycle === 'annual' ? 'Annual' : 'Monthly' },
                { label: 'Branches', value: selectedPlan.branches },
                { label: 'Staff Quota', value: selectedPlan.staff },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontWeight: '700', color: selectedPlan.color }}>{value}</span>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Back to Dashboard <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

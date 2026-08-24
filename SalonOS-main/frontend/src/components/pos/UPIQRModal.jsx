import React, { useState, useEffect } from 'react';
import { soundbox } from '../../utils/soundbox';
import {
  QrCode,
  CheckCircle2,
  Clock,
  Smartphone,
  Copy,
  Volume2,
  Sparkles,
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function UPIQRModal({ isOpen, onClose, amount, invoiceData, onPaymentSuccess }) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
      setIsProcessing(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const upiId = 'luxeaura@upi';
  const salonName = invoiceData?.org?.name || 'Luxe Aura Hair Lounge';
  const invoiceRef = invoiceData?.invoice_number || `INV-${Date.now().toString().slice(-6)}`;
  const upiPayload = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(salonName)}&am=${amount}&tr=${invoiceRef}&cu=INR&tn=SalonOS%20Bill`;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Trigger Soundbox voice and chime
      soundbox.announcePayment(amount, 'UPI');

      // 2. Complete payment
      setIsProcessing(false);
      onPaymentSuccess && onPaymentSuccess({
        payment_method: 'UPI',
        transaction_id: `UPI-TXN-${Date.now().toString().slice(-8)}`,
        upi_ref: invoiceRef,
      });
    }, 800);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-gold)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(217, 119, 6, 0.3)',
          textAlign: 'center',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 211, 102, 0.12)', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: '#25d366', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} />
            <span>Instant Dynamic UPI QR</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
            Scan with Any UPI App
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Google Pay • PhonePe • Paytm • BHIM • Cred
          </p>
        </div>

        {/* Prominent Amount Display */}
        <div
          style={{
            background: 'var(--bg-tertiary)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Amount Due</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-success)' }}>
              ₹{Number(amount).toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Order Ref</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-gold-light)' }}>{invoiceRef}</div>
          </div>
        </div>

        {/* Dynamic High-Contrast QR Code */}
        <div
          style={{
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: '18px',
            display: 'inline-block',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '4px solid var(--accent-gold)',
            marginBottom: '1rem',
            position: 'relative',
          }}
        >
          {/* Simulated High-Res SVG QR Code */}
          <svg width="190" height="190" viewBox="0 0 190 190" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="190" height="190" fill="white"/>
            {/* Corner Squares */}
            <rect x="10" y="10" width="50" height="50" fill="black" rx="6"/>
            <rect x="20" y="20" width="30" height="30" fill="white" rx="3"/>
            <rect x="27" y="27" width="16" height="16" fill="black" rx="2"/>

            <rect x="130" y="10" width="50" height="50" fill="black" rx="6"/>
            <rect x="140" y="20" width="30" height="30" fill="white" rx="3"/>
            <rect x="147" y="27" width="16" height="16" fill="black" rx="2"/>

            <rect x="10" y="130" width="50" height="50" fill="black" rx="6"/>
            <rect x="20" y="140" width="30" height="30" fill="white" rx="3"/>
            <rect x="27" y="147" width="16" height="16" fill="black" rx="2"/>

            {/* Pattern Dots */}
            <rect x="70" y="15" width="12" height="12" fill="black"/>
            <rect x="90" y="15" width="12" height="25" fill="black"/>
            <rect x="110" y="15" width="12" height="12" fill="black"/>
            
            <rect x="70" y="45" width="25" height="12" fill="black"/>
            <rect x="105" y="45" width="15" height="12" fill="black"/>
            
            <rect x="15" y="70" width="15" height="15" fill="black"/>
            <rect x="40" y="70" width="12" height="12" fill="black"/>
            <rect x="65" y="70" width="20" height="20" fill="black"/>
            <rect x="95" y="70" width="12" height="12" fill="black"/>
            <rect x="115" y="70" width="25" height="12" fill="black"/>
            <rect x="150" y="70" width="25" height="25" fill="black"/>

            <rect x="20" y="95" width="25" height="12" fill="black"/>
            <rect x="55" y="95" width="12" height="25" fill="black"/>
            <rect x="75" y="95" width="20" height="12" fill="black"/>
            <rect x="105" y="95" width="15" height="25" fill="black"/>
            <rect x="130" y="105" width="12" height="12" fill="black"/>

            <rect x="70" y="135" width="12" height="20" fill="black"/>
            <rect x="90" y="145" width="25" height="12" fill="black"/>
            <rect x="125" y="135" width="12" height="12" fill="black"/>
            <rect x="145" y="145" width="30" height="12" fill="black"/>
            <rect x="80" y="165" width="30" height="12" fill="black"/>
            <rect x="120" y="165" width="15" height="15" fill="black"/>
            <rect x="145" y="165" width="15" height="15" fill="black"/>

            {/* Center Brand Icon */}
            <rect x="75" y="75" width="40" height="40" fill="#f59e0b" rx="8"/>
            <text x="95" y="100" fontSize="16" fontWeight="bold" textAnchor="middle" fill="black">₹</text>
          </svg>
        </div>

        {/* Expiry Countdown & UPI ID */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: timeLeft < 60 ? 'var(--color-danger)' : 'var(--accent-gold-light)', fontWeight: '700' }}>
            <Clock size={14} />
            <span>Expires in {minutes}:{seconds}</span>
          </div>
          <button
            onClick={handleCopyUPI}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
          >
            <Copy size={13} />
            <span>{copied ? 'Copied!' : upiId}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="btn btn-primary"
            style={{
              width: '100%',
              height: '3rem',
              fontWeight: '800',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #25d366 0%, #10b981 100%)',
              color: '#000',
              border: 'none',
              boxShadow: '0 0 25px rgba(37, 211, 102, 0.4)',
            }}
          >
            <Volume2 size={18} />
            <span>{isProcessing ? 'Processing Payment...' : '⚡ Simulate Customer Scan & Pay'}</span>
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            Choose Cash / Card Instead
          </button>
        </div>
      </div>
    </div>
  );
}

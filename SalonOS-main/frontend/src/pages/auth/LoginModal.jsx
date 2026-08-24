import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Store,
  Scissors,
  Smartphone,
  Sparkles,
  Key,
  Mail,
  Lock,
  Phone,
  User,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Building2,
  X
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, registerTenant, addToast } = useApp();

  const [authTab, setAuthTab] = useState('owner'); // 'superadmin' | 'owner' | 'staff' | 'customer' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Register Form State
  const [regForm, setRegForm] = useState({
    salon_name: '',
    owner_name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    plan: 'Pro Growth',
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authTab === 'superadmin') {
        await login('superadmin', { email: email || 'admin@salonos.com', password: password || 'admin123' });
      } else if (authTab === 'owner') {
        await login('owner', { email: email || 'contact@luxeaura.com', password: password || 'password' });
      } else if (authTab === 'staff') {
        if (!staffPin && staffPin !== '1234') {
          addToast('Please enter your 4-digit stylist PIN', 'danger');
          setLoading(false);
          return;
        }
        await login('staff', { pin: staffPin || '1234' });
      } else if (authTab === 'customer') {
        await login('customer', { phone: phone || '+91 98765 11223', otp: otp || '7788' });
      }
      onClose();
    } catch (err) {
      addToast('Authentication failed. Please check credentials.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerTenant(regForm);
      onClose();
    } catch (err) {
      addToast('Registration failed. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    if (role === 'superadmin') {
      login('superadmin', { email: 'admin@salonos.com' });
    } else if (role === 'owner') {
      login('owner', { email: 'contact@luxeaura.com' });
    } else if (role === 'staff') {
      login('staff', { pin: '1234', staff_name: 'Aarav Sharma' });
    } else if (role === 'customer') {
      login('customer', { phone: '+91 98765 11223', customer_name: 'Neha Kapoor' });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
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
          maxWidth: '520px',
          padding: '2rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-gold)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(217, 119, 6, 0.25)',
          borderRadius: '24px',
          maxHeight: '92vh',
          overflowY: 'auto',
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
            padding: '4px',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, #f59e0b 100%)',
              color: '#000',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.4rem',
              boxShadow: '0 0 20px var(--accent-gold-glow)',
              marginBottom: '0.75rem',
            }}
          >
            <Scissors size={26} strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Salon<span style={{ color: 'var(--accent-gold)' }}>OS</span> Authentication
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Secure Multi-Tenant Cloud Operating System
          </p>
        </div>

        {/* 1-Click Quick Demo Evaluation Toolbar */}
        <div
          style={{
            background: 'var(--bg-tertiary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--accent-gold)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            <Zap size={13} fill="currentColor" />
            <span>1-Click Demo Evaluation (Instant Login)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('superadmin')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.7rem', padding: '4px 6px', justifyContent: 'flex-start', gap: '4px' }}
            >
              👑 <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('owner')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.7rem', padding: '4px 6px', justifyContent: 'flex-start', gap: '4px' }}
            >
              💈 <span>Salon Owner (Sophia)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('staff')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.7rem', padding: '4px 6px', justifyContent: 'flex-start', gap: '4px' }}
            >
              ✂️ <span>Stylist APK (Aarav)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.7rem', padding: '4px 6px', justifyContent: 'flex-start', gap: '4px' }}
            >
              📱 <span>Customer (Neha)</span>
            </button>
          </div>
        </div>

        {/* Auth Role Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'owner', label: 'Salon Owner', icon: Store },
            { id: 'staff', label: 'Stylist PIN', icon: Scissors },
            { id: 'customer', label: 'Client OTP', icon: Smartphone },
            { id: 'superadmin', label: 'Super Admin', icon: Shield },
            { id: 'register', label: 'Register Salon', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = authTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAuthTab(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'var(--accent-gold)' : 'transparent',
                  color: isActive ? '#000' : 'var(--text-muted)',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ====================================================================
            TAB: Salon Owner & Super Admin Login (Email + Password)
            ==================================================================== */}
        {(authTab === 'owner' || authTab === 'superadmin') && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8125rem' }}>
                {authTab === 'superadmin' ? 'Master Admin Email' : 'Salon Business Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder={authTab === 'superadmin' ? 'admin@salonos.com' : 'contact@luxeaura.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '34px', height: '2.5rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', marginBottom: 0 }}>Password</label>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold-light)', cursor: 'pointer' }}>Forgot?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '34px', paddingRight: '36px', height: '2.5rem', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '2.6rem', marginTop: '0.5rem', fontWeight: '800' }}>
              <span>{loading ? 'Authenticating...' : `Sign In as ${authTab === 'superadmin' ? 'Super Admin' : 'Salon Owner'}`}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ====================================================================
            TAB: Stylist / Staff Quick 4-Digit PIN Login
            ==================================================================== */}
        {authTab === 'staff' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Enter Stylist 4-Digit PIN</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Fast chair-side login for Beauticians, Barbers & Hairdressers.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="1 2 3 4"
                value={staffPin}
                onChange={(e) => setStaffPin(e.target.value)}
                className="form-input"
                style={{
                  width: '180px',
                  height: '3.2rem',
                  fontSize: '1.75rem',
                  letterSpacing: '12px',
                  textAlign: 'center',
                  fontWeight: '900',
                  color: 'var(--accent-gold-light)',
                  border: '2px solid var(--accent-gold)',
                }}
              />
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Demo PIN: <strong style={{ color: 'var(--accent-gold-light)' }}>1234</strong>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '2.6rem', fontWeight: '800' }}>
              <span>{loading ? 'Verifying PIN...' : 'Access Stylist Workbench'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ====================================================================
            TAB: Customer Mobile OTP Login
            ==================================================================== */}
        {authTab === 'customer' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.8125rem' }}>10-Digit Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 11223"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '34px', height: '2.5rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ fontSize: '0.8125rem', marginBottom: 0 }}>4-Digit SMS / WhatsApp OTP</label>
                <span onClick={() => { setOtp('7788'); setOtpSent(true); addToast('OTP Sent: 7788', 'info'); }} style={{ fontSize: '0.7rem', color: 'var(--accent-gold-light)', cursor: 'pointer', fontWeight: '700' }}>
                  {otpSent ? 'Resend OTP' : 'Get OTP Code'}
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 7788"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-input"
                style={{ height: '2.5rem', fontSize: '1rem', letterSpacing: '4px', textAlign: 'center', fontWeight: '700' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '2.6rem', marginTop: '0.5rem', fontWeight: '800' }}>
              <span>{loading ? 'Verifying OTP...' : 'Login to Customer App'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ====================================================================
            TAB: Self-Service Register New Salon Tenant
            ==================================================================== */}
        {authTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Salon Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Velvet Luxe Hair Studio"
                value={regForm.salon_name}
                onChange={(e) => setRegForm({ ...regForm, salon_name: e.target.value })}
                className="form-input"
                style={{ height: '2.3rem', fontSize: '0.8125rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Owner Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Karan Mehra"
                  value={regForm.owner_name}
                  onChange={(e) => setRegForm({ ...regForm, owner_name: e.target.value })}
                  className="form-input"
                  style={{ height: '2.3rem', fontSize: '0.8125rem' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98000 12345"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="form-input"
                  style={{ height: '2.3rem', fontSize: '0.8125rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="owner@velvetluxe.com"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="form-input"
                  style={{ height: '2.3rem', fontSize: '0.8125rem' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  className="form-input"
                  style={{ height: '2.3rem', fontSize: '0.8125rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>City, State</label>
                <input
                  type="text"
                  placeholder="Mumbai, Maharashtra"
                  value={regForm.city}
                  onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                  className="form-input"
                  style={{ height: '2.3rem', fontSize: '0.8125rem' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>SaaS Subscription Plan</label>
                <select
                  value={regForm.plan}
                  onChange={(e) => setRegForm({ ...regForm, plan: e.target.value })}
                  className="form-select"
                  style={{ height: '2.3rem', fontSize: '0.8125rem' }}
                >
                  <option value="Starter Studio">Starter Studio (₹3,499/mo)</option>
                  <option value="Pro Growth">Pro Growth (₹7,999/mo)</option>
                  <option value="Enterprise Chain">Enterprise Chain (₹14,999/mo)</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '2.6rem', marginTop: '0.5rem', fontWeight: '800' }}>
              <Sparkles size={16} />
              <span>{loading ? 'Creating Workspace...' : 'Launch Salon Workspace'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

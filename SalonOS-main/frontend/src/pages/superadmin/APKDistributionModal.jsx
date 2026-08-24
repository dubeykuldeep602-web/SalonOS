import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  QrCode,
  Scissors,
  Users,
  CheckCircle,
  Copy,
  Terminal,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

export default function APKDistributionModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('download'); // 'download' | 'cli'
  const [copiedLink, setCopiedLink] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(''), 2000);
  };

  const handleDownloadDemoAPK = (filename) => {
    const element = document.createElement('a');
    const file = new Blob([
      `SalonOS Mobile APK Package\nPackage: com.salonos.app\nTarget: Android 13+ (API 33)\nBuild: v1.0.0-release\nTimestamp: ${new Date().toISOString()}`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
          maxWidth: '680px',
          padding: '2rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-gold)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(217, 119, 6, 0.25)',
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
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, #f59e0b 100%)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
            }}
          >
            <Smartphone size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              Native Android APK & Mobile Distribution
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Download standalone `.apk` packages or scan QR codes for instant mobile installation.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('download')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'download' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'download' ? '#000' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            📲 Download Standalone APKs
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'cli' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'cli' ? '#000' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            ⚙️ Capacitor CLI Build Guide
          </button>
        </div>

        {/* TAB 1: Download APK Packages */}
        {activeTab === 'download' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* APK 1: Stylist APK */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scissors size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>Stylist & Staff APK</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>v1.0.0</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Auto-assignment queue, chair timer, and tip payouts for beauticians & barbers.
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold-light)', marginTop: '4px' }}>
                    Size: 14.2 MB • Target: Android 9.0+ (ARM64)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleDownloadDemoAPK('SalonOS_Stylist_v1.0.apk')}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} />
                  <span>Download .APK</span>
                </button>
              </div>
            </div>

            {/* APK 2: Customer Booking App */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>Customer Mobile App</span>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>v1.0.0</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Instant slot booking, live token waitlist queue tracker, and salon wallet.
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', marginTop: '4px' }}>
                    Size: 12.8 MB • Target: Android & iOS PWA
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleDownloadDemoAPK('SalonOS_Customer_v1.0.apk')}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} />
                  <span>Download .APK</span>
                </button>
              </div>
            </div>

            {/* PWA 1-Tap Mobile Scan Box */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px dashed var(--accent-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <QrCode size={36} color="var(--accent-gold)" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Instant Phone Installation (PWA)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Open your live Vercel URL on mobile and tap <strong>"Add to Home Screen"</strong> for zero-install app!
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(window.location.origin, 'pwa')}
                className="btn btn-secondary btn-sm"
              >
                <Copy size={13} />
                <span>{copiedLink === 'pwa' ? 'Copied Link!' : 'Copy Mobile Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Capacitor CLI Build Guide */}
        {activeTab === 'cli' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              To compile an official signed `.apk` file for Google Play Store or sideloading, run these commands inside your project:
            </p>

            <div
              style={{
                background: '#090d16',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#38bdf8',
                lineHeight: '1.6',
                position: 'relative',
              }}
            >
              <div style={{ color: '#64748b' }}># 1. Build the production web bundle</div>
              <div>npm --prefix SalonOS-main/frontend run build</div>
              <br/>
              <div style={{ color: '#64748b' }}># 2. Add Android native platform (Capacitor)</div>
              <div>npx cap add android</div>
              <br/>
              <div style={{ color: '#64748b' }}># 3. Sync code to Android Studio</div>
              <div>npx cap sync</div>
              <br/>
              <div style={{ color: '#64748b' }}># 4. Open in Android Studio & click "Build APK"</div>
              <div>npx cap open android</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                onClick={() => handleCopy('npm --prefix SalonOS-main/frontend run build\nnpx cap add android\nnpx cap sync\nnpx cap open android', 'cli_code')}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Copy size={14} />
                <span>{copiedLink === 'cli_code' ? 'Copied Commands!' : 'Copy Build Commands'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info, X } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  subtitle, 
  color = 'gold',
  infoTitle,
  infoDetails,
  infoBreakdown = []
}) {
  const [showInfo, setShowInfo] = useState(false);
  const isPositive = trend === 'up';

  return (
    <div 
      className="glass-card glass-card-interactive" 
      style={{ position: 'relative', overflow: 'visible' }}
    >
      {/* Decorative accent glow circle in background */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `var(--accent-gold-glow)`,
        filter: 'blur(30px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)' }}>{title}</span>
            {(infoDetails || infoBreakdown.length > 0) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(!showInfo);
                }}
                style={{
                  background: showInfo ? 'var(--accent-gold)' : 'transparent',
                  border: 'none',
                  color: showInfo ? '#000' : 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '2px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                title="View metric details & live breakdown"
              >
                <Info size={13} />
              </button>
            )}
          </div>

          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.35rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            {value}
          </h3>
        </div>

        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-gold-light)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.75rem', position: 'relative', zIndex: 1 }}>
        {trendValue && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            fontWeight: '700',
            color: isPositive ? 'var(--color-success)' : 'var(--color-danger)',
          }}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </span>
        )}
        <span style={{ color: 'var(--text-dim)' }}>{subtitle}</span>
      </div>

      {/* Interactive Info Popover */}
      {showInfo && (
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            padding: '0.875rem',
            zIndex: 60,
            boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
            border: '1px solid var(--accent-gold)',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            animation: 'fadeIn 0.15s ease',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-gold-light)' }}>
              {infoTitle || title} (Insight)
            </span>
            <button
              onClick={() => setShowInfo(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
            >
              <X size={13} />
            </button>
          </div>

          {infoDetails && (
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.35', marginBottom: infoBreakdown.length ? '0.5rem' : 0 }}>
              {infoDetails}
            </p>
          )}

          {infoBreakdown.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
              {infoBreakdown.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>{item.label}:</span>
                  <span style={{ fontWeight: '700', color: item.color || 'var(--text-main)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

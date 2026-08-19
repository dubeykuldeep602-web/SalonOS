import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, subtitle, color = 'gold' }) {
  const isPositive = trend === 'up';

  return (
    <div className="glass-card glass-card-interactive" style={{ position: 'relative', overflow: 'hidden' }}>
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
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)' }}>{title}</span>
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
    </div>
  );
}

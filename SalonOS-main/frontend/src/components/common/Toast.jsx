import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      zIndex: 2000,
      maxWidth: '380px',
      width: '100%',
    }}>
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderColor = 'var(--color-success)';
        let bgGlow = 'rgba(16, 185, 129, 0.15)';

        if (toast.type === 'error') {
          Icon = XCircle;
          borderColor = 'var(--color-danger)';
          bgGlow = 'rgba(239, 68, 68, 0.15)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'var(--color-warning)';
          bgGlow = 'rgba(245, 158, 11, 0.15)';
        }

        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              background: 'var(--bg-secondary)',
              borderLeft: `4px solid ${borderColor}`,
              borderTop: '1px solid var(--border-subtle)',
              borderRight: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: `0 8px 20px rgba(0,0,0,0.4)`,
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Icon size={18} color={borderColor} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

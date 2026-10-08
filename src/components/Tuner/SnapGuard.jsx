// SnapGuard alert banner: protects beginner players from snapping strings — Light theme
import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SnapGuard({ isSnapDanger, detectedString }) {
  if (!isSnapDanger) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--success-subtle)',
          border: '1px solid var(--success-border)',
          color: 'var(--success)',
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}
      >
        <ShieldCheck size={14} />
        <span>Snap-Guard™ Active: Safe String Tension</span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '520px',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--danger-subtle)',
        border: '2px solid var(--danger)',
        color: 'var(--danger)',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div
        style={{
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--danger)',
          color: '#ffffff',
          flexShrink: 0,
        }}
      >
        <AlertTriangle size={20} />
      </div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
          ⚠️ Tension Alert: Risk of String Breakage!
        </div>
        <div style={{ fontSize: '0.8rem', marginTop: '2px', color: '#7f1d1d', lineHeight: 1.4 }}>
          {detectedString?.num === 1
            ? 'High E string is overtightened. Loosen peg counter-clockwise before string snaps.'
            : 'Tension is significantly too high! Loosen peg to prevent breaking the string.'}
        </div>
      </div>
    </div>
  );
}

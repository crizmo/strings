import React from 'react';

export default function PageHeader({
  badge,
  badgeIcon,
  title,
  subtitle,
  actions,
  children,
}) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {badge && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-primary-subtle)',
            border: '1px solid var(--accent-primary)',
            color: 'var(--accent-primary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}
        >
          {badgeIcon && <span>{badgeIcon}</span>}
          <span>{badge}</span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                marginTop: '0.5rem',
                marginBottom: 0,
                maxWidth: '650px',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {actions}
          </div>
        )}
      </div>

      {children && <div style={{ marginTop: '1.25rem' }}>{children}</div>}
    </div>
  );
}

// Vertical sidebar navigation — Clean light theme
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Music2, Mic, Zap, Piano, Radio, Library, Guitar } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/songs', label: 'Song Library', icon: Music2, badge: '40+' },
  { path: '/chords', label: 'Chord Book', icon: Library },
  { path: '/tuner', label: 'Guitar Tuner', icon: Mic },
  { path: '/speedrun', label: 'Speedrun', icon: Zap },
  { path: '/fretboard', label: 'Fretboard', icon: Piano },
  { path: '/strum', label: 'Strum Studio', icon: Radio },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <div
          style={{
            padding: '1.5rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.25)',
              flexShrink: 0,
            }}
          >
            <Guitar size={20} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.2rem',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Strings
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              Acoustic Studio
            </div>
          </div>
        </div>
      </NavLink>

      {/* Navigation */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0 0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          Studio Menu
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-primary-subtle)' : 'transparent',
                    border: isActive
                      ? '1px solid var(--accent-primary-border)'
                      : '1px solid transparent',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className="badge badge-accent"
                      style={{ marginLeft: 'auto', fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-default)',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          lineHeight: 1.4,
          background: '#ffffff',
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Strings Acoustic v2.0</div>
        <div>In-browser acoustic modeling</div>
      </div>
    </aside>
  );
}

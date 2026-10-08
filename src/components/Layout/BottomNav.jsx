// Mobile bottom navigation bar
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Music2, Mic, Zap, Piano, Radio } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/songs', label: 'Songs', icon: Music2 },
  { path: '/tuner', label: 'Tuner', icon: Mic },
  { path: '/speedrun', label: 'Speed', icon: Zap },
  { path: '/strum', label: 'Strum', icon: Radio },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav" style={{
      justifyContent: 'space-around',
      alignItems: 'center',
    }}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.path);

        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '6px 12px',
              textDecoration: 'none',
              color: isActive ? 'var(--accent)' : 'var(--text-dim)',
              transition: 'color 0.2s',
            }}
          >
            <Icon size={20} />
            <span style={{
              fontSize: '0.625rem',
              fontWeight: isActive ? 700 : 500,
              fontFamily: 'var(--font-body)',
            }}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}

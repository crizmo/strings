import React from 'react';

export default function GlassCard({
  children,
  className = '',
  variant = 'default', // 'default', 'elevated', 'interactive', 'glow'
  onClick,
  ...props
}) {
  const variantClass = {
    default: 'glass-card',
    elevated: 'glass-card glass-card-elevated',
    interactive: 'glass-card glass-card-interactive',
    glow: 'glass-card glow-purple',
  }[variant] || 'glass-card';

  return (
    <div
      className={`${variantClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

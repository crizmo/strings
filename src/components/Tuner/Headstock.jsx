// 3+3 Acoustic Headstock visualizer with interactive tuning pegs — Clean Light Theme
import React from 'react';
import { Volume2, RotateCw, RotateCcw } from 'lucide-react';
import { playAcousticPluck } from '../../audio/acousticSynth';

export default function Headstock({
  activeTuning,
  detectedString,
  targetString,
  onSelectString,
  cents = 0,
}) {
  const strings = activeTuning.strings;

  const leftStrings = strings.filter((s) => s.pegSide === 'left');
  const rightStrings = strings.filter((s) => s.pegSide === 'right');

  const activeStr = targetString || detectedString;

  const handlePlayString = (e, str) => {
    e.stopPropagation();
    playAcousticPluck(str.freq, 2.5, 0.55);
  };

  const getTurnGuidance = (str) => {
    if (!activeStr || activeStr.num !== str.num) return null;
    if (Math.abs(cents) <= 3) return { text: 'In Tune!', color: 'var(--success)' };

    const isFlat = cents < -3;
    return isFlat
      ? { text: 'Tighten (Pitch Up)', icon: RotateCw, color: 'var(--accent-warm)' }
      : { text: 'Loosen (Pitch Down)', icon: RotateCcw, color: 'var(--danger)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', width: '100%' }}>
      <div
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)',
          fontWeight: 700,
          marginBottom: '0.75rem',
        }}
      >
        3+3 Acoustic Headstock & Peg Guide
      </div>

      {/* Visual Headstock Structure */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Left Pegs (Strings 6, 5, 4) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 10 }}>
          {leftStrings.map((str) => {
            const isActive = activeStr && activeStr.num === str.num;
            const guidance = getTurnGuidance(str);

            return (
              <div
                key={str.num}
                onClick={() => onSelectString(targetString?.num === str.num ? null : str)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-lg)',
                  background: isActive ? 'var(--accent-primary-subtle)' : '#ffffff',
                  border: isActive ? '1px solid var(--accent-primary-border)' : '1px solid var(--border-default)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                    color: isActive ? '#ffffff' : 'var(--text-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                  }}
                >
                  <span>{str.note}</span>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {str.label}
                    <button
                      onClick={(e) => handlePlayString(e, str)}
                      title="Play reference tone"
                      className="btn btn-ghost btn-icon"
                      style={{ width: '20px', height: '20px', color: 'var(--accent-primary)' }}
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {str.freq} Hz
                  </div>
                  {guidance && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: guidance.color, marginTop: '1px' }}>
                      {guidance.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Headstock Wooden Silhouette */}
        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '220px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(180deg, #3d271d 0%, #281912 100%)',
            border: '1px solid #57392b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#d4af37', opacity: 0.8 }} />
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#ecd08e', fontWeight: 700, textTransform: 'uppercase' }}>
            STRING
          </div>

          {/* Virtual Guitar Strings Rendering */}
          <div style={{ position: 'absolute', inset: '0 0 0 0', display: 'flex', justifyContent: 'space-around', padding: '0 12px', pointerEvents: 'none' }}>
            {strings.map((str) => {
              const isActive = activeStr && activeStr.num === str.num;
              const thickness = Math.max(1, (7 - str.num) * 0.55);

              return (
                <div
                  key={str.num}
                  style={{
                    width: `${thickness}px`,
                    height: '100%',
                    background: isActive ? '#f59e0b' : 'rgba(255,255,255,0.25)',
                    boxShadow: isActive ? '0 0 6px #f59e0b' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Bone Nut */}
          <div style={{ width: '80px', height: '8px', background: '#f5efe6', borderRadius: '2px', borderTop: '1px solid #d4c8b8' }} />
        </div>

        {/* Right Pegs (Strings 3, 2, 1) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 10 }}>
          {rightStrings.map((str) => {
            const isActive = activeStr && activeStr.num === str.num;
            const guidance = getTurnGuidance(str);

            return (
              <div
                key={str.num}
                onClick={() => onSelectString(targetString?.num === str.num ? null : str)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.6rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-lg)',
                  background: isActive ? 'var(--accent-primary-subtle)' : '#ffffff',
                  border: isActive ? '1px solid var(--accent-primary-border)' : '1px solid var(--border-default)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>
                    <button
                      onClick={(e) => handlePlayString(e, str)}
                      title="Play reference tone"
                      className="btn btn-ghost btn-icon"
                      style={{ width: '20px', height: '20px', color: 'var(--accent-primary)' }}
                    >
                      <Volume2 size={12} />
                    </button>
                    {str.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {str.freq} Hz
                  </div>
                  {guidance && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: guidance.color, marginTop: '1px' }}>
                      {guidance.text}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                    color: isActive ? '#ffffff' : 'var(--text-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                  }}
                >
                  <span>{str.note}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
        {targetString
          ? `Locked to ${targetString.label} (${targetString.freq} Hz). Click again to return to Auto-Detect.`
          : 'Auto-detect mode active: Pluck any string, and the tuner will lock on.'}
      </p>
    </div>
  );
}

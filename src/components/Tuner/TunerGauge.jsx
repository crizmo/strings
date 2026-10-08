// Professional Precision Guitar Tuner Dial & Needle Visualizer
import React from 'react';
import { CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';

export default function TunerGauge({ cents = 0, inTune = false, pitchData = null, detectedString = null }) {
  const clampedCents = Math.max(-50, Math.min(50, cents));
  // Needle angle: -50 cents = -45 deg, 0 cents = 0 deg, +50 cents = +45 deg
  const needleAngle = (clampedCents / 50) * 45;

  const note = pitchData ? pitchData.noteName : '—';
  const octave = pitchData ? pitchData.octave : '';
  const freq = pitchData ? pitchData.frequency : null;
  const targetFreq = pitchData ? pitchData.targetFreq : null;

  const ticks = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '380px', margin: '0 auto' }}>
      {/* Curved Gauge Dial */}
      <div
        style={{
          position: 'relative',
          width: '280px',
          height: '140px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
          marginBottom: '0.5rem',
        }}
      >
        {/* Outer Arc Track */}
        <svg width="280" height="140" viewBox="0 0 280 140" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Background Arc */}
          <path
            d="M 25 135 A 115 115 0 0 1 255 135"
            fill="none"
            stroke="var(--bg-subtle)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Center Sweet Spot Arc (In Tune Zone) */}
          <path
            d="M 128 22 A 115 115 0 0 1 152 22"
            fill="none"
            stroke="var(--success-subtle)"
            strokeWidth="16"
          />
          <path
            d="M 138 20 A 115 115 0 0 1 142 20"
            fill="none"
            stroke="var(--success)"
            strokeWidth="16"
          />

          {/* Tick Lines */}
          {ticks.map((t) => {
            const angleDeg = (t / 50) * 45;
            const angleRad = (angleDeg - 90) * (Math.PI / 180);
            const cx = 140;
            const cy = 135;
            const r1 = t === 0 ? 100 : 106;
            const r2 = 125;
            const x1 = cx + r1 * Math.cos(angleRad);
            const y1 = cy + r1 * Math.sin(angleRad);
            const x2 = cx + r2 * Math.cos(angleRad);
            const y2 = cy + r2 * Math.sin(angleRad);

            return (
              <line
                key={t}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={t === 0 ? 'var(--success)' : '#cbd5e1'}
                strokeWidth={t === 0 ? 3 : 1.5}
              />
            );
          })}
        </svg>

        {/* Needle Pointer */}
        <div
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '50%',
            width: '4px',
            height: '110px',
            background: inTune
              ? 'var(--success)'
              : Math.abs(clampedCents) > 15
              ? 'var(--danger)'
              : 'var(--accent-primary)',
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${needleAngle}deg)`,
            transition: 'transform 0.08s cubic-bezier(0.1, 0.9, 0.2, 1)',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
        >
          {/* Needle Head Pointer */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: inTune ? 'var(--success)' : 'var(--accent-primary)',
            }}
          />
        </div>

        {/* Needle Pivot Center Knob */}
        <div
          style={{
            position: 'absolute',
            bottom: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '3px solid #64748b',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 12,
          }}
        />
      </div>

      {/* Scale Labels */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          padding: '0 1.5rem',
          marginBottom: '1rem',
        }}
      >
        <span>-50¢ FLAT</span>
        <span style={{ color: inTune ? 'var(--success)' : 'var(--text-muted)' }}>0¢ (IN TUNE)</span>
        <span>+50¢ SHARP</span>
      </div>

      {/* Note Name & Frequency Info Box */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: inTune ? 'var(--success-subtle)' : 'var(--bg-subtle)',
          border: inTune ? '2px solid var(--success)' : '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '1rem 2rem',
          width: '100%',
          transition: 'all 0.2s ease',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {detectedString ? `${detectedString.name} (${detectedString.note}${detectedString.octave})` : 'Pluck a Guitar String'}
        </span>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '0.2rem 0' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '3.5rem',
              fontWeight: 900,
              color: inTune ? 'var(--success)' : 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            {note}
          </span>
          {octave && (
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              {octave}
            </span>
          )}
        </div>

        {/* Cents / Hz Readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 700 }}>
          <span style={{ color: inTune ? 'var(--success)' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {pitchData ? `${cents > 0 ? `+${cents}` : cents} Cents` : '—'}
          </span>
          {freq && (
            <>
              <span style={{ color: 'var(--text-dim)' }}>•</span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                {freq} Hz {targetFreq ? `(Target: ${targetFreq} Hz)` : ''}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

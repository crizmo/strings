// SVG Guitar Chord Diagram Box (Standard Guitar Tab / Chord Box notation)
// Supports baseFret offset for barre chords and interactive string plucking
import React from 'react';
import { CHORDS } from '../../data/chords';

export default function ChordBox({
  chord,
  chordName = '',
  size = 110,
  showName = true,
  onStringClick = null,
  activeStringIndex = null,
}) {
  const target = chord || chordName;
  const safeName = typeof target === 'string'
    ? target
    : (target?.id || target?.name || '');

  // Find chord in database, fallback to provided object or generic
  const chordData = typeof target === 'object' && target?.frets
    ? target
    : (safeName ? CHORDS.find(
        (c) => c.id.toLowerCase() === safeName.toLowerCase() || c.name.toLowerCase().startsWith(safeName.toLowerCase())
      ) : null);

  const frets = chordData ? chordData.frets : [0, 0, 0, 0, 0, 0];
  const fingers = chordData ? chordData.fingers : [null, null, null, null, null, null];
  const baseFret = chordData?.baseFret || 1;

  // SVG grid dimensions
  const width = size;
  const height = size * 1.25;
  const topMargin = showName ? 26 : 14;
  const bottomMargin = 14;
  const leftMargin = baseFret > 1 ? 24 : 16;
  const rightMargin = 16;

  const gridWidth = width - leftMargin - rightMargin;
  const gridHeight = height - topMargin - bottomMargin;

  const numStrings = 6;
  const numFrets = 4;

  const stringSpacing = gridWidth / (numStrings - 1);
  const fretSpacing = gridHeight / numFrets;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Chord Title */}
        {showName && (
          <text
            x={width / 2}
            y={16}
            textAnchor="middle"
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: `${Math.max(11, Math.round(size * 0.12))}px`,
              fill: 'var(--text-primary)',
            }}
          >
            {chordData?.id || safeName}
          </text>
        )}

        {/* Base Fret Label for Barre Chords (e.g. 3fr, 5fr, 7fr) */}
        {baseFret > 1 && (
          <text
            x={leftMargin - 6}
            y={topMargin + fretSpacing * 0.65}
            textAnchor="end"
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: `${Math.max(9, Math.round(size * 0.085))}px`,
              fill: 'var(--accent-primary)',
            }}
          >
            {baseFret}fr
          </text>
        )}

        {/* Top Nut or First Fret Line */}
        <line
          x1={leftMargin}
          y1={topMargin}
          x2={width - rightMargin}
          y2={topMargin}
          stroke={baseFret === 1 ? '#0f172a' : '#94a3b8'}
          strokeWidth={baseFret === 1 ? 3.5 : 1.5}
          strokeLinecap="round"
        />

        {/* Fret lines */}
        {Array.from({ length: numFrets }).map((_, fIdx) => (
          <line
            key={`fret-${fIdx}`}
            x1={leftMargin}
            y1={topMargin + (fIdx + 1) * fretSpacing}
            x2={width - rightMargin}
            y2={topMargin + (fIdx + 1) * fretSpacing}
            stroke="#cbd5e1"
            strokeWidth={1}
          />
        ))}

        {/* String lines (Clickable if onStringClick provided) */}
        {Array.from({ length: numStrings }).map((_, sIdx) => {
          const stringX = leftMargin + sIdx * stringSpacing;
          const isActive = activeStringIndex === sIdx;
          const isClickable = !!onStringClick;

          return (
            <g
              key={`string-group-${sIdx}`}
              onClick={() => onStringClick && onStringClick(sIdx)}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              {/* Invisible wider hit area for easy clicking */}
              {isClickable && (
                <rect
                  x={stringX - 8}
                  y={topMargin - 12}
                  width={16}
                  height={gridHeight + 20}
                  fill="transparent"
                />
              )}
              <line
                x1={stringX}
                y1={topMargin}
                x2={stringX}
                y2={topMargin + gridHeight}
                stroke={isActive ? 'var(--accent-warm)' : '#94a3b8'}
                strokeWidth={isActive ? 2.5 : 1.2}
              />
            </g>
          );
        })}

        {/* Markers on Top of Nut: X (Muted) or O (Open) */}
        {frets.map((fretVal, strIdx) => {
          const x = leftMargin + strIdx * stringSpacing;
          const y = topMargin - 6;

          if (fretVal === -1) {
            return (
              <text
                key={`mute-${strIdx}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={Math.max(9, Math.round(size * 0.08))}
                fontWeight="bold"
                fill="var(--danger)"
                onClick={() => onStringClick && onStringClick(strIdx)}
                style={{ cursor: onStringClick ? 'pointer' : 'default' }}
              >
                ✕
              </text>
            );
          }
          if (fretVal === 0) {
            const isActive = activeStringIndex === strIdx;
            return (
              <circle
                key={`open-${strIdx}`}
                cx={x}
                cy={y - 3}
                r={Math.max(3, Math.round(size * 0.03))}
                stroke={isActive ? 'var(--accent-warm)' : 'var(--success)'}
                strokeWidth={1.75}
                fill={isActive ? 'var(--accent-warm)' : 'none'}
                onClick={() => onStringClick && onStringClick(strIdx)}
                style={{ cursor: onStringClick ? 'pointer' : 'default' }}
              />
            );
          }
          return null;
        })}

        {/* Finger Placement Dots */}
        {frets.map((fretVal, strIdx) => {
          if (fretVal > 0) {
            // Calculate position relative to baseFret
            const relativeFret = fretVal - (baseFret - 1);
            if (relativeFret > 0 && relativeFret <= numFrets) {
              const x = leftMargin + strIdx * stringSpacing;
              const y = topMargin + (relativeFret - 0.5) * fretSpacing;
              const finger = fingers[strIdx];
              const isActive = activeStringIndex === strIdx;
              const radius = Math.max(6, Math.round(size * 0.055));

              return (
                <g
                  key={`dot-${strIdx}`}
                  onClick={() => onStringClick && onStringClick(strIdx)}
                  style={{ cursor: onStringClick ? 'pointer' : 'default' }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={isActive ? 'var(--accent-warm)' : 'var(--accent-primary)'}
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                  {finger && (
                    <text
                      x={x}
                      y={y + radius * 0.45}
                      textAnchor="middle"
                      fontSize={Math.max(7, Math.round(size * 0.065))}
                      fontWeight="bold"
                      fill="#ffffff"
                    >
                      {finger}
                    </text>
                  )}
                </g>
              );
            }
          }
          return null;
        })}
      </svg>
    </div>
  );
}

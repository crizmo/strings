// SVG Guitar Chord Diagram Box (Standard Guitar Tab / Chord Box notation)
import React from 'react';
import { CHORDS } from '../../data/chords';

export default function ChordBox({ chord, chordName = '', size = 110, showName = true }) {
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

  // SVG grid dimensions
  const width = size;
  const height = size * 1.25;
  const topMargin = showName ? 26 : 14;
  const bottomMargin = 12;
  const leftMargin = 16;
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
              fontSize: '13px',
              fill: 'var(--text-primary)',
            }}
          >
            {chordData?.id || safeName}
          </text>
        )}

        {/* Top Nut */}
        <line
          x1={leftMargin}
          y1={topMargin}
          x2={width - rightMargin}
          y2={topMargin}
          stroke="#1e293b"
          strokeWidth={3.5}
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

        {/* String lines */}
        {Array.from({ length: numStrings }).map((_, sIdx) => (
          <line
            key={`string-${sIdx}`}
            x1={leftMargin + sIdx * stringSpacing}
            y1={topMargin}
            x2={leftMargin + sIdx * stringSpacing}
            y2={topMargin + gridHeight}
            stroke="#94a3b8"
            strokeWidth={1}
          />
        ))}

        {/* Markers on Top of Nut: X (Muted) or O (Open) */}
        {frets.map((fretVal, strIdx) => {
          const x = leftMargin + strIdx * stringSpacing;
          const y = topMargin - 5;

          if (fretVal === -1) {
            return (
              <text
                key={`mute-${strIdx}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={9}
                fontWeight="bold"
                fill="var(--danger)"
              >
                ✕
              </text>
            );
          }
          if (fretVal === 0) {
            return (
              <circle
                key={`open-${strIdx}`}
                cx={x}
                cy={y - 3}
                r={3}
                stroke="var(--success)"
                strokeWidth={1.5}
                fill="none"
              />
            );
          }
          return null;
        })}

        {/* Finger Placement Dots */}
        {frets.map((fretVal, strIdx) => {
          if (fretVal > 0 && fretVal <= numFrets) {
            const x = leftMargin + strIdx * stringSpacing;
            const y = topMargin + (fretVal - 0.5) * fretSpacing;
            const finger = fingers[strIdx];

            return (
              <g key={`dot-${strIdx}`}>
                <circle cx={x} cy={y} r={6} fill="var(--accent-primary)" />
                {finger && (
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    fontSize={7.5}
                    fontWeight="bold"
                    fill="#ffffff"
                  >
                    {finger}
                  </text>
                )}
              </g>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}

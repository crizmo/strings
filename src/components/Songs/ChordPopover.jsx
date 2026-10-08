import React from 'react';
import { CHORDS } from '../../data/chords';
import { Volume2, X } from 'lucide-react';
import { playStrum } from '../../audio/acousticSynth';

export default function ChordPopover({ chordName, onClose, position }) {
  const chordData = CHORDS.find(
    (c) => c.id.toLowerCase() === (chordName || '').toLowerCase()
  ) || {
    id: chordName,
    name: chordName,
    difficulty: 'Chord',
    tag: 'Song Chord',
    description: 'Place your fingers firmly behind the frets.',
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    notes: ['X', 'A', 'E', 'A', 'C', 'E'],
    frequencies: [0, 110, 164.81, 220, 261.63, 329.63],
  };

  const handlePlayStrum = (e) => {
    e.stopPropagation();
    if (chordData.frequencies) {
      playStrum(chordData.frequencies, 'down', 80, 0.85);
    }
  };

  const stringLabels = ['E', 'A', 'D', 'G', 'B', 'e'];
  const fretsToRender = [1, 2, 3, 4];

  return (
    <div
      style={{
        position: 'absolute',
        top: position?.top ?? '100%',
        left: position?.left ?? '50%',
        transform: position?.left ? 'none' : 'translateX(-50%)',
        zIndex: 100,
        minWidth: '230px',
        padding: '1.25rem',
        borderRadius: 'var(--radius-xl)',
        background: '#ffffff',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-xl)',
        marginTop: '0.5rem',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: '0.5rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {chordData.id}
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginLeft: '0.5rem',
              fontWeight: 600,
            }}
          >
            {chordData.name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            onClick={handlePlayStrum}
            className="btn btn-secondary btn-icon"
            style={{ width: '28px', height: '28px', color: 'var(--accent-primary)' }}
            title="Hear chord"
          >
            <Volume2 size={15} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-ghost btn-icon"
              style={{ width: '28px', height: '28px' }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Chord Diagram */}
      <div
        style={{
          background: 'var(--bg-subtle)',
          padding: '0.75rem 0.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '0.75rem',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Nut indicators (O / X) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
            marginBottom: '4px',
          }}
        >
          {chordData.frets?.map((fret, i) => (
            <span
              key={i}
              style={{
                color:
                  fret === -1
                    ? 'var(--danger)'
                    : fret === 0
                    ? 'var(--success)'
                    : 'var(--text-dim)',
              }}
            >
              {fret === -1 ? '✕' : fret === 0 ? '○' : ''}
            </span>
          ))}
        </div>

        {/* Fret Grid */}
        <div
          style={{
            position: 'relative',
            borderTop: '4px solid #1e293b',
            borderBottom: '1px solid #cbd5e1',
            height: '90px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff',
          }}
        >
          {/* Vertical string lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                style={{
                  borderRight: s < 5 ? '1px solid #cbd5e1' : 'none',
                  position: 'relative',
                }}
              />
            ))}
          </div>

          {/* Horizontal fret lines */}
          {fretsToRender.map((fretNum) => (
            <div
              key={fretNum}
              style={{
                borderBottom: '1px solid #e2e8f0',
                flex: 1,
                position: 'relative',
              }}
            >
              {/* Dots for this fret */}
              {chordData.frets?.map((fret, strIdx) => {
                if (fret === fretNum) {
                  const finger = chordData.fingers?.[strIdx];
                  const leftPercent = (strIdx / 5) * 100;
                  return (
                    <div
                      key={strIdx}
                      style={{
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    >
                      {finger || ''}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>

        {/* String names at bottom */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            marginTop: '4px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
          }}
        >
          {stringLabels.map((name, i) => (
            <span key={i}>{name}</span>
          ))}
        </div>
      </div>

      {chordData.description && (
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            margin: 0,
          }}
        >
          {chordData.description}
        </p>
      )}
    </div>
  );
}

// Interactive Chord Finger Position Diagram & Visual Guide for Beginners
// Shows exact finger placements (1=Index, 2=Middle, 3=Ring, 4=Pinky) with fretboard diagram and acoustic audio
import React from 'react';
import { X } from 'lucide-react';
import { CHORDS } from '../../data/chords';

// Built-in fingerings for common acoustic chords (order: Low E, A, D, G, B, High E)
const COMMON_FINGERINGS = {
  Em: {
    name: 'E Minor',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    summary: '2(Middle) on A2 • 3(Ring) on D2',
    steps: [
      { finger: '2 (Middle)', string: '5th (A string)', fret: 2, desc: 'Place on 2nd fret of 5th string (A)' },
      { finger: '3 (Ring)', string: '4th (D string)', fret: 2, desc: 'Place on 2nd fret of 4th string (D)' },
    ],
    openStrings: ['6th (Low E)', '3rd (G)', '2nd (B)', '1st (High e)'],
    mutedStrings: [],
    tip: 'One of the easiest chords! Keep fingers arched so strings 3, 2, and 1 ring freely.',
  },
  B7: {
    name: 'B Dominant 7',
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [null, 2, 1, 3, null, 4],
    summary: '1(Index): D1 • 2(Middle): A2 • 3(Ring): G2 • 4(Pinky): e2',
    steps: [
      { finger: '1 (Index)', string: '4th (D string)', fret: 1, desc: 'Place on 1st fret of 4th string (D)' },
      { finger: '2 (Middle)', string: '5th (A string)', fret: 2, desc: 'Place on 2nd fret of 5th string (A)' },
      { finger: '3 (Ring)', string: '3rd (G string)', fret: 2, desc: 'Place on 2nd fret of 3rd string (G)' },
      { finger: '4 (Pinky)', string: '1st (High e)', fret: 2, desc: 'Place on 2nd fret of 1st string (High e)' },
    ],
    openStrings: ['2nd (B string)'],
    mutedStrings: ['6th (Low E)'],
    tip: 'Classic diagonal staircase shape! Keep your wrist dropped and curve all 4 fingers.',
  },
  Dsus2: {
    name: 'D Suspended 2',
    frets: [-1, -1, 0, 2, 3, 0],
    fingers: [null, null, null, 1, 3, null],
    summary: '1(Index): G2 • 3(Ring): B3',
    steps: [
      { finger: '1 (Index)', string: '3rd (G string)', fret: 2, desc: 'Place on 2nd fret of 3rd string (G)' },
      { finger: '3 (Ring)', string: '2nd (B string)', fret: 3, desc: 'Place on 3rd fret of 2nd string (B)' },
    ],
    openStrings: ['4th (D string)', '1st (High e)'],
    mutedStrings: ['6th (Low E)', '5th (A)'],
    tip: 'Leave the 1st string (High e) completely open for that dreamy, chimey acoustic sound.',
  },
  A9: {
    name: 'A9 (Intro Shape)',
    frets: [-1, 4, 2, 0, 0, 0],
    fingers: [null, 3, 1, null, null, null],
    summary: '3(Ring): A4 • 1(Index): D2',
    steps: [
      { finger: '3 (Ring)', string: '5th (A string)', fret: 4, desc: 'Place on 4th fret of 5th string (A)' },
      { finger: '1 (Index)', string: '4th (D string)', fret: 2, desc: 'Place on 2nd fret of 4th string (D)' },
    ],
    openStrings: ['3rd (G)', '2nd (B)', '1st (High e)'],
    mutedStrings: ['6th (Low E)'],
    tip: 'The iconic Hotel California Chunk #4 voicing. Stretch Ring finger up to the 4th fret.',
  },
  C: {
    name: 'C Major',
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    summary: '1(Index): B1 • 2(Middle): D2 • 3(Ring): A3',
    steps: [
      { finger: '1 (Index)', string: '2nd (B string)', fret: 1, desc: 'Place on 1st fret of 2nd string (B)' },
      { finger: '2 (Middle)', string: '4th (D string)', fret: 2, desc: 'Place on 2nd fret of 4th string (D)' },
      { finger: '3 (Ring)', string: '5th (A string)', fret: 3, desc: 'Place on 3rd fret of 5th string (A)' },
    ],
    openStrings: ['3rd (G)', '1st (High e)'],
    mutedStrings: ['6th (Low E)'],
    tip: 'Arch your index finger high so it does not accidentally brush and mute the open high E string.',
  },
  G: {
    name: 'G Major',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
    summary: '2(Middle): E3 • 1(Index): A2 • 3(Ring): e3',
    steps: [
      { finger: '1 (Index)', string: '5th (A string)', fret: 2, desc: 'Place on 2nd fret of 5th string (A)' },
      { finger: '2 (Middle)', string: '6th (Low E)', fret: 3, desc: 'Place on 3rd fret of 6th string (Low E)' },
      { finger: '3 (Ring)', string: '1st (High e)', fret: 3, desc: 'Place on 3rd fret of 1st string (High e)' },
    ],
    openStrings: ['4th (D)', '3rd (G)', '2nd (B)'],
    mutedStrings: [],
    tip: 'All 6 strings ring out! Plant Middle on low E and Ring on high e.',
  },
  Am7: {
    name: 'A Minor 7',
    frets: [-1, 0, 2, 0, 1, 0],
    fingers: [null, null, 2, null, 1, null],
    summary: '1(Index): B1 • 2(Middle): D2',
    steps: [
      { finger: '1 (Index)', string: '2nd (B string)', fret: 1, desc: 'Place on 1st fret of 2nd string (B)' },
      { finger: '2 (Middle)', string: '4th (D string)', fret: 2, desc: 'Place on 2nd fret of 4th string (D)' },
    ],
    openStrings: ['5th (A)', '3rd (G)', '1st (High e)'],
    mutedStrings: ['6th (Low E)'],
    tip: 'Like standard Am, but release the ring finger so the open G string rings freely.',
  },
  Gadd9: {
    name: 'G Add 9',
    frets: [3, 2, 0, 2, 0, 3],
    fingers: [2, 1, null, 3, null, 4],
    summary: '2: E3 • 1: A2 • 3: G2 • 4: e3',
    steps: [
      { finger: '2 (Middle)', string: '6th (Low E)', fret: 3, desc: 'Place on 3rd fret of 6th string' },
      { finger: '1 (Index)', string: '5th (A string)', fret: 2, desc: 'Place on 2nd fret of 5th string' },
      { finger: '3 (Ring)', string: '3rd (G string)', fret: 2, desc: 'Place on 2nd fret of 3rd string' },
      { finger: '4 (Pinky)', string: '1st (High e)', fret: 3, desc: 'Place on 3rd fret of 1st string' },
    ],
    openStrings: ['4th (D)', '2nd (B)'],
    mutedStrings: [],
    tip: 'Lush modern acoustic voicing with an open, singing top end.',
  },
  Emadd9: {
    name: 'E Minor Add 9',
    frets: [0, 2, 4, 0, 0, 0],
    fingers: [null, 1, 3, null, null, null],
    summary: '1(Index): A2 • 3(Ring): D4',
    steps: [
      { finger: '1 (Index)', string: '5th (A string)', fret: 2, desc: 'Place on 2nd fret of 5th string' },
      { finger: '3 (Ring)', string: '4th (D string)', fret: 4, desc: 'Place on 4th fret of 4th string' },
    ],
    openStrings: ['6th (Low E)', '3rd (G)', '2nd (B)', '1st (High e)'],
    mutedStrings: [],
    tip: 'Ethereal acoustic arpeggio voicing.',
  },
};

/**
 * Returns clean compact finger notation (e.g. "2:A2  3:D2" or "1:D1  2:A2  3:G2  4:e2")
 */
export function getChordFingerShorthand(chordName, customChords = []) {
  if (!chordName) return '';
  const strNames = ['E', 'A', 'D', 'G', 'B', 'e'];
  if (COMMON_FINGERINGS[chordName]) {
    const cf = COMMON_FINGERINGS[chordName];
    const parts = [];
    cf.frets.forEach((f, idx) => {
      const finger = cf.fingers[idx];
      if (f > 0 && finger) {
        parts.push(`${finger}:${strNames[idx]}${f}`);
      }
    });
    return parts.join('  ');
  }
  const custom = customChords?.find((c) => c.id === chordName || c.name === chordName);
  if (custom?.fingers && custom?.frets) {
    const parts = [];
    custom.frets.forEach((f, idx) => {
      const finger = custom.fingers[idx];
      if (f > 0 && finger) {
        parts.push(`${finger}:${strNames[idx]}${f}`);
      }
    });
    return parts.join('  ');
  }
  const found = CHORDS.find((c) => c.id.toLowerCase() === chordName.toLowerCase());
  if (found && found.fingers && found.frets) {
    const parts = [];
    found.frets.forEach((f, idx) => {
      const finger = found.fingers[idx];
      if (f > 0 && finger) {
        parts.push(`${finger}:${strNames[idx]}${f}`);
      }
    });
    return parts.join('  ');
  }
  return '';
}

/**
 * Returns a short 1-line summary of finger positions for any chord name
 */
export function getChordFingerSummary(chordName, customChords = []) {
  if (!chordName) return '';
  if (COMMON_FINGERINGS[chordName]) {
    return COMMON_FINGERINGS[chordName].summary;
  }
  const custom = customChords?.find((c) => c.id === chordName || c.name === chordName);
  if (custom?.fingers && custom?.frets) {
    const parts = [];
    const strNames = ['E', 'A', 'D', 'G', 'B', 'e'];
    custom.frets.forEach((f, idx) => {
      const finger = custom.fingers[idx];
      if (f > 0 && finger) {
        parts.push(`${finger}:${strNames[idx]}${f}`);
      }
    });
    return parts.join(' • ');
  }
  const found = CHORDS.find((c) => c.id.toLowerCase() === chordName.toLowerCase());
  if (found && found.fingers && found.frets) {
    const parts = [];
    const strNames = ['E', 'A', 'D', 'G', 'B', 'e'];
    found.frets.forEach((f, idx) => {
      const finger = found.fingers[idx];
      if (f > 0 && finger) {
        parts.push(`${finger}:${strNames[idx]}${f}`);
      }
    });
    return parts.join(' • ');
  }
  return '';
}

/**
 * Returns an array of length 6 for TAB staff [High e (0), B (1), G (2), D (3), A (4), Low E (5)]
 * with finger numbers (1, 2, 3, 4) or null.
 */
export function getChordFingersForTab(chordName, customChords = []) {
  if (!chordName) return [null, null, null, null, null, null];
  let rawFingers = null;
  if (COMMON_FINGERINGS[chordName]?.fingers) {
    rawFingers = COMMON_FINGERINGS[chordName].fingers;
  } else {
    const custom = customChords?.find((c) => c.id === chordName || c.name === chordName);
    if (custom?.fingers) {
      rawFingers = custom.fingers;
    } else {
      const found = CHORDS.find((c) => c.id.toLowerCase() === chordName.toLowerCase());
      if (found?.fingers) {
        rawFingers = found.fingers;
      }
    }
  }

  if (!rawFingers) return [null, null, null, null, null, null];
  return [
    rawFingers[5] ?? null,
    rawFingers[4] ?? null,
    rawFingers[3] ?? null,
    rawFingers[2] ?? null,
    rawFingers[1] ?? null,
    rawFingers[0] ?? null,
  ];
}

/**
 * Returns an array of length 6 for TAB staff [High e (0), B (1), G (2), D (3), A (4), Low E (5)]
 * with fret numbers (0..12, or -1 for muted/unplayed).
 */
export function getChordFretsForTab(chordName, customChords = []) {
  if (!chordName) return [0, 0, 0, 0, 0, 0];
  let rawFrets = null;
  if (COMMON_FINGERINGS[chordName]?.frets) {
    rawFrets = COMMON_FINGERINGS[chordName].frets;
  } else {
    const custom = customChords?.find((c) => c.id === chordName || c.name === chordName);
    if (custom?.frets) {
      rawFrets = custom.frets;
    } else {
      const found = CHORDS.find((c) => c.id.toLowerCase() === chordName.toLowerCase());
      if (found?.frets) {
        rawFrets = found.frets;
      }
    }
  }

  if (!rawFrets) return [0, 0, 0, 0, 0, 0];
  return [
    rawFrets[5] ?? null,
    rawFrets[4] ?? null,
    rawFrets[3] ?? null,
    rawFrets[2] ?? null,
    rawFrets[1] ?? null,
    rawFrets[0] ?? null,
  ];
}

export default function ChordFingerPopover({
  chordName = 'Em',
  customChords = [],
  onClose,
  capo = 0,
  isModal = false,
}) {
  // Resolve chord data
  const chordInfo = COMMON_FINGERINGS[chordName] || (() => {
    const found = [...(customChords || []), ...CHORDS].find(
      (c) => c.id.toLowerCase() === chordName.toLowerCase() || c.name?.toLowerCase() === chordName.toLowerCase()
    );
    if (!found) {
      return {
        name: chordName,
        frets: [-1, 0, 2, 2, 1, 0],
        fingers: [null, null, 2, 3, 1, null],
        summary: 'Standard Chord Shape',
        steps: [],
        openStrings: [],
        mutedStrings: [],
        tip: 'Practice placing fingers firmly right behind the fretwire.',
      };
    }

    const strNames = ['6th (Low E)', '5th (A)', '4th (D)', '3rd (G)', '2nd (B)', '1st (High e)'];
    const steps = [];
    const openStrings = [];
    const mutedStrings = [];

    (found.frets || []).forEach((f, idx) => {
      const finger = found.fingers?.[idx];
      if (f === -1) {
        mutedStrings.push(strNames[idx]);
      } else if (f === 0) {
        openStrings.push(strNames[idx]);
      } else if (f > 0) {
        const fingerLabel = finger ? `Finger ${finger}` : 'Fret';
        steps.push({
          finger: fingerLabel,
          string: strNames[idx],
          fret: f,
          desc: `Place ${fingerLabel} on fret ${f} of ${strNames[idx]}`,
        });
      }
    });

    return {
      name: found.name || chordName,
      frets: found.frets,
      fingers: found.fingers,
      summary: found.description || 'Standard Shape',
      steps,
      openStrings,
      mutedStrings,
      tip: found.description || 'Arch your fingers to let open strings ring clearly.',
    };
  })();

  const fretsToRender = [1, 2, 3, 4];
  const stringLabels = ['E', 'A', 'D', 'G', 'B', 'e'];

  const cardContent = (
    <div
      style={{
        position: isModal ? 'relative' : 'absolute',
        top: isModal ? 'auto' : '100%',
        left: isModal ? 'auto' : '0',
        zIndex: 1000,
        width: '320px',
        maxWidth: '92vw',
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--accent-primary-border)',
        boxShadow: isModal ? '0 20px 40px -10px rgba(0,0,0,0.3)' : 'var(--shadow-xl)',
        padding: '1.25rem',
        marginTop: isModal ? '0' : '6px',
        animation: 'fadeIn 0.15s ease-out',
        textAlign: 'left',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: '0.65rem',
          marginBottom: '0.85rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 900,
                color: 'var(--accent-primary)',
              }}
            >
              {chordName}
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {chordInfo.name}
            </span>
          </div>
          {capo > 0 && (
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)' }}>
              Relative to Capo Fret {capo}
            </div>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Visual Fretboard Finger Diagram */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          padding: '0.85rem 0.65rem',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem', textAlign: 'center' }}>
          FRETBOARD FINGER PLACEMENT (1=Index, 2=Middle, 3=Ring, 4=Pinky)
        </div>

        {/* Nut indicators (○ = Open, ✕ = Muted) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            textAlign: 'center',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: '4px',
          }}
        >
          {chordInfo.frets?.map((fret, i) => (
            <span
              key={i}
              style={{
                color: fret === -1 ? 'var(--danger)' : fret === 0 ? 'var(--success)' : 'transparent',
              }}
            >
              {fret === -1 ? '✕' : fret === 0 ? '○' : '·'}
            </span>
          ))}
        </div>

        {/* Fret Grid */}
        <div
          style={{
            position: 'relative',
            borderTop: '4px solid #0f172a', // nut
            borderBottom: '1px solid #cbd5e1',
            height: '92px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff',
          }}
        >
          {/* Vertical 6 string lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              pointerEvents: 'none',
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

          {/* Horizontal fret spaces */}
          {fretsToRender.map((fretNum) => (
            <div
              key={fretNum}
              style={{
                borderBottom: '1px solid #e2e8f0',
                flex: 1,
                position: 'relative',
              }}
            >
              {/* Dots with finger numbers for this fret */}
              {chordInfo.frets?.map((fret, strIdx) => {
                if (fret === fretNum) {
                  const finger = chordInfo.fingers?.[strIdx];
                  const leftPercent = (strIdx / 5) * 100;
                  return (
                    <div
                      key={strIdx}
                      style={{
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '19px',
                        height: '19px',
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3,
                        boxShadow: '0 1px 4px rgba(79, 70, 229, 0.4)',
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

        {/* String names below nut */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            textAlign: 'center',
            fontSize: '0.68rem',
            fontWeight: 800,
            color: 'var(--text-dim)',
            marginTop: '4px',
          }}
        >
          {stringLabels.map((str, i) => (
            <span key={i}>{str}</span>
          ))}
        </div>
      </div>

      {/* Beginner Step-by-Step Finger Placements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.85rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          EXACT FINGER PLACEMENT:
        </div>
        {chordInfo.steps?.map((step, idx) => (
          <div
            key={idx}
            style={{
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              background: '#f8fafc',
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--accent-primary)',
            }}
          >
            <strong style={{ color: 'var(--text-primary)' }}>Finger {step.finger}:</strong> {step.string} at Fret {step.fret}
          </div>
        ))}

        {chordInfo.openStrings?.length > 0 && (
          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, paddingLeft: '4px' }}>
            ○ Open Strings: {chordInfo.openStrings.join(', ')}
          </div>
        )}

        {chordInfo.mutedStrings?.length > 0 && (
          <div style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700, paddingLeft: '4px' }}>
            ✕ Mute (don't play): {chordInfo.mutedStrings.join(', ')}
          </div>
        )}
      </div>

      {/* Practice Tip */}
      {chordInfo.tip && (
        <div
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            background: 'var(--bg-subtle)',
            padding: '0.5rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-default)',
          }}
        >
          💡 <strong>Tip:</strong> {chordInfo.tip}
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(3px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.15s ease-out',
        }}
        onClick={onClose}
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}

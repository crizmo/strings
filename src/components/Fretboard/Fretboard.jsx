// Natural Maple & Acoustic Wood Fretboard with interactive plucks
import React, { useState } from 'react';
import { playAcousticPluck } from '../../audio/acousticSynth';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OPEN_STRING_MIDIS = [40, 45, 50, 55, 59, 64];

export default function Fretboard({ activeChord = null }) {
  const [activeFretNote, setActiveFretNote] = useState(null);
  const totalFrets = 14;

  const getNoteInfo = (stringIndex, fretNumber) => {
    const baseMidi = OPEN_STRING_MIDIS[stringIndex];
    const midi = baseMidi + fretNumber;
    const noteName = NOTE_NAMES[((midi % 12) + 12) % 12];
    const octave = Math.floor(midi / 12) - 1;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    return {
      noteName,
      octave,
      freq: Math.round(freq * 10) / 10,
      label: `${noteName}${octave}`,
    };
  };

  const handlePluckFret = (stringIndex, fretNumber) => {
    const info = getNoteInfo(stringIndex, fretNumber);
    playAcousticPluck(info.freq, 2.5, 0.55);
    setActiveFretNote({ stringIndex, fretNumber, ...info });

    setTimeout(() => {
      setActiveFretNote((curr) =>
        curr && curr.stringIndex === stringIndex && curr.fretNumber === fretNumber ? null : curr
      );
    }, 1200);
  };

  const singleDotFrets = [3, 5, 7, 9];
  const doubleDotFrets = [12];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      
      {/* Plucked Note Banner */}
      <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
        {activeFretNote ? (
          <span
            style={{
              padding: '0.25rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-primary-subtle)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--accent-primary-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            Plucked: {activeFretNote.label} ({activeFretNote.freq} Hz)
          </span>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Tap any fret or string to play reference note
          </span>
        )}
      </div>

      {/* Natural Light Wood Fretboard Neck */}
      <div
        style={{
          position: 'relative',
          minWidth: '760px',
          maxWidth: '960px',
          width: '100%',
          background: 'linear-gradient(180deg, #f8f6f0 0%, #ede8de 100%)',
          border: '1px solid #dcd5c7',
          borderRadius: 'var(--radius-xl)',
          padding: '16px 0',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Bone Nut */}
        <div
          style={{
            position: 'absolute',
            left: '36px',
            top: 0,
            bottom: 0,
            width: '6px',
            background: 'linear-gradient(90deg, #e8dfd2, #d1c7b8)',
            zIndex: 10,
            borderRight: '1px solid #b8ad9c',
          }}
        />

        {/* Fretboard Strings (6 Strings) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative', zIndex: 5 }}>
          {[0, 1, 2, 3, 4, 5].map((strIdx) => {
            const stringGauge = [3.2, 2.6, 2.0, 1.5, 1.1, 0.8][strIdx];
            const isWound = strIdx < 3;

            return (
              <div
                key={strIdx}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: '14px',
                }}
              >
                {/* Horizontal String Line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: `${stringGauge}px`,
                    background: isWound
                      ? 'linear-gradient(180deg, #c99a2c, #8c6818, #c99a2c)' // Acoustic bronze
                      : 'linear-gradient(180deg, #94a3b8, #64748b, #cbd5e1)', // Steel
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />

                {/* Frets for this string */}
                <div style={{ display: 'flex', width: '100%', height: '100%', zIndex: 6 }}>
                  {/* Fret 0 (Open) */}
                  <div
                    onClick={() => handlePluckFret(strIdx, 0)}
                    style={{
                      width: '36px',
                      height: '100%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                    title={`Open string ${strIdx + 1}`}
                  >
                    {activeChord && activeChord.frets && activeChord.frets[strIdx] === 0 && (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'var(--success-subtle)',
                          border: '2px solid var(--success)',
                          color: 'var(--success)',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ○
                      </div>
                    )}
                  </div>

                  {/* Frets 1 to 14 */}
                  {Array.from({ length: totalFrets }).map((_, fIdx) => {
                    const fretNum = fIdx + 1;
                    const isChordFret =
                      activeChord &&
                      activeChord.frets &&
                      activeChord.frets[strIdx] === fretNum;
                    const fingerNum =
                      isChordFret && activeChord.fingers
                        ? activeChord.fingers[strIdx]
                        : null;

                    return (
                      <div
                        key={fretNum}
                        onClick={() => handlePluckFret(strIdx, fretNum)}
                        style={{
                          flex: 1,
                          height: '100%',
                          borderRight: '2px solid #b8ad9c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        {isChordFret && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: 'var(--accent-primary)',
                              color: '#ffffff',
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10,
                              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.3)',
                            }}
                          >
                            {fingerNum || ''}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fret Markers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <div style={{ width: '36px' }} />
          {Array.from({ length: totalFrets }).map((_, fIdx) => {
            const fretNum = fIdx + 1;
            const isSingle = singleDotFrets.includes(fretNum);
            const isDouble = doubleDotFrets.includes(fretNum);

            return (
              <div
                key={fretNum}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px',
                }}
              >
                {isSingle && (
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#5a5245',
                      opacity: 0.6,
                    }}
                  />
                )}
                {isDouble && (
                  <>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#5a5245',
                        opacity: 0.6,
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#5a5245',
                        opacity: 0.6,
                      }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Fret Numbers */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            marginTop: '10px',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          <div style={{ width: '36px' }}>Nut</div>
          {Array.from({ length: totalFrets }).map((_, fIdx) => (
            <div key={fIdx} style={{ flex: 1 }}>
              {fIdx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

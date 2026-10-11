// Interactive Chord Creator & Voicing Builder Modal
// Allows guitarists to design custom chord shapes, assign frets/fingers, audition acoustic sound, and save to the song
import React, { useState } from 'react';
import { X, Volume2, Plus, Sparkles, Check, HelpCircle } from 'lucide-react';
import ChordBox from '../Chords/ChordBox';
import { playStrum } from '../../audio/acousticSynth';
import { chordToFrequencies } from '../../utils/tabAudio';

const STRINGS_META = [
  { num: 6, label: '6 (Low E)', defaultOpen: 0 },
  { num: 5, label: '5 (A)', defaultOpen: 0 },
  { num: 4, label: '4 (D)', defaultOpen: 0 },
  { num: 3, label: '3 (G)', defaultOpen: 0 },
  { num: 2, label: '2 (B)', defaultOpen: 0 },
  { num: 1, label: '1 (High E)', defaultOpen: 0 },
];

export default function ChordBuilderModal({
  isOpen,
  onClose,
  onSaveChord,
  initialChord = null,
}) {
  const [chordName, setChordName] = useState(initialChord?.name || initialChord?.id || 'Gadd9');
  // Frets: [String 6, String 5, String 4, String 3, String 2, String 1]
  // -1 = X (muted), 0 = open, 1-12 = fret number
  const [frets, setFrets] = useState(() => {
    return initialChord?.frets || [3, -1, 0, 2, 0, 2];
  });
  const [fingers, setFingers] = useState(() => {
    return initialChord?.fingers || [2, null, null, 1, null, 3];
  });
  const [baseFret, setBaseFret] = useState(1);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  if (!isOpen) return null;

  // Construct chord object for ChordBox
  const customChordObj = {
    id: chordName.trim() || 'Custom',
    name: chordName.trim() || 'Custom Chord',
    frets: frets,
    fingers: fingers,
    baseFret: baseFret,
    isCustom: true,
  };

  // Change fret on string index (0 = Low E ... 5 = High E)
  const handleFretChange = (strIdx, val) => {
    const next = [...frets];
    next[strIdx] = val;
    setFrets(next);
  };

  // Change finger on string index
  const handleFingerChange = (strIdx, fVal) => {
    const next = [...fingers];
    next[strIdx] = fVal === 0 ? null : fVal;
    setFingers(next);
  };

  // Audition acoustic strum
  const handleAudition = () => {
    setPreviewPlaying(true);
    const freqs = chordToFrequencies(frets);
    playStrum(freqs, 'down', 90, 0.75);
    setTimeout(() => setPreviewPlaying(false), 800);
  };

  // Save chord
  const handleSave = () => {
    if (!chordName.trim()) return;
    onSaveChord({
      id: chordName.trim(),
      name: chordName.trim(),
      frets,
      fingers,
      baseFret,
      frequencies: chordToFrequencies(frets),
      isCustom: true,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-2xl)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                Chord Voicing Designer
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Create any custom chord voicing for your song or tablature
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) 200px',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left: Inputs for chord name and string frets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.35rem',
                }}
              >
                Chord Name (e.g. Gadd9, Emadd9, Dsus2, F#7)
              </label>
              <input
                type="text"
                value={chordName}
                onChange={(e) => setChordName(e.target.value)}
                placeholder="Chord name..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  outline: 'none',
                  background: 'var(--bg-subtle)',
                }}
              />
            </div>

            {/* 6 String Fret Sliders / Selectors */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}
              >
                String Frets &amp; Finger Placements:
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {STRINGS_META.map((sm, strIdx) => {
                  const currentFret = frets[strIdx];
                  const currentFinger = fingers[strIdx];

                  return (
                    <div
                      key={sm.num}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.45rem 0.75rem',
                        background: 'var(--bg-page)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-default)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          width: '85px',
                        }}
                      >
                        String {sm.label}
                      </span>

                      {/* Quick Fret Chips */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {[-1, 0, 1, 2, 3, 4, 5].map((fVal) => (
                          <button
                            key={fVal}
                            type="button"
                            onClick={() => handleFretChange(strIdx, fVal)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: 'var(--radius-xs)',
                              border: currentFret === fVal ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-default)',
                              background: currentFret === fVal ? 'var(--accent-primary)' : '#ffffff',
                              color: currentFret === fVal ? '#ffffff' : 'var(--text-secondary)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {fVal === -1 ? 'X' : fVal}
                          </button>
                        ))}
                      </div>

                      {/* Finger Select */}
                      <select
                        value={currentFinger || 0}
                        onChange={(e) => handleFingerChange(strIdx, Number(e.target.value))}
                        style={{
                          padding: '0.2rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-default)',
                          fontSize: '0.72rem',
                          background: '#ffffff',
                        }}
                        title="Finger used"
                      >
                        <option value={0}>No Finger</option>
                        <option value={1}>1: Index</option>
                        <option value={2}>2: Middle</option>
                        <option value={3}>3: Ring</option>
                        <option value={4}>4: Pinky</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Diagram Preview & Audition */}
          <div
            style={{
              background: 'var(--bg-page)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-default)',
              padding: '1.25rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-dim)',
                marginBottom: '0.5rem',
              }}
            >
              Diagram Preview
            </div>

            <ChordBox chord={customChordObj} size={120} showName={true} />

            <button
              type="button"
              onClick={handleAudition}
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--accent-primary-border)',
                background: previewPlaying ? 'var(--accent-primary)' : 'var(--accent-primary-subtle)',
                color: previewPlaying ? '#ffffff' : 'var(--accent-primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease',
              }}
            >
              <Volume2 size={15} />
              <span>Audition Sound</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Check size={16} />
            <span>Save Chord to Palette</span>
          </button>
        </div>
      </div>
    </div>
  );
}

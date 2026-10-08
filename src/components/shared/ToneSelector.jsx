// Guitar Tone Preset Selector Modal / Dropdown
import React, { useState } from 'react';
import { GUITAR_TONES, getGuitarTone, setGuitarTone, playStrum } from '../../audio/acousticSynth';
import { Volume2, Sliders, Check } from 'lucide-react';
import { CHORDS } from '../../data/chords';

export default function ToneSelector({ compact = false }) {
  const [currentTone, setCurrentTone] = useState(getGuitarTone());
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTone = (tone) => {
    setGuitarTone(tone.id);
    setCurrentTone(tone);

    // Play a sample G Major strum immediately so user hears the new tone
    const sampleChord = CHORDS.find((c) => c.id === 'G') || CHORDS[0];
    if (sampleChord?.frequencies) {
      setTimeout(() => {
        playStrum(sampleChord.frequencies, 'down', 90, 0.9);
      }, 50);
    }
  };

  if (compact) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-secondary"
          style={{
            fontSize: '0.82rem',
            padding: '0.45rem 0.85rem',
            gap: '0.4rem',
            borderRadius: 'var(--radius-lg)',
          }}
          title="Change Guitar Sound & Tone Profile"
        >
          <span>{currentTone.icon}</span>
          <span>{currentTone.shortName || currentTone.name}</span>
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '6px',
              width: '280px',
              background: '#ffffff',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              padding: '0.75rem',
              zIndex: 100,
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.5rem',
                padding: '0 0.25rem',
              }}
            >
              Select Guitar Tone Profile
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {GUITAR_TONES.map((t) => {
                const isSelected = currentTone.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      handleSelectTone(t);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--accent-primary-subtle)' : 'transparent',
                      border: isSelected ? '1px solid var(--accent-primary-border)' : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                      <div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: isSelected ? 700 : 600,
                            color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                          }}
                        >
                          {t.name}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check size={16} style={{ color: 'var(--accent-primary)' }} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.75rem',
      }}
    >
      {GUITAR_TONES.map((tone) => {
        const isSelected = currentTone.id === tone.id;
        return (
          <div
            key={tone.id}
            onClick={() => handleSelectTone(tone)}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-xl)',
              background: isSelected ? 'var(--accent-primary-subtle)' : '#ffffff',
              border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
              cursor: 'pointer',
              boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-xs)',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{tone.icon}</span>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                  {tone.name}
                </span>
              </div>
              {isSelected && <Check size={16} style={{ color: 'var(--accent-primary)' }} />}
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {tone.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

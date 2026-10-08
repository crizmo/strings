// Interactive Chord & Fretboard Explorer — Clean Light Theme
import React, { useState } from 'react';
import { Volume2, Music } from 'lucide-react';
import Fretboard from './Fretboard';
import { CHORDS } from '../../data/chords';
import { playAcousticChord } from '../../audio/acousticSynth';
import PageHeader from '../shared/PageHeader';
import GlassCard from '../shared/GlassCard';

export default function ChordExplorer() {
  const [selectedChord, setSelectedChord] = useState(CHORDS[0]);

  const handleStrumChord = (chord) => {
    const validFreqs = chord.frequencies.filter((f) => f > 0);
    playAcousticChord(validFreqs, 32);
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <PageHeader
        badge="Interactive Neck"
        badgeIcon={<Music size={14} />}
        title="Fretboard & Chord Explorer"
        subtitle="Visualize open chords, barre fingerings, and note frequencies across all 14 frets."
        actions={
          <button
            onClick={() => handleStrumChord(selectedChord)}
            className="btn btn-primary"
            style={{ gap: '0.4rem', fontSize: '0.9rem' }}
          >
            <Volume2 size={16} />
            <span>Strum {selectedChord.name}</span>
          </button>
        }
      />

      {/* Chord Selector Grid */}
      <GlassCard
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.75rem',
          }}
        >
          Select Chord Shape:
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '0.5rem',
          }}
        >
          {CHORDS.map((chord) => {
            const isSelected = selectedChord.id === chord.id;
            return (
              <button
                key={chord.id}
                onClick={() => setSelectedChord(chord)}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background: isSelected
                    ? 'var(--accent-primary)'
                    : 'var(--bg-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  border: isSelected
                    ? '1px solid var(--accent-primary)'
                    : '1px solid var(--border-default)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    fontWeight: 800,
                  }}
                >
                  {chord.id}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: isSelected ? 'rgba(255, 255, 255, 0.85)' : 'var(--text-muted)',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {chord.name}
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Fretboard Card */}
      <GlassCard
        variant="elevated"
        style={{
          padding: '2rem 1.5rem',
          borderRadius: 'var(--radius-2xl)',
          marginBottom: '2rem',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              {selectedChord.name} ({selectedChord.id}) on Fretboard
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Dots show finger placements (1=Index, 2=Middle, 3=Ring, 4=Pinky).
            </p>
          </div>

          <div
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-primary-subtle)',
              border: '1px solid var(--accent-primary-border)',
              color: 'var(--accent-primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {selectedChord.tag || 'Open Chord'}
          </div>
        </div>

        <Fretboard activeChord={selectedChord} />
      </GlassCard>

      {/* Chord Details Card */}
      {selectedChord.description && (
        <GlassCard
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-xl)',
            borderLeft: '4px solid var(--accent-primary)',
            background: '#ffffff',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 700 }}>
            Pro Tips for {selectedChord.name}
          </h4>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {selectedChord.description}
          </p>
        </GlassCard>
      )}
    </div>
  );
}

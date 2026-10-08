// Chord Encyclopedia & Interactive Library — Clean light theme
import React, { useState, useMemo } from 'react';
import { CHORDS } from '../../data/chords';
import ChordBox from './ChordBox';
import PageHeader from '../shared/PageHeader';
import GlassCard from '../shared/GlassCard';
import { playStrum } from '../../audio/acousticSynth';
import { Search, Volume2, BookOpen } from 'lucide-react';

export default function ChordLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredChords = useMemo(() => {
    return CHORDS.filter((chord) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = chord.name.toLowerCase().includes(q);
        const matchesId = chord.id.toLowerCase().includes(q);
        const matchesTag = chord.tag?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesTag) return false;
      }

      if (selectedDifficulty !== 'all') {
        if (chord.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase())
          return false;
      }

      return true;
    });
  }, [searchQuery, selectedDifficulty]);

  const handlePlayChord = (chord) => {
    if (chord?.frequencies) {
      playStrum(chord.frequencies, 'down', 80, 0.85);
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <PageHeader
        badge="Chord Encyclopedia"
        badgeIcon={<BookOpen size={14} />}
        title="Guitar Chord Book"
        subtitle="Explore open cowboy chords, 7ths, suspensions, fingerings, and test realistic acoustic strum tones."
      />

      {/* Filter Bar */}
      <GlassCard
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search chords (e.g. C Major, Em, Dsus4)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{
              paddingLeft: '42px',
              width: '100%',
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'beginner', 'intermediate'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background:
                  selectedDifficulty === diff
                    ? 'var(--accent-primary)'
                    : 'var(--bg-subtle)',
                color: selectedDifficulty === diff ? '#ffffff' : 'var(--text-secondary)',
                border:
                  selectedDifficulty === diff
                    ? '1px solid var(--accent-primary)'
                    : '1px solid var(--border-default)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {diff === 'all' ? 'All Chords' : diff}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Chords Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filteredChords.map((chord) => (
          <GlassCard
            key={chord.id}
            variant="interactive"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={() => handlePlayChord(chord)}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: 'var(--accent-primary)',
                    }}
                  >
                    {chord.id}
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                    }}
                  >
                    {chord.name}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayChord(chord);
                  }}
                  className="btn btn-secondary btn-icon"
                  style={{ width: '36px', height: '36px', color: 'var(--accent-primary)' }}
                  title="Strum Chord"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              {/* ChordBox Diagram */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0' }}>
                <ChordBox chord={chord} showName={false} size={110} />
              </div>

              {chord.description && (
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    margin: '0.5rem 0 0 0',
                  }}
                >
                  {chord.description}
                </p>
              )}
            </div>

            {/* Tag */}
            {chord.tag && (
              <div
                style={{
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-default)',
                  fontSize: '0.75rem',
                  color: 'var(--accent-warm)',
                  fontWeight: 600,
                }}
              >
                ✨ {chord.tag}
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

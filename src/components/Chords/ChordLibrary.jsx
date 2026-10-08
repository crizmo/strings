// Chord Encyclopedia & Interactive Library — Grouped by Category with Multi-Voicing Detail Modal
import React, { useState, useMemo } from 'react';
import { CHORDS, CHORD_CATEGORIES } from '../../data/chords';
import ChordBox from './ChordBox';
import ChordDetailModal from './ChordDetailModal';
import PageHeader from '../shared/PageHeader';
import GlassCard from '../shared/GlassCard';
import { playStrum } from '../../audio/acousticSynth';
import { Search, Volume2, BookOpen, Layers, Sparkles, Filter } from 'lucide-react';

export default function ChordLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [activeModalChord, setActiveModalChord] = useState(null);

  const filteredChords = useMemo(() => {
    return CHORDS.filter((chord) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = chord.name.toLowerCase().includes(q);
        const matchesId = chord.id.toLowerCase().includes(q);
        const matchesTag = chord.tag?.toLowerCase().includes(q);
        const matchesDesc = chord.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesTag && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (chord.category !== selectedCategory) return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all') {
        if (chord.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase())
          return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Group chords by category for grouped layout
  const groupedChords = useMemo(() => {
    if (selectedCategory !== 'all' || searchQuery.trim()) {
      return null; // Show standard grid when actively filtering or searching
    }

    const groups = {};
    CHORD_CATEGORIES.filter((c) => c.id !== 'all').forEach((cat) => {
      groups[cat.id] = {
        category: cat,
        chords: CHORDS.filter((c) => c.category === cat.id),
      };
    });
    return groups;
  }, [selectedCategory, searchQuery]);

  const handlePlayChord = (e, chord) => {
    e.stopPropagation();
    if (chord?.frequencies) {
      playStrum(chord.frequencies, 'down', 80, 0.85);
    }
  };

  const handleOpenChordModal = (chord) => {
    setActiveModalChord(chord);
  };

  const handleModalSelectChord = (chordId) => {
    const next = CHORDS.find(
      (c) => c.id.toLowerCase() === chordId.toLowerCase()
    );
    if (next) {
      setActiveModalChord(next);
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <PageHeader
        badge="Chord Encyclopedia"
        badgeIcon={<BookOpen size={14} />}
        title="Acoustic Guitar Chord Book"
        subtitle="Explore cowboy chords, 7ths, suspensions, and alternative fretboard voicings with interactive acoustic tone previews."
      />

      {/* Filter & Search Bar */}
      <GlassCard
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Top: Search & Difficulty */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
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
              placeholder="Search chords (e.g. C Major, Fmaj7, Em7, barre)..."
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
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
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
                  transition: 'all 0.15s ease',
                }}
              >
                {diff === 'all' ? 'All Difficulties' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom: Category Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-default)', paddingTop: '0.85rem' }}>
          {CHORD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  background: isSelected ? 'var(--accent-primary-subtle)' : '#ffffff',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Render Chords: Grouped View OR Filtered Flat Grid */}
      {groupedChords ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {Object.entries(groupedChords).map(([catId, { category, chords }]) => {
            if (!chords.length) return null;
            return (
              <div key={catId}>
                {/* Category Header */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{category.icon}</span>
                    <h2
                      style={{
                        margin: 0,
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1.35rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {category.label}
                    </h2>
                    <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                      {chords.length} chords
                    </span>
                  </div>
                  {category.description && (
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {chords.map((chord) => (
                    <ChordCard
                      key={chord.id}
                      chord={chord}
                      onPlay={(e) => handlePlayChord(e, chord)}
                      onClick={() => handleOpenChordModal(chord)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div
            style={{
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            Showing {filteredChords.length} chords
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredChords.map((chord) => (
              <ChordCard
                key={chord.id}
                chord={chord}
                onPlay={(e) => handlePlayChord(e, chord)}
                onClick={() => handleOpenChordModal(chord)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal Detail View with Multi-Voicing Picker */}
      {activeModalChord && (
        <ChordDetailModal
          chord={activeModalChord}
          onClose={() => setActiveModalChord(null)}
          onSelectChord={handleModalSelectChord}
        />
      )}
    </div>
  );
}

// Subcomponent: Individual Interactive Chord Card
function ChordCard({ chord, onPlay, onClick }) {
  const voicingCount = chord.voicings?.length || 1;

  return (
    <GlassCard
      variant="interactive"
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onClick={onClick}
    >
      <div>
        {/* Card Top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.45rem',
                fontWeight: 900,
                color: 'var(--accent-primary)',
                lineHeight: 1.1,
              }}
            >
              {chord.id}
            </div>
            <div
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                marginTop: '2px',
              }}
            >
              {chord.name}
            </div>
          </div>

          <button
            onClick={onPlay}
            className="btn btn-secondary btn-icon"
            style={{ width: '36px', height: '36px', color: 'var(--accent-primary)' }}
            title="Strum Chord Audio"
          >
            <Volume2 size={16} />
          </button>
        </div>

        {/* ChordBox Diagram */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0' }}>
          <ChordBox chord={chord} showName={false} size={110} />
        </div>

        {/* Description */}
        {chord.description && (
          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              margin: '0.5rem 0 0 0',
            }}
          >
            {chord.description}
          </p>
        )}
      </div>

      {/* Card Footer: Tag & Voicing Count */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
        }}
      >
        <span style={{ color: 'var(--accent-warm)', fontWeight: 700 }}>
          {chord.tag ? `✨ ${chord.tag}` : 'Acoustic Voicing'}
        </span>

        {voicingCount > 1 && (
          <span
            className="badge badge-accent"
            style={{
              fontSize: '0.68rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.2rem 0.5rem',
            }}
          >
            <Layers size={11} /> {voicingCount} shapes
          </span>
        )}
      </div>
    </GlassCard>
  );
}

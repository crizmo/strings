// Clean, Simple Guitar Chord Encyclopedia
import React, { useState, useMemo } from 'react';
import { CHORDS, CHORD_CATEGORIES } from '../../data/chords';
import ChordBox from './ChordBox';
import ChordDetailModal from './ChordDetailModal';
import PageHeader from '../shared/PageHeader';
import GlassCard from '../shared/GlassCard';
import { playStrum } from '../../audio/acousticSynth';
import { Search, Volume2, BookOpen, Layers } from 'lucide-react';

export default function ChordLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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

      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Group chords by category when in "All" view and not searching
  const groupedChords = useMemo(() => {
    if (selectedCategory !== 'all' || searchQuery.trim()) {
      return null;
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
        badge="Chord Book"
        badgeIcon={<BookOpen size={14} />}
        title="Guitar Chords"
        subtitle="Explore major, minor, 7th, and barre chords with finger placements, multiple voicings, and acoustic audio."
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
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
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
            placeholder="Search chords (e.g. C Major, Am, D7, Barre)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{
              paddingLeft: '42px',
              width: '100%',
            }}
          />
        </div>

        {/* Clean Category Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {CHORD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  background: isSelected ? 'var(--accent-primary-subtle)' : '#ffffff',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Render Chords: Grouped View OR Filtered Flat Grid */}
      {groupedChords ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {Object.entries(groupedChords).map(([catId, { category, chords }]) => {
            if (!chords.length) return null;
            return (
              <div key={catId}>
                {/* Category Header */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h2
                      style={{
                        margin: 0,
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {category.label}
                    </h2>
                    <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                      {chords.length}
                    </span>
                  </div>
                  {category.description && (
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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

      {/* Card Footer */}
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
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          {chord.tag}
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
            <Layers size={11} /> {voicingCount} voicings
          </span>
        )}
      </div>
    </GlassCard>
  );
}

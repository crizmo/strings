// Beginner-Friendly Chord Bank & Progression Generator
// Features visual chord diagrams, audio previews, and 1-click insertion
import React, { useState } from 'react';
import { Volume2, Sparkles, Plus, Search, BookOpen, Music, Check } from 'lucide-react';
import { CHORDS } from '../../data/chords';
import ChordBox from '../Chords/ChordBox';
import { playAcousticChord } from '../../audio/acousticSynth';

const CHORD_GROUPS = [
  {
    id: 'essential',
    name: 'Essential 4 Chords',
    desc: 'The legendary "Axis of Awesome" chords that unlock 500+ famous songs!',
    chords: ['G', 'C', 'D', 'Em'],
  },
  {
    id: 'open_majors',
    name: 'Open Majors (CAGED)',
    desc: 'Bright, standard campfire open shapes with ringing open strings.',
    chords: ['C', 'A', 'G', 'E', 'D', 'Fmaj7'],
  },
  {
    id: 'open_minors',
    name: 'Open Minors',
    desc: 'Deep, emotional, and mellow acoustic minor sounds.',
    chords: ['Am', 'Em', 'Dm'],
  },
  {
    id: 'easy_embellish',
    name: 'Color & 7ths',
    desc: 'Cadd9, Dsus4, and 7ths for acoustic fingerstyle & modern pop.',
    chords: ['Cadd9', 'Dsus4', 'G7', 'C7', 'A7', 'E7', 'D7'],
  },
  {
    id: 'barre',
    name: 'Barre & Movable',
    desc: 'Stepping stones to intermediate guitar playing.',
    chords: ['F', 'Bm', 'F#m', 'B7'],
  },
];

const FAMOUS_PROGRESSIONS = [
  {
    name: 'Pop 4-Chords (Key of G)',
    progression: ['G', 'D', 'Em', 'C'],
    tag: 'Riptide, Let It Be vibe',
  },
  {
    name: 'Folk 50s Ballad (Key of C)',
    progression: ['C', 'Am', 'Fmaj7', 'G'],
    tag: 'Stand By Me vibe',
  },
  {
    name: 'Campfire 2-Chords',
    progression: ['Em', 'D'],
    tag: 'Horse With No Name vibe',
  },
  {
    name: 'Acoustic Blues 1-4-5',
    progression: ['A', 'D', 'E'],
    tag: 'Three Little Birds vibe',
  },
  {
    name: 'Sad / Emotional Minor',
    progression: ['Am', 'Fmaj7', 'C', 'G'],
    tag: 'Passenger / Lumineers vibe',
  },
];

export default function ChordPalette({
  onInsertChord,
  onInsertProgression,
  activeChordsInSong = [],
}) {
  const [activeGroup, setActiveGroup] = useState('essential');
  const [inspectedChord, setInspectedChord] = useState('C');
  const [customSearch, setCustomSearch] = useState('');
  const [justInserted, setJustInserted] = useState(null);

  // Play chord audio
  const handlePlayChord = (chordName) => {
    const chordObj = CHORDS.find(
      (c) => c.id.toLowerCase() === chordName.toLowerCase() || c.name.toLowerCase().startsWith(chordName.toLowerCase())
    );
    if (chordObj && chordObj.frequencies) {
      playAcousticChord(chordObj.frequencies);
    }
  };

  const handleInsert = (chordName) => {
    handlePlayChord(chordName);
    onInsertChord?.(chordName);
    setJustInserted(chordName);
    setTimeout(() => setJustInserted(null), 1200);
  };

  // Find chord data for inspected diagram
  const inspectedChordData = CHORDS.find(
    (c) => c.id.toLowerCase() === inspectedChord.toLowerCase()
  ) || CHORDS[0];

  // Filter chords for search
  const displayedChords = customSearch.trim()
    ? CHORDS.filter((c) =>
        c.name.toLowerCase().includes(customSearch.toLowerCase()) ||
        c.id.toLowerCase().includes(customSearch.toLowerCase())
      ).map((c) => c.id)
    : CHORD_GROUPS.find((g) => g.id === activeGroup)?.chords || [];

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-default)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-warm-subtle)',
              color: 'var(--accent-warm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={16} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              Beginner Chord Bank & Quick Insert
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any chord to insert <strong>[Chord]</strong> into your song and hear its acoustic tone!
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '180px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
            }}
          />
          <input
            type="text"
            placeholder="Search chord (e.g. Cadd9)..."
            value={customSearch}
            onChange={(e) => setCustomSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem 0.45rem 2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              fontSize: '0.82rem',
              outline: 'none',
              background: 'var(--bg-subtle)',
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      {!customSearch.trim() && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.75rem',
          }}
        >
          {CHORD_GROUPS.map((g) => {
            const isActive = activeGroup === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveGroup(g.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: isActive
                    ? '1px solid var(--accent-primary-border)'
                    : '1px solid transparent',
                  background: isActive ? 'var(--accent-primary-subtle)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Grid: Left Chord Buttons, Right Chord Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 190px',
          gap: '1.25rem',
          alignItems: 'start',
        }}
      >
        {/* Left: Chord Buttons */}
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}
          >
            {displayedChords.map((chordName) => {
              const isInSong = activeChordsInSong.includes(chordName);
              const isInspected = inspectedChord === chordName;
              const isRecent = justInserted === chordName;

              return (
                <div
                  key={chordName}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleInsert(chordName)}
                    onMouseEnter={() => setInspectedChord(chordName)}
                    style={{
                      height: '52px',
                      borderRadius: 'var(--radius-md)',
                      border: isRecent
                        ? '2px solid var(--success)'
                        : isInspected
                        ? '2px solid var(--accent-primary)'
                        : isInSong
                        ? '1.5px solid var(--accent-primary-border)'
                        : '1px solid var(--border-default)',
                      background: isRecent
                        ? 'var(--success-subtle)'
                        : isInspected
                        ? 'var(--accent-primary-subtle)'
                        : isInSong
                        ? '#ffffff'
                        : '#ffffff',
                      color: isRecent
                        ? 'var(--success)'
                        : isInspected
                        ? 'var(--accent-primary)'
                        : 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all 0.12s ease',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        lineHeight: 1,
                      }}
                    >
                      {chordName}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                        marginTop: '2px',
                      }}
                    >
                      + Insert
                    </span>
                    {isInSong && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '3px',
                          right: '3px',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--accent-primary)',
                        }}
                        title="Chord currently used in this song"
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Progressions Helper for Beginners */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '0.6rem',
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--accent-warm)' }} />
              <span>1-Click Beginner Chord Progressions:</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {FAMOUS_PROGRESSIONS.map((prog) => (
                <button
                  key={prog.name}
                  type="button"
                  onClick={() => onInsertProgression?.(prog.progression)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.78rem',
                    transition: 'all 0.15s ease',
                  }}
                  title={`Insert ${prog.progression.join(' - ')}`}
                >
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {prog.progression.join(' – ')}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                    ({prog.name.split(' (')[0]})
                  </span>
                  <Plus size={12} style={{ color: 'var(--text-muted)' }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Chord Inspector Box */}
        <div
          style={{
            background: 'var(--bg-page)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)',
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 'var(--shadow-xs)',
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
            Fingering Diagram
          </div>

          <ChordBox chord={inspectedChordData} size={115} showName={true} />

          <button
            type="button"
            onClick={() => handlePlayChord(inspectedChord)}
            style={{
              marginTop: '0.75rem',
              width: '100%',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-primary-border)',
              background: 'var(--accent-primary-subtle)',
              color: 'var(--accent-primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Volume2 size={13} />
            <span>Hear {inspectedChord}</span>
          </button>

          <div
            style={{
              marginTop: '0.65rem',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              lineHeight: 1.35,
            }}
          >
            Numbers = Fingers (1: Index, 2: Mid, 3: Ring, 4: Pinky)
          </div>
        </div>
      </div>
    </div>
  );
}

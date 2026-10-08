// Clean Light Theme Interactive ChordPro Sheet Player
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ChordSheetJS from 'chordsheetjs';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  Music2,
  Info,
  Sliders
} from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import ChordPopover from './ChordPopover';
import ToneSelector from '../shared/ToneSelector';
import { playStrum } from '../../audio/acousticSynth';
import { CHORDS } from '../../data/chords';
import { getSongLevels } from '../../utils/songLevels';

const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTE_MAP = {
  'B#': 0, 'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4, 'E#': 5, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7,
  'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11, 'Cb': 11
};

const getChordString = (chordInput) => {
  if (!chordInput) return '';
  if (typeof chordInput === 'string') return chordInput;
  if (typeof chordInput.toString === 'function') {
    const s = chordInput.toString();
    if (s && s !== '[object Object]') return s;
  }
  if (chordInput.name) return String(chordInput.name);
  return '';
};

const transposeNote = (note, delta) => {
  const pitch = NOTE_MAP[note];
  if (pitch === undefined) return note;
  const newPitch = (pitch + delta + 1200) % 12;
  return note.includes('b') ? NOTES_FLAT[newPitch] : NOTES_SHARP[newPitch];
};

const transposeChord = (chordInput, delta) => {
  const chordStr = getChordString(chordInput);
  if (!chordStr) return '';
  if (!delta) return chordStr;
  return chordStr.replace(/[A-G][b#]?/g, (match) => transposeNote(match, delta));
};

export default function SongPlayer({ song }) {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [transposeDelta, setTransposeDelta] = useState(0);
  const [capoOffset, setCapoOffset] = useState(song?.capo || 0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1.5);
  const [activePopoverChord, setActivePopoverChord] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [fontSize, setFontSize] = useState('medium');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const songLevels = useMemo(() => getSongLevels(song), [song]);
  const activeLevelData = songLevels?.[selectedLevel] || songLevels?.[1];

  useEffect(() => {
    setTransposeDelta(0);
    setCapoOffset(song?.capo || 0);
    setIsAutoScrolling(false);
    setActivePopoverChord(null);
  }, [song]);

  const parsedSong = useMemo(() => {
    const content = activeLevelData?.content || song?.content;
    if (!content) return null;
    try {
      const parser = new ChordSheetJS.ChordProParser();
      return parser.parse(content);
    } catch (e) {
      console.error('Failed to parse chord sheet:', e);
      return null;
    }
  }, [song, activeLevelData]);

  const uniqueChords = useMemo(() => {
    if (!parsedSong) return activeLevelData?.chords || song?.chordsUsed || [];
    const set = new Set();
    parsedSong.lines.forEach((line) => {
      line.items.forEach((item) => {
        if (item.chord) {
          const trans = transposeChord(item.chord, transposeDelta);
          if (trans) set.add(trans);
        }
      });
    });
    return Array.from(set);
  }, [parsedSong, transposeDelta, activeLevelData, song]);

  // Robust Auto-Scroll Loop
  useEffect(() => {
    if (!isAutoScrolling) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      return;
    }

    // Interval tick (e.g. 40ms / speed multiplier)
    const tickMs = 35;
    const pixelsPerTick = 0.8 * scrollSpeed;

    scrollIntervalRef.current = setInterval(() => {
      const el = scrollContainerRef.current;
      if (el) {
        el.scrollTop += pixelsPerTick;
        // Check if reached the end
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
          setIsAutoScrolling(false);
        }
      }
    }, tickMs);

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  const handleChordClick = (chordName, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPos({
      top: rect.bottom + window.scrollY,
      left: Math.min(window.innerWidth - 240, Math.max(10, rect.left)),
    });
    setActivePopoverChord(activePopoverChord === chordName ? null : chordName);

    const cObj = CHORDS.find(
      (c) => c.id.toLowerCase() === chordName.toLowerCase()
    );
    if (cObj?.frequencies) {
      playStrum(cObj.frequencies, 'down', 80, 0.85);
    }
  };

  const fontSizes = {
    small: { lyrics: '0.92rem', chords: '0.8rem', lineGap: '1.4rem' },
    medium: { lyrics: '1.05rem', chords: '0.9rem', lineGap: '1.75rem' },
    large: { lyrics: '1.25rem', chords: '1.05rem', lineGap: '2.1rem' },
  };

  const currentFont = fontSizes[fontSize] || fontSizes.medium;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        position: 'relative',
      }}
    >
      {/* 3-Level Mastery Level Switcher Banner */}
      <GlassCard
        variant="elevated"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '0.85rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.2rem',
              }}
            >
              Mastery Progression
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
              }}
            >
              Choose Your Playing Level
            </div>
          </div>

          {/* 3 Level Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              background: 'var(--bg-subtle)',
              padding: '0.3rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-default)',
            }}
          >
            {[1, 2, 3].map((lvl) => {
              const data = songLevels?.[lvl];
              const isSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.5rem 0.9rem',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? `1px solid ${data.border}` : '1px solid transparent',
                    background: isSelected ? data.bg : 'transparent',
                    color: isSelected ? data.color : 'var(--text-secondary)',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: data.color,
                      display: 'inline-block',
                    }}
                  />
                  <span>{data.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Level Detail Pill */}
        {activeLevelData && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              background: activeLevelData.bg,
              border: `1px solid ${activeLevelData.border}`,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              fontSize: '0.84rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ color: activeLevelData.color, fontWeight: 800 }}>
                {activeLevelData.badge}:
              </strong>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {activeLevelData.focusGoal}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <span>🥁 {activeLevelData.strummingFormula}</span>
              <span>⚡ Rec. Tempo: {activeLevelData.tempo} BPM</span>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Top Sticky Toolbar */}
      <GlassCard
        variant="elevated"
        style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          position: 'sticky',
          top: '1rem',
          zIndex: 40,
          background: '#ffffff',
        }}
      >
        {/* Left: Scroll Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`btn ${isAutoScrolling ? 'btn-danger' : 'btn-primary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.35rem' }}
          >
            {isAutoScrolling ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
            <span>{isAutoScrolling ? 'Pause Scroll' : 'Auto-Scroll'}</span>
          </button>

          <button
            onClick={() => {
              if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
            }}
            className="btn btn-secondary btn-icon"
            title="Scroll back to Top"
            style={{ width: '36px', height: '36px' }}
          >
            <RotateCcw size={15} />
          </button>

          {/* Speed selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              background: 'var(--bg-subtle)',
              padding: '0.2rem 0.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              fontSize: '0.8rem',
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontWeight: 600, paddingRight: '2px' }}>Speed:</span>
            {[0.8, 1.2, 1.8, 2.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setScrollSpeed(spd)}
                style={{
                  background: scrollSpeed === spd ? 'var(--accent-primary)' : 'transparent',
                  color: scrollSpeed === spd ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.2rem 0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Center: Transpose & Tone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Tone Selector */}
          <ToneSelector compact={true} />

          {/* Transpose */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'var(--bg-subtle)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Transpose:
            </span>
            <button
              onClick={() => setTransposeDelta((d) => d - 1)}
              className="btn btn-ghost btn-icon"
              style={{ width: '24px', height: '24px' }}
              title="Down 1 semitone"
            >
              <ChevronDown size={14} />
            </button>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.85rem',
                minWidth: '24px',
                textAlign: 'center',
                color: transposeDelta !== 0 ? 'var(--accent-primary)' : 'var(--text-primary)',
              }}
            >
              {transposeDelta > 0 ? `+${transposeDelta}` : transposeDelta}
            </span>
            <button
              onClick={() => setTransposeDelta((d) => d + 1)}
              className="btn btn-ghost btn-icon"
              style={{ width: '24px', height: '24px' }}
              title="Up 1 semitone"
            >
              <ChevronUp size={14} />
            </button>
          </div>

          {/* Capo Display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-subtle)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
            }}
          >
            <span>🎸 Capo:</span>
            <strong style={{ color: 'var(--accent-warm)' }}>
              {capoOffset === 0 ? 'None' : `Fret ${capoOffset}`}
            </strong>
          </div>
        </div>

        {/* Right: Font Size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '0.2rem',
              background: 'var(--bg-subtle)',
              padding: '0.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
            }}
          >
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                style={{
                  background: fontSize === size ? 'var(--accent-primary)' : 'transparent',
                  color: fontSize === size ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.2rem 0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {size[0]}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Song Chords Quick Preview Bar */}
      <GlassCard
        style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Music2 size={15} /> Click chord to inspect:
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {uniqueChords.map((chord) => (
            <button
              key={chord}
              onClick={(e) => handleChordClick(chord, e)}
              className="btn btn-secondary"
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '0.3rem 0.7rem',
                background:
                  activePopoverChord === chord
                    ? 'var(--accent-primary)'
                    : 'var(--accent-primary-subtle)',
                color: activePopoverChord === chord ? '#ffffff' : 'var(--accent-primary)',
                border: '1px solid var(--accent-primary-border)',
              }}
            >
              {chord}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Main Chord Sheet Body — Direct Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="glass-card"
        style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-2xl)',
          minHeight: '500px',
          maxHeight: isFullscreen ? 'calc(100vh - 160px)' : '620px',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          position: 'relative',
          background: '#ffffff',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {parsedSong ? (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              lineHeight: currentFont.lineGap,
            }}
          >
            {parsedSong.lines.map((line, lineIdx) => {
              const hasItems = line.items && line.items.length > 0;
              const isSectionHeader =
                hasItems &&
                line.items[0]?.lyrics?.startsWith('[') &&
                line.items[0]?.lyrics?.endsWith(']');

              if (isSectionHeader) {
                return (
                  <div
                    key={lineIdx}
                    style={{
                      color: 'var(--accent-warm)',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      marginTop: '1.75rem',
                      marginBottom: '0.75rem',
                      borderLeft: '4px solid var(--accent-warm)',
                      paddingLeft: '0.65rem',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {line.items[0].lyrics}
                  </div>
                );
              }

              const hasChordsInLine = line.items.some((it) => it.chord);

              return (
                <div
                  key={lineIdx}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginBottom: hasChordsInLine ? '1.25rem' : '0.5rem',
                    alignItems: 'flex-end',
                  }}
                >
                  {line.items.map((item, itemIdx) => {
                    const chord = item.chord
                      ? transposeChord(item.chord, transposeDelta)
                      : null;

                    return (
                      <div
                        key={itemIdx}
                        style={{
                          display: 'inline-flex',
                          flexDirection: 'column',
                          marginRight: item.lyrics ? '0' : '0.5rem',
                        }}
                      >
                        {/* Chord Badge */}
                        {chord ? (
                          <button
                            onClick={(e) => handleChordClick(chord, e)}
                            style={{
                              display: 'inline-block',
                              background: 'var(--accent-primary-subtle)',
                              border: '1px solid var(--accent-primary-border)',
                              color: 'var(--accent-primary)',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: currentFont.chords,
                              fontWeight: 800,
                              fontFamily: 'var(--font-mono)',
                              cursor: 'pointer',
                              textAlign: 'left',
                              marginBottom: '2px',
                              transition: 'all 0.1s ease',
                            }}
                            title={`View ${chord} chord diagram`}
                          >
                            {chord}
                          </button>
                        ) : (
                          <div style={{ height: currentFont.chords, marginBottom: '2px' }} />
                        )}

                        {/* Lyrics Text */}
                        <span
                          style={{
                            fontSize: currentFont.lyrics,
                            color: 'var(--text-primary)',
                            whiteSpace: 'pre',
                            fontWeight: 500,
                          }}
                        >
                          {item.lyrics || '\u00A0'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              color: 'var(--text-muted)',
            }}
          >
            <Info size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No chord sheet content available for this song.</p>
          </div>
        )}
      </div>

      {/* Floating Chord Popover Modal */}
      {activePopoverChord && (
        <ChordPopover
          chordName={activePopoverChord}
          onClose={() => setActivePopoverChord(null)}
          position={popoverPos}
        />
      )}
    </div>
  );
}

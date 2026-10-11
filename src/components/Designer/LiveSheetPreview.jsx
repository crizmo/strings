// Live Interactive Chord Sheet Preview for Song Designer
// Shows chords floating over lyrics, clickable chord audio, and strumming pattern bar
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ChordSheetJS from 'chordsheetjs';
import { Volume2, Play, Pause, ArrowDown, ArrowUp, Zap, HelpCircle } from 'lucide-react';
import { playAcousticChord } from '../../audio/acousticSynth';
import { CHORDS } from '../../data/chords';
import ChordBox from '../Chords/ChordBox';
import { STRUM_PATTERNS } from '../../data/strumPatterns';

export default function LiveSheetPreview({
  content = '',
  title = 'Untitled Song',
  artist = 'Artist',
  songKey = 'G',
  tempo = 90,
  capo = 0,
  timeSignature = '4/4',
  strumPattern = 'island',
  customStrumSteps = null,
}) {
  const [selectedChordModal, setSelectedChordModal] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Strum steps to show in top banner
  const steps = useMemo(() => {
    if (customStrumSteps && customStrumSteps.length > 0) return customStrumSteps;
    const match = STRUM_PATTERNS.find((p) => p.id === strumPattern);
    return match ? match.steps : [];
  }, [strumPattern, customStrumSteps]);

  // Safe ChordSheet parser with fallback
  const parsedSong = useMemo(() => {
    if (!content.trim()) return null;
    try {
      const parser = new ChordSheetJS.ChordProParser();
      return parser.parse(content);
    } catch (err) {
      // Robust fallback line-by-line parser if invalid token in ChordSheetJS
      const rawLines = content.split('\n');
      const fallbackLines = rawLines.map((raw) => {
        if (raw.startsWith('{') && raw.endsWith('}')) return null;
        if (raw.startsWith('[') && raw.endsWith(']')) {
          return { isSection: true, title: raw.slice(1, -1) };
        }
        // Extract [Chord]lyric segments
        const items = [];
        const regex = /\[([A-G][b#]?[^\]]*)\]([^\[]*)/g;
        let match;
        let lastIndex = 0;
        let foundAny = false;

        while ((match = regex.exec(raw)) !== null) {
          foundAny = true;
          items.push({
            chord: match[1],
            lyrics: match[2] || ' ',
          });
          lastIndex = regex.lastIndex;
        }

        if (!foundAny) {
          return { items: [{ chord: null, lyrics: raw }] };
        }
        return { items };
      }).filter(Boolean);

      return { fallback: true, lines: fallbackLines };
    }
  }, [content]);

  // Click on chord in preview
  const handleChordClick = (chordName) => {
    if (!chordName) return;
    const chordObj = CHORDS.find(
      (c) => c.id.toLowerCase() === chordName.toLowerCase() || c.name.toLowerCase().startsWith(chordName.toLowerCase())
    );
    if (chordObj && chordObj.frequencies) {
      playAcousticChord(chordObj.frequencies);
    }
    setSelectedChordModal(chordName);
  };

  // Auto-scroll loop
  useEffect(() => {
    if (!isAutoScrolling) {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      return;
    }

    scrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += scrollSpeed;
        const isBottom =
          scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >=
          scrollContainerRef.current.scrollHeight - 5;
        if (isBottom) {
          setIsAutoScrolling(false);
        }
      }
    }, 40);

    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [isAutoScrolling, scrollSpeed]);

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '620px',
        overflow: 'hidden',
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--accent-primary)',
              background: '#ffffff',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
            }}
          >
            Live Sheet Preview
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            (Click any chord to audition acoustic sound)
          </span>
        </div>

        {/* Auto-Scroll Test */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: isAutoScrolling ? 'var(--accent-warm)' : 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {isAutoScrolling ? <Pause size={13} /> : <Play size={13} />}
            <span>{isAutoScrolling ? 'Pause Scroll' : 'Test Auto-Scroll'}</span>
          </button>

          <select
            value={scrollSpeed}
            onChange={(e) => setScrollSpeed(Number(e.target.value))}
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            <option value={1}>0.5x Slow</option>
            <option value={2}>1x Normal</option>
            <option value={4}>2x Fast</option>
          </select>
        </div>
      </div>

      {/* Scrollable Sheet Body */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          padding: '2rem',
          overflowY: 'auto',
          maxHeight: '700px',
        }}
      >
        {/* Header Block: Title, Artist, Badges */}
        <div
          style={{
            borderBottom: '2px solid var(--border-subtle)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            {title || 'Untitled Song'}
          </h2>
          <div
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginTop: '0.25rem',
            }}
          >
            {artist || 'Unknown Artist'}
          </div>

          {/* Quick Specs Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '0.85rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              Key of <strong>{songKey}</strong>
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              Tempo: <strong>{tempo} BPM</strong>
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: capo > 0 ? 'var(--accent-primary-subtle)' : 'var(--bg-subtle)',
                color: capo > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: capo > 0 ? '1px solid var(--accent-primary-border)' : '1px solid var(--border-default)',
              }}
            >
              {capo > 0 ? `Capo Fret ${capo}` : 'No Capo (Open)'}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              Meter: <strong>{timeSignature}</strong>
            </span>
          </div>

          {/* Strum Pattern Visual Bar */}
          {steps && steps.length > 0 && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary-subtle)',
                border: '1px solid var(--accent-primary-border)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                STRUM PATTERN:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {steps.map((st, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: '#ffffff',
                      border: st.accent ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.2rem 0.4rem',
                      minWidth: '24px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: st.type === 'down' ? '#4f46e5' : st.type === 'up' ? '#059669' : '#94a3b8',
                        lineHeight: 1,
                      }}
                    >
                      {st.type === 'down' ? '↓' : st.type === 'up' ? '↑' : st.type === 'bass' ? 'B' : st.type === 'hit' ? '✕' : '—'}
                    </span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-dim)' }}>
                      {st.beat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Lyrics & Floating Chords */}
        {!content.trim() ? (
          <div
            style={{
              padding: '3rem 1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
            }}
          >
            Start adding chords and lyrics in the editor to see your interactive chord sheet appear here in real time!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {parsedSong?.fallback ? (
              // Fallback Renderer
              parsedSong.lines.map((line, lIdx) => {
                if (line.isSection) {
                  return (
                    <div
                      key={`l-${lIdx}`}
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: 'var(--accent-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                    >
                      {line.title}
                    </div>
                  );
                }
                return (
                  <div key={`l-${lIdx}`} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {line.items.map((item, itemIdx) => (
                      <div
                        key={`it-${lIdx}-${itemIdx}`}
                        style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}
                      >
                        {item.chord ? (
                          <button
                            type="button"
                            onClick={() => handleChordClick(item.chord)}
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              color: 'var(--accent-primary)',
                              background: 'var(--accent-primary-subtle)',
                              border: '1px solid var(--accent-primary-border)',
                              borderRadius: 'var(--radius-xs)',
                              padding: '0.15rem 0.45rem',
                              cursor: 'pointer',
                              marginBottom: '2px',
                            }}
                          >
                            {item.chord}
                          </button>
                        ) : (
                          <div style={{ height: '22px' }} />
                        )}
                        <span style={{ fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'pre' }}>
                          {item.lyrics || ' '}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              // ChordSheetJS Renderer
              parsedSong?.lines?.map((line, lIdx) => {
                // Section Header
                const isSectionHeader =
                  line.items.length === 1 && line.items[0].lyrics?.startsWith('[');
                if (isSectionHeader) {
                  return (
                    <div
                      key={`line-${lIdx}`}
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: 'var(--accent-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border-subtle)',
                        marginTop: '0.5rem',
                      }}
                    >
                      {line.items[0].lyrics.replace(/[\[\]]/g, '')}
                    </div>
                  );
                }

                if (line.items.length === 0 || (line.items.length === 1 && !line.items[0].chord && !line.items[0].lyrics)) {
                  return <div key={`line-${lIdx}`} style={{ height: '0.75rem' }} />;
                }

                return (
                  <div
                    key={`line-${lIdx}`}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'baseline',
                      gap: '0.2rem',
                    }}
                  >
                    {line.items.map((item, itemIdx) => {
                      const chord = item.chord ? String(item.chord) : null;
                      const lyrics = item.lyrics;

                      return (
                        <div
                          key={`item-${lIdx}-${itemIdx}`}
                          style={{
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            marginRight: '0.25rem',
                          }}
                        >
                          {/* Floating Chord Pill */}
                          {chord ? (
                            <button
                              type="button"
                              onClick={() => handleChordClick(chord)}
                              title={`Click to preview ${chord} diagram and hear strum`}
                              style={{
                                fontSize: '0.76rem',
                                fontWeight: 800,
                                color: 'var(--accent-primary)',
                                background: 'var(--accent-primary-subtle)',
                                border: '1px solid var(--accent-primary-border)',
                                borderRadius: 'var(--radius-xs)',
                                padding: '0.15rem 0.45rem',
                                cursor: 'pointer',
                                marginBottom: '2px',
                                boxShadow: 'var(--shadow-xs)',
                                transition: 'all 0.12s ease',
                              }}
                            >
                              {chord}
                            </button>
                          ) : (
                            <div style={{ height: '22px' }} />
                          )}

                          {/* Corresponding Lyrics */}
                          <span
                            style={{
                              fontSize: '1rem',
                              fontFamily: 'var(--font-body)',
                              fontWeight: 500,
                              color: 'var(--text-primary)',
                              whiteSpace: 'pre',
                            }}
                          >
                            {lyrics || ' '}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal / Popover when chord clicked */}
      {selectedChordModal && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1rem',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              Chord: {selectedChordModal}
            </span>
            <button
              type="button"
              onClick={() => setSelectedChordModal(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: 'var(--text-dim)',
              }}
            >
              ✕
            </button>
          </div>
          <ChordBox chordName={selectedChordModal} size={110} />
          <button
            type="button"
            onClick={() => handleChordClick(selectedChordModal)}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
            }}
          >
            <Volume2 size={12} />
            <span>Hear Again</span>
          </button>
        </div>
      )}
    </div>
  );
}

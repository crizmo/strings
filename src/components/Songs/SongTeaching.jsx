import React, { useState, useEffect, useRef } from 'react';
import { CHORDS } from '../../data/chords';
import { STRUM_PATTERNS } from '../../data/strumPatterns';
import { playStrum } from '../../audio/acousticSynth';
import GlassCard from '../shared/GlassCard';
import ChordBox from '../Chords/ChordBox';
import {
  Play,
  Pause,
  Volume2,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Music2,
  GraduationCap
} from 'lucide-react';

export default function SongTeaching({ song, onSwitchToPlay }) {
  const [selectedChord, setSelectedChord] = useState(
    song?.chordsUsed?.[0] || 'C'
  );
  const [isPlayingStrum, setIsPlayingStrum] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [practiceTempo, setPracticeTempo] = useState(
    Math.round((song?.tempo || 90) * 0.75) // 75% speed for learning
  );

  const pattern =
    STRUM_PATTERNS.find((p) => p.id === song?.strumPattern) ||
    STRUM_PATTERNS[0];

  const timerRef = useRef(null);

  // Strum metronome animation loop
  useEffect(() => {
    if (!isPlayingStrum) {
      if (timerRef.current) clearInterval(timerRef.current);
      setActiveStepIndex(0);
      return;
    }

    const intervalMs = (60 / practiceTempo / (pattern.steps.length / 4)) * 1000;

    timerRef.current = setInterval(() => {
      setActiveStepIndex((prev) => {
        const nextIndex = (prev + 1) % pattern.steps.length;
        const currentStep = pattern.steps[nextIndex];

        if (currentStep && currentStep.type !== 'rest') {
          const chordObj = CHORDS.find(
            (c) => c.id.toLowerCase() === selectedChord.toLowerCase()
          );
          if (chordObj?.frequencies) {
            playStrum(
              chordObj.frequencies,
              currentStep.type === 'up' ? 'up' : 'down',
              practiceTempo,
              currentStep.accent ? 0.9 : 0.6
            );
          }
        }

        return nextIndex;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingStrum, practiceTempo, pattern, selectedChord]);

  const activeChordData =
    CHORDS.find(
      (c) => c.id.toLowerCase() === (selectedChord || '').toLowerCase()
    ) || CHORDS[0];

  const handleTestStrum = (chordId) => {
    const cObj = CHORDS.find(
      (c) => c.id.toLowerCase() === (chordId || '').toLowerCase()
    );
    if (cObj?.frequencies) {
      playStrum(cObj.frequencies, 'down', 80, 0.85);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Master Lesson Header */}
      <GlassCard
        variant="elevated"
        style={{
          padding: '2rem',
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
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--accent-primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.5rem',
              }}
            >
              <GraduationCap size={16} /> Song Teaching Lesson
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {song?.title}
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                marginTop: '0.35rem',
                marginBottom: 0,
              }}
            >
              By <strong style={{ color: 'var(--text-primary)' }}>{song?.artist}</strong> • {song?.genre || 'Acoustic'} • Key of {song?.key || 'C'} • {song?.capo > 0 ? `Capo ${song.capo}` : 'No Capo'}
            </p>
          </div>

          <button
            onClick={onSwitchToPlay}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.4rem',
              fontSize: '0.95rem',
              gap: '0.5rem',
            }}
          >
            <span>Play Full Song Sheet</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {song?.teachingNotes?.overview && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-subtle)',
              borderLeft: '4px solid var(--accent-primary)',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              lineHeight: 1.6,
            }}
          >
            {song.teachingNotes.overview}
          </div>
        )}
      </GlassCard>

      {/* 2. Chords & Strum Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Chord Selector & Interactive Box */}
        <GlassCard style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
              1. Chords in this Song
            </h3>
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
            >
              {song?.chordsUsed?.length || 0} chords
            </span>
          </div>

          {/* Chord Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              marginBottom: '1.25rem',
            }}
          >
            {song?.chordsUsed?.map((chord) => {
              const isSelected = selectedChord.toLowerCase() === chord.toLowerCase();
              return (
                <button
                  key={chord}
                  onClick={() => {
                    setSelectedChord(chord);
                    handleTestStrum(chord);
                  }}
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    padding: '0.45rem 0.9rem',
                  }}
                >
                  {chord}
                </button>
              );
            })}
          </div>

          {/* Active Chord Visualizer */}
          {activeChordData && (
            <div
              style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid var(--border-default)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: 'var(--accent-primary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {activeChordData.id}
                  </span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      marginLeft: '0.5rem',
                      fontWeight: 600,
                    }}
                  >
                    {activeChordData.name}
                  </span>
                </div>

                <button
                  onClick={() => handleTestStrum(activeChordData.id)}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.35rem 0.75rem',
                    gap: '0.35rem',
                  }}
                >
                  <Volume2 size={15} /> Play Tone
                </button>
              </div>

              {/* Render ChordBox */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ChordBox chord={activeChordData} onChordSelect={() => {}} />
              </div>

              {activeChordData.description && (
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    marginTop: '1rem',
                    marginBottom: 0,
                    lineHeight: 1.5,
                  }}
                >
                  💡 <strong>Fingering Tip:</strong> {activeChordData.description}
                </p>
              )}
            </div>
          )}
        </GlassCard>

        {/* Right: Strumming Rhythm Masterclass */}
        <GlassCard style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                2. Strumming Rhythm
              </h3>
              <p
                style={{
                  margin: '0.2rem 0 0 0',
                  fontSize: '0.82rem',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                }}
              >
                {pattern.name} ({pattern.timeSignature})
              </p>
            </div>

            <button
              onClick={() => setIsPlayingStrum(!isPlayingStrum)}
              className={`btn ${isPlayingStrum ? 'btn-danger' : 'btn-success'}`}
              style={{
                fontSize: '0.82rem',
                padding: '0.45rem 0.9rem',
                gap: '0.4rem',
              }}
            >
              {isPlayingStrum ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
              <span>{isPlayingStrum ? 'Stop Rhythm' : 'Practice Pattern'}</span>
            </button>
          </div>

          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: '1.25rem',
            }}
          >
            {pattern.description}
          </p>

          {/* Interactive Strum Steps */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${pattern.steps.length}, 1fr)`,
              gap: '0.35rem',
              marginBottom: '1.5rem',
            }}
          >
            {pattern.steps.map((step, idx) => {
              const isActive = isPlayingStrum && activeStepIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 0.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive
                      ? 'var(--accent-primary)'
                      : step.type === 'rest'
                      ? 'var(--bg-subtle)'
                      : '#ffffff',
                    color: isActive
                      ? '#ffffff'
                      : step.accent
                      ? 'var(--accent-warm)'
                      : 'var(--text-primary)',
                    border: isActive
                      ? '1px solid var(--accent-primary)'
                      : '1px solid var(--border-default)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: isActive ? '#ffffff' : 'var(--text-dim)',
                      marginBottom: '2px',
                    }}
                  >
                    {step.beat}
                  </span>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {step.label === 'D' ? '↓' : step.label === 'U' ? '↑' : step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Practice Speed Slider */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              border: '1px solid var(--border-default)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.4rem',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Practice Tempo: <strong style={{ color: 'var(--accent-primary)' }}>{practiceTempo} BPM</strong>
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                Original: {song?.tempo || 90} BPM
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={160}
              value={practiceTempo}
              onChange={(e) => setPracticeTempo(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
          </div>
        </GlassCard>
      </div>

      {/* 3. Pro Tips & Common Mistakes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Tips */}
        <GlassCard style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: 'var(--accent-warm)',
            }}
          >
            <Lightbulb size={20} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Pro Tips for this Song
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {song?.teachingNotes?.tips?.map((tip, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <CheckCircle2
                  size={16}
                  style={{ color: 'var(--success)', marginTop: '2px', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {tip}
                </span>
              </div>
            )) || (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Keep your thumb behind the neck and arch your fingers so every string rings cleanly.
              </p>
            )}
          </div>
        </GlassCard>

        {/* Common Mistakes */}
        <GlassCard style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: 'var(--danger)',
            }}
          >
            <AlertTriangle size={20} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Common Pitfalls to Avoid
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {song?.teachingNotes?.commonMistakes?.map((mistake, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-subtle)',
                  border: '1px solid var(--danger-border)',
                }}
              >
                <span
                  style={{
                    color: 'var(--danger)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {mistake}
                </span>
              </div>
            )) || (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Don't rush the chord change! Switch your fingers in the air before landing on the frets.
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

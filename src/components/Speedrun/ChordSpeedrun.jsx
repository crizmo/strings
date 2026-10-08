// Chord Transition Speedrun Trainer — Clean Light Theme
import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { CHORDS } from '../../data/chords';
import { playAcousticChord } from '../../audio/acousticSynth';
import PageHeader from '../shared/PageHeader';
import GlassCard from '../shared/GlassCard';

const CHALLENGE_PAIRS = [
  { id: 'em_g', name: 'Em ↔ G', chords: ['Em', 'G'], tier: 'Novice (2-Finger Anchor)', desc: 'The easiest switch to build finger confidence' },
  { id: 'c_g', name: 'C ↔ G', chords: ['C', 'G'], tier: 'The Golden Transition', desc: 'The backbone of hundreds of acoustic songs' },
  { id: 'c_d', name: 'C ↔ D', chords: ['C', 'D'], tier: 'Fingertip Accuracy', desc: 'Builds knuckle arch and eliminates fret buzz' },
  { id: 'am_f', name: 'Am ↔ Fmaj7', chords: ['Am', 'Fmaj7'], tier: 'Index Anchor Shift', desc: 'Prepares your hand for future barre chords' },
  { id: 'g_d_em_c', name: 'G ↔ D ↔ Em ↔ C', chords: ['G', 'D', 'Em', 'C'], tier: 'The 4-Chord Hit Loop', desc: 'The most famous 4 chords in music history' },
];

export default function ChordSpeedrun({ audioState }) {
  const { lastOnset } = audioState || {};

  const [selectedPair, setSelectedPair] = useState(CHALLENGE_PAIRS[1]);
  const [gameState, setGameState] = useState('idle');
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [currentPromptTime, setCurrentPromptTime] = useState(0);
  const [lastSwitchMs, setLastSwitchMs] = useState(null);
  const [personalBest, setPersonalBest] = useState(null);
  const [streak, setStreak] = useState(0);

  const prevOnsetRef = useRef(lastOnset);

  useEffect(() => {
    const saved = localStorage.getItem(`guitar_speedrun_${selectedPair.id}`);
    if (saved) {
      setPersonalBest(JSON.parse(saved));
    } else {
      setPersonalBest(null);
    }
    setLastSwitchMs(null);
    setGameState('idle');
  }, [selectedPair]);

  const activeChordName = selectedPair.chords[currentChordIndex];
  const nextChordName = selectedPair.chords[(currentChordIndex + 1) % selectedPair.chords.length];

  const handleStart = () => {
    setGameState('active');
    setCurrentChordIndex(0);
    setCurrentPromptTime(performance.now());
    setStreak(0);
  };

  const handleChordStrummed = () => {
    if (gameState !== 'active') return;

    const now = performance.now();
    const latency = Math.round(now - currentPromptTime);
    if (latency < 150) return;

    setLastSwitchMs(latency);
    setStreak((s) => s + 1);

    if (!personalBest || latency < personalBest.fastest) {
      const newPb = { fastest: latency };
      setPersonalBest(newPb);
      localStorage.setItem(`guitar_speedrun_${selectedPair.id}`, JSON.stringify(newPb));
    }

    const nextIdx = (currentChordIndex + 1) % selectedPair.chords.length;
    setCurrentChordIndex(nextIdx);
    setCurrentPromptTime(performance.now());

    const nextChordObj = CHORDS.find((c) => c.id === selectedPair.chords[nextIdx]);
    if (nextChordObj) {
      const validFreqs = nextChordObj.frequencies.filter((f) => f > 0);
      playAcousticChord(validFreqs, 20);
    }
  };

  // Spacebar hotkey
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'active' && e.code === 'Space') {
        e.preventDefault();
        handleChordStrummed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentChordIndex, currentPromptTime]);

  // Mic onset detection
  useEffect(() => {
    if (gameState === 'active' && lastOnset > prevOnsetRef.current) {
      prevOnsetRef.current = lastOnset;
      handleChordStrummed();
    }
  }, [lastOnset, gameState]);

  const getRating = (ms) => {
    if (!ms) return null;
    if (ms < 500) return { label: 'Lightning Fast ⚡', color: 'var(--accent-warm)', bg: 'var(--accent-warm-subtle)' };
    if (ms < 850) return { label: 'Fluid Switch 🔥', color: 'var(--success)', bg: 'var(--success-subtle)' };
    return { label: 'Good Practice 🎯', color: 'var(--accent-primary)', bg: 'var(--accent-primary-subtle)' };
  };

  const rating = getRating(lastSwitchMs);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <PageHeader
        badge="Muscle Memory Coach"
        badgeIcon={<Zap size={14} />}
        title="Chord Speedrun Drill"
        subtitle="Practice rapid chord switches with audio feedback. Strum into your microphone or tap the spacebar."
      />

      {/* Challenge Selection Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        {CHALLENGE_PAIRS.map((pair) => {
          const isSelected = selectedPair.id === pair.id;
          return (
            <GlassCard
              key={pair.id}
              variant="interactive"
              onClick={() => setSelectedPair(pair)}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                background: isSelected ? 'var(--accent-primary-subtle)' : '#ffffff',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                  marginBottom: '0.2rem',
                }}
              >
                {pair.name}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {pair.tier}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* 2-Column Drill Stage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Left Column: Target Chord Stage */}
        <GlassCard
          variant="elevated"
          style={{
            padding: '2.5rem 1.5rem',
            borderRadius: 'var(--radius-2xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-primary-subtle)',
              border: '1px solid var(--accent-primary-border)',
              color: 'var(--accent-primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {selectedPair.tier}
          </div>

          {/* Big Target Chord Box */}
          <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}
            >
              {gameState === 'active' ? 'Strum Right Now:' : 'Target Chord:'}
            </span>

            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: 'var(--radius-2xl)',
                background: 'var(--bg-subtle)',
                border: '2px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(4rem, 8vw, 5.5rem)',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                }}
              >
                {activeChordName}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginTop: '1.25rem',
              }}
            >
              <span>Next in sequence:</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  color: 'var(--accent-primary)',
                  background: 'var(--accent-primary-subtle)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--accent-primary-border)',
                }}
              >
                {nextChordName}
              </span>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '280px' }}>
            {gameState !== 'active' ? (
              <button
                onClick={handleStart}
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Play size={18} fill="currentColor" /> Start Speed Drill
              </button>
            ) : (
              <button
                onClick={handleChordStrummed}
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  justifyContent: 'center',
                }}
              >
                ⚡ Strummed! (or Spacebar)
              </button>
            )}

            {gameState === 'active' && (
              <button
                onClick={() => setGameState('idle')}
                className="btn btn-ghost"
                style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
              >
                End Drill
              </button>
            )}
          </div>
        </GlassCard>

        {/* Right Column: Reaction Metrics & Stats */}
        <GlassCard
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-2xl)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800 }}>
              Performance Metrics
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              Live switch speed in milliseconds.
            </p>
          </div>

          {/* Big Reaction Timer */}
          <div
            style={{
              margin: '1.5rem 0',
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-default)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.25rem',
              }}
            >
              Switch Latency
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '3rem',
                fontWeight: 900,
                color: lastSwitchMs ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              {lastSwitchMs ? `${lastSwitchMs}ms` : '—'}
            </div>

            {rating && (
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: rating.bg,
                  color: rating.color,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {rating.label}
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Streak
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  color: 'var(--accent-warm)',
                  marginTop: '0.2rem',
                }}
              >
                {streak} 🔥
              </div>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Personal Best
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  color: 'var(--success)',
                  marginTop: '0.2rem',
                }}
              >
                {personalBest?.fastest ? `${personalBest.fastest}ms` : '—'}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

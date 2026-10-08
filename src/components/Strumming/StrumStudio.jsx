// Strumming Studio & Rhythm Visualizer — Clean Light Theme
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Radio } from 'lucide-react';
import { STRUM_PATTERNS } from '../../data/strumPatterns';
import { getAudioContext } from '../../audio/audioContext';
import PageHeader from '../shared/PageHeader';
import GlassCard from '../shared/GlassCard';

export default function StrumStudio({ audioState }) {
  const { lastOnset } = audioState || {};

  const [selectedPattern, setSelectedPattern] = useState(STRUM_PATTERNS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(selectedPattern.tempoDefault);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const timerRef = useRef(null);

  const playClick = (isAccent) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(isAccent ? 1100 : 680, ctx.currentTime);
      osc.type = 'triangle';

      gain.gain.setValueAtTime(isAccent ? 0.35 : 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 60000 / bpm / 2;

    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = (prev + 1) % selectedPattern.steps.length;
        if (selectedPattern.steps[next].type !== 'rest') {
          playClick(selectedPattern.steps[next].accent);
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, selectedPattern]);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <PageHeader
        badge="Rhythm Trainer"
        badgeIcon={<Radio size={14} />}
        title="Strumming Pattern Studio"
        subtitle="Practice essential acoustic rhythms: Island strum, folk boom-chick, 3/4 waltz, and pop grooves."
      />

      {/* Pattern Selector Pills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {STRUM_PATTERNS.map((p) => {
          const isSelected = selectedPattern.id === p.id;
          return (
            <GlassCard
              key={p.id}
              variant="interactive"
              onClick={() => {
                setSelectedPattern(p);
                setBpm(p.tempoDefault);
                setCurrentStepIndex(0);
              }}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-xl)',
                border: isSelected
                  ? '1px solid var(--accent-primary)'
                  : '1px solid var(--border-default)',
                background: isSelected
                  ? 'var(--accent-primary-subtle)'
                  : '#ffffff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.4rem',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {p.name}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {p.timeSignature}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {p.tag}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Main Studio Controls & Visualizer */}
      <GlassCard
        variant="elevated"
        style={{
          padding: '2.5rem 1.5rem',
          borderRadius: 'var(--radius-2xl)',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: '#ffffff',
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
            {selectedPattern.name} ({selectedPattern.timeSignature})
          </h3>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px' }}>
            {selectedPattern.description}
          </p>
        </div>

        {/* Dynamic Beat Step Visualizer */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${selectedPattern.steps.length}, 1fr)`,
            gap: '0.5rem',
            width: '100%',
            maxWidth: '700px',
            margin: '1.5rem 0 2rem 0',
          }}
        >
          {selectedPattern.steps.map((step, idx) => {
            const isActive = isPlaying && currentStepIndex === idx;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.25rem 0.5rem',
                  borderRadius: 'var(--radius-xl)',
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
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none',
                  transition: 'all 0.1s ease',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isActive ? '#ffffff' : 'var(--text-dim)',
                    marginBottom: '6px',
                  }}
                >
                  {step.beat}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                  }}
                >
                  {step.label === 'D' ? '↓' : step.label === 'U' ? '↑' : step.label}
                </span>
                {step.accent && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      marginTop: '4px',
                      color: isActive ? '#ffffff' : 'var(--accent-warm)',
                    }}
                  >
                    ACCENT
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls: Play/Pause & Tempo */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`btn ${isPlaying ? 'btn-danger' : 'btn-primary'}`}
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              fontWeight: 700,
              gap: '0.5rem',
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            <span>{isPlaying ? 'Stop Rhythm' : 'Start Metronome'}</span>
          </button>

          {/* Tempo Slider */}
          <div
            style={{
              flex: '1 1 200px',
              background: 'var(--bg-subtle)',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <span>Tempo:</span>
              <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                {bpm} BPM
              </strong>
            </div>
            <input
              type="range"
              min={40}
              max={180}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

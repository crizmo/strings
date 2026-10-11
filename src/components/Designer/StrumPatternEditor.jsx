// Interactive Up & Down Strumming Pattern Designer & Rhythm Visualizer
// Beginner-friendly beat subdivisions with real-time audio auditioning
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Sparkles, ArrowDown, ArrowUp, RefreshCw, Zap, Info } from 'lucide-react';
import { STRUM_PATTERNS } from '../../data/strumPatterns';
import { getAudioContext } from '../../audio/audioContext';
import { playStrum } from '../../audio/acousticSynth';
import { CHORDS } from '../../data/chords';

const STEP_TYPES = [
  { id: 'down', label: 'Down', symbol: '↓', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', desc: 'Downstroke across strings' },
  { id: 'up', label: 'Up', symbol: '↑', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', desc: 'Upstroke brushing treble strings' },
  { id: 'rest', label: 'Miss', symbol: '—', color: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', desc: 'Ghost stroke (air strum)' },
  { id: 'bass', label: 'Bass', symbol: 'B', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', desc: 'Thumb root bass note pluck' },
  { id: 'hit', label: 'Hit', symbol: '✕', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', desc: 'Percussive palm mute / chuck' },
];

const PRESETS = [
  ...STRUM_PATTERNS,
  {
    id: 'driving_rock',
    name: 'Straight Driving 8ths',
    timeSignature: '4/4',
    tempoDefault: 105,
    tag: 'Classic Rock & Grunge',
    description: 'Steady downward acoustic drive with accents on the downbeats.',
    steps: [
      { beat: '1', type: 'down', accent: true, label: 'D' },
      { beat: '&', type: 'down', accent: false, label: 'D' },
      { beat: '2', type: 'down', accent: true, label: 'D' },
      { beat: '&', type: 'down', accent: false, label: 'D' },
      { beat: '3', type: 'down', accent: true, label: 'D' },
      { beat: '&', type: 'down', accent: false, label: 'D' },
      { beat: '4', type: 'down', accent: true, label: 'D' },
      { beat: '&', type: 'down', accent: false, label: 'D' },
    ],
  },
  {
    id: 'reggae_offbeat',
    name: 'Reggae / Ska Upbeat',
    timeSignature: '4/4',
    tempoDefault: 76,
    tag: 'Chill Reggae Skank',
    description: 'Air strum on the downbeat, crisp acoustic upstroke chop on the & beats.',
    steps: [
      { beat: '1', type: 'rest', accent: false, label: '-' },
      { beat: '&', type: 'up', accent: true, label: 'U' },
      { beat: '2', type: 'rest', accent: false, label: '-' },
      { beat: '&', type: 'up', accent: true, label: 'U' },
      { beat: '3', type: 'rest', accent: false, label: '-' },
      { beat: '&', type: 'up', accent: true, label: 'U' },
      { beat: '4', type: 'rest', accent: false, label: '-' },
      { beat: '&', type: 'up', accent: true, label: 'U' },
    ],
  },
];

export default function StrumPatternEditor({
  patternId = 'island',
  timeSignature = '4/4',
  tempo = 90,
  customSteps = null,
  onChangePattern,
  sampleChord = 'G',
}) {
  // Initialize steps based on preset or customSteps
  const [steps, setSteps] = useState(() => {
    if (customSteps && customSteps.length > 0) return customSteps;
    const match = PRESETS.find((p) => p.id === patternId) || PRESETS[0];
    return match.steps;
  });

  const [activePresetId, setActivePresetId] = useState(patternId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [bpm, setBpm] = useState(tempo);
  const [soundMode, setSoundMode] = useState('acoustic'); // 'acoustic' | 'metronome'

  const timerRef = useRef(null);

  // Sync when patternId changes from parent
  useEffect(() => {
    if (patternId && patternId !== 'custom') {
      const match = PRESETS.find((p) => p.id === patternId);
      if (match) {
        setSteps(match.steps);
        setActivePresetId(match.id);
      }
    }
  }, [patternId]);

  // Sync tempo from parent
  useEffect(() => {
    setBpm(tempo);
  }, [tempo]);

  // Find chord frequencies for acoustic preview
  const chordFrequencies = CHORDS.find(
    (c) => c.id.toLowerCase() === (sampleChord || 'G').toLowerCase()
  )?.frequencies || [98.0, 123.47, 146.83, 196.0, 246.94, 392.0];

  // Metronome click synthesizer
  const playClick = (type, isAccent) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      if (soundMode === 'acoustic') {
        if (type === 'down') {
          playStrum(chordFrequencies, 'down', bpm, isAccent ? 0.85 : 0.6);
        } else if (type === 'up') {
          playStrum(chordFrequencies, 'up', bpm, isAccent ? 0.8 : 0.5);
        } else if (type === 'bass') {
          // Play low string pluck
          playStrum(chordFrequencies.slice(0, 3), 'down', bpm, 0.9);
        } else if (type === 'hit') {
          // Percussive noise click
          const bufferSize = ctx.sampleRate * 0.04;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.4, ctx.currentTime);
          noise.connect(gain);
          gain.connect(ctx.destination);
          noise.start();
        }
      } else {
        // Metronome mode
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(isAccent ? 1200 : 700, ctx.currentTime);
        osc.type = 'triangle';
        gain.gain.setValueAtTime(isAccent ? 0.35 : 0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }
    } catch (e) {
      console.warn('Audio playback error in StrumPatternEditor:', e);
    }
  };

  // Rhythm playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setActiveStepIndex(-1);
      return;
    }

    const intervalMs = (60000 / bpm) / 2; // 8th note subdivisions

    timerRef.current = setInterval(() => {
      setActiveStepIndex((prev) => {
        const next = (prev + 1) % steps.length;
        const currentStep = steps[next];
        if (currentStep && currentStep.type !== 'rest') {
          playClick(currentStep.type, currentStep.accent);
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, steps, soundMode, chordFrequencies]);

  // Handle Preset Selection
  const handleSelectPreset = (preset) => {
    setActivePresetId(preset.id);
    setSteps(preset.steps);
    if (preset.tempoDefault) {
      setBpm(preset.tempoDefault);
    }
    onChangePattern?.({
      patternId: preset.id,
      steps: preset.steps,
      timeSignature: preset.timeSignature,
      tempo: preset.tempoDefault || bpm,
    });
  };

  // Cycle step type on click
  const handleCycleStep = (index) => {
    const nextSteps = [...steps];
    const current = nextSteps[index];
    const typeOrder = ['down', 'up', 'rest', 'bass', 'hit'];
    const currentIdx = typeOrder.indexOf(current.type);
    const nextType = typeOrder[(currentIdx + 1) % typeOrder.length];

    nextSteps[index] = {
      ...current,
      type: nextType,
      label: nextType === 'down' ? 'D' : nextType === 'up' ? 'U' : nextType === 'bass' ? 'Bass' : nextType === 'hit' ? 'HIT' : '-',
    };

    setSteps(nextSteps);
    setActivePresetId('custom');
    onChangePattern?.({
      patternId: 'custom',
      steps: nextSteps,
      timeSignature,
      tempo: bpm,
    });
  };

  // Toggle step accent
  const handleToggleAccent = (e, index) => {
    e.stopPropagation();
    const nextSteps = [...steps];
    nextSteps[index] = {
      ...nextSteps[index],
      accent: !nextSteps[index].accent,
    };
    setSteps(nextSteps);
    setActivePresetId('custom');
    onChangePattern?.({
      patternId: 'custom',
      steps: nextSteps,
      timeSignature,
      tempo: bpm,
    });
  };

  // Reset to default 4/4 or 3/4
  const handleResetPattern = () => {
    const defaultSteps = timeSignature === '3/4'
      ? PRESETS.find((p) => p.id === 'waltz')?.steps || []
      : PRESETS.find((p) => p.id === 'island')?.steps || [];
    setSteps(defaultSteps);
    setActivePresetId(timeSignature === '3/4' ? 'waltz' : 'island');
  };

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
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary-subtle)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={16} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              Up & Down Strumming Pattern Designer
            </h3>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                background: activePresetId === 'custom' ? 'var(--accent-warm-subtle)' : 'var(--accent-primary-subtle)',
                color: activePresetId === 'custom' ? 'var(--accent-warm)' : 'var(--accent-primary)',
              }}
            >
              {activePresetId === 'custom' ? 'Custom Pattern' : 'Preset Locked'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Click any beat box to cycle: <strong>↓ Down</strong>, <strong>↑ Up</strong>, <strong>— Miss</strong>, <strong>B Bass</strong>, <strong>✕ Hit</strong>.
          </p>
        </div>

        {/* Play & Audio Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={() => setSoundMode((m) => (m === 'acoustic' ? 'metronome' : 'acoustic'))}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-subtle)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
            title="Toggle between acoustic guitar strum preview and metronome click"
          >
            <Volume2 size={14} />
            <span>{soundMode === 'acoustic' ? `Guitar (${sampleChord})` : 'Metronome'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: isPlaying ? 'var(--danger)' : 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Stop' : 'Audition Pattern'}</span>
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-dim)',
            marginBottom: '0.4rem',
          }}
        >
          Famous Acoustic Presets:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected
                    ? '1.5px solid var(--accent-primary)'
                    : '1px solid var(--border-default)',
                  background: isSelected ? 'var(--accent-primary-subtle)' : '#ffffff',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{p.name}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-dim)',
                    background: isSelected ? '#ffffff' : 'var(--bg-subtle)',
                    padding: '0.1rem 0.35rem',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {p.timeSignature}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Rhythm Grid */}
      <div
        style={{
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
            gap: '0.5rem',
          }}
        >
          {steps.map((step, idx) => {
            const isCurrentBeat = activeStepIndex === idx;
            const stepMeta = STEP_TYPES.find((t) => t.id === step.type) || STEP_TYPES[0];
            const isDownbeat = step.beat !== '&';

            return (
              <div
                key={idx}
                onClick={() => handleCycleStep(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  position: 'relative',
                }}
              >
                {/* Beat Number Indicator */}
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: isDownbeat ? 800 : 600,
                    color: isCurrentBeat
                      ? 'var(--accent-primary)'
                      : isDownbeat
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                    marginBottom: '0.3rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {step.beat}
                </div>

                {/* Main Interactive Beat Box */}
                <div
                  style={{
                    width: '100%',
                    minHeight: '74px',
                    borderRadius: 'var(--radius-md)',
                    background: isCurrentBeat ? 'var(--accent-primary)' : stepMeta.bg,
                    border: isCurrentBeat
                      ? '2px solid var(--accent-primary)'
                      : step.accent
                      ? `2px solid ${stepMeta.color}`
                      : `1px solid ${stepMeta.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.2rem',
                    boxShadow: isCurrentBeat
                      ? '0 0 12px rgba(79, 70, 229, 0.4)'
                      : 'var(--shadow-xs)',
                    transition: 'all 0.12s ease',
                    position: 'relative',
                    transform: isCurrentBeat ? 'scale(1.04)' : 'none',
                  }}
                >
                  {/* Arrow / Symbol */}
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: isCurrentBeat ? '#ffffff' : stepMeta.color,
                      lineHeight: 1,
                    }}
                  >
                    {stepMeta.symbol}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: isCurrentBeat ? '#ffffff' : 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {step.label}
                  </div>

                  {/* Accent Badge Toggle */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleAccent(e, idx)}
                    title={step.accent ? 'Accent ON (Hard strum)' : 'Accent OFF (Normal strum)'}
                    style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      width: '18px',
                      height: '18px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: step.accent
                        ? isCurrentBeat ? '#ffffff' : 'var(--accent-warm)'
                        : 'rgba(0,0,0,0.06)',
                      color: step.accent
                        ? isCurrentBeat ? 'var(--accent-primary)' : '#ffffff'
                        : 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {step.accent ? '★' : '•'}
                  </button>
                </div>

                {/* Accent Tag below */}
                <div
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: step.accent ? 'var(--accent-warm)' : 'transparent',
                    marginTop: '0.25rem',
                  }}
                >
                  ACCENT
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Legend & Help for Beginners */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '0.85rem 1rem',
          background: 'var(--bg-page)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Stroke Legend:
          </span>
          {STEP_TYPES.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: 'var(--radius-xs)',
                  background: t.bg,
                  color: t.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  border: `1px solid ${t.border}`,
                }}
              >
                {t.symbol}
              </span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleResetPattern}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <RefreshCw size={12} />
          <span>Reset Pattern</span>
        </button>
      </div>

      {/* Beginner Strumming Tip */}
      <div
        style={{
          marginTop: '0.85rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: 1.45,
        }}
      >
        <Info size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Beginner Rhythm Tip:</strong> Keep your right strumming hand swinging smoothly like a continuous pendulum clock. Downstrokes fall on the numbered beats (<strong>1, 2, 3, 4</strong>) and upstrokes brush upward on the <strong>&quot;&amp;&quot;</strong> beats!
        </span>
      </div>
    </div>
  );
}

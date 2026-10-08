// Precision Acoustic Guitar Tuner with YIN pitch detection, string locking, and audio reference
import React from 'react';
import {
  Mic,
  MicOff,
  Music,
  Volume2,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Info,
  RotateCw,
  RotateCcw
} from 'lucide-react';
import { TUNINGS } from '../../data/tunings';
import { playAcousticChord, playAcousticPluck } from '../../audio/acousticSynth';
import PageHeader from '../shared/PageHeader';
import GlassCard from '../shared/GlassCard';
import TunerGauge from './TunerGauge';
import Headstock from './Headstock';
import SnapGuard from './SnapGuard';
import ToneSelector from '../shared/ToneSelector';

export default function Tuner({
  audioState,
  activeTuning,
  setActiveTuning,
}) {
  const {
    isMicOn,
    toggleMic,
    pitchData,
    detectedString,
    targetString,
    setTargetString,
    isSnapDanger,
    volumeLevel,
    micError,
  } = audioState;

  const note = pitchData ? pitchData.noteName : '—';
  const octave = pitchData ? pitchData.octave : '';
  const cents = pitchData ? pitchData.cents : 0;
  const inTune = pitchData ? pitchData.inTune : false;

  const getGuidance = () => {
    if (!isMicOn) {
      return {
        title: 'Microphone is Off',
        text: 'Click "Start Microphone" to listen to your guitar.',
        color: 'var(--text-muted)',
        bg: 'var(--bg-subtle)',
        border: 'var(--border-default)',
        icon: Mic,
      };
    }
    if (!pitchData) {
      return {
        title: 'Listening...',
        text: 'Pluck a single guitar string and let it ring clearly.',
        color: 'var(--text-secondary)',
        bg: 'var(--bg-subtle)',
        border: 'var(--border-default)',
        icon: Music,
      };
    }
    if (inTune) {
      return {
        title: 'Perfect Pitch! In Tune',
        text: 'String tension is optimal. Move to the next string.',
        color: 'var(--success)',
        bg: 'var(--success-subtle)',
        border: 'var(--success-border)',
        icon: CheckCircle2,
      };
    }
    if (cents < -3) {
      return {
        title: `Flat (${Math.abs(cents)}¢) — Tighten Peg`,
        text: 'Turn tuning peg clockwise to pitch up.',
        color: 'var(--accent-warm)',
        bg: 'var(--accent-warm-subtle)',
        border: 'var(--accent-warm-border)',
        icon: RotateCw,
      };
    }
    return {
      title: `Sharp (+${cents}¢) — Loosen Peg`,
      text: 'Turn tuning peg counter-clockwise to pitch down.',
      color: 'var(--danger)',
      bg: 'var(--danger-subtle)',
      border: 'var(--danger-border)',
      icon: RotateCcw,
    };
  };

  const guidance = getGuidance();
  const GuidanceIcon = guidance.icon;

  const handleStrumAll = () => {
    const freqs = [...activeTuning.strings].reverse().map((s) => s.freq);
    playAcousticChord(freqs, 38);
  };

  const handlePlaySingle = (e, str) => {
    e.stopPropagation();
    playAcousticPluck(str.freq, 2.8, 0.65);
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <PageHeader
        badge="Precision Tuner"
        badgeIcon={<ShieldCheck size={14} />}
        title="Guitar Tuner with Snap-Guard™"
        subtitle="YIN pitch detection algorithm with string locking, frequency meters, and reference acoustic tones."
      />

      {/* Top Toolbar */}
      <GlassCard
        style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <Music size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Tuning Preset:</span>
          </div>

          <select
            value={activeTuning.id}
            onChange={(e) => {
              const selected = TUNINGS.find((t) => t.id === e.target.value);
              if (selected) {
                setActiveTuning(selected);
                setTargetString(null);
              }
            }}
            className="input"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              width: 'auto',
            }}
          >
            {TUNINGS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <ToneSelector compact={true} />

          <button
            onClick={handleStrumAll}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', gap: '0.4rem', padding: '0.5rem 1rem' }}
          >
            <Volume2 size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Strum All Strings</span>
          </button>

          <button
            onClick={toggleMic}
            className={`btn ${isMicOn ? 'btn-danger' : 'btn-primary'}`}
            style={{ fontSize: '0.88rem', gap: '0.4rem', padding: '0.55rem 1.4rem' }}
          >
            {isMicOn ? <MicOff size={16} /> : <Mic size={16} />}
            <span>{isMicOn ? 'Stop Microphone' : 'Start Microphone'}</span>
          </button>
        </div>
      </GlassCard>

      {/* String Selector Ribbon (1-Click Locking) */}
      <GlassCard
        style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          background: '#ffffff',
        }}
      >
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
          Target String:
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {/* Auto Mode Button */}
          <button
            onClick={() => setTargetString(null)}
            className={`btn ${!targetString ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
            }}
          >
            🎯 Auto-Detect
          </button>

          {/* String Buttons (6 to 1) */}
          {activeTuning.strings.map((str) => {
            const isLocked = targetString?.index === str.index;
            const isDetected = !targetString && detectedString?.index === str.index;

            return (
              <button
                key={str.index}
                onClick={() => {
                  setTargetString(isLocked ? null : str);
                  playAcousticPluck(str.freq, 2.5, 0.6);
                }}
                className="btn"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  borderRadius: 'var(--radius-md)',
                  background: isLocked
                    ? 'var(--accent-primary)'
                    : isDetected
                    ? 'var(--success-subtle)'
                    : 'var(--bg-subtle)',
                  color: isLocked
                    ? '#ffffff'
                    : isDetected
                    ? 'var(--success)'
                    : 'var(--text-primary)',
                  border: isLocked
                    ? '1px solid var(--accent-primary)'
                    : isDetected
                    ? '1px solid var(--success-border)'
                    : '1px solid var(--border-default)',
                }}
              >
                #{str.index} {str.name} ({str.freq}Hz)
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Snap Guard Alert */}
      <SnapGuard isSnapDanger={isSnapDanger} detectedString={detectedString || targetString} />

      {/* 2-Column Tuner Display */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Left Column: Needle Dial & Live Guidance */}
        <GlassCard
          variant="elevated"
          style={{
            padding: '2rem 1.5rem',
            borderRadius: 'var(--radius-2xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            background: '#ffffff',
          }}
        >
          <div style={{ width: '100%' }}>
            {/* Tuner Gauge */}
            <TunerGauge
              cents={cents}
              inTune={inTune}
              pitchData={pitchData}
              detectedString={targetString || detectedString}
            />

            {/* Direction Guidance Banner */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '1rem',
                borderRadius: 'var(--radius-xl)',
                background: guidance.bg,
                border: `1px solid ${guidance.border}`,
                color: guidance.color,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <GuidanceIcon size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                  {guidance.title}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '2px' }}>
                  {guidance.text}
                </div>
              </div>
            </div>
          </div>

          {/* Volume input meter */}
          {isMicOn && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-default)',
              }}
            >
              <Mic size={14} style={{ color: 'var(--text-muted)' }} />
              <div
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-subtle)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, volumeLevel * 100)}%`,
                    background: volumeLevel > 0.6 ? 'var(--accent-warm)' : 'var(--success)',
                    transition: 'width 0.05s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Mic Level
              </span>
            </div>
          )}

          {micError && (
            <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '1rem', marginBottom: 0 }}>
              {micError}
            </p>
          )}
        </GlassCard>

        {/* Right Column: Headstock Peg Guide */}
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
          <Headstock
            activeTuning={activeTuning}
            detectedString={detectedString}
            targetString={targetString}
            onSelectString={(str) => {
              setTargetString(str);
              if (str) playAcousticPluck(str.freq, 2.5, 0.6);
            }}
            cents={cents}
          />
        </GlassCard>
      </div>
    </div>
  );
}

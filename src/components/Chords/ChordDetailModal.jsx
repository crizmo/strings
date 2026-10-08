// Interactive Chord Detail Modal with Multiple Voicings & String-by-String Pluck Previews
import React, { useState, useEffect } from 'react';
import { X, Volume2, Play, Sparkles, Layers, ArrowRight, Music2, Info } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import ChordBox from './ChordBox';
import { playStrum, playAcousticPluck, playAcousticChord } from '../../audio/acousticSynth';
import ToneSelector from '../shared/ToneSelector';

const STRING_NAMES = ['Low E (6)', 'A (5)', 'D (4)', 'G (3)', 'B (2)', 'High E (1)'];

const FINGER_LABELS = {
  1: 'Index Finger (1)',
  2: 'Middle Finger (2)',
  3: 'Ring Finger (3)',
  4: 'Pinky Finger (4)',
  T: 'Thumb (T)',
};

export default function ChordDetailModal({ chord, onClose, onSelectChord }) {
  const [selectedVoicingIndex, setSelectedVoicingIndex] = useState(0);
  const [activeStringIndex, setActiveStringIndex] = useState(null);

  // Reset voicing when chord changes
  useEffect(() => {
    setSelectedVoicingIndex(0);
    setActiveStringIndex(null);
  }, [chord]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!chord) return null;

  const voicings = chord.voicings && chord.voicings.length > 0
    ? chord.voicings
    : [
        {
          name: 'Standard Voicing',
          tag: chord.tag || 'Default Shape',
          baseFret: 1,
          frets: chord.frets,
          fingers: chord.fingers,
          notes: chord.notes,
          frequencies: chord.frequencies,
          description: chord.description,
        },
      ];

  const currentVoicing = voicings[selectedVoicingIndex] || voicings[0];
  const frets = currentVoicing.frets || chord.frets;
  const fingers = currentVoicing.fingers || chord.fingers;
  const notes = currentVoicing.notes || chord.notes;
  const frequencies = currentVoicing.frequencies || chord.frequencies;

  // Strum actions
  const handleStrum = (direction = 'down') => {
    if (frequencies?.length) {
      playStrum(frequencies, direction, 90, 0.85);
    }
  };

  const handleArpeggio = () => {
    if (frequencies?.length) {
      playAcousticChord(frequencies, 65);
    }
  };

  const handlePluckString = (strIdx) => {
    const freq = frequencies[strIdx];
    if (freq && freq > 0) {
      setActiveStringIndex(strIdx);
      playAcousticPluck(freq, 2.8, 0.8);
      setTimeout(() => setActiveStringIndex(null), 600);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          background: '#ffffff',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--accent-primary-subtle)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                border: '1px solid var(--accent-primary-border)',
              }}
            >
              {chord.id}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {chord.name}
                </h2>
                <span className="badge badge-accent" style={{ fontSize: '0.72rem' }}>
                  {chord.difficulty}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {voicings.length} {voicings.length === 1 ? 'voicing available' : 'voicings across the fretboard'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ToneSelector compact={true} />
            <button
              onClick={onClose}
              className="btn btn-secondary btn-icon"
              style={{ width: '36px', height: '36px' }}
              title="Close modal (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', maxHeight: 'calc(85vh - 90px)', overflowY: 'auto' }}>
          {/* Multiple Voicings Tab Selector */}
          {voicings.length > 1 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Layers size={14} /> Available Voicings & Shapes:
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {voicings.map((v, idx) => {
                  const isSelected = selectedVoicingIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVoicingIndex(idx)}
                      style={{
                        padding: '0.5rem 0.9rem',
                        borderRadius: 'var(--radius-lg)',
                        border: isSelected
                          ? '1.5px solid var(--accent-primary)'
                          : '1px solid var(--border-default)',
                        background: isSelected ? 'var(--accent-primary-subtle)' : 'var(--bg-subtle)',
                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <span>{v.name}</span>
                      {v.tag && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            opacity: 0.8,
                            padding: '0.1rem 0.35rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isSelected ? '#ffffff' : 'rgba(0,0,0,0.06)',
                          }}
                        >
                          {v.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Visual & Audio Player Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
              background: 'var(--bg-subtle)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-default)',
              marginBottom: '1.5rem',
            }}
          >
            {/* Left: Large Interactive Chord Box */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  background: '#ffffff',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <ChordBox
                  chord={{
                    id: chord.id,
                    frets: frets,
                    fingers: fingers,
                    baseFret: currentVoicing.baseFret || 1,
                  }}
                  size={160}
                  showName={false}
                  onStringClick={handlePluckString}
                  activeStringIndex={activeStringIndex}
                />
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.6rem',
                  fontWeight: 600,
                }}
              >
                👆 Click any string to pluck note
              </div>
            </div>

            {/* Right: Audio Strum Controls & Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {currentVoicing.name}
                </div>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                    marginTop: '0.35rem',
                    marginBottom: 0,
                  }}
                >
                  {currentVoicing.description || chord.description}
                </p>
              </div>

              {/* Strum Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleStrum('down')}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.1rem', fontSize: '0.88rem', gap: '0.4rem' }}
                >
                  <Volume2 size={16} />
                  <span>Strum Down (↓)</span>
                </button>

                <button
                  onClick={() => handleStrum('up')}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.1rem', fontSize: '0.88rem', gap: '0.4rem' }}
                >
                  <Volume2 size={16} />
                  <span>Strum Up (↑)</span>
                </button>

                <button
                  onClick={handleArpeggio}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.1rem', fontSize: '0.88rem', gap: '0.4rem' }}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Arpeggio Pick</span>
                </button>
              </div>
            </div>
          </div>

          {/* String-by-String Pluck Grid */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.6rem',
              }}
            >
              String-by-String Notes & Placement:
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {STRING_NAMES.map((strName, idx) => {
                const fretVal = frets[idx];
                const noteVal = notes[idx];
                const fingerVal = fingers[idx];
                const freqVal = frequencies[idx];
                const isMuted = fretVal === -1;
                const isOpen = fretVal === 0;
                const isActive = activeStringIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handlePluckString(idx)}
                    disabled={isMuted}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-lg)',
                      border: isActive
                        ? '1.5px solid var(--accent-warm)'
                        : '1px solid var(--border-default)',
                      background: isActive
                        ? '#fef3c7'
                        : isMuted
                        ? 'var(--bg-subtle)'
                        : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: isMuted ? 'not-allowed' : 'pointer',
                      opacity: isMuted ? 0.6 : 1,
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {strName}
                    </span>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 900,
                        fontSize: '1rem',
                        color: isMuted
                          ? 'var(--danger)'
                          : isOpen
                          ? 'var(--success)'
                          : 'var(--accent-primary)',
                        margin: '2px 0',
                      }}
                    >
                      {isMuted ? '✕ Muted' : isOpen ? 'O Open' : `Fret ${fretVal}`}
                    </span>

                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {isMuted ? '-' : noteVal}
                    </span>

                    {fingerVal && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          color: 'var(--accent-primary)',
                          fontWeight: 700,
                          marginTop: '2px',
                        }}
                      >
                        Finger {fingerVal}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Common Transitions & Pairings */}
          {chord.transitions && chord.transitions.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <ArrowRight size={14} /> Practice Transitions (Common Songs Pairings):
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {chord.transitions.map((nextChord) => (
                  <button
                    key={nextChord}
                    onClick={() => onSelectChord && onSelectChord(nextChord)}
                    className="btn btn-secondary"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      padding: '0.35rem 0.75rem',
                      gap: '0.35rem',
                    }}
                  >
                    <span>{chord.id} ➔ {nextChord}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

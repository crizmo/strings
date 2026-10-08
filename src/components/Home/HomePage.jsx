// Clean Light Dashboard — Handcrafted, modern acoustic guitar platform
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music2,
  Mic,
  Zap,
  Radio,
  BookOpen,
  ArrowRight,
  Star,
  Flame,
  Trophy,
  Clock,
  Sparkles,
  Guitar
} from 'lucide-react';
import { SONGS } from '../../data/songs';
import GlassCard from '../shared/GlassCard';
import ToneSelector from '../shared/ToneSelector';

const QUICK_ACTIONS = [
  {
    label: '40+ Famous Songs',
    desc: 'Chord sheets, auto-scroll & lessons',
    icon: Music2,
    path: '/songs',
    color: '#4f46e5',
    bg: '#eef2ff',
    border: '#c7d2fe',
  },
  {
    label: 'Precision Tuner',
    desc: 'Snap-Guard™ peg protection',
    icon: Mic,
    path: '/tuner',
    color: '#16a34a',
    bg: '#dcfce7',
    border: '#bbf7d0',
  },
  {
    label: 'Chord Encyclopedia',
    desc: 'Acoustic voicings & diagrams',
    icon: BookOpen,
    path: '/chords',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a',
  },
  {
    label: 'Speedrun Drill',
    desc: 'Fast transition reaction trainer',
    icon: Zap,
    path: '/speedrun',
    color: '#9333ea',
    bg: '#f3e8ff',
    border: '#e9d5ff',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const featuredSongs = SONGS.filter((s) =>
    ['wonderwall', 'hotel_california', 'let_it_be', 'perfect', 'riptide', 'hallelujah'].includes(s.id)
  );

  const easySongs = SONGS.filter((s) => (s.difficultyScore || 1) <= 2).slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-2xl)',
          padding: '2.5rem 2.25rem',
          position: 'relative',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-primary-subtle)',
              border: '1px solid var(--accent-primary-border)',
              color: 'var(--accent-primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '1rem',
            }}
          >
            <Guitar size={14} /> Acoustic Studio
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '0.75rem',
            }}
          >
            Learn guitar with songs you love.
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
            }}
          >
            40+ famous songs with step-by-step chord breakdowns, real-time audio tuner, and interactive rhythm practice — 100% in your browser.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/songs')}
              className="btn btn-primary"
              style={{
                padding: '0.75rem 1.4rem',
                fontSize: '0.95rem',
                gap: '0.5rem',
              }}
            >
              <Music2 size={16} />
              <span>Browse Song Library</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => navigate('/tuner')}
              className="btn btn-secondary"
              style={{
                padding: '0.75rem 1.4rem',
                fontSize: '0.95rem',
                gap: '0.5rem',
              }}
            >
              <Mic size={16} />
              <span>Tune Guitar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <GlassCard
              key={action.label}
              variant="interactive"
              onClick={() => navigate(action.path)}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  background: action.bg,
                  border: `1px solid ${action.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: action.color,
                }}
              >
                <Icon size={22} />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {action.label}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginTop: '2px',
                  }}
                >
                  {action.desc}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Guitar Tone Soundboard */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Guitar Sound & Tone Profiles
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Choose your acoustic or electric guitar voicing (plucks and chord strums use this acoustic synthesis model).
            </p>
          </div>
        </div>

        <ToneSelector compact={false} />
      </div>

      {/* Featured Songs */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={18} style={{ color: 'var(--accent-warm)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Featured Songs
            </h2>
          </div>
          <button
            onClick={() => navigate('/songs')}
            className="btn btn-ghost"
            style={{ fontSize: '0.85rem', gap: '0.25rem' }}
          >
            <span>View All ({SONGS.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {featuredSongs.map((song) => (
            <GlassCard
              key={song.id}
              variant="interactive"
              onClick={() => navigate(`/songs/${song.id}`)}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                      {song.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                      {song.artist}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      song.difficulty === 'beginner' ? 'badge-success' : 'badge-warm'
                    }`}
                  >
                    {song.difficulty}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {song.chordsUsed?.slice(0, 5).map((chord) => (
                    <span
                      key={chord}
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--accent-primary-subtle)',
                        color: 'var(--accent-primary)',
                        border: '1px solid var(--accent-primary-border)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {chord}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-default)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>{song.tempo} BPM</span>
                <span>•</span>
                <span>Key {song.key}</span>
                <span>•</span>
                <span>{song.capo > 0 ? `Capo ${song.capo}` : 'No Capo'}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Easy 2-3 Chord Starters */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Trophy size={18} style={{ color: 'var(--success)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
            Absolute Beginner Starters (2–3 Chords)
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {easySongs.map((song) => (
            <GlassCard
              key={song.id}
              variant="interactive"
              onClick={() => navigate(`/songs/${song.id}`)}
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--success-subtle)',
                  border: '1px solid var(--success-border)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}
              >
                🎸
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }} className="truncate">
                  {song.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {song.artist} • {song.chordsUsed?.join(', ')}
                </div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, GraduationCap, Heart, Clock } from 'lucide-react';
import GlassCard from '../shared/GlassCard';

export default function SongCard({ song, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();

  const difficultyStyles = {
    beginner: { badgeClass: 'badge-success' },
    intermediate: { badgeClass: 'badge-warm' },
    advanced: { badgeClass: 'badge-danger' },
  };

  const currentDiff = difficultyStyles[song.difficulty] || difficultyStyles.beginner;

  return (
    <GlassCard
      variant="interactive"
      className="song-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
        borderRadius: 'var(--radius-xl)',
        height: '100%',
        position: 'relative',
      }}
      onClick={() => navigate(`/songs/${song.id}`)}
    >
      {/* Top Header */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '0.6rem',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {song.title}
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                margin: '2px 0 0 0',
                fontWeight: 500,
              }}
            >
              {song.artist}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(song.id);
            }}
            className="btn btn-ghost btn-icon"
            style={{
              width: '32px',
              height: '32px',
              color: isFavorite ? 'var(--danger)' : 'var(--text-dim)',
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Badges Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginBottom: '0.9rem',
            alignItems: 'center',
          }}
        >
          <span className={`badge ${currentDiff.badgeClass}`} style={{ textTransform: 'capitalize' }}>
            {song.difficulty} ({song.difficultyScore || 1}/10)
          </span>

          {song.capo !== undefined && (
            <span
              style={{
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              {song.capo === 0 ? 'No Capo' : `Capo ${song.capo}`}
            </span>
          )}

          {song.tempo && (
            <span
              style={{
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Clock size={11} /> {song.tempo} BPM
            </span>
          )}
        </div>

        {/* Chords Used Pills */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginBottom: '0.35rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Chords ({song.chordsUsed?.length || 0})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {song.chordsUsed?.map((chord) => (
              <span
                key={chord}
                style={{
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-primary-subtle)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--accent-primary-border)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {chord}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-default)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => navigate(`/songs/${song.id}?tab=learn`)}
          className="btn btn-secondary"
          style={{
            fontSize: '0.82rem',
            padding: '0.5rem 0.6rem',
            justifyContent: 'center',
            gap: '0.35rem',
          }}
        >
          <GraduationCap size={15} />
          <span>Teach Me</span>
        </button>

        <button
          onClick={() => navigate(`/songs/${song.id}?tab=play`)}
          className="btn btn-primary"
          style={{
            fontSize: '0.82rem',
            padding: '0.5rem 0.6rem',
            justifyContent: 'center',
            gap: '0.35rem',
          }}
        >
          <Play size={15} fill="currentColor" />
          <span>Play Song</span>
        </button>
      </div>
    </GlassCard>
  );
}

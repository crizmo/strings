// Song Detail Page — Clean light theme
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { SONGS } from '../../data/songs';
import {
  GraduationCap,
  Music2,
  Activity,
  ArrowLeft,
  Heart
} from 'lucide-react';
import SongTeaching from './SongTeaching';
import SongPlayer from './SongPlayer';
import ChordBox from '../Chords/ChordBox';
import { CHORDS } from '../../data/chords';
import { playStrum } from '../../audio/acousticSynth';
import GlassCard from '../shared/GlassCard';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function SongDetail() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'learn';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [favorites, setFavorites] = useLocalStorage('string_favorites', []);

  // Practice Mode States
  const [practiceSpeed, setPracticeSpeed] = useState(80);
  const [isLooping, setIsLooping] = useState(false);
  const [activePracticeChordIdx, setActivePracticeChordIdx] = useState(0);

  const song = SONGS.find((s) => s.id === songId) || SONGS[0];
  const isFavorite = favorites.includes(song.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== song.id));
    } else {
      setFavorites([...favorites, song.id]);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Practice Loop Timer
  useEffect(() => {
    if (!isLooping || !song?.chordsUsed?.length) return;

    const intervalMs = (60 / practiceSpeed) * 1000 * 2;
    const timer = setInterval(() => {
      setActivePracticeChordIdx((prev) => {
        const next = (prev + 1) % song.chordsUsed.length;
        const nextChordName = song.chordsUsed[next];
        const chordObj = CHORDS.find(
          (c) => c.id.toLowerCase() === nextChordName.toLowerCase()
        );
        if (chordObj?.frequencies) {
          playStrum(chordObj.frequencies, 'down', practiceSpeed, 0.85);
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isLooping, practiceSpeed, song]);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Back Button & Top Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => navigate('/songs')}
          className="btn btn-secondary"
          style={{ gap: '0.4rem', fontSize: '0.88rem' }}
        >
          <ArrowLeft size={16} /> Back to Library
        </button>

        <button
          onClick={toggleFavorite}
          className="btn btn-secondary btn-icon"
          style={{
            width: '36px',
            height: '36px',
            color: isFavorite ? 'var(--danger)' : 'var(--text-secondary)',
          }}
          title={isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => handleTabChange('learn')}
          className={`btn ${activeTab === 'learn' ? 'btn-primary' : 'btn-ghost'}`}
          style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <GraduationCap size={18} />
          <span>Step-by-Step Lesson</span>
        </button>

        <button
          onClick={() => handleTabChange('play')}
          className={`btn ${activeTab === 'play' ? 'btn-primary' : 'btn-ghost'}`}
          style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Music2 size={18} />
          <span>Interactive Chord Sheet</span>
        </button>

        <button
          onClick={() => handleTabChange('practice')}
          className={`btn ${activeTab === 'practice' ? 'btn-primary' : 'btn-ghost'}`}
          style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Activity size={18} />
          <span>Chord Switch Loop</span>
        </button>
      </div>

      {/* Tab 1: Step-by-Step Learning */}
      {activeTab === 'learn' && (
        <SongTeaching song={song} onSwitchToPlay={() => handleTabChange('play')} />
      )}

      {/* Tab 2: Interactive ChordPro Sheet Player */}
      {activeTab === 'play' && <SongPlayer song={song} />}

      {/* Tab 3: Interactive Chord Trainer Mode */}
      {activeTab === 'practice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <GlassCard
            variant="elevated"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                  Chord Transition Loop Trainer
                </h3>
                <p
                  style={{
                    margin: '0.3rem 0 0 0',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                  }}
                >
                  Loop through every chord in "{song.title}" at your own pace with realistic acoustic sound.
                </p>
              </div>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`btn ${isLooping ? 'btn-danger' : 'btn-primary'}`}
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.95rem', gap: '0.5rem' }}
              >
                <Activity size={18} />
                <span>{isLooping ? 'Stop Loop' : 'Start Practice Loop'}</span>
              </button>
            </div>

            {/* Chords Sequence Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                padding: '1.5rem',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-default)',
                marginBottom: '2rem',
              }}
            >
              {song.chordsUsed?.map((cName, idx) => {
                const isCurrent = isLooping && activePracticeChordIdx === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.75rem 1.4rem',
                        borderRadius: 'var(--radius-lg)',
                        background: isCurrent
                          ? 'var(--accent-primary)'
                          : '#ffffff',
                        color: isCurrent ? '#ffffff' : 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: '1.3rem',
                        border: isCurrent
                          ? '1px solid var(--accent-primary)'
                          : '1px solid var(--border-default)',
                        boxShadow: isCurrent
                          ? '0 4px 12px rgba(79, 70, 229, 0.25)'
                          : 'var(--shadow-xs)',
                        transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cName}
                    </div>
                    {idx < (song.chordsUsed?.length || 0) - 1 && (
                      <span style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>→</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current Chord Display */}
            {song.chordsUsed?.[activePracticeChordIdx] && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ChordBox
                  chord={
                    CHORDS.find(
                      (c) =>
                        c.id.toLowerCase() ===
                        song.chordsUsed[activePracticeChordIdx].toLowerCase()
                    ) || CHORDS[0]
                  }
                  onChordSelect={() => {}}
                />
              </div>
            )}

            {/* Speed Control Slider */}
            <div
              style={{
                maxWidth: '480px',
                margin: '2rem auto 0 auto',
                background: 'var(--bg-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Trainer Tempo: <strong style={{ color: 'var(--accent-primary)' }}>{practiceSpeed} BPM</strong>
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={140}
                value={practiceSpeed}
                onChange={(e) => setPracticeSpeed(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

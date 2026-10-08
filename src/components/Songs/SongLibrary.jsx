// Song Library & Exploration Hub — Clean light theme
import React, { useState, useMemo } from 'react';
import { SONGS } from '../../data/songs';
import { SONG_CATEGORIES, DIFFICULTY_LEVELS } from '../../data/songCategories';
import SongCard from './SongCard';
import PageHeader from '../shared/PageHeader';
import GlassCard from '../shared/GlassCard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  Search,
  SlidersHorizontal,
  Music,
  Flame,
  Star,
  Heart,
  X,
  Filter
} from 'lucide-react';

export default function SongLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('difficultyScore');

  const [favorites, setFavorites] = useLocalStorage('string_favorites', []);

  const toggleFavorite = (songId) => {
    if (favorites.includes(songId)) {
      setFavorites(favorites.filter((id) => id !== songId));
    } else {
      setFavorites([...favorites, songId]);
    }
  };

  // Filter & Sort Logic
  const filteredSongs = useMemo(() => {
    return SONGS.filter((song) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = song.title.toLowerCase().includes(q);
        const matchesArtist = song.artist.toLowerCase().includes(q);
        const matchesGenre = song.genre?.toLowerCase().includes(q);
        const matchesChords = song.chordsUsed?.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesArtist && !matchesGenre && !matchesChords) return false;
      }

      // 2. Category
      if (selectedCategory !== 'all') {
        if (!song.categories?.includes(selectedCategory)) return false;
      }

      // 3. Difficulty
      if (selectedDifficulty !== 'all') {
        if (song.difficulty !== selectedDifficulty) return false;
      }

      // 4. Favorites only
      if (showFavoritesOnly) {
        if (!favorites.includes(song.id)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'difficultyScore') {
        return (a.difficultyScore || 1) - (b.difficultyScore || 1);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'artist') {
        return a.artist.localeCompare(b.artist);
      }
      if (sortBy === 'tempo') {
        return (a.tempo || 90) - (b.tempo || 90);
      }
      return 0;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    showFavoritesOnly,
    sortBy,
    favorites,
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setShowFavoritesOnly(false);
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Page Header */}
      <PageHeader
        badge="40+ Famous Songs"
        badgeIcon={<Music size={14} />}
        title="Song Library & Guitar Lessons"
        subtitle="Explore beginner-friendly acoustic songs with detailed chord teaching, strum guides, and interactive chord sheets."
      />

      {/* Search & Main Filter Bar */}
      <GlassCard
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search Input */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 280px',
              minWidth: '240px',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search by song name, artist, or chord (e.g. Wonderwall, G)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{
                paddingLeft: '42px',
                width: '100%',
                fontSize: '0.92rem',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Right Controls: Favorites + Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`btn ${showFavoritesOnly ? 'btn-danger' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', gap: '0.4rem', padding: '0.55rem 1rem' }}
            >
              <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
              <span>Favorites ({favorites.length})</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
              style={{
                padding: '0.55rem 1rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                width: 'auto',
              }}
            >
              <option value="difficultyScore">Sort: Easiest First</option>
              <option value="title">Sort: Song Title A-Z</option>
              <option value="artist">Sort: Artist A-Z</option>
              <option value="tempo">Sort: Slow to Fast BPM</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingTop: '1rem',
            marginTop: '1rem',
            borderTop: '1px solid var(--border-default)',
            scrollbarWidth: 'none',
          }}
        >
          {SONG_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected
                    ? 'var(--accent-primary)'
                    : 'var(--bg-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  border: isSelected
                    ? '1px solid var(--accent-primary)'
                    : '1px solid var(--border-default)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: Difficulty */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.25rem' }}>
              Difficulty:
            </span>
            {DIFFICULTY_LEVELS.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  background:
                    selectedDifficulty === diff.id
                      ? 'var(--accent-primary-subtle)'
                      : 'transparent',
                  color:
                    selectedDifficulty === diff.id
                      ? 'var(--accent-primary)'
                      : 'var(--text-secondary)',
                  border:
                    selectedDifficulty === diff.id
                      ? '1px solid var(--accent-primary-border)'
                      : '1px solid transparent',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {diff.label}
              </button>
            ))}
          </div>

          {(selectedCategory !== 'all' ||
            selectedDifficulty !== 'all' ||
            searchQuery ||
            showFavoritesOnly) && (
            <button
              onClick={clearFilters}
              className="btn btn-ghost"
              style={{
                fontSize: '0.78rem',
                color: 'var(--accent-primary)',
                padding: '0.2rem 0.5rem',
                gap: '0.25rem',
              }}
            >
              <X size={14} /> Clear filters
            </button>
          )}
        </div>
      </GlassCard>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          padding: '0 0.25rem',
        }}
      >
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredSongs.length}</strong> songs
        </span>
      </div>

      {/* Songs Grid */}
      {filteredSongs.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isFavorite={favorites.includes(song.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <GlassCard
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <Music size={42} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 800 }}>
            No songs found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            We couldn't find any songs matching your current search or filter combination.
          </p>
          <button onClick={clearFilters} className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
            Reset Filters
          </button>
        </GlassCard>
      )}
    </div>
  );
}

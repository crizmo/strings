// Local Storage Manager Modal for Song Designer
// Allows saving, naming, overwriting, directly loading, and managing custom songs in localStorage
import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  FolderOpen,
  Trash2,
  Copy,
  Check,
  Calendar,
  Music,
  ArrowRight,
  FileJson,
  Sparkles,
  Plus,
} from 'lucide-react';
import {
  getCustomSongs,
  saveCustomSong,
  deleteCustomSong,
} from '../../utils/customSongs';

export default function LocalStorageModal({
  isOpen,
  onClose,
  currentSongData,
  currentMeasures,
  currentCustomChords,
  onLoadSong,
  defaultTab = 'save', // 'save' | 'load'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [savedSongs, setSavedSongs] = useState([]);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [selectedLoadId, setSelectedLoadId] = useState(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      refreshList();
      setSongTitle(currentSongData?.title || 'Hotel California (Intro Breakdown)');
      setSongArtist(currentSongData?.artist || 'Eagles (Capo 7th Fret)');
      setSaveSuccessMsg('');
    }
  }, [isOpen, defaultTab, currentSongData]);

  const refreshList = () => {
    const list = getCustomSongs();
    setSavedSongs(list);
  };

  if (!isOpen) return null;

  // Handle Save / Overwrite existing song
  const handleSaveCurrent = (asNewCopy = false) => {
    try {
      const existingId = currentSongData?.id;
      const targetId = asNewCopy || !existingId || existingId === 'hotel_california_chunks'
        ? `custom_${Date.now()}`
        : existingId;

      const toSave = {
        ...currentSongData,
        id: targetId,
        title: songTitle.trim() || 'Untitled Song',
        artist: songArtist.trim() || 'Independent Artist',
        measures: currentMeasures,
        customChords: currentCustomChords,
        isCustom: true,
        updatedAt: new Date().toISOString(),
      };

      const saved = saveCustomSong(toSave);
      refreshList();
      setSaveSuccessMsg(
        asNewCopy
          ? `Saved as new copy: "${saved.title}" in Local Storage!`
          : `Saved "${saved.title}" to Local Storage!`
      );
      setTimeout(() => {
        setSaveSuccessMsg('');
      }, 3000);
    } catch (e) {
      console.error('Save to local storage failed:', e);
    }
  };

  // Handle Load Song
  const handleSelectAndLoad = (song) => {
    onLoadSong(song);
    onClose();
  };

  // Handle Delete Song
  const handleDelete = (songId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from Local Storage?`)) {
      deleteCustomSong(songId);
      refreshList();
    }
  };

  // Count chunks and notes in current work
  const totalMeasures = currentMeasures?.length || 0;
  const customBeatsCount = currentMeasures?.reduce((acc, m) => acc + (m.beats?.length || 8), 0) || 0;
  const strumBeatsCount = currentMeasures?.reduce(
    (acc, m) => acc + (m.beats?.filter((b) => b?.strum)?.length || 0),
    0
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--border-default)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary-subtle)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Save size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-primary)',
                }}
              >
                Local Storage Manager
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Save your custom TABs, strum patterns, and 12-beat chunks directly in your browser.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher: Save vs Load */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-default)',
            background: '#ffffff',
            padding: '0 1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('save')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'save' ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent',
              color: activeTab === 'save' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Save size={15} />
            <span>Save to Local Storage</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('load');
              refreshList();
            }}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'load' ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent',
              color: activeTab === 'load' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <FolderOpen size={15} />
            <span>Load Saved Songs ({savedSongs.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: SAVE */}
          {activeTab === 'save' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {saveSuccessMsg && (
                <div
                  style={{
                    background: 'var(--success-subtle)',
                    border: '1px solid var(--success-border)',
                    color: 'var(--success)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Check size={16} />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Current song summary card */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-default)',
                  padding: '1rem',
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  CURRENT ACTIVE SHEET TO BE SAVED:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-default)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    🎼 {totalMeasures} Chunks / Measures
                  </span>
                  <span
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-default)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    ⏱️ {customBeatsCount} Total Beats (with dynamic lengths)
                  </span>
                  <span
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-default)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                    }}
                  >
                    ⚡ {strumBeatsCount} Strum Strokes Configured
                  </span>
                  <span
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-default)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    🎸 Capo: {currentSongData?.capo || 0}
                  </span>
                  <span
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-default)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    🎵 Tempo: {currentSongData?.tempo || 74} BPM
                  </span>
                </div>
              </div>

              {/* Title & Artist Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Song Title
                  </label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="e.g. Hotel California (My 12-Beat Chunk)"
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      outline: 'none',
                      background: '#ffffff',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Artist / Note
                  </label>
                  <input
                    type="text"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                    placeholder="e.g. Eagles (Custom Tab)"
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      outline: 'none',
                      background: '#ffffff',
                    }}
                  />
                </div>
              </div>

              {/* Save Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleSaveCurrent(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Save size={16} />
                  <span>Save to Local Storage</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveCurrent(true)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: '#ffffff',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                  title="Creates a new independent copy in Local Storage"
                >
                  <Plus size={16} />
                  <span>Save as New Copy</span>
                </button>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                💡 <strong>Persistent Browser Storage:</strong> Songs saved here remain in your browser's Local Storage so you can reload them anytime without losing your custom beat lengths or strum arrows.
              </p>
            </div>
          )}

          {/* TAB 2: LOAD */}
          {activeTab === 'load' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedSongs.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px dashed var(--border-default)',
                  }}
                >
                  <FolderOpen size={36} style={{ color: 'var(--text-dim)', marginBottom: '0.75rem' }} />
                  <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                    No Saved Songs Found in Local Storage
                  </h4>
                  <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Save your current customized song using the <strong>"Save to Local Storage"</strong> tab, and it will appear right here for instant loading!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('save')}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Save Current Sheet Now
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Click <strong>"Load Directly"</strong> on any saved song below to open it in your TAB sheet:
                  </div>

                  {savedSongs.map((song) => {
                    const measureCount = song.measures?.length || 0;
                    const dateStr = song.updatedAt
                      ? new Date(song.updatedAt).toLocaleDateString() + ' ' + new Date(song.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Saved';

                    return (
                      <div
                        key={song.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-default)',
                          padding: '1rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.85rem',
                          transition: 'all 0.15s ease',
                          boxShadow: 'var(--shadow-xs)',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {song.title}
                            </span>
                            {song.capo > 0 && (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  color: 'var(--accent-primary)',
                                  background: 'var(--accent-primary-subtle)',
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: 'var(--radius-full)',
                                }}
                              >
                                Capo {song.capo}
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {song.artist || 'Acoustic Guitar'}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            <span>🎼 {measureCount} Measures</span>
                            <span>•</span>
                            <span>⏱️ {song.tempo || 74} BPM</span>
                            <span>•</span>
                            <span>📅 {dateStr}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleSelectAndLoad(song)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: 'var(--radius-md)',
                              border: 'none',
                              background: 'var(--accent-primary)',
                              color: '#ffffff',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              boxShadow: 'var(--shadow-xs)',
                            }}
                          >
                            <span>Load Directly</span>
                            <ArrowRight size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(song.id, song.title)}
                            style={{
                              padding: '0.5rem',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-default)',
                              background: '#ffffff',
                              color: 'var(--danger)',
                              cursor: 'pointer',
                            }}
                            title="Delete this song from Local Storage"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.45rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

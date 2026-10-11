// Acoustic Chord Sheet & Song Designer Studio
// Composes beginner-friendly chord sheets, up/down strumming patterns, and exports/saves as JSON
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PenTool,
  Save,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Type,
  Eye,
  Sliders,
  Check,
  Music2,
  FileJson,
  Guitar,
  HelpCircle,
  FolderOpen,
} from 'lucide-react';
import PageHeader from '../shared/PageHeader';
import GlassCard from '../shared/GlassCard';
import StrumPatternEditor from './StrumPatternEditor';
import ChordPalette from './ChordPalette';
import ChordProEditor from './ChordProEditor';
import VisualSectionEditor from './VisualSectionEditor';
import LiveSheetPreview from './LiveSheetPreview';
import JsonExportModal from './JsonExportModal';
import InteractiveTabStaff from './InteractiveTabStaff';
import ChordBuilderModal from './ChordBuilderModal';
import LocalStorageModal from './LocalStorageModal';
import { TAB_PRESETS } from '../../data/tabPresets';
import {
  SONG_TEMPLATES,
  saveCustomSong,
  getCustomSongs,
  extractChordsFromChordPro,
} from '../../utils/customSongs';
import { SONGS } from '../../data/songs';

const KEYS = ['C', 'G', 'D', 'A', 'E', 'Em', 'Am', 'Dm', 'F'];
const TIME_SIGNATURES = ['4/4', '3/4'];
const DIFFICULTIES = [
  { id: 'beginner', label: 'Beginner (1-3 Chords)', score: 1 },
  { id: 'intermediate', label: 'Intermediate', score: 3 },
  { id: 'advanced', label: 'Advanced', score: 5 },
];

export default function SongDesigner() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  // Initial template: Default to Hotel California (8 Chunks Breakdown with Capo 7th Fret)
  const defaultTabPreset = TAB_PRESETS[0];

  // State: Song Details (checks for saved working draft in localStorage first)
  const [songData, setSongData] = useState(() => {
    if (songId) {
      const all = [...getCustomSongs(), ...SONGS];
      const found = all.find((s) => s.id === songId);
      if (found) return found;
    }
    try {
      const savedDraft = localStorage.getItem('string_designer_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && parsed.measures) {
          return parsed;
        }
      }
    } catch (e) {}

    return {
      id: 'hotel_california_chunks',
      title: defaultTabPreset.title,
      artist: defaultTabPreset.artist,
      tempo: defaultTabPreset.tempo,
      capo: defaultTabPreset.capo,
      key: defaultTabPreset.key,
      timeSignature: defaultTabPreset.timeSignature,
      measures: defaultTabPreset.measures,
      content: defaultTabPreset.content,
      strumPattern: 'pop_ballad',
      difficulty: 'beginner',
      difficultyScore: 2,
    };
  });

  // Tab mode state ('tab' | 'split' | 'visual' | 'text' | 'preview')
  const [activeTab, setActiveTab] = useState('tab');
  const [measures, setMeasures] = useState(() => {
    if (songId) return defaultTabPreset.measures;
    try {
      const savedDraft = localStorage.getItem('string_designer_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && Array.isArray(parsed.measures)) {
          return parsed.measures;
        }
      }
    } catch (e) {}
    return defaultTabPreset.measures;
  });
  const [customChords, setCustomChords] = useState(songData.customChords || []);
  const [showChordBuilder, setShowChordBuilder] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showLocalStorageModal, setShowLocalStorageModal] = useState(false);
  const [localStorageModalTab, setLocalStorageModalTab] = useState('save');
  const [customSongsList, setCustomSongsList] = useState(() => getCustomSongs());
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);
  const [statusToast, setStatusToast] = useState(null);
  const [selectedChordForInsert, setSelectedChordForInsert] = useState('G');

  // Auto-save active draft to localStorage so user changes (beats, strums) are continuously remembered
  useEffect(() => {
    try {
      const draft = {
        ...songData,
        measures,
        customChords,
      };
      localStorage.setItem('string_designer_draft', JSON.stringify(draft));
    } catch (e) {
      console.warn('Draft auto-save failed:', e);
    }
  }, [songData, measures, customChords]);

  // Load song if URL songId changes
  useEffect(() => {
    if (songId) {
      const all = [...getCustomSongs(), ...SONGS];
      const match = all.find((s) => s.id === songId);
      if (match) {
        setSongData(match);
      }
    }
  }, [songId]);

  // Derived chords used
  const detectedChords = useMemo(() => {
    return extractChordsFromChordPro(songData.content);
  }, [songData.content]);

  // Handle metadata field changes
  const updateField = (field, value) => {
    setSongData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle teaching notes changes
  const updateTeachingNote = (field, value) => {
    setSongData((prev) => ({
      ...prev,
      teachingNotes: {
        ...prev.teachingNotes,
        [field]: value,
      },
    }));
  };

  // Handle insert chord from palette
  const handleInsertChordFromPalette = (chordName) => {
    setSelectedChordForInsert(chordName);

    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = songData.content || '';

      const snippet = `[${chordName}]`;
      const updated = current.substring(0, start) + snippet + current.substring(end);
      updateField('content', updated);

      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
      }, 10);
    } else {
      updateField('content', (songData.content || '') + ` [${chordName}]`);
    }
  };

  // Handle insert full progression
  const handleInsertProgression = (progression) => {
    const progText = progression.map((c) => `[${c}]`).join('  ');
    const snippet = `\n\n[Progression]\n${progText}\n`;
    updateField('content', (songData.content || '') + snippet);
  };

  // Handle Strum Pattern Change
  const handleChangeStrumPattern = ({ patternId, steps, timeSignature, tempo }) => {
    setSongData((prev) => ({
      ...prev,
      strumPattern: patternId,
      customStrumSteps: steps,
      timeSignature: timeSignature || prev.timeSignature,
      tempo: tempo || prev.tempo,
    }));
  };

  // Load custom song directly from localStorage
  const handleLoadCustomSong = (customSong) => {
    setSongData((prev) => ({
      ...prev,
      id: customSong.id,
      title: customSong.title,
      artist: customSong.artist,
      tempo: customSong.tempo || 74,
      capo: customSong.capo || 0,
      key: customSong.key || 'Em',
      timeSignature: customSong.timeSignature || '4/4',
      measures: customSong.measures || defaultTabPreset.measures,
      content: customSong.content || defaultTabPreset.content,
      customChords: customSong.customChords || [],
    }));
    if (customSong.measures && Array.isArray(customSong.measures)) {
      setMeasures(customSong.measures);
    }
    if (customSong.customChords) {
      setCustomChords(customSong.customChords);
    }
    setActiveTab('tab');
    setStatusToast(`Loaded "${customSong.title}" from Local Storage!`);
    setTimeout(() => setStatusToast(null), 3500);
  };

  // Reset to original default Hotel California preset
  const handleResetToDefaultPreset = () => {
    handleLoadTabPreset(defaultTabPreset);
    try {
      localStorage.removeItem('string_designer_draft');
    } catch (e) {}
    setStatusToast('Reset to original Hotel California Intro breakdown.');
    setTimeout(() => setStatusToast(null), 3000);
  };

  // Load a starter template
  const handleLoadTemplate = (template) => {
    setSongData({
      ...template,
      id: `song_${Date.now()}`,
    });
  };

  // Load a TAB preset
  const handleLoadTabPreset = (preset) => {
    setSongData((prev) => ({
      ...prev,
      title: preset.title,
      artist: preset.artist,
      tempo: preset.tempo,
      capo: preset.capo,
      key: preset.key,
      timeSignature: preset.timeSignature,
      measures: preset.measures,
    }));
    setMeasures(preset.measures);
    setActiveTab('tab');
  };

  // Save to LocalStorage Library
  const handleSaveToLibrary = () => {
    const saved = saveCustomSong({
      ...songData,
      measures,
      customChords,
      chordsUsed: detectedChords,
    });
    setSongData(saved);
    setCustomSongsList(getCustomSongs());
    setSaveSuccessNotification(true);
    setStatusToast(`Saved "${saved.title}" in Local Storage! Directly loadable anytime.`);
    setTimeout(() => {
      setSaveSuccessNotification(false);
      setStatusToast(null);
    }, 3500);
  };

  // Save custom chord from ChordBuilderModal
  const handleSaveCustomChord = (newChord) => {
    setCustomChords((prev) => {
      const filtered = prev.filter((c) => c.id !== newChord.id);
      return [newChord, ...filtered];
    });
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Page Header */}
      <PageHeader
        badge="Song Creator &amp; Studio"
        badgeIcon={<PenTool size={14} />}
        title="Chord Sheet &amp; Song Designer"
        subtitle="Write acoustic chord sheets, design custom up/down strumming rhythms, audition audio tones, and save directly in Local Storage."
        actions={
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem' }}>
            {/* Presets & Saved Songs Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Presets:
              </span>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith('custom_')) {
                    const id = val.replace('custom_', '');
                    const cs = customSongsList.find((s) => s.id === id);
                    if (cs) handleLoadCustomSong(cs);
                  } else if (val.startsWith('tab_')) {
                    const id = val.replace('tab_', '');
                    const tp = TAB_PRESETS.find((p) => p.id === id);
                    if (tp) handleLoadTabPreset(tp);
                  } else if (val.startsWith('tmpl_')) {
                    const id = val.replace('tmpl_', '');
                    const tmpl = SONG_TEMPLATES.find((t) => t.id === id);
                    if (tmpl) handleLoadTemplate(tmpl);
                  }
                  e.target.value = '';
                }}
                defaultValue=""
                style={{
                  padding: '0.48rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  maxWidth: '220px',
                }}
              >
                <option value="" disabled>Load Song / Preset...</option>
                {customSongsList.length > 0 && (
                  <optgroup label={`💾 My Saved Songs in Local Storage (${customSongsList.length})`}>
                    {customSongsList.map((cs) => (
                      <option key={cs.id} value={`custom_${cs.id}`}>
                        {cs.title} {cs.updatedAt ? `(${new Date(cs.updatedAt).toLocaleDateString()})` : ''}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="🎸 Interactive TAB Presets (Capo 7 Chunks)">
                  {TAB_PRESETS.map((tp) => (
                    <option key={tp.id} value={`tab_${tp.id}`}>
                      {tp.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📜 ChordPro Lyric Templates">
                  {SONG_TEMPLATES.map((t) => (
                    <option key={t.id} value={`tmpl_${t.id}`}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Save to Local Storage Button */}
            <button
              type="button"
              onClick={() => {
                setLocalStorageModalTab('save');
                setShowLocalStorageModal(true);
              }}
              style={{
                padding: '0.5rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--success-border)',
                background: saveSuccessNotification ? 'var(--success)' : 'var(--success-subtle)',
                color: saveSuccessNotification ? '#ffffff' : 'var(--success)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all 0.15s ease',
              }}
              title="Save current TAB measures, custom beats, and strum patterns to Local Storage"
            >
              {saveSuccessNotification ? <Check size={15} /> : <Save size={15} />}
              <span>Save to Local Storage</span>
            </button>

            {/* Load from Local Storage Button */}
            <button
              type="button"
              onClick={() => {
                setLocalStorageModalTab('load');
                setShowLocalStorageModal(true);
              }}
              style={{
                padding: '0.5rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: '#ffffff',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: 'var(--shadow-xs)',
              }}
              title="View and directly load songs saved in Local Storage"
            >
              <FolderOpen size={15} style={{ color: 'var(--accent-primary)' }} />
              <span>Load from Local Storage {customSongsList.length > 0 ? `(${customSongsList.length})` : ''}</span>
            </button>

            {/* Export JSON Button */}
            <button
              type="button"
              onClick={() => setShowJsonModal(true)}
              style={{
                padding: '0.5rem 0.95rem',
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
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <FileJson size={15} />
              <span>Export JSON</span>
            </button>
          </div>
        }
      />

      {/* Active Status / Toast Notification Banner */}
      {statusToast && (
        <div
          style={{
            background: 'var(--success-subtle)',
            border: '1px solid var(--success-border)',
            color: 'var(--success)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-xs)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={16} />
            <span>{statusToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--success)',
              fontWeight: 800,
              fontSize: '0.8rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Form Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* 1. Song Metadata Configuration Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-default)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.75rem',
            }}
          >
            <Sliders size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              Song Details &amp; Acoustic Configuration
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Title */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.3rem',
                }}
              >
                Song Title
              </label>
              <input
                type="text"
                value={songData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Campfire Anthem"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: 'var(--bg-subtle)',
                }}
              />
            </div>

            {/* Artist */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.3rem',
                }}
              >
                Artist / Composer
              </label>
              <input
                type="text"
                value={songData.artist || ''}
                onChange={(e) => updateField('artist', e.target.value)}
                placeholder="e.g. My Name / Ed Sheeran"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: 'var(--bg-subtle)',
                }}
              />
            </div>

            {/* Key */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.3rem',
                }}
              >
                Musical Key
              </label>
              <select
                value={songData.key || 'G'}
                onChange={(e) => updateField('key', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                }}
              >
                {KEYS.map((k) => (
                  <option key={k} value={k}>
                    Key of {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Capo */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.3rem',
                }}
              >
                Capo Fret
              </label>
              <select
                value={songData.capo || 0}
                onChange={(e) => updateField('capo', Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                }}
              >
                <option value={0}>No Capo (Open Strings)</option>
                {[1, 2, 3, 4, 5, 6, 7].map((f) => (
                  <option key={f} value={f}>
                    Capo Fret {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Tempo (BPM) */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.3rem',
                }}
              >
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Tempo (Speed)
                </label>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {songData.tempo || 90} BPM
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                value={songData.tempo || 90}
                onChange={(e) => updateField('tempo', Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Time Signature */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.3rem',
                }}
              >
                Time Signature (Meter)
              </label>
              <select
                value={songData.timeSignature || '4/4'}
                onChange={(e) => updateField('timeSignature', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                }}
              >
                {TIME_SIGNATURES.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts} {ts === '3/4' ? '(Waltz)' : '(Standard)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.3rem',
                }}
              >
                Difficulty Level
              </label>
              <select
                value={songData.difficulty || 'beginner'}
                onChange={(e) => {
                  const d = DIFFICULTIES.find((x) => x.id === e.target.value);
                  updateField('difficulty', e.target.value);
                  if (d) updateField('difficultyScore', d.score);
                }}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                }}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Interactive Up & Down Strumming Pattern Studio */}
        <StrumPatternEditor
          patternId={songData.strumPattern}
          timeSignature={songData.timeSignature}
          tempo={songData.tempo}
          customSteps={songData.customStrumSteps}
          onChangePattern={handleChangeStrumPattern}
          sampleChord={detectedChords[0] || 'Em'}
        />

        {/* 3. Editor Mode Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              background: '#ffffff',
              padding: '0.3rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-xs)',
              gap: '0.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('tab')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeTab === 'tab' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'tab' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Guitar size={15} />
              <span>🎸 Interactive TAB Staff (Screenshot Mode)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('split')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeTab === 'split' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'split' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Eye size={14} />
              <span>Split Studio (Lyrics + Preview)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeTab === 'visual' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'visual' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Layers size={14} />
              <span>Visual Arranger (Blocks)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('text')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeTab === 'text' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'text' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Type size={14} />
              <span>ChordPro Text Editor</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeTab === 'preview' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'preview' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Eye size={14} />
              <span>Full Sheet Preview</span>
            </button>
          </div>

          {/* Chords in Song Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Chords in Song ({detectedChords.length}):
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {detectedChords.map((c) => (
                <span
                  key={c}
                  style={{
                    background: 'var(--accent-primary-subtle)',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--accent-primary-border)',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-xs)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Main Workspace Layout */}
        {activeTab === 'tab' && (
          <InteractiveTabStaff
            measures={measures}
            onChangeMeasures={setMeasures}
            capo={songData.capo}
            tempo={songData.tempo}
            onOpenChordBuilder={() => setShowChordBuilder(true)}
            customChords={customChords}
          />
        )}
        {activeTab === 'split' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
              gap: '1.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left: Text Editor */}
            <ChordProEditor
              content={songData.content || ''}
              onChangeContent={(val) => updateField('content', val)}
              textareaRef={textareaRef}
            />

            {/* Right: Live Interactive Sheet Preview */}
            <LiveSheetPreview
              content={songData.content || ''}
              title={songData.title}
              artist={songData.artist}
              songKey={songData.key}
              tempo={songData.tempo}
              capo={songData.capo}
              timeSignature={songData.timeSignature}
              strumPattern={songData.strumPattern}
              customStrumSteps={songData.customStrumSteps}
            />
          </div>
        )}

        {activeTab === 'visual' && (
          <VisualSectionEditor
            content={songData.content || ''}
            onChangeContent={(val) => updateField('content', val)}
            selectedChord={selectedChordForInsert}
          />
        )}

        {activeTab === 'text' && (
          <ChordProEditor
            content={songData.content || ''}
            onChangeContent={(val) => updateField('content', val)}
            textareaRef={textareaRef}
          />
        )}

        {activeTab === 'preview' && (
          <LiveSheetPreview
            content={songData.content || ''}
            title={songData.title}
            artist={songData.artist}
            songKey={songData.key}
            tempo={songData.tempo}
            capo={songData.capo}
            timeSignature={songData.timeSignature}
            strumPattern={songData.strumPattern}
            customStrumSteps={songData.customStrumSteps}
          />
        )}
      </div>

      {/* JSON Export & Import Modal */}
      <JsonExportModal
        song={{
          ...songData,
          measures,
          customChords,
          chordsUsed: detectedChords,
        }}
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
        onSaveToLibrary={handleSaveToLibrary}
        onImportSong={(imported) => {
          setSongData(imported);
          if (imported.measures) {
            setMeasures(imported.measures);
            setActiveTab('tab');
          }
          if (imported.customChords) {
            setCustomChords(imported.customChords);
          }
        }}
      />

      {/* Custom Chord Builder Modal */}
      <ChordBuilderModal
        isOpen={showChordBuilder}
        onClose={() => setShowChordBuilder(false)}
        onSaveChord={handleSaveCustomChord}
      />

      {/* Local Storage Manager Modal */}
      <LocalStorageModal
        isOpen={showLocalStorageModal}
        onClose={() => {
          setShowLocalStorageModal(false);
          setCustomSongsList(getCustomSongs());
        }}
        defaultTab={localStorageModalTab}
        currentSongData={songData}
        currentMeasures={measures}
        currentCustomChords={customChords}
        onLoadSong={(loadedSong) => {
          handleLoadCustomSong(loadedSong);
          setCustomSongsList(getCustomSongs());
        }}
      />
    </div>
  );
}

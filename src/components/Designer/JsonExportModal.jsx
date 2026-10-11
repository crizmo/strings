// JSON Export, Download & Import Modal for Song Designer
// Formatted matching exact app SONGS structure with beginner field explanations
import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Upload,
  FileJson,
  Sparkles,
  Save,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { formatSongAsJson } from '../../utils/customSongs';

export default function JsonExportModal({
  song,
  isOpen,
  onClose,
  onSaveToLibrary,
  onImportSong,
  defaultTab = 'export',
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const jsonString = formatSongAsJson(song);

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  // Download .json file
  const handleDownload = () => {
    try {
      const filename = `${(song.title || 'song').toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json`;
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('File download failed:', e);
    }
  };

  // Handle Save to LocalStorage Library
  const handleSave = () => {
    onSaveToLibrary?.();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Handle Import JSON
  const handleImportSubmit = () => {
    setImportError('');
    if (!importJsonText.trim()) {
      setImportError('Please paste song JSON data first.');
      return;
    }

    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed.title && !parsed.content) {
        setImportError('JSON must include at least a "title" or "content" field.');
        return;
      }
      onImportSong?.(parsed);
      onClose();
    } catch (e) {
      setImportError('Invalid JSON format. Check syntax and commas.');
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportJsonText(event.target?.result || '');
    };
    reader.readAsText(file);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-2xl)',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileJson size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                Song JSON Studio
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Export, download, save to library, or import song sheets
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: '#ffffff',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'export' ? '1px solid var(--accent-primary-border)' : '1px solid transparent',
              background: activeTab === 'export' ? 'var(--accent-primary-subtle)' : 'transparent',
              color: activeTab === 'export' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'export' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Download size={14} />
            <span>Export &amp; Download</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'import' ? '1px solid var(--accent-primary-border)' : '1px solid transparent',
              background: activeTab === 'import' ? 'var(--accent-primary-subtle)' : 'transparent',
              color: activeTab === 'import' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'import' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Upload size={14} />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'guide' ? '1px solid var(--accent-primary-border)' : '1px solid transparent',
              background: activeTab === 'guide' ? 'var(--accent-primary-subtle)' : 'transparent',
              color: activeTab === 'guide' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'guide' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <HelpCircle size={14} />
            <span>Beginner JSON Guide</span>
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {activeTab === 'export' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: copied ? 'var(--success-subtle)' : '#ffffff',
                    color: copied ? 'var(--success)' : 'var(--text-primary)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Form JSON'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    padding: '0.55rem 1rem',
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
                  <Download size={15} />
                  <span>Download .json File</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--success-border)',
                    background: savedSuccess ? 'var(--success)' : 'var(--success-subtle)',
                    color: savedSuccess ? '#ffffff' : 'var(--success)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Save size={15} />
                  <span>{savedSuccess ? 'Saved in My Songs!' : 'Save to My Songs Library'}</span>
                </button>
              </div>

              {/* JSON Code Box */}
              <pre
                style={{
                  background: '#0f172a',
                  color: '#e2e8f0',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  maxHeight: '380px',
                  border: '1px solid #334155',
                }}
              >
                <code>{jsonString}</code>
              </pre>
            </div>
          )}

          {activeTab === 'import' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Upload a .json song file or paste JSON code:
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.75rem',
                  }}
                />
              </div>

              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste song JSON here..."
                style={{
                  width: '100%',
                  height: '240px',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-subtle)',
                  outline: 'none',
                }}
              />

              {importError && (
                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--danger-subtle)',
                    color: 'var(--danger)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {importError}
                </div>
              )}

              <div>
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Upload size={16} />
                  <span>Load Into Song Designer</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Beginner Guide to Strings JSON Format
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Every song in Strings Studio uses a standardized JSON object. This allows songs to seamlessly load into the interactive song player, auto-scroller, speedrun mode, and practice trainer.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {[
                  { field: 'title & artist', desc: 'Song name and creator credited on the sheet.' },
                  { field: 'tempo', desc: 'BPM speed for the auto-scroller and rhythm metronome.' },
                  { field: 'key', desc: 'Root musical key (e.g. G, C, Em) for transposition.' },
                  { field: 'capo', desc: 'Fret number (0-7) to clamp the physical capo.' },
                  { field: 'timeSignature', desc: 'Meter subdivision, like 4/4 or 3/4 waltz.' },
                  { field: 'strumPattern', desc: 'Acoustic rhythm preset (island, folk_country, waltz).' },
                  { field: 'customStrumSteps', desc: 'Array of custom Up/Down rhythm subdivisions.' },
                  { field: 'chordsUsed', desc: 'Array of chords (e.g. ["G", "C", "D"]) to display in the chord popover.' },
                  { field: 'teachingNotes', desc: 'Beginner tips and common mistakes to help players learn.' },
                  { field: 'content', desc: 'The lyrics and chords written in ChordPro bracket format.' },
                ].map((item) => (
                  <div
                    key={item.field}
                    style={{
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.8rem' }}>
                      {item.field}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ChordPro Text Mode Editor with syntax helper and quick insertion buttons
import React, { useRef } from 'react';
import { Type, Sparkles, BookOpen, HelpCircle } from 'lucide-react';

const COMMON_TAGS = [
  { label: '[Verse 1]', insert: '\n[Verse 1]\n' },
  { label: '[Chorus]', insert: '\n[Chorus]\n' },
  { label: '[Verse 2]', insert: '\n[Verse 2]\n' },
  { label: '[Bridge]', insert: '\n[Bridge]\n' },
  { label: '[Intro]', insert: '\n[Intro]\n' },
  { label: '[Outro]', insert: '\n[Outro]\n' },
];

export default function ChordProEditor({
  content,
  onChangeContent,
  textareaRef,
}) {
  const localRef = useRef(null);
  const activeRef = textareaRef || localRef;

  const insertSnippet = (snippet) => {
    if (!activeRef.current) {
      onChangeContent(content + snippet);
      return;
    }

    const textarea = activeRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;

    const updated = current.substring(0, start) + snippet + current.substring(end);
    onChangeContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    }, 10);
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-default)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      {/* Editor Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.6rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Type size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ChordPro Lyrics &amp; Chords Editor
          </span>
        </div>

        {/* Quick Section Snippets */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {COMMON_TAGS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => insertSnippet(t.insert)}
              style={{
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <textarea
        ref={activeRef}
        value={content}
        onChange={(e) => onChangeContent(e.target.value)}
        placeholder={`Write or paste chords & lyrics here in ChordPro format!\n\nExample:\n[Verse 1]\n[G]Amazing [D]grace, how [Em]sweet the [C]sound\nThat [G]saved a [D]wretch like [G]me...`}
        style={{
          width: '100%',
          minHeight: '400px',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          background: '#fafbfc',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-primary)',
          outline: 'none',
          resize: 'vertical',
        }}
      />

      {/* Beginner Format Explainer */}
      <div
        style={{
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
        }}
      >
        <HelpCircle size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>How ChordPro Works:</strong> Place chord names inside brackets right before or above the word where you switch chords:
          <span
            style={{
              display: 'inline-block',
              background: '#ffffff',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              border: '1px solid var(--border-default)',
              fontFamily: 'var(--font-mono)',
              margin: '0 0.3rem',
              color: 'var(--text-primary)',
            }}
          >
            [G]Amazing [D]grace
          </span>
          Strings Studio will automatically align the chord box directly above that syllable!
        </div>
      </div>
    </div>
  );
}

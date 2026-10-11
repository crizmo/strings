// Beginner-friendly Visual Section Block Arranger
// Parses and updates ChordPro content as interactive section blocks and lines
import React, { useMemo } from 'react';
import { Plus, Trash2, Layers, Music, ChevronRight } from 'lucide-react';

const COMMON_CHORDS_QUICK = ['G', 'C', 'D', 'Em', 'Am', 'Fmaj7', 'A', 'E'];

export default function VisualSectionEditor({
  content = '',
  onChangeContent,
  selectedChord = 'G',
}) {
  // Parse content into structured sections
  const sections = useMemo(() => {
    const rawLines = content.split('\n');
    const parsedSections = [];
    let currentSection = {
      title: 'Intro',
      lines: [],
    };

    rawLines.forEach((raw) => {
      const trimmed = raw.trim();
      if (!trimmed || (trimmed.startsWith('{') && trimmed.endsWith('}'))) return;

      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const title = trimmed.slice(1, -1);
        // Only if it's a section title like Verse, Chorus, Intro, Bridge, etc.
        const isCommonSection = /^(verse|chorus|bridge|intro|outro|solo|pre-chorus)/i.test(title);
        if (isCommonSection) {
          if (currentSection.lines.length > 0 || currentSection.title !== 'Intro') {
            parsedSections.push(currentSection);
          }
          currentSection = {
            title,
            lines: [],
          };
          return;
        }
      }

      currentSection.lines.push(raw);
    });

    if (currentSection.lines.length > 0 || parsedSections.length === 0) {
      parsedSections.push(currentSection);
    }

    return parsedSections;
  }, [content]);

  // Reconstruct ChordPro string from sections
  const updateSections = (newSections) => {
    // Preserve header metadata tags if present
    const rawLines = content.split('\n');
    const metaTags = rawLines.filter((l) => l.trim().startsWith('{') && l.trim().endsWith('}'));

    const sectionStrings = newSections.map((sec) => {
      const header = `[${sec.title}]`;
      const body = sec.lines.join('\n');
      return `${header}\n${body}`;
    });

    const fullContent = [...metaTags, '', ...sectionStrings].join('\n').trim();
    onChangeContent(fullContent);
  };

  // Add line to section
  const handleAddLine = (secIndex) => {
    const next = [...sections];
    next[secIndex].lines.push(`[${selectedChord || 'G'}] Write lyrics here...`);
    updateSections(next);
  };

  // Delete line from section
  const handleDeleteLine = (secIndex, lineIndex) => {
    const next = [...sections];
    next[secIndex].lines.splice(lineIndex, 1);
    updateSections(next);
  };

  // Edit line text
  const handleLineChange = (secIndex, lineIndex, newText) => {
    const next = [...sections];
    next[secIndex].lines[lineIndex] = newText;
    updateSections(next);
  };

  // Insert chord into specific line at cursor or append
  const handleInsertChordToLine = (secIndex, lineIndex, chordName) => {
    const next = [...sections];
    const current = next[secIndex].lines[lineIndex];
    next[secIndex].lines[lineIndex] = `[${chordName}] ${current}`;
    updateSections(next);
  };

  // Add new section
  const handleAddSection = (title) => {
    const next = [
      ...sections,
      {
        title,
        lines: [
          `[G]New line for ${title}...`,
          `[D]Second line with chord...`,
        ],
      },
    ];
    updateSections(next);
  };

  // Delete entire section
  const handleDeleteSection = (secIndex) => {
    if (sections.length <= 1) return;
    const next = [...sections];
    next.splice(secIndex, 1);
    updateSections(next);
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-default)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-primary-subtle)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={16} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              Visual Song Arranger (Blocks Mode)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Organize your song by sections. Add chords and lines with 1 click!
            </p>
          </div>
        </div>

        {/* Add Section Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => handleAddSection('Verse ' + (sections.length + 1))}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-subtle)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            + Verse
          </button>
          <button
            type="button"
            onClick={() => handleAddSection('Chorus')}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-primary-border)',
              background: 'var(--accent-primary-subtle)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: 'var(--accent-primary)',
            }}
          >
            + Chorus
          </button>
          <button
            type="button"
            onClick={() => handleAddSection('Bridge')}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-subtle)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            + Bridge
          </button>
          <button
            type="button"
            onClick={() => handleAddSection('Outro')}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-subtle)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            + Outro
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {sections.map((sec, secIdx) => (
          <div
            key={secIdx}
            style={{
              background: 'var(--bg-page)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              padding: '1.25rem',
            }}
          >
            {/* Section Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.6rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: 'var(--accent-primary)',
                    background: 'var(--accent-primary-subtle)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--accent-primary-border)',
                  }}
                >
                  [{sec.title}]
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {sec.lines.length} lines
                </span>
              </div>

              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteSection(secIdx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                  title="Delete section"
                >
                  <Trash2 size={13} />
                  <span>Remove Section</span>
                </button>
              )}
            </div>

            {/* Lines List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sec.lines.map((line, lineIdx) => (
                <div
                  key={lineIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-dim)',
                      width: '20px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {lineIdx + 1}
                  </span>

                  <input
                    type="text"
                    value={line}
                    onChange={(e) => handleLineChange(secIdx, lineIdx, e.target.value)}
                    placeholder="[Chord] Type lyrics here..."
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      background: '#ffffff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />

                  {/* Quick Add Chord Chip */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {['G', 'C', 'D', 'Em'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleInsertChordToLine(secIdx, lineIdx, c)}
                        style={{
                          padding: '0.25rem 0.45rem',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--border-default)',
                          background: 'var(--bg-subtle)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--accent-primary)',
                          cursor: 'pointer',
                        }}
                        title={`Add [${c}] to this line`}
                      >
                        +{c}
                      </button>
                    ))}
                  </div>

                  {/* Remove line */}
                  <button
                    type="button"
                    onClick={() => handleDeleteLine(secIdx, lineIdx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '0.2rem',
                    }}
                    title="Delete line"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Line Button */}
            <div style={{ marginTop: '0.85rem' }}>
              <button
                type="button"
                onClick={() => handleAddLine(secIdx)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-strong)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Plus size={13} />
                <span>Add Line to {sec.title}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

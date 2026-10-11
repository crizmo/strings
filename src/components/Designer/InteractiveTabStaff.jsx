// Interactive Guitar Tablature Staff & Measure Arranger
// Supports dynamic beat counts per chunk (e.g. 8, 10, 12, 16 beats) and interactive strum patterns (↓, ↑, ✕, —)
import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Plus,
  Minus,
  Trash2,
  Copy,
  Volume2,
  Sparkles,
  Zap,
  Music,
  ChevronDown,
  RotateCcw,
  ArrowDown,
  ArrowUp,
  X,
  Check,
} from 'lucide-react';
import {
  playTabNote,
  playTabStrum,
  playPercussiveHit,
  TAB_STRING_NAMES,
} from '../../utils/tabAudio';
import { CHORDS } from '../../data/chords';
import ChordFingerPopover, {
  getChordFingerShorthand,
  getChordFingersForTab,
  getChordFretsForTab,
} from './ChordFingerPopover';

/**
 * Helper to get all notes on a beat as an array of { string, fret }
 * Supports 1, 2, 3, 4, 5, or all 6 strings played simultaneously on the same beat
 */
export function getBeatNotes(beat) {
  if (!beat) return [];
  const notes = [];
  if (beat.string !== undefined && beat.string !== null && beat.fret !== undefined && beat.fret !== null && beat.fret >= 0) {
    notes.push({ string: beat.string, fret: beat.fret });
  }
  if (Array.isArray(beat.chordNotes)) {
    beat.chordNotes.forEach((cn) => {
      if (cn && cn.string !== undefined && cn.string !== null && cn.fret !== undefined && cn.fret !== null && cn.fret >= 0) {
        if (!notes.some((n) => n.string === cn.string)) {
          notes.push({ string: cn.string, fret: cn.fret });
        }
      }
    });
  }
  return notes;
}

/**
 * Helper to get the fret for a specific string on a beat
 */
export function getBeatNoteFretForString(beat, strIdx) {
  const notes = getBeatNotes(beat);
  const found = notes.find((n) => n.string === strIdx);
  return found !== undefined && found !== null ? found.fret : null;
}

export default function InteractiveTabStaff({
  measures = [],
  onChangeMeasures,
  capo = 0,
  tempo = 76,
  onOpenChordBuilder,
  customChords = [],
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMeasureIdx, setCurrentMeasureIdx] = useState(0);
  const [currentBeatIdx, setCurrentBeatIdx] = useState(0);
  const [activeCell, setActiveCell] = useState(null); // { mIdx, bIdx, strIdx }
  const [activeFingerSlot, setActiveFingerSlot] = useState(null); // { mIdx, strIdx }
  const [popoverChord, setPopoverChord] = useState(null); // { chordName, mIdx, isModal }

  const playbackTimerRef = useRef(null);

  // Stop playback on unmount
  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, []);

  // Playback loop (eighth notes = 2 subdivisions per beat in 4/4)
  useEffect(() => {
    if (!isPlaying || !measures.length) {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      return;
    }

    const intervalMs = (60000 / tempo) / 2; // 8th note duration

    playbackTimerRef.current = setInterval(() => {
      setCurrentBeatIdx((prevBeat) => {
        let nextBeat = prevBeat + 1;
        let nextMeasure = currentMeasureIdx;

        const currentMeasure = measures[currentMeasureIdx];
        const measureBeatsCount = currentMeasure?.beats?.length || 8;

        if (nextBeat >= measureBeatsCount) {
          nextBeat = 0;
          nextMeasure = (currentMeasureIdx + 1) % measures.length;
          setCurrentMeasureIdx(nextMeasure);
        }

        // Play note(s) and/or strum on current beat
        const measure = measures[nextMeasure];
        if (measure && measure.beats && measure.beats[nextBeat]) {
          const beatNote = measure.beats[nextBeat];

          // 1. Strum playback (Down, Up, Percussive Hit)
          if (beatNote.strum === 'down') {
            playTabStrum(measure.chord || 'G', 'down', capo, tempo, 0.75, customChords, CHORDS);
          } else if (beatNote.strum === 'up') {
            playTabStrum(measure.chord || 'G', 'up', capo, tempo, 0.65, customChords, CHORDS);
          } else if (beatNote.strum === 'hit') {
            playPercussiveHit();
          }

          // 2. Tab Note plucks (plays all simultaneous notes: 1, 2, 3, 4, 5, or 6 strings together)
          const allNotes = getBeatNotes(beatNote);
          allNotes.forEach((n) => {
            playTabNote(n.string, n.fret, capo, 0.72);
          });
        }

        return nextBeat;
      });
    }, intervalMs);

    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, tempo, measures, currentMeasureIdx, capo, customChords]);

  // Click note cell to set fret
  const handleCellClick = (mIdx, bIdx, strIdx, existingFret) => {
    setActiveCell({ mIdx, bIdx, strIdx });
    setActiveFingerSlot(null);
    if (existingFret !== undefined && existingFret !== null && existingFret >= 0) {
      playTabNote(strIdx, existingFret, capo);
    }
  };

  // Set fret on active cell (supports 1, 2, 3, 4, 5, or all 6 strings played simultaneously on the same beat!)
  const handleSetFret = (fretVal) => {
    if (!activeCell) return;
    const { mIdx, bIdx, strIdx } = activeCell;
    const updated = [...measures];
    const targetMeasure = { ...updated[mIdx] };
    const targetBeats = [...(targetMeasure.beats || [])];
    const existing = { ...(targetBeats[bIdx] || {}) };

    let notes = getBeatNotes(existing);

    if (fretVal === null) {
      // Clear note on this string
      notes = notes.filter((n) => n.string !== strIdx);
    } else {
      // Add or update note on this string
      const existingIdx = notes.findIndex((n) => n.string === strIdx);
      if (existingIdx >= 0) {
        notes[existingIdx] = { string: strIdx, fret: fretVal };
      } else {
        notes.push({ string: strIdx, fret: fretVal });
      }
      playTabNote(strIdx, fretVal, capo);
    }

    // Keep notes sorted by string index (Low E [5] down to High e [0])
    notes.sort((a, b) => b.string - a.string);

    const newBeat = {};
    if (existing.strum) {
      newBeat.strum = existing.strum;
    }

    if (notes.length > 0) {
      newBeat.string = notes[0].string;
      newBeat.fret = notes[0].fret;
      if (notes.length > 1) {
        newBeat.chordNotes = notes.slice(1);
      }
    }

    targetBeats[bIdx] = newBeat;
    targetMeasure.beats = targetBeats;
    updated[mIdx] = targetMeasure;
    onChangeMeasures(updated);
  };

  // Clear all notes on the active beat
  const handleClearAllBeatNotes = () => {
    if (!activeCell) return;
    const { mIdx, bIdx } = activeCell;
    const updated = [...measures];
    const targetMeasure = { ...updated[mIdx] };
    const targetBeats = [...(targetMeasure.beats || [])];
    const existing = targetBeats[bIdx] || {};

    targetBeats[bIdx] = existing.strum ? { strum: existing.strum } : {};
    targetMeasure.beats = targetBeats;
    updated[mIdx] = targetMeasure;
    onChangeMeasures(updated);
  };

  // Fill chord notes across strings on active beat (e.g. 3, 4, 5, or 6 notes played together!)
  const handleFillChordNotesOnBeat = () => {
    if (!activeCell) return;
    const { mIdx, bIdx } = activeCell;
    const targetMeasure = measures[mIdx];
    const chordName = targetMeasure?.chord || 'Em';

    const allChords = [...customChords, ...CHORDS];
    const chordData = allChords.find(
      (c) => c.id.toLowerCase() === chordName.toLowerCase() || c.name.toLowerCase().startsWith(chordName.toLowerCase())
    );
    const frets = chordData?.frets || [0, 2, 2, 0, 0, 0]; // [Low E..High E]

    const notes = [];
    frets.forEach((f, chordIdx) => {
      const strIdx = 5 - chordIdx;
      if (f !== null && f !== undefined && f >= 0) {
        notes.push({ string: strIdx, fret: f });
      }
    });

    if (notes.length === 0) return;

    // Sort notes by string
    notes.sort((a, b) => b.string - a.string);

    const updated = [...measures];
    const measureCopy = { ...updated[mIdx] };
    const beatsCopy = [...(measureCopy.beats || [])];
    const existing = beatsCopy[bIdx] || {};

    const newBeat = {
      strum: existing.strum || 'down',
      string: notes[0].string,
      fret: notes[0].fret,
    };
    if (notes.length > 1) {
      newBeat.chordNotes = notes.slice(1);
    }

    beatsCopy[bIdx] = newBeat;
    measureCopy.beats = beatsCopy;
    updated[mIdx] = measureCopy;
    onChangeMeasures(updated);

    playTabStrum(chordName, 'down', capo, tempo, 0.75, customChords, CHORDS);
  };

  // Dynamic Beat Addition: Add an extra beat to a measure
  const handleAddBeat = (mIdx) => {
    const updated = [...measures];
    const targetMeasure = { ...updated[mIdx] };
    const targetBeats = [...(targetMeasure.beats || [])];
    targetBeats.push({});
    targetMeasure.beats = targetBeats;
    updated[mIdx] = targetMeasure;
    onChangeMeasures(updated);
  };

  // Dynamic Beat Removal: Remove last beat from a measure (min 2)
  const handleRemoveBeat = (mIdx) => {
    const updated = [...measures];
    const targetMeasure = { ...updated[mIdx] };
    const targetBeats = [...(targetMeasure.beats || [])];
    if (targetBeats.length <= 2) return;
    targetBeats.pop();
    targetMeasure.beats = targetBeats;
    updated[mIdx] = targetMeasure;
    onChangeMeasures(updated);
  };

  // Set specific beat count for a measure (e.g. 4, 6, 8, 10, 12, 16)
  const handleSetMeasureBeatCount = (mIdx, count) => {
    const targetCount = Math.max(2, Math.min(32, parseInt(count, 10) || 8));
    const updated = [...measures];
    const targetMeasure = { ...updated[mIdx] };
    let targetBeats = [...(targetMeasure.beats || [])];
    if (targetBeats.length < targetCount) {
      while (targetBeats.length < targetCount) {
        targetBeats.push({});
      }
    } else if (targetBeats.length > targetCount) {
      targetBeats = targetBeats.slice(0, targetCount);
    }
    targetMeasure.beats = targetBeats;
    updated[mIdx] = targetMeasure;
    onChangeMeasures(updated);
  };

  // Toggle/Cycle strum pattern on a specific beat: null -> 'down' -> 'up' -> 'hit' -> 'rest' -> null
  const handleToggleBeatStrum = (mIdx, bIdx) => {
    const measure = measures[mIdx];
    const currentStrum = measure?.beats?.[bIdx]?.strum;
    const cycle = [null, 'down', 'up', 'hit', 'rest'];
    const curIdx = cycle.indexOf(currentStrum || null);
    const nextStrum = cycle[(curIdx + 1) % cycle.length];

    handleSetBeatStrum(mIdx, bIdx, nextStrum);
  };

  // Explicitly set beat strum
  const handleSetBeatStrum = (mIdx, bIdx, strumType) => {
    const updated = [...measures];
    const targetMeasure = { ...updated[mIdx] };
    const targetBeats = [...(targetMeasure.beats || [])];
    const currentBeat = targetBeats[bIdx] || {};

    if (strumType) {
      targetBeats[bIdx] = { ...currentBeat, strum: strumType };
      // Play acoustic audio preview
      if (strumType === 'down') {
        playTabStrum(targetMeasure.chord || 'G', 'down', capo, tempo, 0.75, customChords, CHORDS);
      } else if (strumType === 'up') {
        playTabStrum(targetMeasure.chord || 'G', 'up', capo, tempo, 0.65, customChords, CHORDS);
      } else if (strumType === 'hit') {
        playPercussiveHit();
      }
    } else {
      const { strum, ...rest } = currentBeat;
      targetBeats[bIdx] = rest;
    }

    targetMeasure.beats = targetBeats;
    updated[mIdx] = targetMeasure;
    onChangeMeasures(updated);
  };

  // Apply strum preset to entire measure
  const handleApplyStrumPreset = (mIdx, presetKey) => {
    const updated = [...measures];
    const targetMeasure = { ...updated[mIdx] };
    const beatsCount = targetMeasure.beats?.length || 8;
    const targetBeats = [...(targetMeasure.beats || [])];

    for (let i = 0; i < beatsCount; i++) {
      let strumVal = null;
      if (presetKey === 'alternate') {
        // D U D U D U D U
        strumVal = i % 2 === 0 ? 'down' : 'up';
      } else if (presetKey === 'downs') {
        // D - D - D - D -
        strumVal = i % 2 === 0 ? 'down' : null;
      } else if (presetKey === 'folk') {
        // D - D U - U D U
        const folk8 = ['down', null, 'down', 'up', null, 'up', 'down', 'up'];
        strumVal = folk8[i % folk8.length];
      } else if (presetKey === 'percussive') {
        // D U ✕ U D U ✕ U
        const perc8 = ['down', 'up', 'hit', 'up', 'down', 'up', 'hit', 'up'];
        strumVal = perc8[i % perc8.length];
      } else if (presetKey === 'clear') {
        strumVal = null;
      }

      const cur = targetBeats[i] || {};
      if (strumVal) {
        targetBeats[i] = { ...cur, strum: strumVal };
      } else {
        const { strum, ...rest } = cur;
        targetBeats[i] = rest;
      }
    }

    targetMeasure.beats = targetBeats;
    updated[mIdx] = targetMeasure;
    onChangeMeasures(updated);

    // Audio preview first strum
    if (presetKey !== 'clear') {
      playTabStrum(targetMeasure.chord || 'G', 'down', capo, tempo, 0.75, customChords, CHORDS);
    }
  };

  // Get finger positions array [str0..str5] (High e to Low E) for a measure
  const getMeasureFingers = (measure) => {
    if (Array.isArray(measure?.fingers)) {
      return measure.fingers;
    }
    return getChordFingersForTab(measure?.chord || 'Em', customChords);
  };

  // Get fret positions array [str0..str5] (High e to Low E) for a measure
  const getMeasureFrets = (measure) => {
    if (Array.isArray(measure?.chordFrets)) {
      return measure.chordFrets;
    }
    return getChordFretsForTab(measure?.chord || 'Em', customChords);
  };

  // Change measure chord and recalculate default finger & fret slots
  const handleChangeMeasureChord = (mIdx, newChord) => {
    const updated = [...measures];
    const defaultFingers = getChordFingersForTab(newChord, customChords);
    const defaultFrets = getChordFretsForTab(newChord, customChords);
    updated[mIdx] = {
      ...updated[mIdx],
      chord: newChord,
      fingers: defaultFingers,
      chordFrets: defaultFrets,
      fingerGuide: getChordFingerShorthand(newChord, customChords),
    };
    onChangeMeasures(updated);
  };

  // Set finger number (1, 2, 3, 4 or null) for a specific string on a measure
  const handleSetMeasureFinger = (mIdx, strIdx, fingerVal) => {
    const updated = [...measures];
    const targetMeasure = { ...updated[mIdx] };
    const curFingers = [...getMeasureFingers(targetMeasure)];
    curFingers[strIdx] = fingerVal;
    targetMeasure.fingers = curFingers;
    updated[mIdx] = targetMeasure;
    onChangeMeasures(updated);
  };

  // Set fret number (0..12 or -1) for a specific string on a measure
  const handleSetMeasureChordFret = (mIdx, strIdx, fretVal) => {
    const updated = [...measures];
    const targetMeasure = { ...updated[mIdx] };
    const curFrets = [...getMeasureFrets(targetMeasure)];
    curFrets[strIdx] = fretVal;
    targetMeasure.chordFrets = curFrets;
    updated[mIdx] = targetMeasure;
    onChangeMeasures(updated);
  };

  // Cycle finger on string: null -> 1 -> 2 -> 3 -> 4 -> null
  const handleCycleMeasureFinger = (mIdx, strIdx) => {
    const targetMeasure = measures[mIdx];
    const curFingers = getMeasureFingers(targetMeasure);
    const cur = curFingers[strIdx];
    let nextVal = null;
    if (cur === null || cur === undefined) nextVal = 1;
    else if (cur === 1) nextVal = 2;
    else if (cur === 2) nextVal = 3;
    else if (cur === 3) nextVal = 4;
    else nextVal = null;

    handleSetMeasureFinger(mIdx, strIdx, nextVal);
    setActiveFingerSlot({ mIdx, strIdx });
    setActiveCell(null);
  };

  // Keyboard shortcut listener for active finger slot
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeFingerSlot) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        handleSetMeasureFinger(activeFingerSlot.mIdx, activeFingerSlot.strIdx, parseInt(e.key, 10));
      } else if (['0', 'Backspace', 'Delete', 'c', 'C'].includes(e.key)) {
        handleSetMeasureFinger(activeFingerSlot.mIdx, activeFingerSlot.strIdx, null);
      } else if (e.key === 'Escape') {
        setActiveFingerSlot(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFingerSlot, measures, customChords]);

  // Keyboard shortcut listener for active note cell
  useEffect(() => {
    const handleNoteKeyDown = (e) => {
      if (!activeCell) return;
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        handleSetFret(parseInt(e.key, 10));
      } else if (['Backspace', 'Delete', 'c', 'C'].includes(e.key)) {
        handleSetFret(null);
      } else if (e.key === 'Escape') {
        setActiveCell(null);
      }
    };
    window.addEventListener('keydown', handleNoteKeyDown);
    return () => window.removeEventListener('keydown', handleNoteKeyDown);
  }, [activeCell, measures, capo]);

  // Auto-Arpeggiate measure based on its chord
  const handleAutoArpeggiate = (mIdx) => {
    const measure = measures[mIdx];
    const chordName = measure.chord || 'G';
    const totalBeats = measure.beats?.length || 8;

    // Find chord in custom chords or DB
    const allChords = [...customChords, ...CHORDS];
    const chordData = allChords.find(
      (c) => c.id.toLowerCase() === chordName.toLowerCase() || c.name.toLowerCase().startsWith(chordName.toLowerCase())
    );

    const frets = chordData?.frets || [3, 2, 0, 0, 0, 3]; // [Low E..High E]

    // Determine root bass string:
    let bassStr = 5; // Low E
    if (frets[0] === -1 || frets[0] === null) {
      bassStr = frets[1] !== -1 ? 4 : 3;
    }
    const bassFret = frets[5 - bassStr] ?? 0;

    // Standard acoustic picking pattern cycler:
    const pickingPattern = [
      { string: bassStr, fret: bassFret },
      { string: 2, fret: frets[3] >= 0 ? frets[3] : 0 },
      { string: 3, fret: frets[2] >= 0 ? frets[2] : 0 },
      { string: 2, fret: frets[3] >= 0 ? frets[3] : 0 },
      { string: 1, fret: frets[4] >= 0 ? frets[4] : 0 },
      { string: 2, fret: frets[3] >= 0 ? frets[3] : 0 },
      { string: 0, fret: frets[5] >= 0 ? frets[5] : 0 },
      { string: 1, fret: frets[4] >= 0 ? frets[4] : 0 },
    ];

    const newBeats = [];
    for (let i = 0; i < totalBeats; i++) {
      const existingStrum = measure.beats?.[i]?.strum;
      const pick = pickingPattern[i % pickingPattern.length];
      newBeats.push({
        ...pick,
        ...(existingStrum ? { strum: existingStrum } : {}),
      });
    }

    const updated = [...measures];
    updated[mIdx] = {
      ...updated[mIdx],
      beats: newBeats,
    };
    onChangeMeasures(updated);
  };

  // Add new measure
  const handleAddMeasure = () => {
    const nextNum = measures.length + 1;
    const lastMeasure = measures[measures.length - 1];
    const beatsCount = lastMeasure?.beats?.length || 8;
    const newBeats = Array.from({ length: beatsCount }, () => ({}));
    const newMeasure = {
      measureNum: nextNum,
      chord: lastMeasure?.chord || 'G',
      beats: newBeats,
    };
    onChangeMeasures([...measures, newMeasure]);
  };

  // Delete measure
  const handleDeleteMeasure = (mIdx) => {
    if (measures.length <= 1) return;
    const updated = measures.filter((_, i) => i !== mIdx).map((m, idx) => ({
      ...m,
      measureNum: idx + 1,
    }));
    onChangeMeasures(updated);
  };

  // Duplicate measure
  const handleDuplicateMeasure = (mIdx) => {
    const source = measures[mIdx];
    const copy = {
      ...source,
      measureNum: measures.length + 1,
      beats: JSON.parse(JSON.stringify(source.beats || [])),
    };
    onChangeMeasures([...measures, copy]);
  };

  // Available chord options for measure header
  const allAvailableChords = [
    'Gadd9',
    'Emadd9',
    'Cadd9',
    'Dsus2',
    'Em',
    'Am',
    'Am7',
    'E7',
    'G',
    'D',
    'Fmaj7',
    'C',
    'Dm',
    'E',
    'Bm',
    'F#7',
    'A',
    'A9',
    'B7',
    ...customChords.map((c) => c.name || c.id),
  ];
  const uniqueChordOptions = Array.from(new Set(allAvailableChords));

  // Break measures into rows of 4 measures each
  const rows = [];
  for (let i = 0; i < measures.length; i += 4) {
    rows.push(measures.slice(i, i + 4));
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-default)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Top Playback & Action Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Play / Stop Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: isPlaying ? 'var(--danger)' : 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} />}
            <span>{isPlaying ? 'Pause' : 'Play Tab Sheet'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentMeasureIdx(0);
              setCurrentBeatIdx(0);
            }}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
            title="Reset playback to measure 1"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              background: 'var(--bg-subtle)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
            }}
          >
            Measure: <strong>{currentMeasureIdx + 1}</strong> / {measures.length} • Beat: <strong>{currentBeatIdx + 1}</strong>
            {measures[currentMeasureIdx]?.beats?.length && (
              <span style={{ color: 'var(--text-dim)', marginLeft: '4px' }}>
                ({measures[currentMeasureIdx].beats.length} beats)
              </span>
            )}
          </div>
        </div>

        {/* Right tools: Add Measure & Custom Chord Maker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={handleAddMeasure}
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Plus size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>+ Add Measure</span>
          </button>

          <button
            type="button"
            onClick={onOpenChordBuilder}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-warm-border)',
              background: 'var(--accent-warm-subtle)',
              color: 'var(--accent-warm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Sparkles size={15} />
            <span>Make Custom Chord</span>
          </button>
        </div>
      </div>

      {/* Quick Fret & Strum Placement Toolbar for active clicked cell */}
      {activeCell && (
        <div
          style={{
            background: 'var(--accent-primary-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--accent-primary-border)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {/* Top row: Cell info & Note Frets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                Measure {activeCell.mIdx + 1}, Beat {activeCell.bIdx + 1}, String {TAB_STRING_NAMES[activeCell.strIdx]}:
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Place Note Fret:
              </span>

              {/* Multi-note badges showing all simultaneous notes on this beat */}
              {(() => {
                const currentBeatNotes = getBeatNotes(measures[activeCell.mIdx]?.beats?.[activeCell.bIdx]);
                if (currentBeatNotes.length > 1) {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.35rem' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#4338ca' }}>
                        🎵 {currentBeatNotes.length} notes together:
                      </span>
                      {currentBeatNotes.map((n, i) => (
                        <span
                          key={i}
                          style={{
                            background: n.string === activeCell.strIdx ? '#dbeafe' : '#ffffff',
                            border: n.string === activeCell.strIdx ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                            borderRadius: '4px',
                            padding: '1px 5px',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            color: n.string === activeCell.strIdx ? '#1d4ed8' : '#334155',
                          }}
                        >
                          {TAB_STRING_NAMES[n.string]}:{n.fret}
                        </span>
                      ))}
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 12].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleSetFret(f)}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-default)',
                    background: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                >
                  {f}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleSetFret(null)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--danger-border)',
                  background: 'var(--danger-subtle)',
                  color: 'var(--danger)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Remove note from this string only"
              >
                Clear String
              </button>

              <button
                type="button"
                onClick={handleFillChordNotesOnBeat}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #86efac',
                  background: '#f0fdf4',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                title={`Fill all notes of ${measures[activeCell.mIdx]?.chord || 'Chord'} on this beat simultaneously`}
              >
                🎸 Fill Chord ({measures[activeCell.mIdx]?.chord || 'Chord'})
              </button>

              {getBeatNotes(measures[activeCell.mIdx]?.beats?.[activeCell.bIdx]).length > 1 && (
                <button
                  type="button"
                  onClick={handleClearAllBeatNotes}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid #fecaca',
                    background: '#fff1f2',
                    color: '#991b1b',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title="Clear all simultaneous notes on this beat"
                >
                  Clear All Notes
                </button>
              )}
            </div>
          </div>

          {/* Bottom row: Beat Strum Pattern & Beat Management */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              borderTop: '1px dashed var(--accent-primary-border)',
              paddingTop: '0.65rem',
            }}
          >
            {/* Strumming Buttons for this beat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Beat Strum Pattern:
              </span>
              <button
                type="button"
                onClick={() => handleSetBeatStrum(activeCell.mIdx, activeCell.bIdx, 'down')}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #c7d2fe',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <ArrowDown size={13} strokeWidth={2.8} />
                <span>Down (D)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetBeatStrum(activeCell.mIdx, activeCell.bIdx, 'up')}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #a7f3d0',
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <ArrowUp size={13} strokeWidth={2.8} />
                <span>Up (U)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetBeatStrum(activeCell.mIdx, activeCell.bIdx, 'hit')}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #fed7aa',
                  background: '#ffedd5',
                  color: '#c2410c',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>✕ Hit (Slap)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetBeatStrum(activeCell.mIdx, activeCell.bIdx, 'rest')}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #cbd5e1',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <span>— Miss / Rest</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetBeatStrum(activeCell.mIdx, activeCell.bIdx, null)}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-default)',
                  background: '#ffffff',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                Clear Strum
              </button>
            </div>

            {/* Beat expansion buttons for this measure */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Chunk Beats:
              </span>
              <button
                type="button"
                onClick={() => handleAddBeat(activeCell.mIdx)}
                style={{
                  padding: '0.22rem 0.55rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--accent-primary-border)',
                  background: '#ffffff',
                  color: 'var(--accent-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                title="Add 1 beat to this chunk (can expand beyond 8)"
              >
                <Plus size={12} strokeWidth={2.5} />
                <span>+1 Beat</span>
              </button>

              <button
                type="button"
                onClick={() => handleRemoveBeat(activeCell.mIdx)}
                disabled={(measures[activeCell.mIdx]?.beats?.length || 8) <= 2}
                style={{
                  padding: '0.22rem 0.55rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-default)',
                  background: '#ffffff',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: (measures[activeCell.mIdx]?.beats?.length || 8) <= 2 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                title="Remove 1 beat from this chunk"
              >
                <Minus size={12} strokeWidth={2.5} />
                <span>-1 Beat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Finger & Fret Placement Toolbar when a chord string slot is active */}
      {activeFingerSlot && !activeCell && (
        <div
          style={{
            background: '#eff6ff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #bfdbfe',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          {(() => {
            const curMeasure = measures[activeFingerSlot.mIdx];
            const curFret = getMeasureFrets(curMeasure)[activeFingerSlot.strIdx];
            const curFinger = getMeasureFingers(curMeasure)[activeFingerSlot.strIdx];

            return (
              <>
                {/* Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.05rem' }}>🖐️</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e40af' }}>
                      Chunk #{activeFingerSlot.mIdx + 1} ({curMeasure?.chord || 'Chord'})
                      — String {TAB_STRING_NAMES[activeFingerSlot.strIdx]} Position:
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#1d4ed8', fontWeight: 700, background: '#dbeafe', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      Fret: {curFret === -1 ? 'Muted (✕)' : curFret === 0 ? '0 (Open)' : curFret} • Finger: {curFinger ? `${curFinger}` : 'None'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveFingerSlot(null)}
                    style={{
                      padding: '0.28rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Done
                  </button>
                </div>

                {/* Row 1: Select Fret for this chord string */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px dashed #bfdbfe', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e40af', minWidth: '45px' }}>
                    Fret:
                  </span>
                  {[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 12].map((f) => {
                    const isFretActive = curFret === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => handleSetMeasureChordFret(activeFingerSlot.mIdx, activeFingerSlot.strIdx, f)}
                        style={{
                          padding: '0.22rem 0.6rem',
                          borderRadius: 'var(--radius-xs)',
                          border: isFretActive ? '2px solid #2563eb' : '1px solid #bfdbfe',
                          background: isFretActive ? '#2563eb' : '#ffffff',
                          color: isFretActive ? '#ffffff' : '#1e3a8a',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {f === 0 ? '0 (Open)' : f}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handleSetMeasureChordFret(activeFingerSlot.mIdx, activeFingerSlot.strIdx, -1)}
                    style={{
                      padding: '0.22rem 0.6rem',
                      borderRadius: 'var(--radius-xs)',
                      border: curFret === -1 ? '2px solid #dc2626' : '1px solid #fecaca',
                      background: curFret === -1 ? '#dc2626' : '#fef2f2',
                      color: curFret === -1 ? '#ffffff' : '#b91c1c',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                    title="Mute string (do not play)"
                  >
                    ✕ Mute
                  </button>
                </div>

                {/* Row 2: Select Finger for this chord string */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e40af', minWidth: '45px' }}>
                    Finger:
                  </span>
                  {[
                    { val: 1, label: '1 (Index)' },
                    { val: 2, label: '2 (Middle)' },
                    { val: 3, label: '3 (Ring)' },
                    { val: 4, label: '4 (Pinky)' },
                  ].map(({ val, label }) => {
                    const isFingerActive = curFinger === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSetMeasureFinger(activeFingerSlot.mIdx, activeFingerSlot.strIdx, val)}
                        style={{
                          padding: '0.22rem 0.65rem',
                          borderRadius: 'var(--radius-xs)',
                          border: isFingerActive ? '2px solid #2563eb' : '1px solid #bfdbfe',
                          background: isFingerActive ? '#2563eb' : '#ffffff',
                          color: isFingerActive ? '#ffffff' : '#1e3a8a',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handleSetMeasureFinger(activeFingerSlot.mIdx, activeFingerSlot.strIdx, null)}
                    style={{
                      padding: '0.22rem 0.6rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Clear Finger
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Minimal Finger Position Notation Legend */}
      <div
        style={{
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          background: 'linear-gradient(90deg, #f8fafc 0%, #eff6ff 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '0.35rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          flexWrap: 'wrap',
          marginBottom: '0.75rem',
        }}
      >
        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>🖐️ Chord Position Guide:</span>
        <span style={{ fontWeight: 800, color: '#0f172a' }}>Fret Number</span>
        <span style={{ color: '#94a3b8' }}>|</span>
        <span style={{ fontWeight: 800, color: '#1e40af' }}>Finger (1=Index, 2=Middle, 3=Ring, 4=Pinky)</span>
        <span style={{ color: 'var(--text-dim)', marginLeft: '4px' }}>
          (Shown on each string before the chunk's barline. Click any string to edit both fret and finger!)
        </span>
      </div>

      {/* THE TABLATURE STAFF */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
        }}
      >
        {rows.map((rowMeasures, rowIdx) => {
          const rowStartMeasureIdx = rowIdx * 4;

          return (
            <div
              key={rowIdx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: '880px',
                position: 'relative',
              }}
            >
              {/* Row Header: Chord Names, Chunk Labels, Strum Presets & Beat Counters */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `54px repeat(${rowMeasures.length}, minmax(0, 1fr))`,
                  alignItems: 'end',
                  marginBottom: '6px',
                }}
              >
                {/* Left empty spacer for TAB clef */}
                <div />

                {/* Measure headers: Chord Name, Capo label, Measure number, Strum preset, Beat count controls */}
                {rowMeasures.map((m, mInRowIdx) => {
                  const absoluteMIdx = rowStartMeasureIdx + mInRowIdx;
                  const totalBeatsInMeasure = m.beats?.length || 8;

                  return (
                    <div
                      key={m.measureNum}
                      id={`staff-measure-${absoluteMIdx}`}
                      style={{
                        paddingLeft: '10px',
                        paddingRight: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        position: 'relative',
                      }}
                    >
                      {/* Row 1: Chunk Label on left, Beat stepper on right */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '3px',
                          gap: '0.25rem',
                        }}
                      >
                        {m.chunkLabel ? (
                          <div
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: 'var(--accent-primary)',
                              letterSpacing: '0.01em',
                              lineHeight: 1.2,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {m.chunkLabel}
                          </div>
                        ) : (
                          <div />
                        )}

                        {/* Dynamic Beat Counter Stepper: [-] {count} [+] */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: '#f8fafc',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-xs)',
                            padding: '0 0.15rem',
                            flexShrink: 0,
                          }}
                          title={`Beats in Chunk ${m.measureNum} (click + to add more than 8 beats)`}
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveBeat(absoluteMIdx)}
                            disabled={totalBeatsInMeasure <= 2}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: totalBeatsInMeasure <= 2 ? 'not-allowed' : 'pointer',
                              padding: '0.1rem 0.2rem',
                              color: 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Decrease beats"
                          >
                            <Minus size={10} />
                          </button>

                          <span
                            style={{
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              color: totalBeatsInMeasure > 8 ? 'var(--accent-primary)' : 'var(--text-primary)',
                              padding: '0 0.2rem',
                              minWidth: '22px',
                              textAlign: 'center',
                            }}
                          >
                            {totalBeatsInMeasure}b
                          </span>

                          <button
                            type="button"
                            onClick={() => handleAddBeat(absoluteMIdx)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              padding: '0.1rem 0.2rem',
                              color: 'var(--accent-primary)',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Add beat (increase beyond 8)"
                          >
                            <Plus size={10} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Chord Name + Finger Pos + Arp on left, Strum preset on right */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.35rem',
                          marginBottom: '3px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <select
                            value={m.chord || 'G'}
                            onChange={(e) => handleChangeMeasureChord(absoluteMIdx, e.target.value)}
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '0.98rem',
                              fontWeight: 800,
                              color: 'var(--text-primary)',
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            {uniqueChordOptions.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>

                          {/* Quick Finger Pos diagram button */}
                          <button
                            type="button"
                            onClick={() =>
                              setPopoverChord(
                                popoverChord?.mIdx === absoluteMIdx
                                  ? null
                                  : { chordName: m.chord || 'G', mIdx: absoluteMIdx }
                              )
                            }
                            style={{
                              background:
                                popoverChord?.mIdx === absoluteMIdx
                                  ? 'var(--accent-primary)'
                                  : 'var(--accent-primary-subtle)',
                              border: '1px solid var(--accent-primary-border)',
                              color: popoverChord?.mIdx === absoluteMIdx ? '#ffffff' : 'var(--accent-primary)',
                              fontSize: '0.67rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              padding: '0.12rem 0.35rem',
                              borderRadius: 'var(--radius-xs)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                            }}
                            title={`Finger positions diagram for ${m.chord || 'G'}`}
                          >
                            🖐️ Pos
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAutoArpeggiate(absoluteMIdx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--accent-primary)',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '0.1rem 0.25rem',
                              borderRadius: 'var(--radius-xs)',
                            }}
                            title={`Auto-arpeggiate ${m.chord} across this measure`}
                          >
                            ⚡ Arp
                          </button>
                        </div>
                      </div>

                      {/* Popover Diagram for this measure */}
                      {popoverChord?.mIdx === absoluteMIdx && (
                        <ChordFingerPopover
                          chordName={m.chord || 'G'}
                          customChords={customChords}
                          capo={capo}
                          onClose={() => setPopoverChord(null)}
                        />
                      )}

                      {/* Row 3: Measure Number & Capo label */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div
                          style={{
                            fontSize: '0.74rem',
                            color: '#475569',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                          }}
                        >
                          {m.measureNum}
                        </div>
                        {absoluteMIdx === 0 && capo > 0 && (
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-secondary)',
                              fontWeight: 600,
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            Capo fret {capo}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* The 6-Line TAB Staff with Strumming Rows */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `54px repeat(${rowMeasures.length}, minmax(0, 1fr))`,
                  position: 'relative',
                  borderRight: '2px solid #000000',
                }}
              >
                {/* Left TAB Clef Box */}
                <div
                  style={{
                    position: 'relative',
                    height: '124px', // 24px strum bar + 100px staff lines
                    borderLeft: '2px solid #000000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '0 4px',
                    userSelect: 'none',
                  }}
                >
                  {/* Left Strum label badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: '4px',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: 'var(--text-dim)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    STRUM
                  </div>

                  {/* Staff container with 6 lines & TAB 4/4 */}
                  <div
                    style={{
                      position: 'relative',
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* The 6 horizontal black staff lines */}
                    {[0, 1, 2, 3, 4, 5].map((lineIdx) => (
                      <div
                        key={lineIdx}
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: `${lineIdx * 20}px`,
                          height: '1px',
                          background: '#000000',
                        }}
                      />
                    ))}

                    {/* T A B letters */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        lineHeight: '20px',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        color: '#000000',
                        zIndex: 2,
                        paddingLeft: '2px',
                      }}
                    >
                      <span>T</span>
                      <span>A</span>
                      <span>B</span>
                    </div>

                    {/* 4/4 Time Signature */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        lineHeight: '18px',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: '#000000',
                        zIndex: 2,
                      }}
                    >
                      <span>4</span>
                      <span>4</span>
                    </div>
                  </div>
                </div>

                {/* Measures Columns */}
                {rowMeasures.map((measure, mInRowIdx) => {
                  const absoluteMIdx = rowStartMeasureIdx + mInRowIdx;
                  const isMeasureActive = isPlaying && currentMeasureIdx === absoluteMIdx;
                  const totalBeats = measure.beats?.length || 8;
                  const measureFingers = getMeasureFingers(measure);
                  const measureFrets = getMeasureFrets(measure);

                  return (
                    <div
                      key={measure.measureNum}
                      style={{
                        position: 'relative',
                        height: '124px', // 24px strum bar + 100px staff lines
                        borderLeft: '1px solid #000000',
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      {/* Left: Fret & Finger Position Column (Placed on strings BEFORE the notes line!) */}
                      <div
                        style={{
                          width: '46px',
                          flexShrink: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          borderRight: '1.5px solid #000000',
                          background: '#f8fafc',
                        }}
                      >
                        {/* Strum Row Header for Fret & Finger Column */}
                        <div
                          title="Chord positions for this chunk (Fret | Finger). Click any string to edit in toolbar!"
                          style={{
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: '1px dashed #e2e8f0',
                            fontSize: '0.60rem',
                            color: '#64748b',
                            fontWeight: 800,
                            userSelect: 'none',
                            letterSpacing: '0.02em',
                          }}
                        >
                          Fr · 🖐️
                        </div>

                        {/* Staff Lines with Fret & Finger Badges on each string */}
                        <div
                          style={{
                            position: 'relative',
                            height: '100px',
                          }}
                        >
                          {/* 6 horizontal black staff lines */}
                          {[0, 1, 2, 3, 4, 5].map((lineIdx) => (
                            <div
                              key={lineIdx}
                              style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: `${lineIdx * 20}px`,
                                height: '1px',
                                background: '#000000',
                                pointerEvents: 'none',
                              }}
                            />
                          ))}

                          {/* 6 String Position Slots (Fret | Finger) */}
                          {[0, 1, 2, 3, 4, 5].map((strIdx) => {
                            const fingerVal = measureFingers[strIdx];
                            const fretVal = measureFrets[strIdx];
                            const isSlotActive =
                              activeFingerSlot?.mIdx === absoluteMIdx &&
                              activeFingerSlot?.strIdx === strIdx;

                            const isMuted = fretVal === -1;
                            const hasFinger = fingerVal !== null && fingerVal !== undefined;

                            return (
                              <div
                                key={strIdx}
                                onClick={() => {
                                  if (activeFingerSlot?.mIdx === absoluteMIdx && activeFingerSlot?.strIdx === strIdx) {
                                    handleCycleMeasureFinger(absoluteMIdx, strIdx);
                                  } else {
                                    setActiveFingerSlot({ mIdx: absoluteMIdx, strIdx });
                                    setActiveCell(null);
                                  }
                                }}
                                title={`String ${TAB_STRING_NAMES[strIdx]}: Fret ${isMuted ? 'Muted (✕)' : fretVal ?? 0}, Finger ${fingerVal || 'None'}. Click to select & edit fret or finger!`}
                                style={{
                                  position: 'absolute',
                                  top: `${strIdx * 20 - 9}px`,
                                  left: '3px',
                                  width: '40px',
                                  height: '18px',
                                  borderRadius: '9px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '2px',
                                  cursor: 'pointer',
                                  zIndex: 6,
                                  background: isSlotActive
                                    ? '#dbeafe'
                                    : hasFinger || fretVal > 0
                                    ? '#eff6ff'
                                    : '#ffffff',
                                  border: isSlotActive
                                    ? '2px solid #2563eb'
                                    : hasFinger || fretVal > 0
                                    ? '1.5px solid #3b82f6'
                                    : isMuted
                                    ? '1.5px solid #f87171'
                                    : '1px solid #cbd5e1',
                                  boxShadow: isSlotActive
                                    ? '0 0 0 2.5px rgba(37,99,235,0.35)'
                                    : hasFinger
                                    ? '0 1px 2px rgba(37,99,235,0.1)'
                                    : 'none',
                                  userSelect: 'none',
                                  transition: 'all 0.1s ease',
                                  padding: '0 2px',
                                }}
                              >
                                {/* Fret display */}
                                <span
                                  style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontWeight: 800,
                                    fontSize: '0.68rem',
                                    color: isMuted ? '#dc2626' : fretVal > 0 ? '#1d4ed8' : '#64748b',
                                    lineHeight: 1,
                                  }}
                                >
                                  {isMuted ? '✕' : fretVal !== undefined && fretVal !== null ? fretVal : '0'}
                                </span>

                                {/* Divider */}
                                <span
                                  style={{
                                    fontSize: '0.52rem',
                                    color: '#94a3b8',
                                    lineHeight: 1,
                                    opacity: 0.8,
                                  }}
                                >
                                  |
                                </span>

                                {/* Finger circle badge */}
                                {hasFinger ? (
                                  <span
                                    style={{
                                      minWidth: '12px',
                                      height: '12px',
                                      borderRadius: '6px',
                                      background: '#2563eb',
                                      color: '#ffffff',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontFamily: 'var(--font-heading)',
                                      fontWeight: 800,
                                      fontSize: '0.58rem',
                                      lineHeight: 1,
                                      padding: '0 1px',
                                    }}
                                  >
                                    {fingerVal}
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      fontSize: '0.55rem',
                                      color: '#94a3b8',
                                      lineHeight: 1,
                                    }}
                                  >
                                    ·
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Notes & Beats Column */}
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {/* 1. Strum Pattern Bar Row (Above the strings) */}
                        <div
                          style={{
                            height: '24px',
                            display: 'grid',
                            gridTemplateColumns: `repeat(${totalBeats}, 1fr)`,
                            alignItems: 'center',
                            borderBottom: '1px dashed #e2e8f0',
                            background: '#fafafa',
                          }}
                        >
                          {Array.from({ length: totalBeats }).map((_, bIdx) => {
                            const beat = measure.beats?.[bIdx] || {};
                            const strum = beat.strum;
                            const isBeatActive = isMeasureActive && currentBeatIdx === bIdx;

                            return (
                              <div
                                key={bIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleToggleBeatStrum(absoluteMIdx, bIdx)}
                                  title={`Beat ${bIdx + 1}: ${strum ? strum.toUpperCase() : 'No strum'} (click to cycle Down, Up, Hit, Miss)`}
                                  style={{
                                    border: 'none',
                                    background: strum === 'down'
                                      ? '#e0e7ff'
                                      : strum === 'up'
                                      ? '#dcfce7'
                                      : strum === 'hit'
                                      ? '#ffedd5'
                                      : strum === 'rest'
                                      ? '#f1f5f9'
                                      : 'transparent',
                                    color: strum === 'down'
                                      ? '#4338ca'
                                      : strum === 'up'
                                      ? '#15803d'
                                      : strum === 'hit'
                                      ? '#c2410c'
                                      : strum === 'rest'
                                      ? '#64748b'
                                      : '#94a3b8',
                                    borderRadius: 'var(--radius-xs)',
                                    padding: '1px 3px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.66rem',
                                    fontWeight: 800,
                                    minWidth: '18px',
                                    height: '18px',
                                    boxShadow: isBeatActive && strum ? '0 0 6px rgba(99, 102, 241, 0.4)' : 'none',
                                    transform: isBeatActive && strum ? 'scale(1.15)' : 'none',
                                    transition: 'transform 0.1s ease',
                                  }}
                                >
                                  {strum === 'down' && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                                      <ArrowDown size={11} strokeWidth={3} />
                                      <span>D</span>
                                    </span>
                                  )}
                                  {strum === 'up' && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                                      <ArrowUp size={11} strokeWidth={3} />
                                      <span>U</span>
                                    </span>
                                  )}
                                  {strum === 'hit' && <span>✕</span>}
                                  {strum === 'rest' && <span>—</span>}
                                  {!strum && <span style={{ opacity: 0.35, fontSize: '0.62rem' }}>·</span>}
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* 2. Staff Notes Area (100px height with 6 horizontal lines) */}
                        <div
                          style={{
                            position: 'relative',
                            height: '100px',
                            display: 'grid',
                            gridTemplateColumns: `repeat(${totalBeats}, 1fr)`,
                          }}
                        >
                          {/* The 6 horizontal black staff lines */}
                          {[0, 1, 2, 3, 4, 5].map((lineIdx) => (
                            <div
                              key={lineIdx}
                              style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: `${lineIdx * 20}px`,
                                height: '1px',
                                background: '#000000',
                                pointerEvents: 'none',
                              }}
                            />
                          ))}

                          {/* Subdivision Beat Columns */}
                          {Array.from({ length: totalBeats }).map((_, bIdx) => {
                            const isBeatActive = isMeasureActive && currentBeatIdx === bIdx;
                            const beatNote = measure.beats?.[bIdx];

                            return (
                              <div
                                key={bIdx}
                                style={{
                                  position: 'relative',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                }}
                              >
                                {/* ACTIVE PLAYHEAD CURSOR */}
                                {isBeatActive && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      inset: '-26px -3px -30px -3px',
                                      border: '2px solid rgba(220, 38, 38, 0.45)',
                                      borderRadius: '8px',
                                      background: 'rgba(34, 197, 94, 0.12)',
                                      pointerEvents: 'none',
                                      zIndex: 10,
                                      boxShadow: '0 0 14px rgba(34, 197, 94, 0.25)',
                                    }}
                                  />
                                )}

                                {/* 6 Clickable string points for this beat (supports multiple simultaneous notes) */}
                                {[0, 1, 2, 3, 4, 5].map((strIdx) => {
                                  const noteFret = getBeatNoteFretForString(beatNote, strIdx);
                                  const isCellSelected =
                                    activeCell?.mIdx === absoluteMIdx &&
                                    activeCell?.bIdx === bIdx &&
                                    activeCell?.strIdx === strIdx;

                                  return (
                                    <div
                                      key={strIdx}
                                      onClick={() =>
                                        handleCellClick(
                                          absoluteMIdx,
                                          bIdx,
                                          strIdx,
                                          noteFret
                                        )
                                      }
                                      style={{
                                        position: 'absolute',
                                        top: `${strIdx * 20 - 9}px`,
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '3px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 5,
                                        background: noteFret !== null
                                          ? '#ffffff'
                                          : isCellSelected
                                          ? 'var(--accent-primary-subtle)'
                                          : 'transparent',
                                        border: isCellSelected
                                          ? '1.5px solid var(--accent-primary)'
                                          : 'none',
                                        userSelect: 'none',
                                      }}
                                    >
                                      {noteFret !== null && (
                                        <span
                                          style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontWeight: 800,
                                            fontSize: '0.88rem',
                                            color: isBeatActive ? '#15803d' : '#000000',
                                            lineHeight: 1,
                                          }}
                                        >
                                          {noteFret}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rhythm Stems & Flags Below Staff (Eighth note brackets dynamically adapted to beat count) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `54px repeat(${rowMeasures.length}, minmax(0, 1fr))`,
                  marginTop: '10px',
                  userSelect: 'none',
                }}
              >
                <div />
                {rowMeasures.map((measure) => {
                  const totalBeats = measure.beats?.length || 8;
                  const numPairs = Math.ceil(totalBeats / 2);

                  return (
                    <div
                      key={measure.measureNum}
                      style={{
                        display: 'flex',
                        height: '24px',
                      }}
                    >
                      {/* Spacer matching 46px Chord Position Guide column */}
                      <div style={{ width: '46px', flexShrink: 0 }} />

                      {/* Rhythm Stems aligned with Beats */}
                      <div
                        style={{
                          flex: 1,
                          display: 'grid',
                          gridTemplateColumns: `repeat(${totalBeats}, 1fr)`,
                          height: '24px',
                        }}
                      >
                        {Array.from({ length: numPairs }).map((_, pairIdx) => {
                          const spanCount = Math.min(2, totalBeats - pairIdx * 2);

                          return (
                            <div
                              key={pairIdx}
                              style={{
                                gridColumn: `${pairIdx * 2 + 1} / span ${spanCount}`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '0 6px',
                              }}
                            >
                              <div
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  height: '14px',
                                  borderBottom: '2.5px solid #000000',
                                  borderLeft: '2px solid #000000',
                                  borderRight: spanCount > 1 ? '2px solid #000000' : 'none',
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Measure management icons & Quick actions */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `54px repeat(${rowMeasures.length}, minmax(0, 1fr))`,
                  marginTop: '4px',
                }}
              >
                <div />
                {rowMeasures.map((m, mIdx) => {
                  const absoluteMIdx = rowStartMeasureIdx + mIdx;
                  return (
                    <div
                      key={m.measureNum}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.6rem',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleAddBeat(absoluteMIdx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-primary)',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                        title="Add 1 beat to this chunk (expand beyond 8)"
                      >
                        <Plus size={12} />
                        <span>Beat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateMeasure(absoluteMIdx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: '0.2rem',
                        }}
                        title="Duplicate this measure"
                      >
                        <Copy size={13} />
                      </button>

                      {measures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMeasure(absoluteMIdx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            padding: '0.2rem',
                          }}
                          title="Delete this measure"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hotel California 8-Chunk Lesson Breakdown (Positioned Below the Chords Sheet) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          padding: '1.25rem',
          marginTop: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🦅</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
              Hotel California Intro — 8 Chunks Breakdown (Capo 7th Fret)
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-primary)', background: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)' }}>
            Capo 7 • Directional Picking • Dynamic Beats & Strumming
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
          As an absolute beginner, the key is taking it one chunk at a time. Each chunk can now have <strong>more than 8 beats</strong> using the <strong>[+]</strong> button, and you can add <strong>Strum Patterns (Down ↓, Up ↑, Hit ✕)</strong> directly above each beat! Click any chunk below to jump:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem' }}>
          {[
            { num: 1, chord: 'E minor', time: '2:36', desc: 'Pick 3rd from top, 3rd from bottom, 3rd from top, 2nd from bottom. Release ring & strum 3rd & 2nd from bottom together.' },
            { num: 2, chord: 'B7', time: '6:55', desc: 'Index 1st fret (3rd from top), Middle 2nd fret (2nd from top), Ring 2nd fret (3rd from bottom), Pinky 2nd fret (bottom).' },
            { num: 3, chord: 'Dsus2', time: '10:25', desc: 'Index on 2nd fret (3rd from bottom), Ring on 3rd fret (2nd from bottom). Steady picking across treble strings.' },
            { num: 4, chord: 'A9 variation', time: '13:50', desc: 'Ring on 4th fret (2nd from top), Index on 2nd fret (3rd from top). Focus on smooth melodic flow.' },
            { num: 5, chord: 'C major', time: '18:03', desc: 'Standard C. End with open bottom string & hammer-on with middle finger to 2nd fret of 3rd string from top.' },
            { num: 6, chord: 'G major', time: '20:06', desc: 'Ring 3rd fret (bottom), Middle 3rd fret (top), Index 2nd fret (2nd from top). Keep picking steady.' },
            { num: 7, chord: 'A minor 7', time: '23:00', desc: 'Index on 1st fret (2nd from bottom), Middle on 2nd fret (3rd from top). Classic melodic pattern.' },
            { num: 8, chord: 'B7 return', time: '24:25', desc: 'Return to B7 shape from Chunk #2 to close the intro.' },
          ].map((chunk) => {
            const isTarget = currentMeasureIdx === chunk.num - 1;
            return (
              <div
                key={chunk.num}
                onClick={() => {
                  setCurrentMeasureIdx(chunk.num - 1);
                  setCurrentBeatIdx(0);
                  const targetEl = document.getElementById(`staff-measure-${chunk.num - 1}`);
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                  const m = measures[chunk.num - 1];
                  if (m?.beats?.[0]?.fret !== undefined) {
                    playTabNote(m.beats[0].string, m.beats[0].fret, capo);
                  }
                }}
                style={{
                  background: isTarget ? 'var(--accent-primary-subtle)' : '#ffffff',
                  border: isTarget ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isTarget ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    Chunk #{chunk.num} ({chunk.chord})
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                    {chunk.time}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  {chunk.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal View for Chord Finger Position Diagram */}
      {popoverChord?.isModal && (
        <ChordFingerPopover
          chordName={popoverChord.chordName}
          customChords={customChords}
          capo={capo}
          isModal
          onClose={() => setPopoverChord(null)}
        />
      )}
    </div>
  );
}

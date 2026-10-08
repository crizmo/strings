// Professional Interactive Chord Sheet & Song Player
// Uses ChordSheetJS to parse, transpose, and format chord sheets with auto-scroll and acoustic audio
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ChordSheetJS from 'chordsheetjs';
import { Note } from 'tonal';
import { Play, Pause, ChevronUp, ChevronDown, Volume2, Music, ArrowDown, ArrowUp, Edit3 } from 'lucide-react';
import { SONGS } from '../../data/songs';
import ChordBox from '../Chords/ChordBox';
import { playAcousticChord } from '../../audio/acousticSynth';
import { CHORDS } from '../../data/chords';

// String-safe chord extractor from ChordSheetJS objects
const getChordString = (chordInput) => {
  if (!chordInput) return '';
  if (typeof chordInput === 'string') return chordInput;
  if (typeof chordInput.toString === 'function') {
    const s = chordInput.toString();
    if (s && s !== '[object Object]') return s;
  }
  if (chordInput.name) return String(chordInput.name);
  return '';
};

const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTE_MAP = {
  'B#': 0, 'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4, 'E#': 5, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7,
  'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11, 'Cb': 11
};

const transposeNote = (note, delta) => {
  const pitch = NOTE_MAP[note];
  if (pitch === undefined) return note;
  const newPitch = (pitch + delta + 1200) % 12;
  return note.includes('b') ? NOTES_FLAT[newPitch] : NOTES_SHARP[newPitch];
};

// Transpose a chord string (e.g. "Am", "C/G", "F#m7") by N semitones
const transposeChord = (chordInput, delta) => {
  const chordStr = getChordString(chordInput);
  if (!chordStr) return '';
  if (!delta) return chordStr;
  return chordStr.replace(/[A-G][b#]?/g, (match) => transposeNote(match, delta));
};

export default function ChordSheetPlayer() {
  const [selectedSong, setSelectedSong] = useState(SONGS[0]);
  const [transposeDelta, setTransposeDelta] = useState(0); // in semitones (-6 to +6)
  const [capoOffset, setCapoOffset] = useState(selectedSong.capo || 0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 to 5
  const [previewChord, setPreviewChord] = useState(null);
  const [customText, setCustomText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Reset transposition & capo when song changes
  useEffect(() => {
    setTransposeDelta(0);
    setCapoOffset(selectedSong.capo || 0);
    setIsAutoScrolling(false);
    setIsEditing(false);
  }, [selectedSong]);

  // Parse song using ChordSheetJS ChordPro parser
  const parsedSong = useMemo(() => {
    try {
      const rawText = isEditing && customText ? customText : selectedSong.content;
      const parser = new ChordSheetJS.ChordProParser();
      return parser.parse(rawText);
    } catch (e) {
      console.error('Failed to parse chord sheet:', e);
      return null;
    }
  }, [selectedSong, customText, isEditing]);

  // Extract unique chords present in the song (guaranteed strings)
  const uniqueChords = useMemo(() => {
    if (!parsedSong) return [];
    const chordsSet = new Set();

    parsedSong.lines.forEach((line) => {
      line.items.forEach((item) => {
        if (item.chord) {
          const trans = transposeChord(item.chord, transposeDelta);
          if (trans) chordsSet.add(trans);
        }
      });
    });

    return Array.from(chordsSet);
  }, [parsedSong, transposeDelta]);

  // Auto-scroll loop
  useEffect(() => {
    if (!isAutoScrolling) {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      return;
    }

    scrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
      } else {
        window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
      }
    }, 45);

    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [isAutoScrolling, scrollSpeed]);

  // Play chord audio when clicked
  const handleChordClick = (chordName) => {
    setPreviewChord(chordName);
    const found = CHORDS.find((c) => c.id.toLowerCase() === chordName.toLowerCase());
    if (found) {
      const validFreqs = found.frequencies.filter((f) => f > 0);
      playAcousticChord(validFreqs, 24);
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6 py-2">
      
      {/* Top Workspace Header (Transposition, Song Picker, Auto-Scroll) */}
      <div className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky top-20 z-40">
        
        {/* Song Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <Music size={18} className="text-blue-600" />
            <span>Song:</span>
          </div>
          <select
            value={selectedSong.id}
            onChange={(e) => {
              const s = SONGS.find((song) => song.id === e.target.value);
              if (s) setSelectedSong(s);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
          >
            {SONGS.map((song) => (
              <option key={song.id} value={song.id}>
                {song.title} — {song.artist}
              </option>
            ))}
          </select>
        </div>

        {/* Transpose Controls & Capo */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 px-2 uppercase">Key:</span>
          <button
            onClick={() => setTransposeDelta((d) => d - 1)}
            className="px-2.5 py-1 rounded-xl bg-white text-slate-700 font-mono font-bold text-xs border border-slate-200 shadow-sm hover:bg-slate-100"
            title="Transpose down 1 semitone"
          >
            ♭ -1
          </button>
          <span className="font-mono text-xs font-black text-blue-600 px-1 min-w-[28px] text-center">
            {transposeDelta > 0 ? `+${transposeDelta}` : transposeDelta}
          </span>
          <button
            onClick={() => setTransposeDelta((d) => d + 1)}
            className="px-2.5 py-1 rounded-xl bg-white text-slate-700 font-mono font-bold text-xs border border-slate-200 shadow-sm hover:bg-slate-100"
            title="Transpose up 1 semitone"
          >
            ♯ +1
          </button>
          {transposeDelta !== 0 && (
            <button
              onClick={() => setTransposeDelta(0)}
              className="text-[10px] text-slate-400 hover:text-slate-600 px-1 font-bold underline"
            >
              Reset
            </button>
          )}

          <div className="w-[1px] h-4 bg-slate-300 mx-1" />

          {/* Capo */}
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-xs font-bold text-slate-500">Capo:</span>
            <select
              value={capoOffset}
              onChange={(e) => setCapoOffset(Number(e.target.value))}
              className="bg-white border border-slate-200 text-xs font-bold rounded-lg px-2 py-0.5 cursor-pointer"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((fret) => (
                <option key={fret} value={fret}>
                  {fret === 0 ? 'None' : `Fret ${fret}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hands-Free Auto-Scroll Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isAutoScrolling
                ? 'bg-amber-500 text-white shadow-amber-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isAutoScrolling ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            <span>{isAutoScrolling ? 'Pause Scroll' : 'Auto-Scroll'}</span>
          </button>

          {/* Scroll Speed */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Speed:</span>
            <select
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 font-bold rounded-lg px-2 py-1 text-xs"
            >
              <option value={1}>0.5x Slow</option>
              <option value={2}>1x Normal</option>
              <option value={3}>1.5x Fast</option>
              <option value={5}>2x Pro</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main 2-Column Workspace: Song Sheet on Left, Chord Box Reference on Right */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Interactive Chord Sheet View (2 Cols) */}
        <div
          ref={scrollContainerRef}
          className="lg:col-span-2 bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 max-h-[800px] overflow-y-auto"
        >
          {/* Song Metadata */}
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-3xl font-black text-slate-900 font-sans tracking-tight">
              {selectedSong.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1 font-medium">
              <span>{selectedSong.artist}</span>
              <span>•</span>
              <span>Tempo: {selectedSong.tempo} BPM</span>
              {capoOffset > 0 && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 font-bold">Capo on Fret {capoOffset}</span>
                </>
              )}
            </div>
          </div>

          {/* Song Lyrics & Floating Chord Grid */}
          <div className="flex flex-col gap-5 font-mono text-base leading-relaxed select-text">
            {parsedSong &&
              parsedSong.lines.map((line, lIdx) => {
                // Section header (e.g. [Chorus], [Verse 1])
                const isSectionHeader = line.items.length === 1 && line.items[0].lyrics?.startsWith('[');
                if (isSectionHeader) {
                  return (
                    <div
                      key={`line-${lIdx}`}
                      className="font-sans font-extrabold text-blue-600 text-sm tracking-wider uppercase pt-4 border-t border-slate-100 mt-2"
                    >
                      {line.items[0].lyrics.replace(/[\[\]]/g, '')}
                    </div>
                  );
                }

                // If empty blank line
                if (line.items.length === 0 || (line.items.length === 1 && !line.items[0].chord && !line.items[0].lyrics)) {
                  return <div key={`line-${lIdx}`} className="h-3" />;
                }

                return (
                  <div key={`line-${lIdx}`} className="flex flex-wrap items-baseline gap-x-1">
                    {line.items.map((item, itemIdx) => {
                      const chord = item.chord ? transposeChord(item.chord, transposeDelta) : null;
                      const lyrics = item.lyrics;

                      return (
                        <div
                          key={`item-${lIdx}-${itemIdx}`}
                          className="inline-flex flex-col items-start leading-tight mr-1"
                        >
                          {/* Floating Chord Tag */}
                          {chord ? (
                            <button
                              onClick={() => handleChordClick(chord)}
                              className="text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-2 py-0.5 rounded-md border border-blue-200 transition-all cursor-pointer shadow-xs mb-1"
                              title={`Click to preview ${chord} chord diagram and acoustic pluck`}
                            >
                              {chord}
                            </button>
                          ) : (
                            <div className="h-5" />
                          )}

                          {/* Corresponding Lyrics */}
                          <span className="text-slate-800 text-[15px] font-sans font-medium whitespace-pre">
                            {lyrics || ' '}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>

        </div>

        {/* Right Column: Song Chords Reference & Interactive Box Preview */}
        <div className="flex flex-col gap-6 sticky top-44">
          
          {/* Active Preview Chord Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Chord Inspector
            </span>

            {previewChord ? (
              <div className="flex flex-col items-center">
                <ChordBox chordName={previewChord} size={130} />
                <button
                  onClick={() => handleChordClick(previewChord)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Volume2 size={13} />
                  <span>Strum Again</span>
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Click any chord in the song sheet to inspect its fingering diagram and hear its acoustic tone.
              </div>
            )}
          </div>

          {/* All Chords In This Song */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Chords in this Song ({uniqueChords.length})
            </span>

            <div className="grid grid-cols-2 gap-3">
              {uniqueChords.map((chord) => (
                <div
                  key={chord}
                  onClick={() => handleChordClick(chord)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center ${
                    previewChord === chord
                      ? 'bg-blue-50 border-blue-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-base font-black text-slate-900 font-mono">
                    {chord}
                  </span>
                  <div className="scale-75 origin-top mt-1">
                    <ChordBox chordName={chord} size={80} showName={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

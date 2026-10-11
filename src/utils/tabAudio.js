// Audio utilities for Interactive Guitar Tablature
// Calculates exact physical string frequencies considering open strings, frets, and capo
import { playAcousticPluck, playStrum } from '../audio/acousticSynth';

// Standard Tuning Open String Frequencies (Low E to High E)
// String indices: 0 = Low E (String 6), 1 = A (5), 2 = D (4), 3 = G (3), 4 = B (2), 5 = High E (1)
// Note: In TAB staff display, string 0 is top (High E) or bottom (Low E).
// We use 0 = String 1 (High E), 5 = String 6 (Low E) for standard TAB convention.

export const TAB_STRING_BASE_FREQS = [
  329.63, // String 1: High E (E4)
  246.94, // String 2: B (B3)
  196.00, // String 3: G (G3)
  146.83, // String 4: D (D3)
  110.00, // String 5: A (A2)
  82.41,  // String 6: Low E (E2)
];

export const TAB_STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];

/**
 * Calculates frequency for a specific string (0=High E, 5=Low E) and fret (0=open)
 */
export function getTabFrequency(stringIndex, fret, capo = 0) {
  if (stringIndex < 0 || stringIndex >= 6 || fret === null || fret === undefined || fret < 0) {
    return null;
  }
  const baseFreq = TAB_STRING_BASE_FREQS[stringIndex];
  const totalSemis = fret + capo;
  return baseFreq * Math.pow(2, totalSemis / 12);
}

/**
 * Plays a single plucked tab note with physical acoustic modeling
 */
export function playTabNote(stringIndex, fret, capo = 0, volume = 0.65) {
  const freq = getTabFrequency(stringIndex, fret, capo);
  if (!freq) return null;
  return playAcousticPluck(freq, 2.5, volume);
}

export function chordToFrequencies(frets, capo = 0) {
  // frets: [Low E, A, D, G, B, High E] (indices 0..5)
  if (!frets || !frets.length) return [];
  const freqs = [];
  for (let i = 0; i < 6; i++) {
    const f = frets[i];
    const tabStrIdx = 5 - i; // tab index 5 = Low E, 0 = High E
    if (f !== undefined && f !== null && f >= 0) {
      freqs.push(getTabFrequency(tabStrIdx, f, capo));
    } else {
      freqs.push(0);
    }
  }
  return freqs;
}

/**
 * Resolves frequencies for a chord name considering capo and custom chords
 */
export function getChordFrequencies(chordName, capo = 0, customChords = [], chordsList = []) {
  if (!chordName) return [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
  
  const all = [...(customChords || []), ...(chordsList || [])];
  const found = all.find(
    (c) =>
      c.id?.toLowerCase() === chordName.toLowerCase() ||
      c.name?.toLowerCase() === chordName.toLowerCase() ||
      c.name?.toLowerCase().startsWith(chordName.toLowerCase())
  );

  if (found) {
    if (found.frets) {
      return chordToFrequencies(found.frets, capo);
    }
    if (found.frequencies) {
      if (capo > 0) {
        return found.frequencies.map((f) => (f ? f * Math.pow(2, capo / 12) : 0));
      }
      return found.frequencies;
    }
  }

  // Fallback default open chord frequencies (e.g. G major with capo)
  const defaultGFrets = [3, 2, 0, 0, 0, 3];
  return chordToFrequencies(defaultGFrets, capo);
}

/**
 * Synthesizes a percussive guitar body chuck / muted slap
 */
export function playPercussiveHit(volume = 0.45) {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();
    const bufferSize = Math.floor(ctx.sampleRate * 0.045);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {
    console.warn('Percussive hit audio error:', e);
  }
}

/**
 * Plays an acoustic chord strum with direction (down or up) and humanized micro-timing
 */
export function playTabStrum(frequenciesOrChord, direction = 'down', capo = 0, tempo = 80, volume = 0.7, customChords = [], chordsList = []) {
  let freqs = frequenciesOrChord;
  if (typeof frequenciesOrChord === 'string') {
    freqs = getChordFrequencies(frequenciesOrChord, capo, customChords, chordsList);
  }
  if (!freqs || !freqs.length) return;
  playStrum(freqs, direction, tempo, volume);
}


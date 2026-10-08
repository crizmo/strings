// 3-Level Acoustic Mastery Engine
// Provides Level 1 (Beginner/Simplified), Level 2 (Standard Rhythm), and Level 3 (Pro Studio) for all songs

// Chord simplification dictionary for Level 1 (converting barre chords to friendly open chords)
const CHORD_SIMPLIFICATIONS = {
  F: 'Fmaj7',
  'F#m': 'Em',
  Bm: 'Em',
  Bb: 'Fmaj7',
  Gm: 'Em',
  Eb: 'D',
  'C#m': 'Am',
  B: 'A',
  B7: 'Em',
  Ab: 'G',
  Fm: 'Dm',
  Cm: 'Am',
};

// Pro embellishments for Level 3
const CHORD_EMBELLISHMENTS = {
  C: 'Cadd9',
  D: 'Dsus4',
  G: 'Gadd9',
  Em: 'Em7',
  A: 'A7sus4',
  Am: 'Am7',
  F: 'Fmaj7',
  Dm: 'Dm7',
};

export const getSongLevels = (song) => {
  if (!song) return null;

  // Level 1: Beginner / Simplified
  const simplifiedChords = (song.chordsUsed || []).map(
    (chord) => CHORD_SIMPLIFICATIONS[chord] || chord
  );
  const uniqueL1Chords = Array.from(new Set(simplifiedChords));

  // Generate Level 1 ChordPro content with simplified chord names
  let l1Content = song.content || '';
  Object.entries(CHORD_SIMPLIFICATIONS).forEach(([hardChord, easyChord]) => {
    const regex = new RegExp(`\\[${hardChord}\\]`, 'g');
    l1Content = l1Content.replace(regex, `[${easyChord}]`);
  });

  // Level 3: Pro / Embellished
  const proChords = (song.chordsUsed || []).map(
    (chord) => CHORD_EMBELLISHMENTS[chord] || chord
  );
  const uniqueL3Chords = Array.from(new Set([...(song.chordsUsed || []), ...proChords]));

  return {
    1: {
      level: 1,
      name: 'Beginner',
      subtitle: '1-Strum & Easy Chords',
      badge: 'Level 1: Beginner',
      color: '#16a34a',
      bg: '#dcfce7',
      border: '#bbf7d0',
      difficultyScore: 1,
      chords: uniqueL1Chords,
      capo: song.capo || 0,
      tempo: Math.round((song.tempo || 90) * 0.75), // 75% speed
      strummingLabel: '1 Downstrum per Bar on Beat 1 (or 4 soft downstrokes)',
      strumPatternId: 'simple_down',
      strummingFormula: '↓ . . . | ↓ . . .',
      focusGoal: 'Master clean finger placement and timing chord transitions without barre fatigue.',
      content: l1Content,
      tips: [
        'Strum only ONCE on beat 1 of each chord change to give yourself time to switch.',
        'Uses simplified open chords (like Fmaj7 instead of full barre F).',
        'Practice at 75% speed until your fingers remember the shapes.',
      ],
    },
    2: {
      level: 2,
      name: 'Intermediate',
      subtitle: 'Campfire & Full Rhythm',
      badge: 'Level 2: Standard',
      color: '#d97706',
      bg: '#fef3c7',
      border: '#fde68a',
      difficultyScore: song.difficultyScore || 2,
      chords: song.chordsUsed || [],
      capo: song.capo || 0,
      tempo: song.tempo || 100,
      strummingLabel: 'Classic Acoustic Strum (D - D U - U D U)',
      strumPatternId: song.strumPattern || 'folk_country',
      strummingFormula: '↓ . ↓ ↑ . ↑ ↓ ↑',
      focusGoal: 'Lock in a continuous, fluid acoustic strumming hand and keep steady time throughout all sections.',
      content: song.content || '',
      tips: [
        'Keep your right strumming hand moving like a pendulum, even on ghost strokes.',
        'Accent beats 2 and 4 for an authentic campfire acoustic drive.',
        'Sing or hum along to internalize the lyric phrasing.',
      ],
    },
    3: {
      level: 3,
      name: 'Advanced',
      subtitle: 'Pro Studio & Embellishments',
      badge: 'Level 3: Pro',
      color: '#9333ea',
      bg: '#f3e8ff',
      border: '#e9d5ff',
      difficultyScore: Math.min(5, (song.difficultyScore || 2) + 2),
      chords: uniqueL3Chords,
      capo: song.capo || 0,
      tempo: song.tempo || 100,
      strummingLabel: 'Dynamic Fingerpicking / Palm-Muted Accent Groove',
      strumPatternId: song.strumPattern || 'pop_ballad',
      strummingFormula: 'P - i - m - a (Bass + Arpeggio / Palm Mute)',
      focusGoal: 'Add studio-grade embellishments, suspended flourishes (Dsus4, Cadd9, Em7), and dynamic picking.',
      content: song.content || '',
      tips: [
        'Use pinky hammer-ons and pull-offs on open chord extensions (e.g. D to Dsus4, C to Cadd9).',
        'Add palm muting near the bridge on verses, then explode into full open strums on the chorus.',
        'Arpeggiate individual strings (Bass string -> G -> B -> High E) for intimate intro verses.',
      ],
    },
  };
};

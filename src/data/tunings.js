// Acoustic guitar tuning presets
// String numbering: 1 = High E, 6 = Low E
// Headstock layout: 3 Left (Strings 6, 5, 4), 3 Right (Strings 3, 2, 1)

export const TUNINGS = [
  {
    id: 'standard',
    name: 'Standard Tuning',
    description: 'The universal tuning for 99% of acoustic songs (E A D G B E)',
    strings: [
      { num: 1, note: 'E', octave: 4, freq: 329.63, pegSide: 'right', pegIndex: 2, label: 'High E' },
      { num: 2, note: 'B', octave: 3, freq: 246.94, pegSide: 'right', pegIndex: 1, label: 'B' },
      { num: 3, note: 'G', octave: 3, freq: 196.00, pegSide: 'right', pegIndex: 0, label: 'G' },
      { num: 4, note: 'D', octave: 3, freq: 146.83, pegSide: 'left',  pegIndex: 2, label: 'D' },
      { num: 5, note: 'A', octave: 2, freq: 110.00, pegSide: 'left',  pegIndex: 1, label: 'A' },
      { num: 6, note: 'E', octave: 2, freq: 82.41,  pegSide: 'left',  pegIndex: 0, label: 'Low E' },
    ],
  },
  {
    id: 'drop_d',
    name: 'Drop D',
    description: 'Low E dropped down a full step to D. Gives deep resonant bass (D A D G B E)',
    strings: [
      { num: 1, note: 'E', octave: 4, freq: 329.63, pegSide: 'right', pegIndex: 2, label: 'High E' },
      { num: 2, note: 'B', octave: 3, freq: 246.94, pegSide: 'right', pegIndex: 1, label: 'B' },
      { num: 3, note: 'G', octave: 3, freq: 196.00, pegSide: 'right', pegIndex: 0, label: 'G' },
      { num: 4, note: 'D', octave: 3, freq: 146.83, pegSide: 'left',  pegIndex: 2, label: 'D' },
      { num: 5, note: 'A', octave: 2, freq: 110.00, pegSide: 'left',  pegIndex: 1, label: 'A' },
      { num: 6, note: 'D', octave: 2, freq: 73.42,  pegSide: 'left',  pegIndex: 0, label: 'Drop D' },
    ],
  },
  {
    id: 'dadgad',
    name: 'DADGAD (Celtic / Folk)',
    description: 'Lush, modal, ringing acoustic resonance popularized by Led Zeppelin & Ed Sheeran',
    strings: [
      { num: 1, note: 'D', octave: 4, freq: 293.66, pegSide: 'right', pegIndex: 2, label: 'D' },
      { num: 2, note: 'A', octave: 3, freq: 220.00, pegSide: 'right', pegIndex: 1, label: 'A' },
      { num: 3, note: 'G', octave: 3, freq: 196.00, pegSide: 'right', pegIndex: 0, label: 'G' },
      { num: 4, note: 'D', octave: 3, freq: 146.83, pegSide: 'left',  pegIndex: 2, label: 'D' },
      { num: 5, note: 'A', octave: 2, freq: 110.00, pegSide: 'left',  pegIndex: 1, label: 'A' },
      { num: 6, note: 'D', octave: 2, freq: 73.42,  pegSide: 'left',  pegIndex: 0, label: 'D' },
    ],
  },
  {
    id: 'open_g',
    name: 'Open G',
    description: 'Strumming all open strings forms a glorious G major chord (D G D G B D)',
    strings: [
      { num: 1, note: 'D', octave: 4, freq: 293.66, pegSide: 'right', pegIndex: 2, label: 'D' },
      { num: 2, note: 'B', octave: 3, freq: 246.94, pegSide: 'right', pegIndex: 1, label: 'B' },
      { num: 3, note: 'G', octave: 3, freq: 196.00, pegSide: 'right', pegIndex: 0, label: 'G' },
      { num: 4, note: 'D', octave: 3, freq: 146.83, pegSide: 'left',  pegIndex: 2, label: 'D' },
      { num: 5, note: 'G', octave: 2, freq: 98.00,  pegSide: 'left',  pegIndex: 1, label: 'G' },
      { num: 6, note: 'D', octave: 2, freq: 73.42,  pegSide: 'left',  pegIndex: 0, label: 'D' },
    ],
  },
  {
    id: 'half_step',
    name: 'Half-Step Down (Eb)',
    description: 'Lower string tension, warmer acoustic tone, easier on beginner fingers (Eb Ab Db Gb Bb Eb)',
    strings: [
      { num: 1, note: 'D#', octave: 4, freq: 311.13, pegSide: 'right', pegIndex: 2, label: 'Eb' },
      { num: 2, note: 'A#', octave: 3, freq: 233.08, pegSide: 'right', pegIndex: 1, label: 'Bb' },
      { num: 3, note: 'F#', octave: 3, freq: 185.00, pegSide: 'right', pegIndex: 0, label: 'Gb' },
      { num: 4, note: 'C#', octave: 3, freq: 138.59, pegSide: 'left',  pegIndex: 2, label: 'Db' },
      { num: 5, note: 'G#', octave: 2, freq: 103.83, pegSide: 'left',  pegIndex: 1, label: 'Ab' },
      { num: 6, note: 'D#', octave: 2, freq: 77.78,  pegSide: 'left',  pegIndex: 0, label: 'Eb' },
    ],
  },
];

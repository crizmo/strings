// Tablature & Measure Sheet Presets
// Default: Hotel California (8 Chunks Breakdown with Capo 7th Fret)

export const TAB_PRESETS = [
  {
    id: 'hotel_california_chunks',
    name: 'Hotel California (8 Chunks Intro — Capo 7)',
    description: 'The step-by-step 8 chunks intro with Capo on 7th fret: Em, B7, Dsus2, A9, C, G, Am7, B7.',
    title: 'Hotel California (Intro Breakdown)',
    artist: 'Eagles (Capo 7th Fret)',
    tempo: 74,
    capo: 7,
    key: 'Em',
    timeSignature: '4/4',
    content: `{title: Hotel California (Intro Breakdown)}
{artist: Eagles (Capo 7th Fret)}
{capo: 7}

[Setup]
Capo: 7th Fret | Technique: Directional Picking with Pick | Anchor wrist on body

[Chunk 1: Em] (2:36)
[Em]Start with E minor shape. Strum, then pick: 3rd from top, 3rd from bottom, 3rd from top, 2nd from bottom.
Release ring finger and play 3rd from bottom, then strum 3rd & 2nd from bottom together.

[Chunk 2: B7] (6:55)
[B7]Index 1st fret (3rd from top), Middle 2nd fret (2nd from top), Ring 2nd fret (3rd from bottom), Pinky 2nd fret (bottom).
Pick: 3rd from top, 3rd from bottom, 2nd from bottom twice, bottom string, 3rd from bottom, 2nd from bottom, 3rd from top.

[Chunk 3: Dsus2] (10:25)
[Dsus2]Index 2nd fret (3rd from bottom), Ring 3rd fret (2nd from bottom).
Pick: 3rd from top, 3rd from bottom, 2nd from bottom, bottom string, 2nd from bottom, 3rd from top.

[Chunk 4: A9 variation] (13:50)
[A9]Ring on 4th fret (2nd from top), Index on 2nd fret (3rd from top).
Mimic the melodic flow of previous chunks.

[Chunk 5: C major] (18:03)
[C]Standard C chord. Pick: 2nd from top, 3rd from top, 3rd from bottom, 3rd from top, 2nd from bottom, 3rd from top, 3rd from bottom.
End with open bottom string and hammer-on to 2nd fret of 3rd from top.

[Chunk 6: G major] (20:06)
[G]Ring 3rd fret (bottom), Middle 3rd fret (top), Index 2nd fret (2nd from top). Keep picking steady.

[Chunk 7: Am7] (23:00)
[Am7]Index 1st fret (2nd from bottom), Middle 2nd fret (3rd from top). Use classic picking pattern.

[Chunk 8: B7 return] (24:25)
[B7]Return to B7 shape from Chunk #2 to close the intro.

[Verse 1]
[Em]On a dark desert highway, [B7]cool wind in my hair
[Dsus2]Warm smell of colitas, [A9]rising up through the air
[C]Up ahead in the distance, [G]I saw a shimmering light
[Am7]My head grew heavy and my sight grew dim, [B7]I had to stop for the night

[Chorus]
[C]Welcome to the Hotel Cali[G]fornia
Such a [B7]lovely place, such a [Em]lovely face
[C]Plenty of room at the Hotel Cali[G]fornia
Any [Am7]time of year, you can [B7]find it here`,
    measures: [
      // Chunk #1: Em (2:36)
      // Pick 3rd from top (D: str 3 fret 2), 3rd from bottom (G: str 2 fret 0), 3rd from top (D: str 3 fret 2), 2nd from bottom (B: str 1 fret 0)...
      {
        measureNum: 1,
        chord: 'Em',
        fingerGuide: '2:A2  3:D2',
        chunkLabel: 'Chunk 1 (2:36)',
        beats: [
          { string: 3, fret: 2, strum: 'down' }, // 3rd string from top (D) with intro strum
          { string: 2, fret: 0 }, // 3rd from bottom (G)
          { string: 3, fret: 2 }, // 3rd from top (D)
          { string: 1, fret: 0 }, // 2nd from bottom (B)
          { string: 2, fret: 0 }, // release ring finger (G open)
          { string: 2, fret: 0, chordNotes: [{ string: 1, fret: 0 }], strum: 'up' }, // strum G & B together
          { string: 3, fret: 2 }, // 3rd from top
          { string: 1, fret: 0 }, // 2nd from bottom
        ],
      },
      // Chunk #2: B7 (6:55)
      // Index 1st fret (D: str 3 fret 1), Middle 2nd fret (A: str 4 fret 2), Ring 2nd fret (G: str 2 fret 2), Pinky 2nd fret (High E: str 0 fret 2)
      {
        measureNum: 2,
        chord: 'B7',
        fingerGuide: '1:D1  2:A2  3:G2  4:e2',
        chunkLabel: 'Chunk 2 (6:55)',
        beats: [
          { string: 3, fret: 1 }, // 3rd from top
          { string: 2, fret: 2 }, // 3rd from bottom
          { string: 1, fret: 0 }, // 2nd from bottom
          { string: 1, fret: 0 }, // 2nd from bottom
          { string: 0, fret: 2 }, // bottom string
          { string: 2, fret: 2 }, // 3rd from bottom
          { string: 1, fret: 0 }, // 2nd from bottom
          { string: 3, fret: 1 }, // 3rd from top
        ],
      },
      // Chunk #3: Dsus2 (10:25)
      // Index on 2nd fret (G: str 2 fret 2), Ring on 3rd fret (B: str 1 fret 3)
      {
        measureNum: 3,
        chord: 'Dsus2',
        fingerGuide: '1:G2  3:B3',
        chunkLabel: 'Chunk 3 (10:25)',
        beats: [
          { string: 3, fret: 0 }, // 3rd from top (D open)
          { string: 2, fret: 2 }, // 3rd from bottom
          { string: 1, fret: 3 }, // 2nd from bottom
          { string: 1, fret: 3 }, // 2nd from bottom
          { string: 0, fret: 0 }, // bottom string (High E open)
          { string: 1, fret: 3 }, // 2nd from bottom
          { string: 2, fret: 2 }, // 3rd from bottom
          { string: 3, fret: 0 }, // 3rd from top
        ],
      },
      // Chunk #4: A9 variation (13:50)
      // Ring on 4th fret (A: str 4 fret 4), Index on 2nd fret (D: str 3 fret 2)
      {
        measureNum: 4,
        chord: 'A9',
        fingerGuide: '3:A4  1:D2',
        chunkLabel: 'Chunk 4 (13:50)',
        beats: [
          { string: 4, fret: 4 }, // 2nd from top (A string 4th fret)
          { string: 3, fret: 2 }, // 3rd from top (D string 2nd fret)
          { string: 2, fret: 0 }, // 3rd from bottom (G open)
          { string: 1, fret: 0 }, // 2nd from bottom (B open)
          { string: 0, fret: 0 }, // bottom string (High E open)
          { string: 1, fret: 0 }, // 2nd from bottom
          { string: 2, fret: 0 }, // 3rd from bottom
          { string: 3, fret: 2 }, // 3rd from top
        ],
      },
      // Chunk #5: C major (18:03)
      // Standard C (str 4 fret 3, str 3 fret 2, str 2 fret 0, str 1 fret 1, str 0 fret 0)
      {
        measureNum: 5,
        chord: 'C',
        fingerGuide: '1:B1  2:D2  3:A3',
        chunkLabel: 'Chunk 5 (18:03)',
        beats: [
          { string: 4, fret: 3 }, // 2nd from top (A)
          { string: 3, fret: 2 }, // 3rd from top (D)
          { string: 2, fret: 0 }, // 3rd from bottom (G)
          { string: 3, fret: 2 }, // 3rd from top (D)
          { string: 1, fret: 1 }, // 2nd from bottom (B)
          { string: 3, fret: 2 }, // 3rd from top (D)
          { string: 2, fret: 0 }, // 3rd from bottom (G)
          { string: 0, fret: 0, chordNotes: [{ string: 3, fret: 2 }] }, // open bottom + hammer-on to 2nd fret D
        ],
      },
      // Chunk #6: G major (20:06)
      // Ring on 3rd fret (High E: str 0 fret 3), Middle on 3rd fret (Low E: str 5 fret 3), Index on 2nd fret (A: str 4 fret 2)
      {
        measureNum: 6,
        chord: 'G',
        fingerGuide: '2:E3  1:A2  3:e3',
        chunkLabel: 'Chunk 6 (20:06)',
        beats: [
          { string: 5, fret: 3 }, // top string (Low E)
          { string: 4, fret: 2 }, // 2nd from top (A)
          { string: 2, fret: 0 }, // 3rd from bottom (G)
          { string: 1, fret: 0 }, // 2nd from bottom (B)
          { string: 0, fret: 3 }, // bottom string (High E)
          { string: 1, fret: 0 }, // 2nd from bottom
          { string: 2, fret: 0 }, // 3rd from bottom
          { string: 3, fret: 0 }, // 3rd from top
        ],
      },
      // Chunk #7: Am7 (23:00)
      // Index on 1st fret (B: str 1 fret 1), Middle on 2nd fret (D: str 3 fret 2)
      {
        measureNum: 7,
        chord: 'Am7',
        fingerGuide: '1:B1  2:D2',
        chunkLabel: 'Chunk 7 (23:00)',
        beats: [
          { string: 4, fret: 0 }, // 2nd from top (A open)
          { string: 3, fret: 2 }, // 3rd from top (D 2nd fret)
          { string: 2, fret: 0 }, // 3rd from bottom (G open)
          { string: 1, fret: 1 }, // 2nd from bottom (B 1st fret)
          { string: 0, fret: 0 }, // bottom string (High E open)
          { string: 1, fret: 1 }, // 2nd from bottom
          { string: 2, fret: 0 }, // 3rd from bottom
          { string: 3, fret: 2 }, // 3rd from top
        ],
      },
      // Chunk #8: B7 return (24:25)
      // Return to B7 shape from Chunk #2
      {
        measureNum: 8,
        chord: 'B7',
        fingerGuide: '1:D1  2:A2  3:G2  4:e2',
        chunkLabel: 'Chunk 8 (24:25)',
        beats: [
          { string: 3, fret: 1 }, // 3rd from top
          { string: 2, fret: 2 }, // 3rd from bottom
          { string: 1, fret: 0 }, // 2nd from bottom
          { string: 1, fret: 0 }, // 2nd from bottom
          { string: 0, fret: 2 }, // bottom string
          { string: 2, fret: 2 }, // 3rd from bottom
          { string: 1, fret: 0 }, // 2nd from bottom
          { string: 3, fret: 1 }, // 3rd from top
        ],
      },
    ],
  },
  {
    id: 'screenshot_gadd9',
    name: 'Gadd9 – Emadd9 Acoustic Pattern (As in Image)',
    description: '8-measure acoustic arpeggio with Capo 1, Gadd9, Emadd9, Cadd9, and Dsus2.',
    title: 'Acoustic Arpeggio in Gadd9',
    artist: 'Acoustic Master',
    tempo: 76,
    capo: 1,
    key: 'G',
    timeSignature: '4/4',
    content: `{title: Acoustic Arpeggio in Gadd9}
{artist: Acoustic Master}
{capo: 1}

[Intro]
[Gadd9]Sunlight falling soft upon the strings
[Emadd9]Echoes of the melody it brings
[Cadd9]Moving gently like the morning light
[Dsus2]Drifting softly through the fading [Gadd9]night`,
    measures: [
      {
        measureNum: 1,
        chord: 'Gadd9',
        beats: [
          { string: 5, fret: 3 },
          { string: 2, fret: 0 },
          { string: 3, fret: 2 },
          { string: 2, fret: 0 },
          { string: 1, fret: 2, chordNotes: [{ string: 0, fret: 0 }] },
          { string: 2, fret: 0 },
          { string: 1, fret: 2 },
          { string: 2, fret: 0 },
        ],
      },
      {
        measureNum: 2,
        chord: 'Gadd9',
        beats: [
          { string: 5, fret: 3 },
          { string: 2, fret: 0 },
          { string: 3, fret: 2 },
          { string: 2, fret: 0 },
          { string: 0, fret: 0 },
          { string: 1, fret: 2 },
          { string: 2, fret: 0 },
          { string: 1, fret: 2 },
        ],
      },
      {
        measureNum: 3,
        chord: 'Emadd9',
        beats: [
          { string: 5, fret: 0 },
          { string: 4, fret: 2 },
          { string: 3, fret: 4 },
          { string: 4, fret: 2 },
          { string: 2, fret: 0 },
          { string: 3, fret: 4 },
          { string: 4, fret: 2 },
          { string: 3, fret: 4 },
        ],
      },
      {
        measureNum: 4,
        chord: 'Emadd9',
        beats: [
          { string: 5, fret: 0 },
          { string: 4, fret: 2 },
          { string: 3, fret: 4 },
          { string: 4, fret: 2 },
          { string: 2, fret: 0 },
          { string: 3, fret: 4 },
          { string: 4, fret: 2 },
          { string: 3, fret: 4 },
        ],
      },
      {
        measureNum: 5,
        chord: 'Cadd9',
        beats: [
          { string: 4, fret: 3 },
          { string: 2, fret: 0 },
          { string: 1, fret: 3 },
          { string: 2, fret: 0 },
          { string: 0, fret: 1 },
          { string: 1, fret: 0 },
          { string: 4, fret: 3 },
          { string: 2, fret: 0 },
        ],
      },
      {
        measureNum: 6,
        chord: 'Dsus2',
        beats: [
          { string: 3, fret: 0 },
          { string: 2, fret: 2 },
          { string: 0, fret: 0 },
          { string: 2, fret: 2 },
          { string: 1, fret: 3 },
          { string: 2, fret: 2 },
          { string: 3, fret: 0 },
          { string: 1, fret: 2 },
        ],
      },
      {
        measureNum: 7,
        chord: 'Gadd9',
        beats: [
          { string: 5, fret: 3 },
          { string: 2, fret: 0 },
          { string: 3, fret: 2 },
          { string: 2, fret: 0 },
          { string: 0, fret: 0 },
          { string: 1, fret: 2 },
          { string: 2, fret: 0 },
          { string: 1, fret: 2 },
        ],
      },
      {
        measureNum: 8,
        chord: 'Gadd9',
        beats: [
          { string: 5, fret: 3 },
          { string: 2, fret: 0 },
          { string: 3, fret: 2 },
          { string: 2, fret: 0 },
          { string: 0, fret: 0 },
          { string: 1, fret: 2 },
          { string: 2, fret: 0 },
          { string: 1, fret: 2 },
        ],
      },
    ],
  },
];

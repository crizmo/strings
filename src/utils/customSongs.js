// Storage & Template utilities for custom songs created in Chord Sheet Designer
import { SONGS } from '../data/songs';

export const CUSTOM_SONGS_KEY = 'string_custom_songs';

export const SONG_TEMPLATES = [
  {
    id: 'template_pop_4chords',
    name: 'Pop 4-Chords Anthem (G - D - Em - C)',
    description: 'The legendary chord progression used in hundreds of hit acoustic songs.',
    title: 'My Acoustic Anthem',
    artist: 'Me',
    year: new Date().getFullYear(),
    genre: 'Pop / Acoustic',
    difficulty: 'beginner',
    difficultyScore: 1,
    tempo: 88,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'island',
    categories: ['essential', 'pop', 'campfire'],
    chordsUsed: ['G', 'D', 'Em', 'C'],
    teachingNotes: {
      overview: 'Classic 4-chord progression. Keep your anchor fingers steady when switching between G, Em, and C!',
      tips: [
        'Lock in the Island Strum (D - D U - U D U)',
        'Practice switching from G to D smoothly without pausing',
        'Keep finger 3 and 4 planted on the high strings if playing acoustic rock style',
      ],
      commonMistakes: [
        'Pausing during the chord transition',
        'Strumming too hard on the upstrokes',
      ],
    },
    content: `{title: My Acoustic Anthem}
{artist: Me}

[Verse 1]
[G]Sunlight streaming through the [D]open door
[Em]Leaving footprints on the [C]wooden floor
[G]Strumming melodies that [D]feel so right
[Em]Singing songs into the [C]summer night

[Chorus]
'Cause we've got [G]all the time in the [D]world today
Let the [Em]chords ring out and the [C]music play
Yeah we've got [G]love and rhythm and a [D]simple song
[Em]Come on everybody and [C]sing along`,
  },
  {
    id: 'template_campfire_folk',
    name: 'Campfire Folk Ballad (C - Am - F - G)',
    description: 'Warm, heartfelt 50s doo-wop / folk progression in the key of C.',
    title: 'Campfire Glow',
    artist: 'Me',
    year: new Date().getFullYear(),
    genre: 'Folk',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 78,
    capo: 0,
    key: 'C',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['campfire', 'folk', 'essential'],
    chordsUsed: ['C', 'Am', 'Fmaj7', 'G'],
    teachingNotes: {
      overview: 'The golden circle of 5ths progression. We use Fmaj7 (0-3-3-2-1-0 or x-x-3-2-1-0) instead of barre F for beginner ease!',
      tips: [
        'C to Am only requires moving one finger (ring finger)',
        'Use Fmaj7 to avoid stressful barre chords',
        'Give a gentle boom on the bass note for each chord',
      ],
      commonMistakes: [
        'Accidentally muting high E on the C chord',
        'Fretting too far from the fretwire',
      ],
    },
    content: `{title: Campfire Glow}
{artist: Me}

[Verse 1]
[C]Sparks fly up into the [Am]starry sky
[Fmaj7]Smoke drifting slowly as the [G]night goes by
[C]Gather close beside the [Am]golden flame
[Fmaj7]Whisper softly to re[G]call a name

[Chorus]
And the [C]fire burns warm through the [Am]chilly night
With our [Fmaj7]old six-string in the [G]flickering light
[C]Home is wherever this [Am]song may be
[Fmaj7]Underneath the canopy [G]by the sea`,
  },
  {
    id: 'template_two_chord_groove',
    name: 'Absolute Beginner 2-Chord Jam (Em - D)',
    description: 'Zero stress! Just 2 chords back and forth like "Horse With No Name".',
    title: 'Desert Breeze',
    artist: 'Me',
    year: new Date().getFullYear(),
    genre: 'Acoustic Rock',
    difficulty: 'beginner',
    difficultyScore: 1,
    tempo: 96,
    capo: 0,
    key: 'Em',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['essential', 'campfire'],
    chordsUsed: ['Em', 'D'],
    teachingNotes: {
      overview: 'Only two chords! Great for absolute beginners building strumming stamina and transition speed.',
      tips: [
        'Em uses fingers 1 and 2 on the 2nd fret of strings 5 and 4',
        'Keep right hand rhythm swinging like a steady pendulum',
        'Switch right on beat 1 of each measure',
      ],
      commonMistakes: [
        'Stopping your strumming hand when changing chords',
      ],
    },
    content: `{title: Desert Breeze}
{artist: Me}

[Verse 1]
[Em]Riding down the dusty trail
[D]Wind is blowing in my sail
[Em]Nothing left behind to find
[D]Peace of heart and ease of mind

[Chorus]
[Em]Oh, feel the desert breeze
[D]Whispering across the trees
[Em]Oh, moving wild and free
[D]Just the open road and me`,
  },
  {
    id: 'template_34_waltz',
    name: '3/4 Campfire Waltz (G - C - D)',
    description: 'Gentle, swaying 3-beat rhythm in 3/4 time signature.',
    title: 'River Willow Waltz',
    artist: 'Me',
    year: new Date().getFullYear(),
    genre: 'Folk',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 92,
    capo: 0,
    key: 'G',
    timeSignature: '3/4',
    strumPattern: 'waltz',
    categories: ['folk', 'campfire'],
    chordsUsed: ['G', 'C', 'D'],
    teachingNotes: {
      overview: '3/4 time signature: Count ONE-two-three, ONE-two-three! Hit the bass on 1, strum down-up on 2 and 3.',
      tips: [
        'Accent beat 1 heavily with the thumb or pick on the root string',
        'Strum lightly on beats 2 and 3',
      ],
      commonMistakes: [
        'Counting in 4 instead of 3',
      ],
    },
    content: `{title: River Willow Waltz}
{artist: Me}

[Verse 1]
[G]Down by the river the [C]willow trees sway
[D]Watching the daylight slip [G]softly away
[G]Water is humming a [C]hymn to the dawn
[D]Long after all of the [G]travelers have gone

[Chorus]
[C]Dance with me softly in [G]three-quarter time
[D]Every sweet melody [G]finding its rhyme
[C]Round and around till the [G]morning comes near
[D]Holding you close with no [G]sorrow or fear`,
  },
];

/**
 * Reads custom songs from localStorage
 */
export function getCustomSongs() {
  try {
    const raw = localStorage.getItem(CUSTOM_SONGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load custom songs:', e);
    return [];
  }
}

/**
 * Saves or updates a custom song in localStorage
 */
export function saveCustomSong(song) {
  try {
    const existing = getCustomSongs();
    const songId = song.id || `custom_${Date.now()}`;
    const cleanSong = {
      ...song,
      id: songId,
      isCustom: true,
      updatedAt: new Date().toISOString(),
    };

    const index = existing.findIndex((s) => s.id === songId);
    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = cleanSong;
    } else {
      updated = [cleanSong, ...existing];
    }

    localStorage.setItem(CUSTOM_SONGS_KEY, JSON.stringify(updated));
    return cleanSong;
  } catch (e) {
    console.error('Failed to save custom song:', e);
    throw e;
  }
}

/**
 * Deletes a custom song from localStorage
 */
export function deleteCustomSong(songId) {
  try {
    const existing = getCustomSongs();
    const updated = existing.filter((s) => s.id !== songId);
    localStorage.setItem(CUSTOM_SONGS_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Failed to delete custom song:', e);
    return false;
  }
}

/**
 * Merges custom songs with static SONGS library
 */
export function getAllSongs() {
  const custom = getCustomSongs();
  return [...custom, ...SONGS];
}

/**
 * Parses all chords used from a ChordPro formatted string
 */
export function extractChordsFromChordPro(content = '') {
  if (!content) return [];
  const matches = content.match(/\[([A-G][b#]?(?:maj|min|m|M|sus|add|dim|aug|[0-9])*(?:\/[A-G][b#]?)?)\]/g) || [];
  const chords = matches.map((m) => m.slice(1, -1));
  return Array.from(new Set(chords));
}

/**
 * Generates an export-ready JSON string matching the exact app SONGS schema
 */
export function formatSongAsJson(song) {
  const exportObject = {
    id: song.id || `custom_${Date.now()}`,
    title: song.title || 'Untitled Acoustic Song',
    artist: song.artist || 'Independent Artist',
    year: Number(song.year) || new Date().getFullYear(),
    genre: song.genre || 'Acoustic',
    difficulty: song.difficulty || 'beginner',
    difficultyScore: Number(song.difficultyScore) || 1,
    tempo: Number(song.tempo) || 90,
    capo: Number(song.capo) || 0,
    key: song.key || 'G',
    timeSignature: song.timeSignature || '4/4',
    strumPattern: song.strumPattern || 'island',
    customStrumSteps: song.customStrumSteps || null,
    measures: song.measures || null,
    customChords: song.customChords || [],
    categories: song.categories?.length ? song.categories : ['essential', 'campfire'],
    chordsUsed: song.chordsUsed?.length ? song.chordsUsed : extractChordsFromChordPro(song.content),
    teachingNotes: {
      overview: song.teachingNotes?.overview || 'Beginner acoustic arrangement designed with Strings Studio.',
      tips: song.teachingNotes?.tips?.length ? song.teachingNotes.tips : ['Keep fingers arched on tips', 'Practice steady strumming'],
      commonMistakes: song.teachingNotes?.commonMistakes?.length ? song.teachingNotes.commonMistakes : ['Rushing chord transitions'],
    },
    content: song.content || '',
  };

  return JSON.stringify(exportObject, null, 2);
}

// Massive beginner-friendly acoustic song library — 40+ famous songs in ChordPro format
// Each song includes detailed teaching notes, difficulty scoring, categories, and strumming pattern links

export const SONGS = [
  // ============ TIER 1: ABSOLUTE BEGINNER (2-3 chords) ============
  {
    id: 'horse_no_name',
    title: 'A Horse with No Name',
    artist: 'America',
    year: 1971,
    genre: 'Folk Rock',
    difficulty: 'beginner',
    difficultyScore: 1,
    tempo: 122,
    capo: 0,
    key: 'Em',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['essential', 'campfire', 'folk', '70s'],
    chordsUsed: ['Em', 'D'],
    teachingNotes: {
      overview: 'The easiest guitar song in history — just 2 chords alternating back and forth! Perfect first song for absolute beginners.',
      tips: ['Only 2 chords: Em and D6add9 (we simplify to D)', 'Both chords use similar finger positions', 'Keep a steady strumming rhythm throughout'],
      commonMistakes: ['Rushing the chord change', 'Not letting strings ring clearly'],
    },
    content: `{title: A Horse with No Name}
{artist: America}

[Verse 1]
On the [Em]first part of the journey, I was [D]looking at all the life
There were [Em]plants and birds and rocks and things, there was [D]sand and hills and rings
The [Em]first thing I met was a fly with a buzz, and the [D]sky with no clouds
The [Em]heat was hot and the ground was dry, but the [D]air was full of sound

[Chorus]
I've been [Em]through the desert on a horse with no name
It felt [D]good to be out of the rain
In the [Em]desert, you can't remember your name
'Cause there [D]ain't no one for to give you no pain
[Em]La, la, la, la, la, la, la, la, la...
[D]La, la, la, la, la, la, la, la, la...`,
  },
  {
    id: 'love_me_do',
    title: 'Love Me Do',
    artist: 'The Beatles',
    year: 1962,
    genre: 'Rock',
    difficulty: 'beginner',
    difficultyScore: 1,
    tempo: 148,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['essential', 'rock', '60s', 'campfire'],
    chordsUsed: ['G', 'C', 'D'],
    teachingNotes: {
      overview: 'The Beatles\' debut single! Simple 3-chord song that every guitarist should know.',
      tips: ['G, C, and D are the most important chords to master', 'Practice the G to C switch — it\'s the foundation of hundreds of songs', 'Keep a light, bouncy strum'],
      commonMistakes: ['Not cleanly fretting the C chord', 'Strumming too hard'],
    },
    content: `{title: Love Me Do}
{artist: The Beatles}

[Verse 1]
[G]Love, love me [C]do, you [G]know I love [C]you
I'll [G]always be [C]true, so [G]please... [C]love me [G]do

[Chorus]
[D]Someone to love, [C]somebody [G]new
[D]Someone to love, [C]somebody like [G]you

[Verse 2]
[G]Love, love me [C]do, you [G]know I love [C]you
I'll [G]always be [C]true, so [G]please... [C]love me [G]do`,
  },
  {
    id: 'three_little_birds',
    title: 'Three Little Birds',
    artist: 'Bob Marley',
    year: 1977,
    genre: 'Reggae',
    difficulty: 'beginner',
    difficultyScore: 1,
    tempo: 74,
    capo: 0,
    key: 'A',
    timeSignature: '4/4',
    strumPattern: 'island',
    categories: ['essential', 'campfire', 'chill', 'reggae'],
    chordsUsed: ['A', 'D', 'E'],
    teachingNotes: {
      overview: 'The ultimate feel-good song! "Don\'t worry about a thing" — relaxed reggae groove with just 3 chords.',
      tips: ['Use a relaxed island strum pattern', 'Let the A chord ring on "Don\'t worry"', 'Keep tempo slow and laid-back'],
      commonMistakes: ['Playing too fast — this should be chill', 'Strumming too aggressively'],
    },
    content: `{title: Three Little Birds}
{artist: Bob Marley}

[Chorus]
[A]Don't worry about a thing
'Cause [D]every little thing gonna be al[A]right
Singin' [A]don't worry about a thing
'Cause [D]every little thing gonna be al[A]right

[Verse 1]
[A]Rise up this mornin', smiled with the [E]risin' sun
Three little [A]birds, pitched by my [D]doorstep
Singin' [A]sweet songs, of melodies [E]pure and true
Sayin' [D]this is my message to [A]you

[Chorus]
[A]Don't worry about a thing
'Cause [D]every little thing gonna be al[A]right`,
  },
  {
    id: 'bad_moon_rising',
    title: 'Bad Moon Rising',
    artist: 'Creedence Clearwater Revival',
    year: 1969,
    genre: 'Rock',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 176,
    capo: 0,
    key: 'D',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['rock', '60s', 'campfire', 'essential'],
    chordsUsed: ['D', 'A', 'G'],
    teachingNotes: {
      overview: 'Classic 3-chord rock song by CCR. Fast tempo but simple chord progression — D, A, G all night long!',
      tips: ['The chord progression is D - A - G throughout', 'Practice at half speed first', 'All down strums work great for this'],
      commonMistakes: ['Trying to play at full speed too soon', 'Sloppy chord changes at high tempo'],
    },
    content: `{title: Bad Moon Rising}
{artist: Creedence Clearwater Revival}

[Verse 1]
[D]I see the [A]bad [G]moon a-[D]rising
[D]I see [A]trouble [G]on the [D]way
[D]I see [A]earth[G]quakes and [D]lightnin'
[D]I see [A]bad [G]times to[D]day

[Chorus]
[G]Don't go around tonight, well it's [D]bound to take your life
[A]There's a [G]bad moon on the [D]rise

[Verse 2]
[D]I hear [A]hurri[G]canes a-[D]blowin'
[D]I know the [A]end is [G]coming [D]soon
[D]I fear [A]rivers [G]over[D]flowing
[D]I hear the [A]voice of [G]rage and [D]ruin`,
  },
  {
    id: 'knockin',
    title: "Knockin' On Heaven's Door",
    artist: 'Bob Dylan',
    year: 1973,
    genre: 'Folk Rock',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 68,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['essential', 'ballad', 'folk', '70s', 'campfire'],
    chordsUsed: ['G', 'D', 'Am', 'C'],
    teachingNotes: {
      overview: 'Slow, soulful acoustic ballad by Bob Dylan. Standard G-D-Am/C chords that every guitarist must know.',
      tips: ['Play slow and let chords breathe', 'The verse pattern is G-D-Am, G-D-C', 'Great song for practicing chord transitions at slow tempo'],
      commonMistakes: ['Playing too fast — this is a ballad', 'Not muting the low E on Am and C'],
    },
    content: `{title: Knockin' On Heaven's Door}
{artist: Bob Dylan}

[Verse 1]
[G]Mama, take this [D]badge off of [Am]me
[G]I can't [D]use it any[C]more
[G]It's gettin' dark, too [D]dark for me to [Am]see
[G]I feel I'm [D]knockin' on heaven's [C]door

[Chorus]
[G]Knock, knock, [D]knockin' on heaven's [Am]door
[G]Knock, knock, [D]knockin' on heaven's [C]door
[G]Knock, knock, [D]knockin' on heaven's [Am]door
[G]Knock, knock, [D]knockin' on heaven's [C]door

[Verse 2]
[G]Mama, put my [D]guns in the [Am]ground
[G]I can't [D]shoot them any[C]more
[G]That long black cloud is [D]comin' on [Am]down
[G]I feel I'm [D]knockin' on heaven's [C]door`,
  },
  {
    id: 'you_are_sunshine',
    title: 'You Are My Sunshine',
    artist: 'Johnny Cash',
    year: 1939,
    genre: 'Country',
    difficulty: 'beginner',
    difficultyScore: 1,
    tempo: 100,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['country', 'campfire', 'essential', 'folk'],
    chordsUsed: ['G', 'C', 'D'],
    teachingNotes: {
      overview: 'A timeless folk/country classic that everyone knows! Perfect for singing around a campfire.',
      tips: ['Simple G-C-D progression', 'Great for singing and playing simultaneously', 'Keep a steady "boom-chick" country strum'],
      commonMistakes: ['Getting lost in the lyrics while changing chords'],
    },
    content: `{title: You Are My Sunshine}
{artist: Johnny Cash}

[Chorus]
You are my [G]sunshine, my only sunshine
You make me [C]happy when skies are [G]gray
You'll never [C]know dear, how much I [G]love you
Please don't [D]take my sunshine a[G]way

[Verse 1]
The other [G]night dear, as I lay sleeping
I dreamed I [C]held you in my [G]arms
When I a[C]woke dear, I was mis[G]taken
So I hung my [D]head and I [G]cried`,
  },
  {
    id: 'ring_of_fire',
    title: 'Ring of Fire',
    artist: 'Johnny Cash',
    year: 1963,
    genre: 'Country',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 108,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['country', 'campfire', 'essential', '60s'],
    chordsUsed: ['G', 'C', 'D'],
    teachingNotes: {
      overview: 'Johnny Cash\'s iconic country classic — simple G-C-D with a catchy rhythm.',
      tips: ['The strumming pattern has a slight swing to it', 'Emphasize the downbeats', 'Practice the quick G to C switch'],
      commonMistakes: ['Losing the rhythm during chord changes'],
    },
    content: `{title: Ring of Fire}
{artist: Johnny Cash}

[Verse 1]
[G]Love is a [C]burning [G]thing
And it [G]makes a [C]fiery [G]ring
[G]Bound by [C]wild de[G]sire
[G]I fell into a [C]ring of [G]fire

[Chorus]
[D]I fell in to a [C]burning ring of [G]fire
I went [D]down, down, down and the [C]flames went [G]higher
And it [G]burns, burns, burns
The [C]ring of [G]fire, the [D]ring of [G]fire`,
  },

  // ============ TIER 2: BEGINNER (3-4 chords) ============
  {
    id: 'riptide',
    title: 'Riptide',
    artist: 'Vance Joy',
    year: 2013,
    genre: 'Indie Pop',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 100,
    capo: 1,
    key: 'Am',
    timeSignature: '4/4',
    strumPattern: 'island',
    categories: ['essential', 'pop', 'campfire', 'trending'],
    chordsUsed: ['Am', 'G', 'C'],
    teachingNotes: {
      overview: 'The #1 beginner acoustic song in the world! Originally a ukulele song, it translates perfectly to guitar.',
      tips: ['Use the island strum pattern: D-DU-UDU', 'Capo on fret 1 to match the original key', 'The Am→G→C progression repeats throughout'],
      commonMistakes: ['Not using a capo (will sound off from the recording)', 'Strumming pattern timing — practice the muted strum on beat 3'],
    },
    content: `{title: Riptide}
{artist: Vance Joy}
{capo: 1}

[Verse 1]
[Am]I was scared of [G]dentists and the [C]dark
[Am]I was scared of [G]pretty girls and [C]starting conversations
Oh, [Am]all my [G]friends are turning [C]green
You're the [Am]magician's as[G]sistant in their [C]dreams

[Chorus]
Oh, [Am]closer, [G]come on and [C]close your eyes
[Am]Lady, [G]running down to the [C]riptide
Taken away to the [Am]dark side
[G]I wanna be your [C]left hand man
I [Am]love you when you're [G]singing that song and
[C]I got a lump in my throat 'cause
[Am]You're gonna [G]sing the words [C]wrong

[Verse 2]
[Am]There's this movie that I [G]think you'll [C]like
This [Am]guy decides to [G]quit his job and [C]heads to New York City
This [Am]cowboy's [G]running from him[C]self
And [Am]she's been living on the [G]highest [C]shelf`,
  },
  {
    id: 'stand_by_me',
    title: 'Stand By Me',
    artist: 'Ben E. King',
    year: 1961,
    genre: 'Soul',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 118,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['essential', 'ballad', '60s', 'campfire', 'movie'],
    chordsUsed: ['G', 'Em', 'C', 'D'],
    teachingNotes: {
      overview: 'Iconic 4-chord acoustic progression that\'s been covered thousands of times. Timeless classic!',
      tips: ['The bass line is crucial — try alternating bass notes', 'G-Em-C-D is one of the most important progressions in music', 'Slow, steady strum with emphasis on beat 1'],
      commonMistakes: ['Rushing through the progression', 'Not giving each chord its full measure'],
    },
    content: `{title: Stand By Me}
{artist: Ben E. King}

[Verse 1]
When the [G]night has come, [Em]and the land is dark
And the [C]moon is the [D]only light we'll [G]see
No, I [G]won't be afraid, no, I [Em]won't be afraid
Just as [C]long as you [D]stand, stand by [G]me

[Chorus]
So darling, darling, [G]stand by me, oh, [Em]stand by me
Oh, [C]stand, [D]stand by me, [G]stand by me

[Verse 2]
If the [G]sky that we look upon [Em]should tumble and fall
Or the [C]mountains should [D]crumble to the [G]sea
I won't [G]cry, I won't cry, no, I [Em]won't shed a tear
Just as [C]long as you [D]stand, stand by [G]me`,
  },
  {
    id: 'wonderwall',
    title: 'Wonderwall',
    artist: 'Oasis',
    year: 1995,
    genre: 'Rock',
    difficulty: 'beginner',
    difficultyScore: 3,
    tempo: 87,
    capo: 2,
    key: 'Em',
    timeSignature: '4/4',
    strumPattern: 'island',
    categories: ['essential', 'rock', '90s', 'campfire', 'trending'],
    chordsUsed: ['Em', 'G', 'D', 'A'],
    teachingNotes: {
      overview: 'THE quintessential campfire guitar song. Every guitarist plays this at some point — make sure you play it well!',
      tips: ['Capo 2 is essential to match the original', 'The real chords are Em7-G-Dsus4-A7sus4 but standard shapes work', 'Master the strumming pattern — it makes this song shine'],
      commonMistakes: ['Playing open chords without the capo', 'Basic down-strum only — learn the proper pattern!'],
    },
    content: `{title: Wonderwall}
{artist: Oasis}
{capo: 2}

[Verse 1]
[Em]Today is gonna be the day that they're [G]gonna throw it back to [D]you
[Em]By now you shoulda somehow rea[G]lized what you gotta [D]do
[Em]I don't believe that any[G]body feels the way I [D]do about you [A]now

[Verse 2]
[Em]Backbeat, the word is on the street that the [G]fire in your heart is [D]out
[Em]I'm sure you've heard it all before but you [G]never really had a [D]doubt
[Em]I don't believe that any[G]body feels the way I [D]do about you [A]now

[Pre-Chorus]
And [C]all the roads we [D]have to walk are [Em]winding
And [C]all the lights that [D]lead us there are [Em]blinding
[C]There are many [D]things that I would like to say to you
But I don't know [A]how

[Chorus]
Because [C]maybe, [Em]you're gonna be the one that [G]saves me
And [Em]after [C]all, [Em]you're my wonder[G]wall[Em]`,
  },
  {
    id: 'let_it_be',
    title: 'Let It Be',
    artist: 'The Beatles',
    year: 1970,
    genre: 'Rock',
    difficulty: 'beginner',
    difficultyScore: 3,
    tempo: 71,
    capo: 0,
    key: 'C',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['essential', 'rock', '70s', 'ballad', 'campfire'],
    chordsUsed: ['C', 'G', 'Am', 'Fmaj7'],
    teachingNotes: {
      overview: 'One of The Beatles\' most beloved songs. The C-G-Am-F progression is the backbone of thousands of pop songs.',
      tips: ['We use Fmaj7 instead of the barre F — it sounds beautiful and is much easier', 'This progression (I-V-vi-IV) is the most common in all of pop music', 'Play slowly and let each chord ring fully'],
      commonMistakes: ['Struggling with the F chord — use Fmaj7 instead!', 'Playing too fast — this is a gentle ballad'],
    },
    content: `{title: Let It Be}
{artist: The Beatles}

[Verse 1]
When I [C]find myself in [G]times of trouble, [Am]Mother Mary [Fmaj7]comes to me
[C]Speaking words of [G]wisdom, let it [Fmaj7]be [C]
And [C]in my hour of [G]darkness, she is [Am]standing right in [Fmaj7]front of me
[C]Speaking words of [G]wisdom, let it [Fmaj7]be [C]

[Chorus]
Let it [Am]be, let it [G]be, let it [Fmaj7]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [Fmaj7]be [C]

[Verse 2]
And [C]when the broken-[G]hearted people [Am]living in the [Fmaj7]world agree
[C]There will be an [G]answer, let it [Fmaj7]be [C]
For [C]though they may be [G]parted, there is [Am]still a chance that [Fmaj7]they will see
[C]There will be an [G]answer, let it [Fmaj7]be [C]`,
  },
  {
    id: 'perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    year: 2017,
    genre: 'Pop',
    difficulty: 'beginner',
    difficultyScore: 3,
    tempo: 63,
    capo: 1,
    key: 'G',
    timeSignature: '6/8',
    strumPattern: 'waltz',
    categories: ['pop', 'ballad', 'trending', 'campfire'],
    chordsUsed: ['G', 'Em', 'C', 'D'],
    teachingNotes: {
      overview: 'Ed Sheeran\'s beautiful wedding song. Simple chords but the 6/8 time signature gives it a lilting, waltz-like feel.',
      tips: ['This song is in 6/8 time — count "1-2-3, 1-2-3"', 'Use fingerpicking or a gentle waltz strum', 'Capo 1 to match the original recording'],
      commonMistakes: ['Playing in 4/4 time instead of 6/8 — it should feel like a waltz', 'Strumming too hard on this delicate song'],
    },
    content: `{title: Perfect}
{artist: Ed Sheeran}
{capo: 1}

[Verse 1]
I found a [G]love for [Em]me
Oh darling, just [C]dive right in and follow my [D]lead
Well, I found a [G]girl, beauti[Em]ful and sweet
Oh, I never [C]knew you were the someone waiting for [D]me

[Pre-Chorus]
'Cause we were just kids when we [G]fell in [Em]love
Not knowing [C]what it was, I will not [D]give you up this [G]time

[Chorus]
Baby, [Em]I'm [C]dancing in the [G]dark with [D]you between my [Em]arms
[C]Barefoot on the [G]grass, [D]listening to our [Em]favourite song
When you [C]said you looked a [G]mess, I whispered [D]underneath my [Em]breath
But you [C]heard it, darling, [G]you look [D]perfect to[G]night`,
  },
  {
    id: 'hallelujah',
    title: 'Hallelujah',
    artist: 'Leonard Cohen',
    year: 1984,
    genre: 'Folk',
    difficulty: 'beginner',
    difficultyScore: 3,
    tempo: 56,
    capo: 0,
    key: 'C',
    timeSignature: '6/8',
    strumPattern: 'waltz',
    categories: ['essential', 'ballad', 'folk', 'campfire', 'movie'],
    chordsUsed: ['C', 'Am', 'Fmaj7', 'G'],
    teachingNotes: {
      overview: 'Leonard Cohen\'s masterpiece, covered by hundreds of artists. Beautiful arpeggiated guitar part.',
      tips: ['Try fingerpicking instead of strumming for the authentic sound', 'The 6/8 time signature creates a beautiful flowing rhythm', 'We use Fmaj7 instead of F — sounds even more ethereal'],
      commonMistakes: ['Strumming when fingerpicking would sound much better', 'Not letting the chords sustain long enough'],
    },
    content: `{title: Hallelujah}
{artist: Leonard Cohen}

[Verse 1]
I've [C]heard there was a [Am]secret chord
That [C]David played and it [Am]pleased the Lord
But [Fmaj7]you don't really [G]care for music, [C]do you? [G]
It [C]goes like this, the [Fmaj7]fourth, the fifth
The [Am]minor fall, the [Fmaj7]major lift
The [G]baffled king com[Am]posing Halle[Fmaj7]lujah

[Chorus]
Halle[Fmaj7]lujah, Halle[Am]lujah
Halle[Fmaj7]lujah, Halle[C]lu[G]u[C]jah`,
  },
  {
    id: 'no_woman_no_cry',
    title: 'No Woman, No Cry',
    artist: 'Bob Marley',
    year: 1974,
    genre: 'Reggae',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 78,
    capo: 0,
    key: 'C',
    timeSignature: '4/4',
    strumPattern: 'island',
    categories: ['essential', 'reggae', 'chill', 'campfire'],
    chordsUsed: ['C', 'G', 'Am', 'Fmaj7'],
    teachingNotes: {
      overview: 'Bob Marley\'s timeless classic. Same 4-chord progression as "Let It Be" — once you learn one, you know both!',
      tips: ['C-G-Am-F progression loops throughout', 'Use a relaxed, slightly syncopated strum', 'Let the groove be loose and natural'],
      commonMistakes: ['Playing too rigidly — reggae should feel relaxed and free'],
    },
    content: `{title: No Woman, No Cry}
{artist: Bob Marley}

[Chorus]
No [C]woman, no [G]cry
No [Am]woman, no [Fmaj7]cry
No [C]woman, no [G]cry
No [Am]woman, no [Fmaj7]cry

[Verse 1]
Said, said, [C]said I remember [G]when we used to [Am]sit
In the government [Fmaj7]yard in Trenchtown
[C]Oba, ob-[G]serving the [Am]hypocrites
As they would [Fmaj7]mingle with the good people we [C]meet [G]
Good friends we have, oh, [Am]good friends we've [Fmaj7]lost
Along the [C]way [G] [Am] [Fmaj7]

[Chorus]
No [C]woman, no [G]cry
No [Am]woman, no [Fmaj7]cry`,
  },
  {
    id: 'wish_you_were_here',
    title: 'Wish You Were Here',
    artist: 'Pink Floyd',
    year: 1975,
    genre: 'Rock',
    difficulty: 'beginner',
    difficultyScore: 3,
    tempo: 60,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['essential', 'rock', '70s', 'ballad', 'campfire'],
    chordsUsed: ['Em', 'G', 'A', 'C', 'D'],
    teachingNotes: {
      overview: 'Pink Floyd\'s legendary acoustic masterpiece. The intro riff is iconic but the strumming pattern is beginner-friendly.',
      tips: ['Start with just the chord progression before trying the intro riff', 'Em-G repeated in the intro, then the verse uses C-D-Am-G', 'The acoustic solo is a great next step once you master the chords'],
      commonMistakes: ['Trying to play the intro solo before mastering the chords', 'Not giving the song enough emotional space'],
    },
    content: `{title: Wish You Were Here}
{artist: Pink Floyd}

[Intro]
[Em] [G] [Em] [G] [Em] [A] [Em] [A] [G]

[Verse 1]
[C]So, so you think you can [D]tell
Heaven from [Am]hell, blue skies from [G]pain
Can you tell a green [D]field from a cold steel [C]rail?
A smile from a [Am]veil? Do you think you can [G]tell?

[Verse 2]
Did they get you to [C]trade your heroes for [D]ghosts?
Hot ashes for [Am]trees? Hot air for a [G]cool breeze?
Cold comfort for [D]change? Did you ex[C]change
A walk-on part in the [Am]war for a lead role in a [G]cage?

[Chorus]
[Em]How I wish, how I wish you were [A]here
We're just [Em]two lost souls swimming in a fish bowl, [A]year after [G]year
[Em]Running over the same old ground, [A]what have we [G]found?
The same old [Em]fears, wish you were [A]here [G]`,
  },
  {
    id: 'take_me_home',
    title: 'Take Me Home, Country Roads',
    artist: 'John Denver',
    year: 1971,
    genre: 'Country',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 82,
    capo: 2,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['essential', 'country', 'folk', 'campfire'],
    chordsUsed: ['G', 'Em', 'D', 'C'],
    teachingNotes: {
      overview: 'John Denver\'s iconic country-folk anthem. The perfect singalong song!',
      tips: ['The G-Em-D-C progression is incredibly common', 'Capo 2 to match the original', 'Great for building confidence with singing while playing'],
      commonMistakes: ['Forgetting to switch between verse and chorus chord patterns'],
    },
    content: `{title: Take Me Home, Country Roads}
{artist: John Denver}
{capo: 2}

[Verse 1]
[G]Almost heaven, [Em]West Virginia
[D]Blue Ridge Mountains, [C]Shenandoah [G]River
[G]Life is old there, [Em]older than the trees
[D]Younger than the mountains, [C]growin' like a [G]breeze

[Chorus]
[G]Country roads, take me [D]home
To the [Em]place I be[C]long
West Vir[G]ginia, mountain [D]mama
Take me [C]home, country [G]roads

[Verse 2]
[G]All my memories [Em]gather 'round her
[D]Miner's lady, [C]stranger to blue [G]water
[G]Dark and dusty, [Em]painted on the sky
[D]Misty taste of moonshine, [C]teardrop in my [G]eye`,
  },
  {
    id: 'have_you_ever_seen_rain',
    title: 'Have You Ever Seen the Rain',
    artist: 'Creedence Clearwater Revival',
    year: 1971,
    genre: 'Rock',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 118,
    capo: 0,
    key: 'C',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['rock', '70s', 'campfire', 'essential'],
    chordsUsed: ['Am', 'Fmaj7', 'C', 'G'],
    teachingNotes: {
      overview: 'Another CCR classic — simple chords and a melody that everyone knows.',
      tips: ['Am-F-C-G is the core progression', 'Use Fmaj7 in place of F for easier playing', 'Steady mid-tempo strum throughout'],
      commonMistakes: ['Overthinking the strum — keep it simple and steady'],
    },
    content: `{title: Have You Ever Seen the Rain}
{artist: Creedence Clearwater Revival}

[Verse 1]
[Am]Someone told me long ago, [Am]there's a calm before the storm
I [G]know, it's been comin' [C]for some time
[Am]When it's over, so they say, [Am]it'll rain a sunny day
I [G]know, shinin' down like [C]water

[Chorus]
[Fmaj7]I wanna [G]know, have you [C]ever [Am]seen the [Fmaj7]rain?
[Fmaj7]I wanna [G]know, have you [C]ever [Am]seen the [Fmaj7]rain
[G]Comin' down on a sunny [C]day?`,
  },
  {
    id: 'brown_eyed_girl',
    title: 'Brown Eyed Girl',
    artist: 'Van Morrison',
    year: 1967,
    genre: 'Rock',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 148,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['essential', 'rock', '60s', 'campfire'],
    chordsUsed: ['G', 'C', 'D', 'Em'],
    teachingNotes: {
      overview: 'Van Morrison\'s iconic feel-good hit. G-C-G-D is the verse, perfect for beginners!',
      tips: ['The verse follows a G-C-G-D pattern', 'The "sha la la" chorus is Em-C-G-D', 'Try to add the classic bass walk from G to C'],
      commonMistakes: ['Missing the Em in the chorus section'],
    },
    content: `{title: Brown Eyed Girl}
{artist: Van Morrison}

[Verse 1]
[G]Hey, where did we [C]go? [G]Days when the [D]rains came
[G]Down in the [C]hollow, [G]playin' a [D]new game
[G]Laughin' and a-[C]runnin', hey hey, [G]skippin' and a-[D]jumpin'
[G]In the misty [C]mornin' fog with our [G]hearts a-[D]thumpin' and

[Chorus]
[C]You, [D]my [G]brown-eyed [Em]girl
[C]You, my [D]brown-eyed girl [G]

[Outro]
[G]Sha la la [C]la la la la [G]la la la la te [D]da
[G]Sha la la [C]la la la la [G]la la la la te [D]da, la te [G]da`,
  },
  {
    id: 'zombie',
    title: 'Zombie',
    artist: 'The Cranberries',
    year: 1994,
    genre: 'Alternative Rock',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 82,
    capo: 0,
    key: 'Em',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['rock', '90s', 'campfire'],
    chordsUsed: ['Em', 'C', 'G', 'D'],
    teachingNotes: {
      overview: 'The Cranberries\' powerful anti-war song with a driving Em-C-G-D progression.',
      tips: ['Em-C-G-D repeats for the entire song', 'Let the Em chord ring with intensity', 'Build dynamics between verse and chorus'],
      commonMistakes: ['Playing the same dynamic throughout — vary your strumming intensity'],
    },
    content: `{title: Zombie}
{artist: The Cranberries}

[Verse 1]
[Em]Another head hangs lowly, [C]child is slowly taken
[G]And the violence caused such [D]silence, who are we mistaken?
[Em]But you see, it's not me, it's [C]not my family
[G]In your head, in your [D]head, they are fighting

[Chorus]
With their [Em]tanks and their bombs, and their [C]bombs and their guns
In your [G]head, in your head, they are [D]crying
In your [Em]head, in your [C]head
[G]Zombie, [D]zombie, zombie-ie-ie
What's in your [Em]head, in your [C]head
[G]Zombie, [D]zombie, zombie-ie-ie-ie`,
  },
  {
    id: 'blowin_in_the_wind',
    title: "Blowin' in the Wind",
    artist: 'Bob Dylan',
    year: 1962,
    genre: 'Folk',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 94,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['essential', 'folk', '60s', 'campfire'],
    chordsUsed: ['G', 'C', 'D'],
    teachingNotes: {
      overview: 'Bob Dylan\'s legendary protest song — simple folk progression with powerful lyrics.',
      tips: ['Classic folk strum pattern works perfectly', 'G-C-D is all you need', 'Focus on clear chord transitions'],
      commonMistakes: ['Playing too fast — this is a contemplative song'],
    },
    content: `{title: Blowin' in the Wind}
{artist: Bob Dylan}

[Verse 1]
[G]How many [C]roads must a [G]man walk down
Be[G]fore you [C]call him a [D]man?
[G]How many [C]seas must a [G]white dove sail
Be[G]fore she [C]sleeps in the [D]sand?
[G]How many [C]times must the [G]cannonballs fly
Be[G]fore they're [C]forever [D]banned?

[Chorus]
The [C]answer, my [D]friend, is [G]blowin' in the [Em]wind
The [C]answer is [D]blowin' in the [G]wind`,
  },
  {
    id: 'sweet_home_alabama',
    title: 'Sweet Home Alabama',
    artist: 'Lynyrd Skynyrd',
    year: 1974,
    genre: 'Southern Rock',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 100,
    capo: 0,
    key: 'D',
    timeSignature: '4/4',
    strumPattern: 'folk_country',
    categories: ['rock', 'campfire', '70s', 'essential'],
    chordsUsed: ['D', 'C', 'G'],
    teachingNotes: {
      overview: 'Lynyrd Skynyrd\'s southern rock anthem — D-C-G on repeat!',
      tips: ['D-Cadd9-G is the entire song', 'Try adding a Cadd9 instead of C for that iconic sound', 'The rhythm guitar keeps a steady driving pattern'],
      commonMistakes: ['Not emphasizing the downbeat on the D chord'],
    },
    content: `{title: Sweet Home Alabama}
{artist: Lynyrd Skynyrd}

[Verse 1]
[D]Big wheels keep on [C]turnin'
[G]Carry me home to see my kin
[D]Singin' songs about the [C]southland
[G]I miss 'ole 'bamy once again and I think it's a sin

[Chorus]
[D]Sweet home Ala[C]bama
[G]Where the skies are so blue
[D]Sweet home Ala[C]bama
[G]Lord, I'm comin' home to you`,
  },
  {
    id: 'im_yours',
    title: "I'm Yours",
    artist: 'Jason Mraz',
    year: 2008,
    genre: 'Pop',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 76,
    capo: 4,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'island',
    categories: ['pop', 'chill', 'campfire', 'trending'],
    chordsUsed: ['G', 'D', 'Em', 'C'],
    teachingNotes: {
      overview: 'Jason Mraz\'s laid-back hit — perfect for developing your island strum pattern!',
      tips: ['Capo 4 to match original', 'G-D-Em-C loops the entire song', 'Use a relaxed island strum with muted strums'],
      commonMistakes: ['Playing too rigidly — this song should flow naturally'],
    },
    content: `{title: I'm Yours}
{artist: Jason Mraz}
{capo: 4}

[Verse 1]
Well, [G]you done done me in, you bet I felt it
I [D]tried to be chill, but you're so hot that I melted
I [Em]fell right through the cracks, now I'm [C]trying to get back

[Chorus]
[G]I won't hesi[D]tate no more, no [Em]more, it cannot [C]wait
I'm [G]yours

[Verse 2]
Well, [G]open up your mind and see like [D]me
Open up your plans and, damn, you're [Em]free
Look into your heart and you'll [C]find love, love, love, love`,
  },
  {
    id: 'good_riddance',
    title: 'Good Riddance (Time of Your Life)',
    artist: 'Green Day',
    year: 1997,
    genre: 'Punk Rock',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 95,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['rock', '90s', 'campfire', 'essential'],
    chordsUsed: ['G', 'Cadd9', 'D'],
    teachingNotes: {
      overview: 'Green Day\'s acoustic classic — played at every graduation and farewell. Beautiful fingerpicking pattern!',
      tips: ['G-Cadd9-D is the progression', 'Try fingerpicking the pattern: thumb plays bass note, fingers play melody', 'This song sounds amazing on acoustic'],
      commonMistakes: ['Only strumming — try to learn the fingerpicking pattern too'],
    },
    content: `{title: Good Riddance (Time of Your Life)}
{artist: Green Day}

[Verse 1]
[G]Another turning point, a [Cadd9]fork stuck in the [D]road
[G]Time grabs you by the wrist, di[Cadd9]rects you where to [D]go
[Em]So make the [D]best of this [C]test and don't ask [G]why
[Em]It's not a [D]question but a [C]lesson learned in [G]time

[Chorus]
It's [Em]something unpre[G]dictable
But [Em]in the end it's [G]right
I [Em]hope you had the [D]time of your [G]life`,
  },
  {
    id: 'hey_jude',
    title: 'Hey Jude',
    artist: 'The Beatles',
    year: 1968,
    genre: 'Rock',
    difficulty: 'beginner',
    difficultyScore: 3,
    tempo: 74,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['essential', 'rock', '60s', 'ballad'],
    chordsUsed: ['G', 'D', 'C', 'Em'],
    teachingNotes: {
      overview: 'One of The Beatles\' greatest songs. Simple chord progression builds to an epic "na na na" outro!',
      tips: ['G-D-D-G for the verse, C-G-D-G for the chorus', 'The outro "na na na" section is just G-F-C-G on repeat', 'Let the song build dynamically'],
      commonMistakes: ['Playing too loud at the beginning — save energy for the big outro'],
    },
    content: `{title: Hey Jude}
{artist: The Beatles}

[Verse 1]
Hey [G]Jude, don't make it [D]bad
Take a [D]sad song and make it [G]better
Re[C]member to let her into your [G]heart
Then you can [D]start to make it [G]better

[Verse 2]
Hey [G]Jude, don't be a[D]fraid
You were [D]made to go out and [G]get her
The [C]minute you let her under your [G]skin
Then you be[D]gin to make it [G]better

[Chorus]
And any time you feel the [Em]pain, hey Jude, re[C]frain
Don't [G]carry the [D]world upon your shoul[G]ders`,
  },
  {
    id: 'leaving_jet_plane',
    title: "Leaving on a Jet Plane",
    artist: 'John Denver',
    year: 1966,
    genre: 'Folk',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 76,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['folk', 'ballad', 'campfire'],
    chordsUsed: ['G', 'C', 'D'],
    teachingNotes: {
      overview: 'John Denver\'s beautiful departure song — just G, C, D in a flowing pattern.',
      tips: ['Simple 3-chord song perfect for beginners', 'Try fingerpicking for the verses', 'Great song for developing emotional expression'],
      commonMistakes: ['Not connecting with the emotion of the lyrics'],
    },
    content: `{title: Leaving on a Jet Plane}
{artist: John Denver}

[Verse 1]
All my [G]bags are packed, I'm [C]ready to go
I'm [G]standing here out[C]side your door
I [G]hate to wake you [C]up to say good[D]bye

[Verse 2]
But the [G]dawn is breakin', it's [C]early morn
The [G]taxi's waitin', he's [C]blowin' his horn
Al[G]ready I'm so [C]lonesome I could [D]cry

[Chorus]
So [G]kiss me and [C]smile for me
[G]Tell me that you'll [C]wait for me
[G]Hold me like you'll [C]never let me [D]go
'Cause I'm [G]leavin' on a [C]jet plane
[G]Don't know when I'll [C]be back again
Oh [G]babe, I [C]hate to [D]go`,
  },
  {
    id: 'cant_help_falling',
    title: "Can't Help Falling in Love",
    artist: 'Elvis Presley',
    year: 1961,
    genre: 'Pop',
    difficulty: 'beginner',
    difficultyScore: 3,
    tempo: 68,
    capo: 0,
    key: 'C',
    timeSignature: '4/4',
    strumPattern: 'waltz',
    categories: ['essential', 'ballad', 'movie', 'campfire'],
    chordsUsed: ['C', 'Em', 'Am', 'Fmaj7', 'G'],
    teachingNotes: {
      overview: 'Elvis\'s most romantic song. Beautiful fingerpicking pattern with simple chords.',
      tips: ['Try fingerpicking — thumb on bass, fingers on treble strings', 'We use Fmaj7 instead of full F barre chord', 'Slow, gentle tempo — let each note breathe'],
      commonMistakes: ['Playing too fast — this is a slow romantic ballad'],
    },
    content: `{title: Can't Help Falling in Love}
{artist: Elvis Presley}

[Verse 1]
[C]Wise [Em]men [Am]say
Only [Fmaj7]fools [C]rush [G]in
But [Fmaj7]I can't [G]help [Am]falling in [Fmaj7]love with [C]you [G] [C]

[Verse 2]
[C]Shall [Em]I [Am]stay?
Would it [Fmaj7]be [C]a [G]sin
If [Fmaj7]I can't [G]help [Am]falling in [Fmaj7]love with [C]you? [G] [C]

[Bridge]
[Em]Like a river [Am]flows
[Em]Surely to the [Am]sea
[Em]Darling, so it [Am]goes
[Fmaj7]Some things are [G]meant to be`,
  },

  // ============ TIER 3: INTERMEDIATE BEGINNER (4-5+ chords) ============
  {
    id: 'hotel_california',
    title: 'Hotel California',
    artist: 'Eagles',
    year: 1977,
    genre: 'Rock',
    difficulty: 'intermediate',
    difficultyScore: 5,
    tempo: 74,
    capo: 0,
    key: 'Am',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['essential', 'rock', '70s', 'campfire'],
    chordsUsed: ['Am', 'E', 'G', 'D', 'Fmaj7', 'C', 'Dm'],
    teachingNotes: {
      overview: 'The Eagles\' masterpiece — more chords than beginner songs, but incredibly rewarding to learn.',
      tips: ['Learn the verse chord progression first: Am-E-G-D-F-C-Dm-E', 'This uses 7 different chords — take it slow', 'The iconic intro is an arpeggiated pattern worth learning separately'],
      commonMistakes: ['Trying to learn the solo before mastering the rhythm part', 'Giving up because of the number of chords — they follow a logical pattern!'],
    },
    content: `{title: Hotel California}
{artist: Eagles}

[Verse 1]
[Am]On a dark desert highway, [E]cool wind in my hair
[G]Warm smell of colitas, [D]rising up through the air
[Fmaj7]Up ahead in the distance, [C]I saw a shimmering light
[Dm]My head grew heavy and my sight grew dim, [E]I had to stop for the night

[Verse 2]
[Am]There she stood in the doorway, [E]I heard the mission bell
[G]And I was thinking to myself, this could be [D]heaven or this could be hell
[Fmaj7]Then she lit up a candle, [C]and she showed me the way
[Dm]There were voices down the corridor, [E]I thought I heard them say

[Chorus]
[Fmaj7]Welcome to the Hotel Cali[C]fornia
Such a [E]lovely place, such a [Am]lovely face
[Fmaj7]Plenty of room at the Hotel Cali[C]fornia
Any [Dm]time of year, you can [E]find it here`,
  },
  {
    id: 'someone_like_you',
    title: 'Someone Like You',
    artist: 'Adele',
    year: 2011,
    genre: 'Pop',
    difficulty: 'intermediate',
    difficultyScore: 4,
    tempo: 68,
    capo: 2,
    key: 'A',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['pop', 'ballad', 'trending'],
    chordsUsed: ['A', 'E', 'C', 'G', 'D'],
    teachingNotes: {
      overview: 'Adele\'s heartbreaking ballad — powerful and emotional with a beautiful piano-inspired guitar arrangement.',
      tips: ['Capo 2 makes the chords much easier', 'Fingerpicking sounds incredible on this song', 'Build emotional dynamics from quiet verse to powerful chorus'],
      commonMistakes: ['Playing without dynamics — this song needs quiet vs. loud'],
    },
    content: `{title: Someone Like You}
{artist: Adele}
{capo: 2}

[Verse 1]
I [A]heard that you're [E]settled down
That you [C]found a girl and you're [G]married now
I [A]heard that your [E]dreams came true
Guess she [C]gave you things I didn't [G]give to you

[Pre-Chorus]
[A]Old [E]friend, why are you so [C]shy?
Ain't like [G]you to hold back or [A]hide from the [E]light

[Chorus]
Never[D]mind, I'll [E]find someone like [A]you
I wish [D]nothing but the [E]best for [A]you, too
Don't for[D]get me, I [E]beg, I'll re[A]member you said
Sometimes it [D]lasts in love, but [E]sometimes it hurts in[A]stead`,
  },
  {
    id: 'thinking_out_loud',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    year: 2014,
    genre: 'Pop',
    difficulty: 'intermediate',
    difficultyScore: 4,
    tempo: 79,
    capo: 0,
    key: 'D',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['pop', 'ballad', 'trending', 'campfire'],
    chordsUsed: ['D', 'G', 'A'],
    teachingNotes: {
      overview: 'Ed Sheeran\'s romantic hit — deceptively simple chord-wise but the groove makes it special.',
      tips: ['D-D/F#-G-A is the progression (simplified to D-G-A)', 'The guitar rhythm is very groove-based', 'Try adding a walking bass line between chords'],
      commonMistakes: ['Playing a basic strum — try to capture the R&B groove'],
    },
    content: `{title: Thinking Out Loud}
{artist: Ed Sheeran}

[Verse 1]
When your [D]legs don't work like they [G]used to before
[A]And I can't sweep you off of your [D]feet
Will your [D]mouth still remember the [G]taste of my love?
[A]Will your eyes still smile from your [D]cheeks?

[Chorus]
So honey [G]now, [A]take me into your [D]loving arms
[G]Kiss me under the [A]light of a [D]thousand stars
[G]Place your head on my [A]beating heart
I'm thinking [D]out [G]loud
Maybe [A]we found love right [D]where we are`,
  },
  {
    id: 'creep',
    title: 'Creep',
    artist: 'Radiohead',
    year: 1993,
    genre: 'Alternative Rock',
    difficulty: 'intermediate',
    difficultyScore: 4,
    tempo: 92,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['rock', '90s', 'campfire'],
    chordsUsed: ['G', 'C', 'Em', 'D'],
    teachingNotes: {
      overview: 'Radiohead\'s breakthrough hit — quiet verses that explode into loud choruses.',
      tips: ['G-B-C-Cm in the original (simplified to G-C-Em-D)', 'Practice the dynamic shift between quiet verse and loud chorus', 'The signature "crunch" before the chorus is a muted strum'],
      commonMistakes: ['Playing at one dynamic level — this song needs contrast'],
    },
    content: `{title: Creep}
{artist: Radiohead}

[Verse 1]
When you were here be[G]fore, couldn't look you in the [C]eye
You're just like an [Em]angel, your skin makes me [D]cry
You float like a [G]feather in a beautiful [C]world
I wish I was [Em]special, you're so very [D]special

[Chorus]
But I'm a [G]creep, I'm a [C]weirdo
What the hell am I doin' [Em]here?
I don't be[D]long here`,
  },
  {
    id: 'house_rising_sun',
    title: 'House of the Rising Sun',
    artist: 'The Animals',
    year: 1964,
    genre: 'Folk Rock',
    difficulty: 'intermediate',
    difficultyScore: 4,
    tempo: 74,
    capo: 0,
    key: 'Am',
    timeSignature: '6/8',
    strumPattern: 'waltz',
    categories: ['essential', 'rock', '60s', 'campfire'],
    chordsUsed: ['Am', 'C', 'D', 'Fmaj7', 'E'],
    teachingNotes: {
      overview: 'The Animals\' legendary folk-rock classic. Beautiful arpeggiated picking pattern in 6/8 time.',
      tips: ['Learn the arpeggiation pattern — it\'s the heart of this song', 'Am-C-D-F-Am-E-Am-E is the main progression', 'In 6/8 time: pick each chord as 6 individual notes'],
      commonMistakes: ['Strumming instead of picking — this song demands arpeggiation'],
    },
    content: `{title: House of the Rising Sun}
{artist: The Animals}

[Verse 1]
[Am]There [C]is a [D]house in [Fmaj7]New Orleans
They [Am]call the [C]Rising [E]Sun
And it's [Am]been the [C]ruin of [D]many a poor [Fmaj7]boy
And [Am]God, I [E]know I'm [Am]one [E]

[Verse 2]
My [Am]mother [C]was a [D]tailor [Fmaj7]
She [Am]sewed my [C]new blue [E]jeans
My [Am]father [C]was a [D]gamblin' [Fmaj7]man
[Am]Down in [E]New Or[Am]leans [E]`,
  },
  {
    id: 'shallow',
    title: 'Shallow',
    artist: 'Lady Gaga & Bradley Cooper',
    year: 2018,
    genre: 'Pop',
    difficulty: 'intermediate',
    difficultyScore: 4,
    tempo: 96,
    capo: 0,
    key: 'Em',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['pop', 'movie', 'ballad', 'trending'],
    chordsUsed: ['Em', 'D', 'G', 'C', 'Am'],
    teachingNotes: {
      overview: 'From A Star Is Born — builds from a quiet verse to an epic, soaring chorus.',
      tips: ['The verse is quiet fingerpicking: Em-D-G-C', 'The chorus explodes with powerful strumming', 'Practice the dynamic build-up from verse to chorus'],
      commonMistakes: ['Not building dynamics — the power of this song is in the contrast'],
    },
    content: `{title: Shallow}
{artist: Lady Gaga & Bradley Cooper}

[Verse 1]
[Em]Tell me somethin', girl
[D]Are you happy in this [G]modern world? [C]
[Em]Or do you need more?
[D]Is there somethin' else you're [G]searchin' for? [C]

[Pre-Chorus]
[Am]I'm fallin'
In all the good times, I [D]find myself longin' for [G]change
And [Am]in the bad times, I [D]fear myself

[Chorus]
I'm off the [G]deep end, watch as I [D]dive in
I'll [Em]never meet the [C]ground
[G]Crash through the sur[D]face where they can't [Em]hurt us, we're [C]far from the shallow now

[Chorus]
In the [Am]sha-ha, sha-ha-[D]llow
In the [G]sha-ha, sha-la-la-la-[D]llow
In the [Am]sha-ha, sha-ha-[D]llow
We're far from the shallow [Em]now`,
  },
  {
    id: 'let_her_go',
    title: 'Let Her Go',
    artist: 'Passenger',
    year: 2012,
    genre: 'Folk Pop',
    difficulty: 'intermediate',
    difficultyScore: 4,
    tempo: 75,
    capo: 7,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['pop', 'ballad', 'campfire', 'trending'],
    chordsUsed: ['G', 'D', 'Em', 'C'],
    teachingNotes: {
      overview: 'Passenger\'s beautiful folk-pop hit. High capo gives it that bright, delicate sound.',
      tips: ['Capo 7 is essential for the original sound', 'Fingerpicking the intro is a great challenge', 'G-D-Em-C is the core progression'],
      commonMistakes: ['Skipping the capo — it won\'t sound right without it'],
    },
    content: `{title: Let Her Go}
{artist: Passenger}
{capo: 7}

[Chorus]
Well, you only need the [G]light when it's burning [D]low
Only miss the [Em]sun when it starts to [C]snow
Only know you [G]love her when you let her [D]go
Only know you've been [Em]high when you're feeling [C]low
Only hate the [G]road when you're missing [D]home
Only know you [Em]love her when you let her [C]go
And you let her [G]go

[Verse 1]
[Em]Staring at the bottom of your [C]glass
[G]Hoping one day you'll make a [D]dream last
[Em]But dreams come slow and they [C]go so fast
[G]You see her when you [D]close your eyes`,
  },
  {
    id: 'stay_with_me',
    title: 'Stay With Me',
    artist: 'Sam Smith',
    year: 2014,
    genre: 'Pop',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 84,
    capo: 0,
    key: 'Am',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['pop', 'ballad', 'trending'],
    chordsUsed: ['Am', 'Fmaj7', 'C'],
    teachingNotes: {
      overview: 'Sam Smith\'s soulful hit — just 3 chords but incredibly emotional.',
      tips: ['Am-F-C is the entire song', 'We use Fmaj7 for the easier fingering', 'Focus on dynamics and vocal delivery'],
      commonMistakes: ['Playing too loud — this is a subtle, soulful song'],
    },
    content: `{title: Stay With Me}
{artist: Sam Smith}

[Verse 1]
Guess it's [Am]true, I'm not [Fmaj7]good at a [C]one-night stand
But I [Am]still need [Fmaj7]love 'cause I'm [C]just a man
These [Am]nights never [Fmaj7]seem to [C]go to plan
I [Am]don't want you to [Fmaj7]leave, will you [C]hold my hand?

[Chorus]
Oh, won't you [Am]stay with [Fmaj7]me? [C]
'Cause you're [Am]all I [Fmaj7]need [C]
This ain't [Am]love, it's [Fmaj7]clear to [C]see
But, darling, [Am]stay with [Fmaj7]me [C]`,
  },
  {
    id: 'all_of_me',
    title: 'All of Me',
    artist: 'John Legend',
    year: 2013,
    genre: 'Pop',
    difficulty: 'beginner',
    difficultyScore: 3,
    tempo: 63,
    capo: 1,
    key: 'Am',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['pop', 'ballad', 'trending', 'campfire'],
    chordsUsed: ['Am', 'Fmaj7', 'C', 'G'],
    teachingNotes: {
      overview: 'John Legend\'s iconic wedding song — beautiful piano ballad that translates wonderfully to acoustic guitar.',
      tips: ['Capo 1 to match the original key', 'Am-F-C-G progression throughout', 'Try gentle fingerpicking for the verse'],
      commonMistakes: ['Heavy strumming — this delicate song needs a light touch'],
    },
    content: `{title: All of Me}
{artist: John Legend}
{capo: 1}

[Verse 1]
What would I [Am]do without your smart [Fmaj7]mouth
Drawing me [C]in, and you kicking me [G]out
You've got my [Am]head spinning, [Fmaj7]no kidding
I [C]can't pin you [G]down

[Pre-Chorus]
My [Am]head's under [Fmaj7]water, but I'm [C]breathing [G]fine
You're [Am]crazy and I'm [Fmaj7]out of my [C]mind [G]

[Chorus]
'Cause [Fmaj7]all of me loves [G]all of you
Love your [Am]curves and all your edges
All your [C]perfect imperfections
Give your [Fmaj7]all to me, I'll give my [G]all to you
You're my [Am]end and my begin[C]ning
Even [Fmaj7]when I lose, I'm [G]winning`,
  },
  {
    id: 'someone_you_loved',
    title: 'Someone You Loved',
    artist: 'Lewis Capaldi',
    year: 2019,
    genre: 'Pop',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 110,
    capo: 0,
    key: 'C',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['pop', 'ballad', 'trending'],
    chordsUsed: ['C', 'G', 'Am', 'Fmaj7'],
    teachingNotes: {
      overview: 'Lewis Capaldi\'s powerful ballad — same C-G-Am-F progression that powers thousands of hits!',
      tips: ['C-G-Am-F is all you need', 'Build from quiet verse to powerful chorus', 'Once you know this progression, you can play hundreds of songs'],
      commonMistakes: ['Not building intensity through the song'],
    },
    content: `{title: Someone You Loved}
{artist: Lewis Capaldi}

[Verse 1]
I'm going [C]under, and this [G]time, I fear there's [Am]no one to save [Fmaj7]me
This all or [C]nothing really [G]got a way of [Am]driving me [Fmaj7]crazy

[Chorus]
Now the [C]day bleeds into [G]nightfall
And you're [Am]not here to get me [Fmaj7]through it all
I let my [C]guard down, and [G]then you pulled the [Am]rug
I was getting [Fmaj7]kinda used to being someone you [C]loved`,
  },
  {
    id: 'counting_stars',
    title: 'Counting Stars',
    artist: 'OneRepublic',
    year: 2013,
    genre: 'Pop Rock',
    difficulty: 'intermediate',
    difficultyScore: 3,
    tempo: 122,
    capo: 0,
    key: 'Am',
    timeSignature: '4/4',
    strumPattern: 'island',
    categories: ['pop', 'rock', 'trending'],
    chordsUsed: ['Am', 'C', 'G', 'Fmaj7'],
    teachingNotes: {
      overview: 'OneRepublic\'s energetic hit — driving Am-C-G-F progression with a great strum pattern.',
      tips: ['The strumming pattern is key — it drives the whole song', 'Am-C-G-F throughout', 'Build energy from verse to chorus'],
      commonMistakes: ['Not maintaining the rhythmic energy throughout'],
    },
    content: `{title: Counting Stars}
{artist: OneRepublic}

[Verse 1]
[Am]Lately, I been, I been losing sleep
[C]Dreaming about the things that [G]we could be
But [Fmaj7]baby, I been, I been prayin' hard
[Am]Said no more counting [C]dollars, we'll be [G]counting stars [Fmaj7]

[Chorus]
[Am]I feel something so right
[C]Doing the wrong thing
[G]I feel something so wrong
[Fmaj7]Doing the right thing
I could [Am]lie, could [C]lie, could [G]lie
Everything that [Fmaj7]kills me makes me feel alive`,
  },
  {
    id: 'falling_slowly',
    title: 'Falling Slowly',
    artist: 'Glen Hansard',
    year: 2007,
    genre: 'Folk',
    difficulty: 'intermediate',
    difficultyScore: 4,
    tempo: 69,
    capo: 0,
    key: 'C',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['folk', 'movie', 'ballad', 'campfire'],
    chordsUsed: ['C', 'Fmaj7', 'Am', 'G'],
    teachingNotes: {
      overview: 'Oscar-winning song from "Once" — hauntingly beautiful acoustic guitar piece.',
      tips: ['The original uses arpeggiated picking', 'C-Fmaj7-Am-G is the progression', 'Let the dynamics build naturally throughout'],
      commonMistakes: ['Not leaving enough space — silence is part of the music'],
    },
    content: `{title: Falling Slowly}
{artist: Glen Hansard}

[Verse 1]
[C]I don't know you, but I [Fmaj7]want you
[C]All the more for [Fmaj7]that
[C]Words fall through me and [Fmaj7]always fool me
[C]And I can't re[Fmaj7]act

[Chorus]
And [Am]games that [G]never a[Fmaj7]mount
To [G]more than they're [Am]meant
Will [G]play themselves [Fmaj7]out

[Chorus]
[C]Take this [Fmaj7]sinking boat and [Am]point it [G]home
We've still got [C]time [Fmaj7]
[C]Raise your [Fmaj7]hopeful voice, you [Am]have a [G]choice
You've made it [C]now [Fmaj7]

[Outro]
[C]Falling slowly, [Fmaj7]eyes that know me
[C]And I can't go [Fmaj7]back`,
  },
  {
    id: 'careless_whisper',
    title: 'Careless Whisper',
    artist: 'George Michael',
    year: 1984,
    genre: 'Pop / Soul',
    difficulty: 'intermediate',
    difficultyScore: 3,
    tempo: 76,
    capo: 0,
    key: 'Dm',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['essential', '80s', 'ballad', 'pop'],
    chordsUsed: ['Dm', 'Gm', 'Bb', 'Am', 'A7'],
    teachingNotes: {
      overview: 'The immortal 80s saxophone anthem arranged for acoustic guitar. Built on an unforgettable 4-chord cycle: Dm - Gm - Bb - Am.',
      tips: [
        'Main chord loop: [Dm] (2 bars) -> [Gm] (2 bars) -> [Bb] (2 bars) -> [Am] / [A7] (2 bars)',
        'Beginner trick: Put Capo on Fret 5 and play [Am] - [Dm] - [F] - [Em] for an easier open-chord version!',
        'Keep a relaxed, sensual rhythm at 76 BPM with soft down-up strumming',
      ],
      commonMistakes: ['Rushing the tempo', 'Pressing too hard on the Bb barre chord — keep the thumb relaxed'],
    },
    content: `{title: Careless Whisper}
{artist: George Michael}

[Intro]
[Dm] [Gm] [Bb] [Am] [A7]

[Verse 1]
I feel so un[Dm]sure
As I take your [Gm]hand and lead you to the dance floor
[Bb] As the music dies, something in your [Am]eyes
Calls to mind a [A7]silver screen and all its sad good[Dm]byes

[Chorus]
I'm never gonna [Dm]dance again, guilty feet have [Gm]got no rhythm
Though it's easy to [Bb]pretend, I know you're not a [Am]fool [A7]
Should've known [Dm]better than to cheat a friend
And waste the [Gm]chance that I'd been given
So I'm never gonna [Bb]dance again the way I danced with [Am]you, [A7]oh

[Verse 2]
[Dm] Time can never mend
The careless [Gm]whispers of a good friend
[Bb] To the heart and mind, ignorance is [Am]kind
There's no comfort [A7]in the truth, pain is all you'll [Dm]find

[Chorus]
I'm never gonna [Dm]dance again, guilty feet have [Gm]got no rhythm
Though it's easy to [Bb]pretend, I know you're not a [Am]fool [A7]
Should've known [Dm]better than to cheat a friend
And waste the [Gm]chance that I'd been given
So I'm never gonna [Bb]dance again the way I danced with [Am]you, [A7]oh

[Bridge]
[Dm] Tonight the music seems so loud
I wish that [Gm]we could lose this crowd
Maybe it's [Bb]better this way, we'd hurt each other with the [Am]things we'd say [A7]
We could have been so [Dm]good together, we could have lived this [Gm]dance forever
But now, [Bb]who's gonna dance with [Am]me? [A7]Please stay

[Chorus]
I'm never gonna [Dm]dance again, guilty feet have [Gm]got no rhythm
Though it's easy to [Bb]pretend, I know you're not a [Am]fool [A7]
Should've known [Dm]better than to cheat a friend
And waste the [Gm]chance that I'd been given
So I'm never gonna [Bb]dance again the way I danced with [Am]you, [A7]oh

[Outro]
[Dm] (Now that you're gone) [Gm] Now that you're gone
[Bb] What I did's so wrong, so wrong, that you had to [Am]leave me a[A7]lone
[Dm] [Gm] [Bb] [Am] [A7] [Dm]`,
  },
  {
    id: 'snooze_sza',
    title: 'Snooze',
    artist: 'SZA',
    year: 2022,
    genre: 'R&B / Soul',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 72,
    capo: 1,
    key: 'F',
    timeSignature: '4/4',
    strumPattern: 'pop_ballad',
    categories: ['pop', '2020s', 'essential', 'ballad'],
    chordsUsed: ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'],
    teachingNotes: {
      overview: 'SZA\'s Grammy-winning masterpiece from "SOS". Features a smooth 4-chord descending progression that sounds mesmerizing on acoustic guitar.',
      tips: [
        'Capo on Fret 1 lets you play smooth open 7th chords: Fmaj7 -> Em7 -> Dm7 -> Cmaj7',
        'Fmaj7 to Em7 is a simple slide down: just shift the finger shape one fret to the left and lift a finger',
        'Use gentle finger-plucking (thumb on bass string, 3 fingers on strings 3, 2, 1) for that intimate R&B tone',
      ],
      commonMistakes: ['Strumming too hard — keep it velvety and relaxed', 'Rushing the 72 BPM tempo'],
    },
    content: `{title: Snooze}
{artist: SZA}
{capo: 1}

[Intro]
[Fmaj7] [Em7] [Dm7] [Cmaj7]

[Verse 1]
I'll touch that [Fmaj7]fire for you
I do that [Em7]three, four times again, I testify for you
Told myself I [Dm7]wouldn't cry for you
No, I won't, no, I [Cmaj7]won't, yeah, yeah

[Pre-Chorus]
I might front like I [Fmaj7]don't care, but I do
No, I'm [Em7]frontin' like I'm careless, I'm carein'
I could [Dm7]lose everything, but I won't lose you
Send me [Cmaj7]location, I'm slidin' through

[Chorus]
I can't [Fmaj7]lose when I'm with you
How can I [Em7]snooze and miss the moment?
You just too im[Dm7]portant
Nobody do body like you [Cmaj7]do
I can't [Fmaj7]lose when I'm with you
How can I [Em7]snooze and miss the moment?
You just too im[Dm7]portant
Nobody do body like you [Cmaj7]do, you do

[Verse 2]
In a [Fmaj7]drop-top, ridin' with you
Head in the [Em7]clouds, I'm flyin' with you
I'm so ob[Dm7]sessed, I'm blind to the truth
Ain't got no [Cmaj7]shame when it come to you

[Pre-Chorus]
I might front like I [Fmaj7]don't care, but I do
No, I'm [Em7]frontin' like I'm careless, I'm carein'
I could [Dm7]lose everything, but I won't lose you
Send me [Cmaj7]location, I'm slidin' through

[Chorus]
I can't [Fmaj7]lose when I'm with you
How can I [Em7]snooze and miss the moment?
You just too im[Dm7]portant
Nobody do body like you [Cmaj7]do
I can't [Fmaj7]lose when I'm with you
How can I [Em7]snooze and miss the moment?
You just too im[Dm7]portant
Nobody do body like you [Cmaj7]do, you do

[Outro]
[Fmaj7] (Can't lose when I'm with you)
[Em7] (How can I snooze and miss the moment?)
[Dm7] (Nobody do body like you do)
[Cmaj7] (You do)`,
  },
  {
    id: 'every_breath_you_take',
    title: 'Every Breath You Take',
    artist: 'The Police',
    year: 1983,
    genre: 'Rock / Pop',
    difficulty: 'beginner',
    difficultyScore: 2,
    tempo: 117,
    capo: 0,
    key: 'G',
    timeSignature: '4/4',
    strumPattern: 'rock_steady',
    categories: ['essential', 'rock', '80s'],
    chordsUsed: ['G', 'Em', 'C', 'D', 'Eb', 'F'],
    teachingNotes: {
      overview: 'The Police\'s global #1 classic. Andy Summers\' iconic 9th chord arpeggio line sounds full and resonant with open acoustic chords.',
      tips: [
        'Main verse progression follows a classic 50s doo-wop cycle: [G] (2 bars) -> [Em] (2 bars) -> [C] (1 bar) -> [D] (1 bar) -> [G] (2 bars)',
        'Try light palm-muting with the fleshy edge of your right hand resting on the bridge for that signature tight pulse',
        'The bridge features a dramatic chromatic lift with [Eb] and [F] chords!',
      ],
      commonMistakes: ['Rushing the tempo (keep steady 117 BPM)', 'Strumming too loudly during the verses — build dynamics into the chorus'],
    },
    content: `{title: Every Breath You Take}
{artist: The Police}

[Intro]
[G] [Em] [C] [D] [G]

[Verse 1]
Every breath you [G]take and every move you [Em]make
Every bond you [C]break, every step you [D]take
I'll be watching [Em]you

[Verse 2]
Every single [G]day and every word you [Em]say
Every game you [C]play, every night you [D]stay
I'll be watching [G]you

[Chorus]
Oh, can't you [C]see you belong to [G]me?
How my poor heart [A7]aches with every step you [D]take

[Verse 3]
Every move you [G]make and every vow you [Em]break
Every smile you [C]fake, every claim you [D]stake
I'll be watching [Em]you

[Bridge]
[Eb] Since you've gone, I've been lost without a trace
[F] I dream at night, I can only see your face
[Eb] I look around, but it's you I can't replace
[F] I feel so cold, and I long for your embrace
[Eb] I keep crying, baby, baby, [G]please

[Solo]
[G] [Em] [C] [D] [Em]
[G] [Em] [C] [D] [G]

[Chorus]
Oh, can't you [C]see you belong to [G]me?
How my poor heart [A7]aches with every step you [D]take

[Verse 4]
Every move you [G]make and every vow you [Em]break
Every smile you [C]fake, every claim you [D]stake
I'll be watching [Em]you
Every move you [C]make, every step you [D]take
I'll be watching [Em]you

[Outro]
I'll be watching [G]you (Every breath you [Em]take, every move you [C]make)
I'll be watching [D]you (Every bond you [G]break, every step you [Em]take)
I'll be watching [G]you`,
  },
];

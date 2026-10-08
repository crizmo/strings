<div align="center">

# 🎸 Strings
### The Modern Acoustic Guitar Practice Companion

[![Live Demo](https://img.shields.io/badge/Live_Demo-strings.journy.net-4f46e5?style=for-the-badge&logo=vercel&logoColor=white)](https://strings.journy.net)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Audio](https://img.shields.io/badge/Web_Audio_API-Karplus_Strong-f59e0b?style=for-the-badge&logo=soundcharts&logoColor=white)](https://strings.journy.net)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**An interactive, in-browser acoustic guitar studio featuring 40+ famous songs, a 3-tier progressive learning engine, physical modeling acoustic audio synthesis, and a high-precision chromatic tuner with string tension safety alerts.**

[🌐 Explore the Live App](https://strings.journy.net) • [📖 Song Library](https://strings.journy.net/songs) • [🎯 Tuner](https://strings.journy.net/tuner) • [⚡ Speedrun](https://strings.journy.net/speedrun)

</div>

---

## ✨ Key Features

### 🎼 1. 40+ Famous Songs & Interactive Chord Sheets
- **ChordPro Interactive Rendering**: Clean, real-time ChordPro sheet viewer with customizable auto-scroll speeds (0.8x to 2.5x).
- **Instant Transposition & Capo Calculator**: Transpose any song across 12 semitones or calculate optimal capo placement for open chord voicing.
- **Click-to-Inspect Chord Popovers**: Tap any chord directly in the lyrics to see the exact finger diagram and hear an authentic acoustic strum.

---

### 📈 2. 3-Tier Progressive Mastery System
Every song in the library is broken down into **3 tailored learning levels** so beginners can start playing immediately and advance naturally:

| Level | Chords & Voicings | Strumming & Rhythm | Focus Goal |
| :--- | :--- | :--- | :--- |
| **🟢 Level 1: Beginner** | Auto-converts tough barre chords (`F` ➔ `Fmaj7`, `Bb` ➔ `Fmaj7`/open) | **1 Downstrum on Beat 1** at 75% speed | Clean finger placement & relaxed transitions without hand fatigue. |
| **🟡 Level 2: Standard** | Full authentic chord progression (verses, chorus, bridge) | **Classic Acoustic Strum** (`↓ . ↓ ↑ . ↑ ↓ ↑`) | Steady pendulum strumming hand & lyric timing at original tempo. |
| **🟣 Level 3: Pro** | Album extensions (`Cadd9`, `Dsus4`, `Gadd9`, `Em7`, `Dm7`, 7ths/9ths) | **Fingerpicking / Palm-Muted Accents** | Dynamics, hammer-ons/pull-offs, and acoustic projection. |

---

### 🪵 3. Physical Modeling Acoustic Audio Engine
- **100% In-Browser Synthesis**: Uses Karplus-Strong physical modeling algorithms and wood body resonance filters — zero heavy audio samples required.
- **4 Distinct Acoustic Tone Profiles**:
  - 🎸 **Standard Acoustic Guitar** *(Crisp, natural acoustic balance)*
  - 🪵 **Warm Vintage** *(Deeper wood body resonance and mellow highs)*
  - ✨ **Bright Folk** *(Chimey spruce top with sparkling treble projection)*
  - 🪕 **Classical Nylon** *(Soft, warm, rounded string attack)*

---

### 🎯 4. Precision Chromatic Tuner with Snap-Guard™
- **YIN Pitch Detection Algorithm**: 4096-sample buffer with bandpass filtering (`60Hz – 400Hz`) for stable low E string frequency tracking.
- **3+3 Safe Headstock Visualizer**: Intuitive peg-by-peg layout with target note frequencies and dynamic cent deviation needles (`±50 cents`).
- **Snap-Guard™ String Protection**: High-tension safety warnings when tuning too tight above standard pitch to prevent breaking strings.

---

### ⚡ 5. Speedrun Drills, Fretboard & Strum Studio
- **Chord Transition Speedrun**: Reaction drill trainer to build muscle memory for fast chord switching under time pressure.
- **Interactive Fretboard Explorer**: Complete 24-fret acoustic fretboard with scale overlays and note position discovery.
- **Strum Studio**: Visual metronome strumming breakdowns with animated down/up stroke indicators and audio playbacks.

---

### ☀️ 6. Handcrafted Light Design System
- Modern, tactile design system with clean paper whites (`#ffffff`), off-white canvas (`#f8fafc`), and slate typography.
- Natural maple fretboard visualization with zero generic AI neon glow.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router DOM v7, Framer Motion
- **Audio & DSP Engine**: Web Audio API, Karplus-Strong physical modeling, YIN pitch detection, Tonal.js
- **Sheet Parser**: ChordSheetJS (ChordPro parser & formatter)
- **Icons & UI**: Lucide React, Custom CSS Tokens & Tactile Design System
- **Deployment**: Vercel Edge Network (`https://strings.journy.net`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18.0+`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/crizmo/string.git

# 2. Navigate to project directory
cd string

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```text
string/
├── index.html                   # HTML entry point with OpenGraph & SEO JSON-LD schema
├── package.json                 # Project dependencies & scripts
├── public/                      # Static assets & favicon
└── src/
    ├── audio/
    │   ├── acousticSynth.js     # Karplus-Strong physical modeling acoustic audio engine
    │   ├── audioContext.js      # Web Audio Context & bandpass filtering DSP
    │   └── pitchDetector.js     # YIN algorithm pitch detection for guitar tuning
    ├── components/
    │   ├── Chords/              # Chord encyclopedia & interactive diagrams
    │   ├── Fretboard/           # Interactive acoustic fretboard explorer
    │   ├── Home/                # Dashboard with featured songs & quick actions
    │   ├── Layout/              # Sidebar, BottomNav & Responsive Shell
    │   ├── Songs/               # Song library, ChordPro player & step-by-step teaching
    │   ├── Speedrun/            # Rapid chord transition reaction trainer
    │   ├── Strumming/           # Animated strumming patterns & rhythmic metronome
    │   ├── Tuner/               # 3+3 Safe Headstock chromatic tuner & Snap-Guard™
    │   └── shared/              # Reusable UI cards & tone selectors
    ├── data/
    │   ├── chords.js            # Comprehensive acoustic chords database
    │   ├── songs.js             # 40+ full ChordPro song sheets & teaching notes
    │   ├── strumPatterns.js     # Strumming patterns library
    │   └── tunings.js           # Standard, Drop D, DADGAD, Open G tuning profiles
    ├── utils/
    │   └── songLevels.js        # 3-tier progressive learning calculation engine
    ├── hooks/                   # Custom audio & local storage hooks
    ├── index.css                # Handcrafted light theme design tokens
    └── main.jsx                 # Application bootstrapping
```

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ for acoustic guitarists worldwide. If you enjoy Strings, star the repository! ⭐</sub>
</div>

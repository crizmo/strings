// String: Premium Acoustic Guitar Studio — Dark Theme
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import BottomNav from './components/Layout/BottomNav';
import HomePage from './components/Home/HomePage';
import SongLibrary from './components/Songs/SongLibrary';
import SongDetail from './components/Songs/SongDetail';
import ChordLibrary from './components/Chords/ChordLibrary';
import Tuner from './components/Tuner/Tuner';
import ChordSpeedrun from './components/Speedrun/ChordSpeedrun';
import ChordExplorer from './components/Fretboard/ChordExplorer';
import StrumStudio from './components/Strumming/StrumStudio';
import { useAcousticAudio } from './hooks/useAcousticAudio';
import { TUNINGS } from './data/tunings';

export default function App() {
  const [activeTuning, setActiveTuning] = useState(TUNINGS[0]);
  const audioState = useAcousticAudio(activeTuning);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/songs" element={<SongLibrary />} />
            <Route path="/songs/:songId" element={<SongDetail />} />
            <Route path="/chords" element={<ChordLibrary />} />
            <Route
              path="/tuner"
              element={
                <Tuner
                  audioState={audioState}
                  activeTuning={activeTuning}
                  setActiveTuning={setActiveTuning}
                />
              }
            />
            <Route
              path="/speedrun"
              element={<ChordSpeedrun audioState={audioState} />}
            />
            <Route path="/fretboard" element={<ChordExplorer />} />
            <Route
              path="/strum"
              element={<StrumStudio audioState={audioState} />}
            />
          </Routes>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

// Clean, light 6-string acoustic selector bar
import React from 'react';
import { Volume2 } from 'lucide-react';
import { playAcousticPluck } from '../../audio/acousticSynth';

export default function StringBar({
  activeTuning,
  detectedString,
  targetString,
  onSelectString,
}) {
  const strings = activeTuning.strings;

  const handlePlayString = (e, str) => {
    e.stopPropagation();
    playAcousticPluck(str.freq, 2.5, 0.5);
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center mt-6">
      <div className="flex items-center justify-between w-full px-1 mb-2">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Strings (Low E to High E)
        </span>
        <span className="text-[11px] text-stone-400">
          Tap to lock string or hear reference tone
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2 w-full">
        {/* Render from String 6 (Low E) to String 1 (High E) */}
        {[...strings].reverse().map((str) => {
          const isTarget = targetString && targetString.num === str.num;
          const isDetected = detectedString && detectedString.num === str.num;
          const isActive = isTarget || isDetected;

          return (
            <div
              key={str.num}
              onClick={() => onSelectString(isTarget ? null : str)}
              className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-50 border-amber-300 shadow-sm scale-105'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <span className="text-[10px] text-stone-400 font-mono">
                #{str.num}
              </span>
              <span className={`text-base font-extrabold my-0.5 ${isActive ? 'text-amber-700' : 'text-stone-800'}`}>
                {str.note}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                {str.octave ? `${str.octave}` : ''}
              </span>

              <button
                onClick={(e) => handlePlayString(e, str)}
                title="Hear reference tone"
                className="mt-1 p-1 text-stone-400 hover:text-amber-600 transition-colors"
              >
                <Volume2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {targetString && (
        <button
          onClick={() => onSelectString(null)}
          className="mt-3 text-xs text-amber-700 font-medium underline hover:text-amber-800"
        >
          Reset to Auto-Detect All Strings
        </button>
      )}
    </div>
  );
}

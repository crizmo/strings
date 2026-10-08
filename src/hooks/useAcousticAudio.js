// Custom React hook for microphone streaming, YIN pitch detection, and tuning logic
import { useState, useEffect, useRef, useCallback } from 'react';
import { startMicInput, stopMicInput, getAudioContext } from '../audio/audioContext';
import { autoCorrelate, frequencyToNote, getRMS } from '../audio/pitchDetector';
import { OnsetDetector } from '../audio/onsetDetector';

export function useAcousticAudio(activeTuning) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [pitchData, setPitchData] = useState(null);
  const [detectedString, setDetectedString] = useState(null);
  const [targetString, setTargetString] = useState(null); // null = Auto mode, or specific string object
  const [isSnapDanger, setIsSnapDanger] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [micError, setMicError] = useState(null);
  const [lastOnset, setLastOnset] = useState(0);

  const animFrameRef = useRef(null);
  const analyserRef = useRef(null);
  const bufferRef = useRef(null);
  const onsetDetectorRef = useRef(new OnsetDetector());
  const smoothedCentsRef = useRef(0);
  const inTuneFramesRef = useRef(0);
  const prevStringRef = useRef(null);

  // Toggle Microphone
  const toggleMic = useCallback(async () => {
    if (isMicOn) {
      stopMicInput();
      setIsMicOn(false);
      setPitchData(null);
      setDetectedString(null);
      setIsSnapDanger(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      try {
        setMicError(null);
        const { analyserNode } = await startMicInput();
        analyserRef.current = analyserNode;
        bufferRef.current = new Float32Array(analyserNode.fftSize);
        setIsMicOn(true);
      } catch (err) {
        console.error('Microphone access denied:', err);
        setMicError(
          err.message || 'Microphone access denied. Please allow microphone access in your browser settings.'
        );
        setIsMicOn(false);
      }
    }
  }, [isMicOn]);

  // Audio processing loop
  useEffect(() => {
    if (!isMicOn) return;

    const ctx = getAudioContext();
    const analyser = analyserRef.current;
    if (!analyser) return;

    const sampleRate = ctx.sampleRate;
    const onsetDetector = onsetDetectorRef.current;

    let noPitchCounter = 0;

    const processAudio = () => {
      const buffer = bufferRef.current;
      if (!buffer) return;

      analyser.getFloatTimeDomainData(buffer);

      const rms = getRMS(buffer);
      setVolumeLevel(Math.min(1, rms * 6));

      // Onset (strum attack) check
      if (onsetDetector.detect(buffer)) {
        setLastOnset(Date.now());
      }

      // High-precision YIN pitch detection
      const freq = autoCorrelate(buffer, sampleRate, 60, 480);

      if (freq && freq > 0) {
        noPitchCounter = 0;
        const noteInfo = frequencyToNote(freq);

        const strings = activeTuning.strings;
        let matchedStr = null;

        if (targetString) {
          // Manual Locked String Mode
          matchedStr = targetString;
        } else {
          // Intelligent Auto String Mode (cents distance matching with sticky hysteresis)
          let minCentsDistance = Infinity;
          for (const s of strings) {
            const centsDist = Math.abs(1200 * Math.log2(freq / s.freq));
            if (centsDist < minCentsDistance) {
              minCentsDistance = centsDist;
              matchedStr = s;
            }
          }

          // If previous string is close, keep previous string to avoid jittery bouncing
          if (prevStringRef.current && minCentsDistance > 75) {
            const prevCentsDist = Math.abs(1200 * Math.log2(freq / prevStringRef.current.freq));
            if (prevCentsDist < 120) {
              matchedStr = prevStringRef.current;
            }
          }
        }

        prevStringRef.current = matchedStr;

        // Calculate exact cents offset relative to target string
        const targetFrequency = matchedStr ? matchedStr.freq : noteInfo.targetFreq;
        const rawRelativeCents = Math.round(1200 * Math.log2(freq / targetFrequency));

        // Smooth cents with exponential moving average for steady needle movement
        const smoothingFactor = Math.abs(rawRelativeCents - smoothedCentsRef.current) > 20 ? 0.6 : 0.35;
        smoothedCentsRef.current = smoothedCentsRef.current * (1 - smoothingFactor) + rawRelativeCents * smoothingFactor;
        const currentCents = Math.round(smoothedCentsRef.current);

        const inTune = Math.abs(currentCents) <= 3;
        if (inTune) {
          inTuneFramesRef.current++;
        } else {
          inTuneFramesRef.current = 0;
        }

        // Snap-Guard Tension Alert:
        // Trigger if string is tightened way beyond safety limit
        const isHighE = matchedStr && matchedStr.num === 1;
        const snapDanger = (isHighE && freq > 375) || (matchedStr && rawRelativeCents > 150);

        setIsSnapDanger(Boolean(snapDanger));
        setDetectedString(matchedStr);
        setPitchData({
          ...noteInfo,
          frequency: Math.round(freq * 10) / 10,
          cents: currentCents,
          targetFreq: targetFrequency,
          inTune,
          isClose: Math.abs(currentCents) <= 10,
          inTuneSustained: inTuneFramesRef.current > 8,
        });
      } else {
        noPitchCounter++;
        // Keep needle steady during brief note decay (~300ms)
        if (noPitchCounter > 20) {
          setPitchData(null);
          setIsSnapDanger(false);
          smoothedCentsRef.current = 0;
          inTuneFramesRef.current = 0;
        }
      }

      animFrameRef.current = requestAnimationFrame(processAudio);
    };

    animFrameRef.current = requestAnimationFrame(processAudio);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isMicOn, activeTuning, targetString]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      stopMicInput();
    };
  }, []);

  return {
    isMicOn,
    toggleMic,
    pitchData,
    detectedString,
    targetString,
    setTargetString,
    isSnapDanger,
    volumeLevel,
    micError,
    lastOnset,
  };
}

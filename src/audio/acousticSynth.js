// Advanced Multi-Profile Acoustic Guitar Synthesizer
// Physical modeling using Karplus-Strong with wooden body resonance filters and profile presets
import { getAudioContext } from './audioContext';

export const GUITAR_TONES = [
  {
    id: 'standard_acoustic',
    name: 'Standard Acoustic Guitar',
    shortName: 'Standard Acoustic',
    icon: '🎸',
    description: 'Natural, authentic steel-string acoustic guitar with balanced wood tone and chime.',
    dampingBase: 0.994,
    brightness: 0.65,
    bodyResonanceFreq: 220,
    bodyGain: 5.0,
    cavityFreq: 115,
    cavityGain: 4.5,
    highShelfFreq: 3800,
    highShelfGain: -1.5,
  },
  {
    id: 'warm_vintage',
    name: 'Warm Vintage Acoustic',
    shortName: 'Warm Vintage',
    icon: '🪵',
    description: 'Rich, mellow mahogany body tone with deep bass and rounded highs.',
    dampingBase: 0.992,
    brightness: 0.50,
    bodyResonanceFreq: 195,
    bodyGain: 6.5,
    cavityFreq: 105,
    cavityGain: 5.5,
    highShelfFreq: 3000,
    highShelfGain: -4.0,
  },
  {
    id: 'bright_acoustic',
    name: 'Bright Acoustic (Phosphor Bronze)',
    shortName: 'Bright Acoustic',
    icon: '✨',
    description: 'Crisp, sparkling steel string tone with articulate pick attack for strumming.',
    dampingBase: 0.9965,
    brightness: 0.85,
    bodyResonanceFreq: 260,
    bodyGain: 3.5,
    cavityFreq: 125,
    cavityGain: 2.5,
    highShelfFreq: 3400,
    highShelfGain: 3.0,
  },
  {
    id: 'nylon_acoustic',
    name: 'Classical Nylon Guitar',
    shortName: 'Classical Nylon',
    icon: '🎼',
    description: 'Soft, rounded fingertip pluck with warm woody midrange and smooth decay.',
    dampingBase: 0.987,
    brightness: 0.38,
    bodyResonanceFreq: 190,
    bodyGain: 6.0,
    cavityFreq: 98,
    cavityGain: 5.0,
    highShelfFreq: 2200,
    highShelfGain: -6.5,
  },
];

// Active tone selection (stored in localStorage)
let activeToneId = 'standard_acoustic';
try {
  const saved = localStorage.getItem('string_guitar_tone');
  if (saved && GUITAR_TONES.some((t) => t.id === saved)) {
    activeToneId = saved;
  }
} catch (e) {
  // localStorage fallback
}

export function getGuitarTone() {
  return GUITAR_TONES.find((t) => t.id === activeToneId) || GUITAR_TONES[0];
}

export function setGuitarTone(toneId) {
  if (GUITAR_TONES.some((t) => t.id === toneId)) {
    activeToneId = toneId;
    try {
      localStorage.setItem('string_guitar_tone', toneId);
    } catch (e) {}
  }
}

/**
 * Synthesizes an authentic acoustic guitar string pluck with wood body resonance
 * @param {number} frequency - Target frequency in Hz (e.g. 82.41 for Low E)
 * @param {number} duration - Note duration in seconds
 * @param {number} volume - Volume gain (0 to 1)
 */
export function playAcousticPluck(frequency, duration = 3.0, volume = 0.65) {
  try {
    if (!frequency || frequency <= 0) return null;

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const tone = getGuitarTone();
    const sampleRate = ctx.sampleRate;
    const period = Math.max(2, Math.round(sampleRate / frequency));
    const totalSamples = Math.floor(sampleRate * duration);

    // Audio buffer
    const audioBuffer = ctx.createBuffer(1, totalSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // Seed the delay line with shaped organic pick excitation
    const delayLine = new Float32Array(period);
    const noiseBurstLen = period;
    
    // Pick shape: soft triangular impulse + filtered noise
    for (let i = 0; i < noiseBurstLen; i++) {
      const envelope = Math.sin((i / noiseBurstLen) * Math.PI); // smooth half-sine window
      const randomNoise = (Math.random() * 2 - 1) * tone.brightness;
      const fundamentalBurst = Math.sin((i / period) * 2 * Math.PI) * (1 - tone.brightness) * 0.75;
      delayLine[i] = (randomNoise + fundamentalBurst) * envelope;
    }

    // Dynamic frequency-dependent damping
    const freqDampingOffset = (frequency / 22000) * 0.012;
    const damping = Math.max(0.978, Math.min(0.9985, tone.dampingBase - freqDampingOffset));

    let previousSample = 0;
    let delayIndex = 0;

    for (let i = 0; i < totalSamples; i++) {
      const currentDelaySample = delayLine[delayIndex];
      // Lowpass moving average filter simulates string stiffness & air loss
      const filteredSample = (currentDelaySample * 0.48 + previousSample * 0.52) * damping;

      previousSample = currentDelaySample;
      delayLine[delayIndex] = filteredSample;
      channelData[i] = filteredSample;

      delayIndex = (delayIndex + 1) % period;
    }

    // Audio Graph
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    // Gain envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    // 1. Acoustic Wood Soundboard Filter
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'peaking';
    bodyFilter.frequency.value = tone.bodyResonanceFreq;
    bodyFilter.gain.value = tone.bodyGain;
    bodyFilter.Q.value = 1.4;

    // 2. Air Cavity / Helmholtz Resonance Filter (for acoustic warmth)
    const cavityFilter = ctx.createBiquadFilter();
    cavityFilter.type = 'peaking';
    cavityFilter.frequency.value = tone.cavityFreq;
    cavityFilter.gain.value = tone.cavityGain;
    cavityFilter.Q.value = 2.2;

    // 3. High Shelf Filter for string sparkle / warmth contour
    const shelfFilter = ctx.createBiquadFilter();
    shelfFilter.type = 'highshelf';
    shelfFilter.frequency.value = tone.highShelfFreq;
    shelfFilter.gain.value = tone.highShelfGain;

    // Connect filter chain
    source.connect(bodyFilter);
    bodyFilter.connect(cavityFilter);
    cavityFilter.connect(shelfFilter);
    shelfFilter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start();
    return source;
  } catch (err) {
    console.error('Error in playAcousticPluck:', err);
    return null;
  }
}

/**
 * Plays a strummed chord with humanized micro-timing
 * @param {Array<number>} frequencies - String frequencies from Low E to High E
 * @param {number} strumSpeedMs - Milliseconds between string plucks
 */
export function playAcousticChord(frequencies, strumSpeedMs = 28) {
  if (!frequencies || !frequencies.length) return;
  const validFreqs = frequencies.filter((f) => f && f > 0);

  validFreqs.forEach((freq, idx) => {
    const microDelay = idx * strumSpeedMs + (Math.random() * 4 - 2);
    setTimeout(() => {
      playAcousticPluck(freq, 2.8, 0.55);
    }, Math.max(0, microDelay));
  });
}

/**
 * Strums a chord with direction, tempo speed, and dynamic volume
 * @param {Array<number>} frequencies - List of frequencies (Low E to High E)
 * @param {'down' | 'up'} direction - Strum stroke direction
 * @param {number} tempo - BPM
 * @param {number} volume - Volume gain (0 to 1)
 */
export function playStrum(frequencies, direction = 'down', tempo = 90, volume = 0.6) {
  if (!frequencies || !frequencies.length) return;
  const activeFreqs = frequencies.filter((f) => f && f > 0);
  const orderedFreqs = direction === 'up' ? [...activeFreqs].reverse() : activeFreqs;
  
  const strumSpeedMs = Math.max(12, Math.min(32, Math.round(1600 / tempo)));

  orderedFreqs.forEach((freq, idx) => {
    const velocityWeight = direction === 'down' 
      ? 1.0 - (idx / orderedFreqs.length) * 0.2
      : 0.85 + (idx / orderedFreqs.length) * 0.2;

    const microDelay = idx * strumSpeedMs + (Math.random() * 3 - 1.5);

    setTimeout(() => {
      playAcousticPluck(freq, 2.6, volume * velocityWeight * 0.85);
    }, Math.max(0, microDelay));
  });
}

// AudioContext and MediaStream singleton manager with guitar-optimized signal chain
let audioCtx = null;
let micStream = null;
let sourceNode = null;
let analyserNode = null;
let isListening = false;

export function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export async function startMicInput() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  if (micStream && isListening) {
    return { audioCtx: ctx, analyserNode, sourceNode };
  }

  // Request high quality microphone stream without aggressive browser noise gates
  micStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
      latency: 0,
    },
  });

  sourceNode = ctx.createMediaStreamSource(micStream);
  analyserNode = ctx.createAnalyser();
  // 4096 samples provides ~85ms window for ultra-accurate low string detection (E2 ~ 82.4Hz)
  analyserNode.fftSize = 4096;
  analyserNode.smoothingTimeConstant = 0.05; // low smoothing for fast response

  // Highpass filter: remove rumble & desk bumps below 55Hz
  const highpassFilter = ctx.createBiquadFilter();
  highpassFilter.type = 'highpass';
  highpassFilter.frequency.value = 55;

  // Lowpass filter: remove hiss and high-frequency noise above 900Hz while preserving High E harmonics
  const lowpassFilter = ctx.createBiquadFilter();
  lowpassFilter.type = 'lowpass';
  lowpassFilter.frequency.value = 900;

  sourceNode.connect(highpassFilter);
  highpassFilter.connect(lowpassFilter);
  lowpassFilter.connect(analyserNode);

  isListening = true;
  return { audioCtx: ctx, analyserNode, sourceNode };
}

export function stopMicInput() {
  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop());
    micStream = null;
  }
  if (sourceNode) {
    sourceNode.disconnect();
    sourceNode = null;
  }
  isListening = false;
}

export function isMicActive() {
  return isListening;
}

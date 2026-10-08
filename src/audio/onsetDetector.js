// Transient & Onset Detector for acoustic guitar strums and pick attacks
import { getRMS } from './pitchDetector';

export class OnsetDetector {
  constructor(thresholdMultiplier = 1.8, minIntervalMs = 120) {
    this.thresholdMultiplier = thresholdMultiplier;
    this.minIntervalMs = minIntervalMs;
    this.lastOnsetTime = 0;
    this.movingAverage = 0.02;
    this.history = [];
    this.historySize = 10;
  }

  /**
   * Process a time-domain audio buffer to detect sudden pick or strum attacks
   * @param {Float32Array} buffer 
   * @returns {boolean} true if an onset/strum was just detected
   */
  detect(buffer) {
    const rms = getRMS(buffer);
    const now = performance.now();

    // Maintain recent average energy
    this.history.push(rms);
    if (this.history.length > this.historySize) {
      this.history.shift();
    }
    const avgRms = this.history.reduce((a, b) => a + b, 0) / this.history.length;

    const isSpike = rms > 0.04 && rms > (avgRms * this.thresholdMultiplier);
    const isCoolDownOver = (now - this.lastOnsetTime) > this.minIntervalMs;

    if (isSpike && isCoolDownOver) {
      this.lastOnsetTime = now;
      return true;
    }

    return false;
  }

  reset() {
    this.lastOnsetTime = 0;
    this.history = [];
  }
}

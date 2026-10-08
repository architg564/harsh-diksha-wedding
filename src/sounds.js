// Web Audio API Synthesizer for Authentic Indian Temple Bells and Festive Chimes
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a resonant, authentic brass temple bell sound
 * with rich harmonics and natural decay.
 */
export function playTempleBellSound(pitchMultiplier = 1.0) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic series of traditional Indian cast-bronze temple bell
    const partials = [
      { freq: 440 * pitchMultiplier, gain: 0.5, decay: 3.5 },
      { freq: 880 * pitchMultiplier, gain: 0.35, decay: 2.8 },
      { freq: 1320 * pitchMultiplier, gain: 0.22, decay: 2.2 },
      { freq: 1760 * pitchMultiplier, gain: 0.15, decay: 1.6 },
      { freq: 2640 * pitchMultiplier, gain: 0.08, decay: 1.1 }
    ];

    partials.forEach(p => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);
      // Subtle pitch bend of heavy swinging metal
      osc.frequency.exponentialRampToValueAtTime(p.freq * 0.996, now + p.decay);

      gain.gain.setValueAtTime(p.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  } catch (err) {
    console.warn('Bell sound synthesis error:', err);
  }
}

/**
 * Synthesizes a subtle, celebratory chime / sparkle sound
 */
export function playSparkleChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  } catch (err) {
    console.warn('Sparkle chime error:', err);
  }
}

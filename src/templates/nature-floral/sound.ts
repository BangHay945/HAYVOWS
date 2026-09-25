// Nature Floral Sound Synthesizer (Web Audio API)
// Provides gentle, organic acoustic chimes and harp arpeggios
import { getAudioContext } from "../shared/audio";

export function playFloralSound(
  type: "open" | "click" | "success" | "chime" | "page"
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === "click") {
      // Soft gentle wood/kalimba droplet tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.04); // E5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "open") {
      // Soft celestial wind chime / harp sweep
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const startTime = now + idx * 0.06;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } else if (type === "success" || type === "chime") {
      // Gentle romantic chime chord
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C major chord
      chords.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    } else if (type === "page") {
      // Soft subtle brush sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch {
    // Ignore audio limits
  }
}

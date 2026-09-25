// 16-Bit Cyberpunk Web Audio API Synthesizer
// Zero external sound files needed for instant zero-latency feedback
import { getAudioContext } from "../shared/audio";

export function playCyberSound(
  type: "move" | "interact" | "fanfare" | "open" | "success" | "select" | "magic"
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === "move") {
      // Futuristic soft boot tap on wet neon asphalt
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.04);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === "select") {
      // Crisp Cyberpunk Terminal Tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1760, now + 0.03);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "interact" || type === "magic") {
      // Shimmering Hologram Resonance (Synthwave Chime)
      const frequencies = [440, 659.25, 880, 1318.51]; // A4, E5, A5, E6
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const noteStart = now + i * 0.035;
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.07, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.28);
      });
    } else if (type === "open") {
      // High-Tech Cyber Deck Boot Sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.28);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (type === "success" || type === "fanfare") {
      // 80s Synthwave Victory Arpeggio
      const fanfareNotes = [
        { f: 587.33, d: 0.08 }, // D5
        { f: 739.99, d: 0.08 }, // F#5
        { f: 880.0, d: 0.08 },  // A5
        { f: 1174.66, d: 0.16 }, // D6
        { f: 1046.5, d: 0.08 }, // C6
        { f: 1174.66, d: 0.35 }, // D6
      ];

      let noteTime = now;
      fanfareNotes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(n.f, noteTime);
        gain.gain.setValueAtTime(0.04, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + n.d);
        noteTime += n.d * 0.9;
      });
    }
  } catch {
    // Graceful fallback if Web Audio is restricted
  }
}

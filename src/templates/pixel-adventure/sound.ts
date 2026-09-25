// Sea of Stars Inspired Modern JRPG Sound Synthesizer (Web Audio API)
import { getAudioContext } from "../shared/audio";

export function play8BitSound(
  type: "move" | "interact" | "fanfare" | "open" | "success" | "select" | "magic"
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === "move") {
      // Soft gentle grass/stone step with slight resonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "select") {
      // Crisp JRPG cursor tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "interact" || type === "magic") {
      // Shimmering Solstice crystal chime (Sea of Stars style)
      const frequencies = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const noteStart = now + i * 0.04;
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.08, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.25);
      });
    } else if (type === "open") {
      // Majestic Chest / Portal Opening Chime
      const freqs = [329.63, 493.88, 659.25, 987.77, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const startTime = now + idx * 0.05;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.09, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } else if (type === "success" || type === "fanfare") {
      // Grand JRPG Solstice Victory Fanfare (Harp & Brass arpeggio)
      const fanfareNotes = [
        { f: 523.25, d: 0.1 }, // C5
        { f: 659.25, d: 0.1 }, // E5
        { f: 783.99, d: 0.1 }, // G5
        { f: 1046.5, d: 0.2 }, // C6
        { f: 987.77, d: 0.1 }, // B5
        { f: 1046.5, d: 0.1 }, // C6
        { f: 1318.51, d: 0.4 }, // E6
      ];

      let accumulatedTime = now;
      fanfareNotes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(note.f, accumulatedTime);
        gain.gain.setValueAtTime(0.12, accumulatedTime);
        gain.gain.exponentialRampToValueAtTime(0.001, accumulatedTime + note.d * 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(accumulatedTime);
        osc.stop(accumulatedTime + note.d * 1.2);
        accumulatedTime += note.d * 0.9;
      });
    }
  } catch {
    // Ignore audio policy limits
  }
}

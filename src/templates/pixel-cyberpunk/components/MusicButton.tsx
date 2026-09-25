"use client";
import { motion } from "framer-motion";

export function CyberMusicButton({
  isPlaying,
  onToggle,
  className = "fixed top-3 right-3 sm:top-4 sm:right-4 z-50",
}: {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={`${className} flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 border-2 ${
        isPlaying
          ? "border-[#00f0ff] bg-[#0b0f19f2] shadow-[0_0_15px_rgba(0,240,255,0.6),0_4px_12px_rgba(0,0,0,0.9)]"
          : "border-[#ff007f]/60 bg-[#0b0f19cc] opacity-80 shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
      } ring-1 ring-[#00f0ff]/30 text-[#00f0ff] font-pixel cursor-pointer select-none transition-all`}
      title={isPlaying ? "Mute BGM Synthwave" : "Play BGM Synthwave"}
      aria-label={isPlaying ? "Matikan Musik Latar" : "Putar Musik Latar"}
    >
      <motion.span
        animate={
          isPlaying
            ? { rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }
            : { rotate: 0, scale: 1 }
        }
        transition={{
          duration: 1.4,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="text-sm sm:text-base inline-block"
      >
        {isPlaying ? "📻" : "🔇"}
      </motion.span>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider drop-shadow-[0_0_6px_#00f0ff]">
        {isPlaying ? "SYNTH ON" : "SYNTH OFF"}
      </span>
    </motion.button>
  );
}

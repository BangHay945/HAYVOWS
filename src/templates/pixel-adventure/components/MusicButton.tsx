"use client";
import { motion } from "framer-motion";

export function PixelMusicButton({
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
          ? "border-[#fde047] bg-gradient-to-tr from-[#4c0519] to-[#881337] shadow-[0_0_15px_rgba(253,224,71,0.5),0_4px_12px_rgba(0,0,0,0.85)]"
          : "border-[#eab308]/60 bg-[#2a0812e6] opacity-90 shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
      } ring-1 ring-[#78350f] text-[#fde047] font-pixel cursor-pointer select-none transition-all`}
      title={isPlaying ? "Matikan Musik Latar (Mute)" : "Putar Musik Latar (Play)"}
      aria-label={isPlaying ? "Matikan Musik Latar" : "Putar Musik Latar"}
    >
      <motion.span
        animate={
          isPlaying
            ? { rotate: [0, 12, -12, 0], scale: [1, 1.12, 1] }
            : { rotate: 0, scale: 1 }
        }
        transition={{
          duration: 1.5,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="text-sm sm:text-base inline-block"
      >
        {isPlaying ? "🎵" : "🔇"}
      </motion.span>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider drop-shadow">
        {isPlaying ? "ON" : "OFF"}
      </span>
    </motion.button>
  );
}


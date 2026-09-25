"use client";
import { motion } from "framer-motion";

export function FloralMusicButton({
  isPlaying,
  onToggle,
  className = "fixed top-4 right-4 z-50",
}: {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${className} flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#c5a880]/70 bg-[#ffffff]/90 backdrop-blur-md shadow-md text-[#2d4a3e] font-sans-floral cursor-pointer select-none transition-all hover:bg-white`}
      title={isPlaying ? "Jeda Musik Latar" : "Putar Musik Latar"}
      aria-label={isPlaying ? "Jeda Musik Latar" : "Putar Musik Latar"}
    >
      <motion.div
        animate={
          isPlaying
            ? { rotate: 360 }
            : { rotate: 0 }
        }
        transition={{
          duration: 4,
          repeat: isPlaying ? Infinity : 0,
          ease: "linear",
        }}
        className="w-5 h-5 rounded-full bg-[#e8eee5] border border-[#c5a880] flex items-center justify-center text-[10px]"
      >
        {isPlaying ? "🌿" : "🍂"}
      </motion.div>
      <span className="text-[11px] font-semibold tracking-wider text-[#2d4a3e] uppercase">
        {isPlaying ? "Music" : "Muted"}
      </span>
    </motion.button>
  );
}

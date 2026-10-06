"use client";

import { motion } from "framer-motion";
import { Disc3, VolumeX } from "lucide-react";

interface MusicButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}

export function VintageRoyalMusicButton({
  isPlaying,
  onToggle,
  className = "",
}: MusicButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      whileHover={{
        borderColor: "var(--hy-accent, #d5be9b)",
        scale: 1.05,
      }}
      className={`vintage-royal-music-btn relative flex items-center justify-center rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.6)] ${className}`}
      style={{
        width: 44,
        height: 44,
        background: "rgba(20, 21, 23, 0.92)",
        border: "1px solid color-mix(in srgb, var(--hy-accent, #d5be9b) 45%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: "pointer",
        outline: "none",
        flexShrink: 0,
        transition: "border-color 0.25s ease, transform 0.2s ease",
      }}
      title={isPlaying ? "Jeda Alunan Musik" : "Putar Alunan Musik"}
      aria-label={isPlaying ? "Jeda Alunan Musik" : "Putar Alunan Musik"}
    >
      {/* Vinyl record outer subtle groove */}
      <span className="absolute inset-0.5 rounded-full border border-white/5 pointer-events-none" />

      {/* Center Italian monogram / wax seal aesthetic icon */}
      <span className="flex items-center justify-center">
        {isPlaying ? (
          <Disc3
            className="w-5 h-5 animate-spin [animation-duration:4s]"
            style={{ color: "var(--hy-accent, #d5be9b)" }}
            strokeWidth={1.6}
          />
        ) : (
          <VolumeX
            className="w-5 h-5 text-[#8a8b90]"
            strokeWidth={1.6}
          />
        )}
      </span>
    </motion.button>
  );
}

"use client";

import { motion } from "framer-motion";
import { Disc3, VolumeX } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MusicButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CinematicIvoryMusicButton({
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
        borderColor: "rgba(212, 196, 176, 0.9)",
        scale: 1.05,
      }}
      className={`relative flex items-center justify-center rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.6)] ${className}`}
      style={{
        width: 44,
        height: 44,
        background: "rgba(22, 23, 27, 0.92)",
        border: "1px solid rgba(212, 196, 176, 0.4)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: "pointer",
        outline: "none",
        flexShrink: 0,
        transition: "border-color 0.25s ease, transform 0.2s ease",
      }}
      title={isPlaying ? "Jeda Musik" : "Putar Alunan Musik"}
      aria-label={isPlaying ? "Jeda Musik" : "Putar Alunan Musik"}
    >
      {/* Vinyl record outer subtle groove */}
      <span className="absolute inset-0.5 rounded-full border border-white/5 pointer-events-none" />

      {/* Icon with continuous smooth spin */}
      <span className="flex items-center justify-center">
        {isPlaying ? (
          <Disc3
            className="w-5 h-5 text-[#f5f3ef] animate-spin [animation-duration:4s]"
            strokeWidth={1.5}
          />
        ) : (
          <VolumeX
            className="w-5 h-5 text-[#8a8b90]"
            strokeWidth={1.5}
          />
        )}
      </span>
    </motion.button>
  );
}

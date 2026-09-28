"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MusicButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function CinematicIvoryMusicButton({
  isPlaying,
  onToggle,
  className = "",
}: MusicButtonProps) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      whileHover={{
        borderColor: "rgba(212, 196, 176, 0.8)",
      }}
      className={`relative flex items-center justify-center rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.6)] ${className}`}
      style={{
        width: 44,
        height: 44,
        background: "rgba(22, 23, 27, 0.92)",
        border: "1px solid rgba(212, 196, 176, 0.35)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: "pointer",
        outline: "none",
        flexShrink: 0,
        transition: "border-color 0.25s ease",
      }}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      {/* Icon with conditional rotation */}
      <motion.span
        className="flex items-center justify-center"
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isPlaying
            ? {
                rotate: {
                  duration: 10,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }
            : {
                rotate: {
                  duration: 0.5,
                  ease: EASE,
                },
              }
        }
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {isPlaying ? (
          <Volume2
            size={16}
            strokeWidth={1.5}
            color="#f5f3ef"
          />
        ) : (
          <VolumeX
            size={16}
            strokeWidth={1.5}
            color="#8a8b90"
          />
        )}
      </motion.span>
    </motion.button>
  );
}

"use client";

import { motion } from "framer-motion";
import { Disc3, VolumeX } from "lucide-react";

interface MusicButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function EditorialMusicButton({ isPlaying, onToggle }: MusicButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      className="w-12 h-12 rounded-full bg-[#111115]/95 backdrop-blur-md border border-[#e8d5b5]/50 text-[#e8d5b5] shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex items-center justify-center cursor-pointer transition-all hover:border-[#e8d5b5] hover:scale-105 relative group select-none"
      title={isPlaying ? "Jeda Musik" : "Putar Musik"}
      aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"}
    >
      {/* Vinyl Disc Ring / Glow */}
      <span className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />

      {isPlaying ? (
        <Disc3 className="w-5 h-5 text-[#e8d5b5] animate-spin [animation-duration:4s]" />
      ) : (
        <VolumeX className="w-5 h-5 text-neutral-400" />
      )}
    </motion.button>
  );
}

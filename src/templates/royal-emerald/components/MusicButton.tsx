"use client";

import { Disc3, Music2 } from "lucide-react";

interface RoyalMusicButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function RoyalMusicButton({ isPlaying, onToggle }: RoyalMusicButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#02241b]/90 backdrop-blur-md border border-[#d4af37] text-[#ffd700] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_28px_rgba(212,175,55,0.65)] hover:scale-105 transition-all duration-300 cursor-pointer group"
    >
      <Disc3
        className={`w-6 h-6 text-[#ffd700] transition-transform ${
          isPlaying ? "animate-spin [animation-duration:4s]" : "opacity-75"
        }`}
      />
      {/* Little center gold jewel */}
      <span className="absolute w-2 h-2 rounded-full bg-[#d4af37] group-hover:scale-125 transition-transform" />
    </button>
  );
}

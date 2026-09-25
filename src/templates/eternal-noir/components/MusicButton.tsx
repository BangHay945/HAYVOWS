"use client";
import { CassetteTape } from "lucide-react";

interface MusicButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}

export function NoirMusicButton({ isPlaying, onToggle, className = "" }: MusicButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={isPlaying ? "Jeda Musik" : "Putar Musik"}
      aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"}
      className={`w-11 h-11 rounded-full border border-[#c9a84c]/60 hover:border-[#c9a84c] bg-[#111111]/90 backdrop-blur-md text-[#c9a84c] flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 group relative ${className}`}
    >
      {/* Subtle pulse ring when playing */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full border border-[#c9a84c]/40 animate-ping pointer-events-none" />
      )}

      <CassetteTape
        className={`w-5 h-5 transition-all duration-300 ${
          isPlaying
            ? "text-[#c9a84c] scale-105"
            : "text-[#888888] opacity-50 group-hover:opacity-80"
        }`}
      />
    </button>
  );
}

"use client";
import { Music, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export function MonogramMusicButton({
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
      title={isPlaying ? "Jeda musik" : "Putar musik"}
      className="w-10 h-10 rounded-full bg-[#2d4a3e] text-white border-2 border-[#c5a880] shadow-md flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
    >
      <div className={`flex items-center justify-center ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "5s" }}>
        <Music className="w-4 h-4 text-[#fef08a]" />
      </div>
    </motion.button>
  );
}

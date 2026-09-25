"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { playCyberSound } from "../sound";
import { QrCode, Zap } from "lucide-react";

export function CyberCover({
  context,
  onOpen,
  onOpenTicket,
}: TemplateComponentProps & { onOpen: () => void; onOpenTicket?: () => void }) {
  const { wedding, guest } = context;
  const couple = wedding.couple;

  const handleOpen = () => {
    playCyberSound("open");
    onOpen();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-pixel select-none px-4 bg-[#070913]">
      {/* 1. Full-Screen Cyberpunk Neon City Rooftop Map */}
      <img
        src="/assets/templates/pixel-cyberpunk/maps/skyline-district-v1/ground-map.png"
        alt="Cyberpunk Wedding City Map"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-105 [image-rendering:pixelated] [image-rendering:crisp-edges]"
        style={{
          imageRendering: "pixelated",
          filter: "brightness(0.9) contrast(1.08)",
        }}
      />

      {/* Cyber Fog / Dark Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(0, 240, 255, 0.08) 0%, rgba(11, 15, 25, 0.7) 70%, rgba(5, 7, 12, 0.92) 100%)",
        }}
      />

      {/* CRT Scanline Retro Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 6px 100%",
        }}
      />

      {/* Floating Neon Cyber Sparkles & Rain Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute [image-rendering:pixelated]"
            style={{
              left: `${(i * 19 + 7) % 96}%`,
              top: `${(i * 29 + 11) % 92}%`,
              width: i % 2 === 0 ? "4px" : "6px",
              height: i % 2 === 0 ? "4px" : "6px",
              backgroundColor:
                i % 3 === 0 ? "#00f0ff" : i % 3 === 1 ? "#ff007f" : "#ffe600",
              boxShadow:
                i % 3 === 0
                  ? "0 0 8px #00f0ff"
                  : i % 3 === 1
                  ? "0 0 8px #ff007f"
                  : "0 0 8px #ffe600",
            }}
            animate={{
              y: [0, 45, 90],
              x: [(i % 2 === 0 ? -1 : 1) * 6, (i % 2 === 0 ? 1 : -1) * 8],
              opacity: [0, 0.95, 0],
              scale: [0.6, 1.2, 0.6],
            }}
            transition={{
              duration: 3.5 + (i % 4) * 0.8,
              repeat: Infinity,
              delay: (i % 5) * 0.7,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Holographic Cyber Invitation Terminal Card */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-sm sm:max-w-md w-full bg-[#0b0f19fa] border-3 sm:border-4 border-[#00f0ff] p-4 sm:p-6 text-center shadow-[0_0_35px_rgba(0,240,255,0.4),inset_0_0_20px_rgba(255,0,127,0.2)]"
      >
        {/* Neon HUD Corner Brackets */}
        <div className="absolute -top-2.5 -left-2.5 w-4 h-4 bg-[#ff007f] border border-[#00f0ff] shadow-[0_0_8px_#ff007f]" />
        <div className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-[#ff007f] border border-[#00f0ff] shadow-[0_0_8px_#ff007f]" />
        <div className="absolute -bottom-2.5 -left-2.5 w-4 h-4 bg-[#ff007f] border border-[#00f0ff] shadow-[0_0_8px_#ff007f]" />
        <div className="absolute -bottom-2.5 -right-2.5 w-4 h-4 bg-[#ff007f] border border-[#00f0ff] shadow-[0_0_8px_#ff007f]" />

        {/* Top Terminal Status Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121829] border border-[#00f0ff]/60 text-[#00f0ff] text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-3 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
          <span>CYBER-VOWS // NEO-TOKYO 2077</span>
        </div>

        {/* Couple Portraits Display */}
        <div className="flex justify-center items-center gap-3 my-3">
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-[#00f0ff] bg-[#121829] p-0.5 overflow-hidden shadow-[0_0_12px_rgba(0,240,255,0.5)]">
              <img
                src={
                  couple?.groomPhoto ||
                  "/assets/templates/pixel-cyberpunk/characters/portraits/portrait-groom.png"
                }
                alt="Groom"
                className="w-full h-full object-cover [image-rendering:pixelated]"
              />
            </div>
            <span className="text-[8px] font-bold text-[#00f0ff] block mt-1">
              GROOM
            </span>
          </div>

          {/* Glowing Neon Cyber Heart */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-2xl sm:text-3xl text-[#ff007f] drop-shadow-[0_0_12px_#ff007f]"
          >
            💖
          </motion.div>

          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-[#ff007f] bg-[#121829] p-0.5 overflow-hidden shadow-[0_0_12px_rgba(255,0,127,0.5)]">
              <img
                src={
                  couple?.bridePhoto ||
                  "/assets/templates/pixel-cyberpunk/characters/portraits/portrait-bride.png"
                }
                alt="Bride"
                className="w-full h-full object-cover [image-rendering:pixelated]"
              />
            </div>
            <span className="text-[8px] font-bold text-[#ff007f] block mt-1">
              BRIDE
            </span>
          </div>
        </div>

        {/* Couple Names */}
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider my-1 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
          <span className="text-[#00f0ff]">
            {couple?.groomNickname || couple?.groomName || "LIAM"}
          </span>
          <span className="text-[#ff007f] mx-1.5">&amp;</span>
          <span className="text-[#ff007f]">
            {couple?.brideNickname || couple?.brideName || "ELARA"}
          </span>
        </h1>

        <p className="text-[9px] sm:text-[10px] text-[#94a3b8] tracking-widest uppercase mb-3">
          ROYAL CYBERNETIC WEDDING CEREMONY
        </p>

        {/* Guest Security Pass Box */}
        <div className="my-3 p-2.5 bg-[#0f172a]/90 border border-[#00f0ff]/40 text-left">
          <div className="flex items-center justify-between text-[7px] sm:text-[8px] text-[#00f0ff] font-bold uppercase tracking-wider mb-1">
            <span>VIP ACCESS PROTOCOL</span>
            <span className="text-[#ff007f]">AUTHENTICATED</span>
          </div>
          <div className="text-[8px] sm:text-[9px] text-gray-400">
            Kepada Yth. Tamu Terhormat:
          </div>
          <div className="text-xs sm:text-sm font-black text-[#ffe600] tracking-wide mt-0.5 drop-shadow-[0_0_6px_rgba(255,230,0,0.6)]">
            {guest?.name || "Tamu Kehormatan VIP"}
          </div>
          {guest?.guestCount && guest.guestCount > 1 && (
            <div className="text-[8px] text-[#38bdf8] mt-0.5">
              Kapasitas Akses: {guest.guestCount} Orang
            </div>
          )}
        </div>

        {/* Start Game Button [INITIALIZE ACCESS] */}
        <motion.button
          onClick={handleOpen}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="w-full mt-2 py-3 bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ff007f] text-[#0b0f19] font-black text-xs sm:text-sm tracking-wider uppercase border-2 border-white shadow-[0_0_20px_rgba(0,240,255,0.7)] cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>🚀</span>
          <span>BUKA UNDANGAN [START]</span>
          <span>🎮</span>
        </motion.button>

        {/* Button: Tiket E-Pass QR */}
        {guest && onOpenTicket && (
          <motion.button
            type="button"
            onClick={onOpenTicket}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-2.5 py-2.5 bg-[#0a0a14]/90 hover:bg-[#00f0ff]/20 text-[#00f0ff] font-mono text-[10px] sm:text-xs tracking-widest uppercase border border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-[#fcee0a] animate-pulse" />
            <span>LIHAT TIKET E-PASS QR</span>
          </motion.button>
        )}

        <p className="text-[7px] sm:text-[8px] text-gray-500 mt-2 font-mono">
          PRESS START TO ENTER THE CYBER DISTRICT
        </p>
      </motion.div>
    </div>
  );
}

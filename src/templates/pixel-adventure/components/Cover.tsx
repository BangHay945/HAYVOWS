"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { play8BitSound } from "../sound";
import { QrCode, Star } from "lucide-react";

interface CoverProps extends TemplateComponentProps {
  onOpen: () => void;
  onOpenTicket?: () => void;
}

export function PixelCover({ context, onOpen, onOpenTicket }: CoverProps) {
  const { wedding, guest } = context;
  const couple = wedding.couple;

  const handleStart = () => {
    play8BitSound("open");
    onOpen();
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden touch-none font-pixel select-none px-3 sm:px-4 bg-[#2a0812]">
      {/* 1. Full-Screen Bright, Vibrant Pixel Art Floating Island Map */}
      <img
        src="/assets/templates/pixel-adventure/maps/floating-island-v1/map.png"
        alt="Floating Island Wedding Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-105 [image-rendering:pixelated] [image-rendering:crisp-edges]"
        style={{
          imageRendering: "pixelated",
          filter: "brightness(0.95) contrast(1.05)",
        }}
      />

      {/* Gentle Warm Sunlit Backdrop Film (Preserves sunny garden colors & courtyard) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(254, 240, 138, 0.15) 0%, rgba(45, 10, 20, 0.38) 75%, rgba(25, 5, 12, 0.58) 100%)",
        }}
      />

      {/* Floating Gold & Flower Pixel Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute [image-rendering:pixelated]"
            style={{
              left: `${(i * 17 + 8) % 94}%`,
              top: `${(i * 27 + 12) % 90}%`,
              width: i % 2 === 0 ? "6px" : "8px",
              height: i % 2 === 0 ? "6px" : "8px",
              backgroundColor: i % 3 === 0 ? "#fde047" : i % 3 === 1 ? "#f472b6" : "#fef08a",
              boxShadow: "0 0 6px rgba(254, 240, 138, 0.8)",
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, i % 2 === 0 ? 12 : -12, 0],
              opacity: [0.3, 0.95, 0.3],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* 2. Main JRPG Royal Banquet Window Box (Matching Red Carpet & Banners in Map) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-sm sm:max-w-md w-full my-auto flex flex-col items-center"
      >
        {/* Top Royal Banner Badge */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mb-1.5 sm:mb-2.5 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-[#4c0519] border-2 border-[#f6d776] shadow-[0_4px_16px_rgba(0,0,0,0.7)] text-[#fde047]"
        >
          <span className="text-xs sm:text-sm">👑</span>
          <span className="text-[10px] sm:text-sm font-bold uppercase tracking-widest drop-shadow">
            THE ROYAL WEDDING FESTIVAL
          </span>
          <span className="text-xs sm:text-sm">👑</span>
        </motion.div>

        {/* Royal Window Frame (Burgundy Velvet + 4px Gold Bevel + Wood Outline) */}
        <div className="relative w-full border-3 sm:border-4 border-[#eab308] bg-[#2a0812f5] backdrop-blur-sm p-3.5 sm:p-7 shadow-[0_12px_45px_rgba(0,0,0,0.85),inset_0_0_20px_rgba(234,179,8,0.25)] ring-2 ring-[#78350f]">
          {/* 4-Corner Royal Gemstones */}
          <div className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3 w-4 h-4 sm:w-5 sm:h-5 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[8px] sm:text-[9px] text-[#78350f] font-black">
            ◆
          </div>
          <div className="absolute -top-2.5 -right-2.5 sm:-top-3 sm:-right-3 w-4 h-4 sm:w-5 sm:h-5 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[8px] sm:text-[9px] text-[#78350f] font-black">
            ◆
          </div>
          <div className="absolute -bottom-2.5 -left-2.5 sm:-bottom-3 sm:-left-3 w-4 h-4 sm:w-5 sm:h-5 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[8px] sm:text-[9px] text-[#78350f] font-black">
            ◆
          </div>
          <div className="absolute -bottom-2.5 -right-2.5 sm:-bottom-3 sm:-right-3 w-4 h-4 sm:w-5 sm:h-5 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[8px] sm:text-[9px] text-[#78350f] font-black">
            ◆
          </div>

          {/* Couple Pixel Avatars with Royal Gold Frames */}
          <div className="flex items-center justify-center -space-x-2 sm:-space-x-3 mb-2 sm:mb-4">
            <div className="relative">
              <div className="w-13 h-13 sm:w-20 sm:h-20 border-2 sm:border-3 border-[#60a5fa] overflow-hidden bg-[#3b0d19] shadow-[0_0_12px_rgba(96,165,250,0.6)] [image-rendering:pixelated]">
                <img
                  src={
                    couple?.groomPhoto ||
                    "/assets/templates/pixel-adventure/characters/portraits/portrait-groom.png"
                  }
                  alt="Groom Pixel Portrait"
                  className="w-full h-full object-cover [image-rendering:pixelated]"
                />
              </div>
              <span className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 bg-[#0284c7] text-white text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 border border-white uppercase tracking-wider shadow whitespace-nowrap">
                GROOM
              </span>
            </div>

            <div className="relative z-10 text-xl sm:text-2xl text-[#f472b6] animate-pulse drop-shadow">
              💖
            </div>

            <div className="relative">
              <div className="w-13 h-13 sm:w-20 sm:h-20 border-2 sm:border-3 border-[#f472b6] overflow-hidden bg-[#3b0d19] shadow-[0_0_12px_rgba(244,114,182,0.6)] [image-rendering:pixelated]">
                <img
                  src={
                    couple?.bridePhoto ||
                    "/assets/templates/pixel-adventure/characters/portraits/portrait-bride.png"
                  }
                  alt="Bride Pixel Portrait"
                  className="w-full h-full object-cover [image-rendering:pixelated]"
                />
              </div>
              <span className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 bg-[#db2777] text-white text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 border border-white uppercase tracking-wider shadow whitespace-nowrap">
                BRIDE
              </span>
            </div>
          </div>

          {/* Couple Names in Bold 16-Bit Golden Typography */}
          <div className="text-center mt-2 mb-1.5">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#fde047] tracking-wider drop-shadow-[0_2px_0px_#78350f] uppercase leading-tight">
              {couple?.groomNickname || couple?.groomName || "ALEX"}
            </h1>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-0.5 sm:my-1 text-[#fbcfe8]">
              <span className="text-[#fde047] text-[10px] sm:text-xs">✦</span>
              <span className="text-xs sm:text-sm font-bold text-[#fef08a] tracking-widest">&amp;</span>
              <span className="text-[#fde047] text-[10px] sm:text-xs">✦</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#fde047] tracking-wider drop-shadow-[0_2px_0px_#78350f] uppercase leading-tight">
              {couple?.brideNickname || couple?.brideName || "SARA"}
            </h1>
          </div>

          {/* Golden Pixel Divider */}
          <div className="w-full h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#fde047] to-transparent my-2 sm:my-3.5" />

          {/* Royal Invitation Parchment Scroll for Honored Guest */}
          <div className="bg-[#fef9eb] border-2 border-[#b45309] p-2 sm:p-3 text-center shadow-inner my-1.5 sm:my-2 text-[#451a03]">
            <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#92400e] font-extrabold flex items-center justify-center gap-1 sm:gap-1.5">
              <span>📜</span>
              <span>SURAT UNDANGAN KERAJAAN</span>
            </div>
            <p className="text-[#831843] text-sm sm:text-lg font-black mt-0.5 sm:mt-1 tracking-wide drop-shadow-[0_1px_0px_rgba(255,255,255,0.8)] line-clamp-1">
              {guest?.name || "Tamu Kehormatan"}
            </p>
            <p className="text-[9px] sm:text-[10px] text-[#451a03] font-bold mt-0.5">
              Status: <span className="text-[#15803d] font-black">Tamu Terhormat (VIP)</span>
            </p>
          </div>

          {/* 16-Bit Chunky 3D Gold Action Button */}
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2.5 sm:mt-3.5 bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#d97706] hover:brightness-110 text-[#451a03] font-black text-xs sm:text-base py-2.5 sm:py-3.5 px-4 sm:px-6 border-b-4 border-r-4 border-[#78350f] active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 shadow-[0_6px_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 tracking-wider"
          >
            <span>▶</span>
            <span>BUKA UNDANGAN &amp; MASUK PESTA</span>
            <span>◀</span>
          </motion.button>

          {/* Button: Tiket E-Pass QR */}
          {guest && onOpenTicket && (
            <motion.button
              type="button"
              onClick={onOpenTicket}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 bg-[#1a1c23] hover:bg-[#282b36] text-[#fceb00] font-black text-[11px] sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 border-2 border-[#fceb00] shadow-[3px_3px_0px_#000] active:translate-y-0.5 active:translate-x-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wider uppercase"
            >
              <Star className="w-3.5 h-3.5 text-[#fceb00]" />
              <span>LIHAT TIKET E-PASS QR</span>
            </motion.button>
          )}
        </div>

        {/* Footer Subtext */}
        <div className="mt-2 sm:mt-3 text-center space-y-0.5 sm:space-y-1">
          <p className="text-[#fef08a] text-[10px] sm:text-[11px] tracking-wider drop-shadow flex items-center justify-center gap-1 font-bold">
            <span>✨</span>
            <span>KLIK UNTUK MEMULAI PETUALANGAN DI PULAU LANGIT KERAJAAN</span>
            <span>✨</span>
          </p>
          <p className="text-[9px] sm:text-[10px] text-amber-200/60 font-mono">
            Undangan Digital oleh{" "}
            <a
              href="https://www.hayvows.com"
              target="_blank"
              rel="noopener"
              className="text-[#fde047] underline hover:text-white transition-colors font-bold"
            >
              Hayvows
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}



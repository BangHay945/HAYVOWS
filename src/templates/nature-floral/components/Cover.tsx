"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { playFloralSound } from "../sound";
import { QrCode } from "lucide-react";

interface CoverProps extends TemplateComponentProps {
  onOpen: () => void;
  onOpenTicket?: () => void;
}

export function FloralCover({ context, onOpen, onOpenTicket }: CoverProps) {
  const { wedding, guest } = context;
  const couple = wedding.couple;
  const events = wedding.events ?? [];
  const firstEvent = events[0];

  const handleStart = () => {
    playFloralSound("open");
    onOpen();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden font-sans-floral select-none px-4 bg-gradient-to-b from-[#f7f4ee] via-[#fbf9f5] to-[#f0ece4]">
      {/* Background Subtle Organic Mesh / Botanical Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(232, 238, 229, 0.7) 0%, rgba(247, 244, 238, 0.4) 60%, rgba(216, 207, 196, 0.45) 100%)",
        }}
      />

      {/* Floating Gentle Petals / Leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${(i * 18 + 7) % 94}%`,
              top: `${(i * 26 + 10) % 90}%`,
              width: i % 2 === 0 ? "10px" : "14px",
              height: i % 2 === 0 ? "10px" : "14px",
              backgroundColor: i % 3 === 0 ? "#b2c5b2" : i % 3 === 1 ? "#e8c5b8" : "#dfd5c6",
              opacity: 0.45,
              borderRadius: "80% 0 80% 0",
              transform: `rotate(${i * 35}deg)`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              rotate: [i * 35, i * 35 + 45, i * 35],
              opacity: [0.3, 0.65, 0.3],
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Main Floral Card Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full my-auto flex flex-col items-center"
      >
        {/* Top Botanical Wreath Badge */}
        <div className="flex items-center gap-2 mb-3 text-[#5a7263]">
          <span className="text-sm">🌿</span>
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#5a7263]">
            THE WEDDING CELEBRATION
          </span>
          <span className="text-sm">🌿</span>
        </div>

        {/* Central Card with Elegant Double Border */}
        <div className="relative w-full rounded-2xl bg-white/85 backdrop-blur-md p-7 sm:p-9 shadow-[0_15px_40px_rgba(45,74,62,0.08)] border border-[#d8cfc4] text-center">
          {/* Inner Accent Inset Border */}
          <div className="absolute inset-2.5 rounded-xl border border-[#c5a880]/35 pointer-events-none" />

          {/* Couple Nicknames in Elegant Serif */}
          <div className="py-2">
            <h1 className="font-serif-floral text-3xl sm:text-4xl text-[#2d4a3e] tracking-tight font-medium">
              {couple?.groomNickname || couple?.groomName || "Alexander"}
            </h1>
            <div className="flex items-center justify-center gap-3 my-1.5">
              <div className="w-10 h-[1px] bg-[#c5a880]/60" />
              <span className="font-serif-floral text-xl sm:text-2xl text-[#c5a880] italic">&amp;</span>
              <div className="w-10 h-[1px] bg-[#c5a880]/60" />
            </div>
            <h1 className="font-serif-floral text-3xl sm:text-4xl text-[#2d4a3e] tracking-tight font-medium">
              {couple?.brideNickname || couple?.brideName || "Sara"}
            </h1>
          </div>

          {/* Event Date If Available */}
          {firstEvent?.date && (
            <p className="text-xs tracking-[0.2em] font-medium text-[#7a8c7e] uppercase mt-2">
              {new Date(firstEvent.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          {/* Soft Floral Divider */}
          <div className="flex items-center justify-center gap-2 my-5 text-[#c5a880]">
            <span className="w-12 h-[1px] bg-[#c5a880]/40" />
            <span className="text-xs">❀</span>
            <span className="w-12 h-[1px] bg-[#c5a880]/40" />
          </div>

          {/* Honored Guest Envelope Card */}
          <div className="bg-[#fcfaf7] border border-[#e8ded1] rounded-xl p-3.5 my-3 shadow-inner">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#7a8c7e] font-semibold">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </p>
            <p className="font-serif-floral text-xl sm:text-2xl text-[#2d4a3e] font-bold mt-1 tracking-wide">
              {guest?.name || "Tamu Undangan"}
            </p>
            {guest?.category && (
              <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e8eee5] text-[#2d4a3e] border border-[#b2c5b2]/60">
                {guest.category}
              </span>
            )}
          </div>

          {/* Button: Buka Undangan */}
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 bg-[#2d4a3e] hover:bg-[#233a30] text-[#fbf8f3] font-semibold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wider"
          >
            <span>🌿</span>
            <span>BUKA UNDANGAN</span>
            <span>🌿</span>
          </motion.button>

          {/* Button: Tiket E-Pass QR */}
          {guest && onOpenTicket && (
            <motion.button
              type="button"
              onClick={onOpenTicket}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2.5 bg-white/90 hover:bg-white text-[#2d4a3e] border border-[#2d4a3e]/30 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wide"
            >
              <QrCode className="w-4 h-4 text-[#c5a880]" />
              <span>Lihat Tiket E-Pass QR</span>
            </motion.button>
          )}
        </div>

        {/* Footer Subtext */}
        <p className="text-[#63756b] text-xs mt-4 tracking-wide text-center font-medium">
          Mohon maaf apabila ada kesalahan penulisan nama/gelar
        </p>
      </motion.div>
    </div>
  );
}

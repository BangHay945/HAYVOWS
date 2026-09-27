"use client";
import { motion } from "framer-motion";
import { Mail, Calendar, ChevronDown, Heart, QrCode } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";
import { MonogramSeal } from "./MonogramSeal";

export function MonogramCover({
  context,
  onOpen,
  onOpenTicket,
}: TemplateComponentProps & { onOpen: () => void; onOpenTicket?: () => void }) {
  const { wedding, guest } = context;
  const groom = wedding.couple?.groomNickname || wedding.couple?.groomName || "Alex";
  const bride = wedding.couple?.brideNickname || wedding.couple?.brideName || "Sara";

  const groomInitial = (wedding.couple?.groomName || groom).charAt(0).toUpperCase();
  const brideInitial = (wedding.couple?.brideName || bride).charAt(0).toUpperCase();

  const eventYear = wedding.events?.[0]?.date
    ? new Date(wedding.events[0].date).getFullYear()
    : 2026;

  const eventDate = wedding.events?.[0]?.date
    ? new Date(wedding.events[0].date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Sabtu, 24 Oktober 2026";

  const guestName = guest?.name || "Tamu Kehormatan";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6 }}
      className="relative h-[100dvh] max-h-[100dvh] w-full flex flex-col items-center justify-between px-3 sm:px-4 py-3 sm:py-6 bg-[#faf8f5] text-slate-800 text-center overflow-hidden touch-none"
    >
      {/* Subtle Editorial Hairline Border Frame */}
      <div className="absolute inset-2 sm:inset-6 border border-[#c5a880]/30 rounded-2xl sm:rounded-3xl pointer-events-none" />
      <div className="absolute inset-3 sm:inset-7 border border-slate-200/60 rounded-xl sm:rounded-[22px] pointer-events-none" />

      {/* Top Heading */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 pt-1 sm:pt-2"
      >
        <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#8c7e72] uppercase block">
          THE WEDDING CELEBRATION OF
        </span>
      </motion.div>

      {/* Centerpiece: Big Artist Monogram & Couple Names */}
      <div className="relative z-10 my-auto py-1 sm:py-3 flex flex-col items-center max-w-lg mx-auto space-y-2 sm:space-y-4">
        {/* Monogram Seal */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative"
        >
          <MonogramSeal
            groomInitial={groomInitial}
            brideInitial={brideInitial}
            year={eventYear}
            size="md"
            variant="crest"
          />
        </motion.div>

        {/* Names */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-1 sm:space-y-1.5"
        >
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {groom} <span className="font-sans font-light text-[#c5a880]">&amp;</span> {bride}
          </h1>
          <p className="text-[11px] sm:text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5">
            <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#2d4a3e]" />
            <span>{eventDate}</span>
          </p>
        </motion.div>

        {/* Guest Envelope Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-xs sm:max-w-sm rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/90 p-2.5 sm:p-4 shadow-xs text-center space-y-1"
        >
          <p className="text-[9px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <h2 className="text-sm sm:text-lg font-bold text-slate-900 truncate">
            {guestName}
          </h2>
          <p className="text-[9px] sm:text-[11px] text-slate-400 italic">
            Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>
        </motion.div>
      </div>

      {/* Bottom CTA Action Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10 pb-2 sm:pb-3 flex flex-col items-center gap-1.5 sm:gap-2.5 w-full max-w-xs"
      >
        <button
          onClick={onOpen}
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full bg-[#2d4a3e] hover:bg-[#233a30] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>BUKA UNDANGAN</span>
        </button>

        {/* Button: Tiket E-Pass QR */}
        {guest && onOpenTicket && (
          <button
            type="button"
            onClick={onOpenTicket}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-300 text-[11px] sm:text-xs font-semibold tracking-wide shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-[#2d4a3e]" />
            <span>Lihat Tiket E-Pass QR</span>
          </button>
        )}

        {/* Platform Backlink */}
        <p className="text-[9px] sm:text-[10px] text-slate-400 tracking-wider">
          Undangan Digital oleh{" "}
          <a
            href="https://www.hayvows.com"
            target="_blank"
            rel="noopener"
            className="text-[#2d4a3e] font-semibold underline hover:text-slate-900 transition-colors"
          >
            Hayvows
          </a>
        </p>
      </motion.div>
    </motion.section>
  );
}

"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

const EASE = [0.22, 1, 0.36, 1] as const;

function toRoman(num: number): string {
  if (!num || num < 1 || num > 3999) return "";
  const lookup: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let res = "";
  for (const [val, roman] of lookup) {
    while (num >= val) {
      res += roman;
      num -= val;
    }
  }
  return res;
}

function getRomanDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const year = toRoman(d.getFullYear());
  const month = toRoman(d.getMonth() + 1);
  const day = toRoman(d.getDate());
  return `${year} • ${month} • ${day}`;
}

function formatFullDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CornerFiligree({ className = "w-6 h-6 text-[#d5be9b]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M2 34V12C2 6.477 6.477 2 12 2H34"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6 30V14C6 9.582 9.582 6 14 6H30"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="2" cy="34" r="1" fill="currentColor" />
      <circle cx="34" cy="2" r="1" fill="currentColor" />
    </svg>
  );
}

export function VintageRoyalHero({ context }: TemplateComponentProps) {
  const couple = context.wedding?.couple;
  const events = context.wedding?.events;

  const groomName = couple?.groomNickname || couple?.groomName || "Alexander";
  const brideName = couple?.brideNickname || couple?.brideName || "Sara";
  const eventDate = events?.[0]?.date;
  const displayDate = formatFullDate(eventDate);
  const romanDate = getRomanDate(eventDate);
  const venueName = events?.[0]?.venue || "Villa Tenuta di Amore";

  const groomInitial = (couple?.groomNickname || couple?.groomName || "A").charAt(0).toUpperCase();
  const brideInitial = (couple?.brideNickname || couple?.brideName || "S").charAt(0).toUpperCase();

  return (
    <section className="relative w-full min-h-[96dvh] flex flex-col justify-between items-center text-center px-5 sm:px-8 py-12 sm:py-16 select-none overflow-hidden">
      {/* ── ARCHITECTURAL LOGGIA BORDER (Framing the Viewport) ── */}
      <div className="absolute inset-4 sm:inset-6 pointer-events-none rounded-2xl border border-[#d5be9b]/25 z-10">
        {/* Four Vintage Corner Filigrees */}
        <div className="absolute top-1 left-1">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
        <div className="absolute top-1 right-1 -scale-x-100">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
        <div className="absolute bottom-1 left-1 -scale-y-100">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
        <div className="absolute bottom-1 right-1 -scale-x-100 -scale-y-100">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>

        {/* Top Keystone Arch Crest */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#141517] border border-[#d5be9b]/40 rounded-full flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d5be9b]" />
          <span className="text-[9px] font-sans tracking-[0.3em] text-[#d5be9b] uppercase">
            THE WEDDING OF
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d5be9b]" />
        </div>
      </div>

      {/* ── TOP SECTION: Wedding Celebration Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative z-20 flex flex-col items-center gap-2 pt-4 sm:pt-6"
      >
        <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.35em] text-[#d5be9b] uppercase">
          THE WEDDING CELEBRATION OF
        </span>
        <div className="w-12 h-px bg-[#d5be9b]/40" />
      </motion.div>

      {/* ── CENTER SECTION: Royal Wax Seal Crest & Dramatic Editorial Typography ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        className="relative z-20 flex flex-col items-center my-auto py-6 sm:py-8 max-w-sm sm:max-w-md"
      >
        {/* Concentric Double-Ring Royal Wax Medallion */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1c1e22]/90 border border-[#d5be9b]/50 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center justify-center group">
            {/* Dashed outer engraving ring */}
            <div className="absolute inset-1 rounded-full border border-dashed border-[#d5be9b]/35 animate-[spin_60s_linear_infinite]" />
            {/* Inner solid hairline ring */}
            <div className="absolute inset-2.5 rounded-full border border-[#d5be9b]/25" />

            {/* Intertwined Monogram Initials */}
            <div className="relative flex items-center justify-center gap-0.5 select-none text-[#f8f6f0]">
              <span className="text-2xl sm:text-3xl font-serif font-light text-[#f8f6f0]">
                {groomInitial}
              </span>
              <span className="text-xs sm:text-sm font-serif italic text-[#d5be9b] -mt-1">&amp;</span>
              <span className="text-2xl sm:text-3xl font-serif font-light text-[#f8f6f0]">
                {brideInitial}
              </span>
            </div>

            {/* Subtle warm wax aura */}
            <div className="absolute -inset-1.5 rounded-full bg-[#c06c54]/15 blur-sm pointer-events-none" />
          </div>
        </div>

        {/* Archival Latin Subtitle */}
        <p className="text-[11px] sm:text-xs font-serif italic text-[#b8b5ad] tracking-[0.25em] uppercase mb-2">
          Together with their honored families
        </p>

        {/* Grand Headline: Groom & Bride with Illuminated Flouish */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#f8f6f0] tracking-wide leading-tight">
          <span className="block transform hover:scale-[1.02] transition-transform duration-500">
            {groomName}
          </span>
          {/* Centered Ampersand with Filigree Hairline Dividers */}
          <div className="flex items-center justify-center gap-3 my-2 text-[#d5be9b]">
            <div className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#d5be9b]/50" />
            <span className="text-2xl sm:text-3xl font-serif italic text-[#d5be9b] px-1">
              &amp;
            </span>
            <div className="w-10 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#d5be9b]/50" />
          </div>
          <span className="block transform hover:scale-[1.02] transition-transform duration-500">
            {brideName}
          </span>
        </h1>

        {/* Archival Estate Venue & Date Ribbon */}
        <div className="mt-6 flex flex-col items-center gap-2">
          {displayDate && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-[#1c1e22]/75 backdrop-blur-md shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d5be9b]" />
              <span className="text-[11px] font-sans tracking-[0.2em] text-[#d5be9b] uppercase">
                {displayDate}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d5be9b]" />
            </div>
          )}

          <span className="text-[10px] font-serif italic text-[#b8b5ad]/90 tracking-wider">
            📍 {venueName}
          </span>
        </div>
      </motion.div>

      {/* ── BOTTOM SECTION: Antique Pendulum Scroll Cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        className="relative z-20 flex flex-col items-center gap-2 pb-2 text-[#7c7970]"
      >
        <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.3em] uppercase text-[#b8b5ad]/80">
          PERJALANAN CINTA KAMI
        </span>

        {/* Antique Watchmaker Pendulum Drop Indicator */}
        <div className="relative w-4 h-9 flex items-center justify-center">
          {/* Vertical Hairline */}
          <div className="w-px h-full bg-gradient-to-b from-[#d5be9b]/60 via-[#d5be9b]/30 to-transparent" />
          {/* Animated Golden Droplet */}
          <div
            className="absolute top-0 w-1.5 h-1.5 rounded-full bg-[#d5be9b] shadow-[0_0_8px_rgba(213,190,155,0.8)]"
            style={{
              animation: "vr-pendulum 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite",
            }}
          />
        </div>
      </motion.div>

      {/* Pendulum Animation Style */}
      <style>{`
        @keyframes vr-pendulum {
          0% { transform: translateY(0); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translateY(26px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

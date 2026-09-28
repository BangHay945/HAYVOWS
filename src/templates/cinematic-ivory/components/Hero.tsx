"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { Sparkles, MapPin, Calendar, ChevronDown } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CinematicIvoryHero({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const couple = wedding?.couple;
  const events = wedding?.events ?? [];
  const firstEvent = events[0];

  const groomName =
    couple?.groomNickname || couple?.groomName || "Alexander";
  const brideName =
    couple?.brideNickname || couple?.brideName || "Sara";

  // Ambil ambient background foto dari galeri atau couplePhoto
  const galleryPhotos = (wedding?.galleries || []).map((g) => g.imageUrl);
  const heroBgPhoto =
    galleryPhotos[1] ||
    couple?.couplePhoto ||
    galleryPhotos[0] ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

  // Format tanggal & venue
  const eventDate = firstEvent?.date ? new Date(firstEvent.date) : new Date();
  const dayNumber = eventDate.getDate();
  const monthName = eventDate
    .toLocaleDateString("id-ID", { month: "long" })
    .toUpperCase();
  const yearNumber = eventDate.getFullYear();
  const dayName = eventDate
    .toLocaleDateString("id-ID", { weekday: "long" })
    .toUpperCase();
  const venueName = firstEvent?.venue || "The St. Regis Jakarta";

  return (
    <section
      className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden px-6 py-12 sm:py-16 text-[#f5f3ef] bg-transparent"
    >
      {/* ── ATMOSPHERIC GRADIENT WASH OVER STATIONARY SLIDESHOW ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep Atmospheric Film Wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,13,14,0.65) 0%, rgba(12,13,14,0.30) 35%, rgba(12,13,14,0.75) 75%, #0c0d0e 100%)",
          }}
        />
        {/* Subtle Vignette for Depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, transparent 35%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* ── TOP EDITORIAL MASTHEAD & ISSUE INFO ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-4 text-[8px] sm:text-[9px] tracking-[0.35em] uppercase font-ci-sans text-[#8a8b90]"
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-2.5 h-2.5 text-[#d4c4b0]" />
          <span>OFFICIAL INVITATION</span>
        </span>
        <span className="text-[#d4c4b0] font-medium">ISSUE &bull; 2026</span>
        <span className="hidden sm:inline">THE WEDDING JOURNAL</span>
      </motion.div>

      {/* ── CENTER EDITORIAL FEATURE SPREAD ── */}
      <div className="relative z-10 my-auto py-8 sm:py-12 text-center flex flex-col items-center gap-8 max-w-xl mx-auto w-full">
        {/* Header Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-ci-sans text-[8px] sm:text-[9px] tracking-[0.5em] uppercase text-[#d4c4b0]">
            WALIMATUL &bull; URS
          </span>
          <div className="w-10 h-px bg-[#d4c4b0]/40" />
        </motion.div>

        {/* Grand Sculptural Couple Names */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
          className="flex flex-col items-center"
        >
          <h1
            className="font-ci-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#f5f3ef] tracking-[0.04em] leading-[0.95]"
          >
            {groomName}
          </h1>
          <div className="flex items-center gap-4 my-2 sm:my-3 w-40 sm:w-48">
            <div className="flex-1 h-px bg-white/15" />
            <span className="font-ci-serif text-2xl sm:text-3xl italic font-light text-[#d4c4b0] leading-none">
              &amp;
            </span>
            <div className="flex-1 h-px bg-white/15" />
          </div>
          <h1
            className="font-ci-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#f5f3ef] tracking-[0.04em] leading-[0.95]"
          >
            {brideName}
          </h1>
        </motion.div>

        {/* Architectural Date & Location Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] uppercase font-ci-sans tracking-[0.25em] text-[#dcd8cf]"
        >
          <span className="flex items-center gap-1.5 bg-[#16171b]/80 border border-white/10 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <Calendar className="w-3 h-3 text-[#d4c4b0]" />
            <span>{dayName}, {dayNumber} {monthName} {yearNumber}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[#16171b]/80 border border-white/10 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md">
            <MapPin className="w-3 h-3 text-[#d4c4b0]" />
            <span className="truncate max-w-[180px] sm:max-w-none">{venueName}</span>
          </span>
        </motion.div>

        {/* ── THE SACRED OPENING VERSE PLAQUE (QS. Ar-Rum: 21) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.5, ease: EASE }}
          className="w-full relative rounded-2xl p-6 sm:p-8 bg-[#16171b]/85 backdrop-blur-md border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.6)] space-y-4"
        >
          {/* Subtle Top Quotation Mark */}
          <div className="select-none pointer-events-none text-center font-ci-serif text-3xl leading-none text-[#d4c4b0]/50 -mb-2">
            &ldquo;
          </div>

          <blockquote className="font-ci-serif text-sm sm:text-base font-light italic leading-relaxed text-[#f5f3ef] max-w-md mx-auto">
            &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
            pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
            dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
            kasih dan sayang.&rdquo;
          </blockquote>

          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="w-6 h-px bg-[#d4c4b0]/30" />
            <span className="font-ci-sans text-[8.5px] uppercase tracking-[0.35em] text-[#d4c4b0] font-medium">
              QS. AR-RUM : 21
            </span>
            <div className="w-6 h-px bg-[#d4c4b0]/30" />
          </div>
        </motion.div>
      </div>

      {/* ── BOTTOM EDITORIAL ACCENT & SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        className="relative z-10 w-full flex flex-col items-center gap-2 pt-4 border-t border-white/10 text-[#72737a]"
      >
        <span className="font-ci-sans text-[8px] tracking-[0.4em] uppercase text-[#72737a]">
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#d4c4b0]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { RoyalCrown, RoyalDivider, RoyalCorner } from "./Ornaments";

export function RoyalHero({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const couple = wedding.couple;
  const events = wedding.events ?? [];
  const firstEvent = events[0];

  const groomName = couple?.groomNickname || couple?.groomName || "Arthur";
  const brideName = couple?.brideNickname || couple?.brideName || "Guinevere";

  const heroImage =
    couple?.couplePhoto || wedding.galleries?.[0]?.imageUrl || null;

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden bg-[#02241b] text-[#fdfbf7]">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,78,59,0.45)_0%,rgba(2,36,27,0.85)_60%,rgba(2,20,15,1)_100%)] pointer-events-none" />

      {/* Decorative Corner Filigree */}
      <div className="absolute top-6 left-6 pointer-events-none opacity-40">
        <RoyalCorner className="w-14 h-14 text-[#d4af37]" position="top-left" />
      </div>
      <div className="absolute top-6 right-6 pointer-events-none opacity-40">
        <RoyalCorner className="w-14 h-14 text-[#d4af37]" position="top-right" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-auto text-center flex flex-col items-center"
      >
        <RoyalCrown className="w-10 h-10 text-[#ffd700] drop-shadow-[0_0_15px_rgba(212,175,55,0.7)] mb-3" />

        <p className="text-[10px] sm:text-[11px] tracking-[0.45em] uppercase text-[#d4af37] font-semibold mb-3">
          The Wedding Celebration of
        </p>

        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#fdfbf7] leading-tight">
          {groomName} &amp; {brideName}
        </h2>

        <RoyalDivider className="max-w-[240px] my-4" />

        {/* Arch-Framed Couple Photo */}
        {heroImage && (
          <div className="relative my-6 p-2 rounded-t-[140px] rounded-b-2xl border-2 border-[#d4af37]/50 shadow-[0_0_35px_rgba(212,175,55,0.25)] bg-[#063c2f]/40 backdrop-blur-xs max-w-[280px] sm:max-w-[320px] overflow-hidden group">
            <div className="rounded-t-[132px] rounded-b-xl overflow-hidden aspect-[3/4]">
              <img
                src={heroImage}
                alt={`${groomName} & ${brideName}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {/* Subtle inner gold arch glow */}
            <div className="absolute inset-0 rounded-t-[140px] rounded-b-2xl border border-[#ffd700]/30 pointer-events-none" />
          </div>
        )}

        {/* Romantic Palace Quote */}
        <p className="font-serif italic text-sm sm:text-base text-[#f4eedb] max-w-md leading-relaxed mt-2 opacity-90 px-4">
          &ldquo;Dua hati yang dipersatukan dalam keagungan cinta suci, melangkah bersama di bawah restu Ilahi menuju kebahagiaan abadi.&rdquo;
        </p>

        {firstEvent?.date && (
          <div className="mt-6 py-2 px-6 rounded-full border border-[#d4af37]/40 bg-[#063c2f]/50 backdrop-blur-md">
            <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#d4af37] font-medium">
              {new Date(firstEvent.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}

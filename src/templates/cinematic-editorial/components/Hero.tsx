"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { Sparkles, Calendar, Heart } from "lucide-react";

export function EditorialHero({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const couple = wedding.couple;
  const events = wedding.events ?? [];
  const firstEvent = events[0];

  const groomName = couple?.groomNickname || couple?.groomName || "Alexander";
  const brideName = couple?.brideNickname || couple?.brideName || "Sara";

  // Ambil foto latar belakang dari galeri (foto ke-2 jika ada, atau couplePhoto)
  const galleryPhotos = (wedding.galleries || []).map((g) => g.imageUrl);
  const heroBgPhoto =
    galleryPhotos[1] ||
    couple?.couplePhoto ||
    galleryPhotos[0] ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

  const eventDate = firstEvent?.date ? new Date(firstEvent.date) : new Date();
  const dayNumber = eventDate.getDate();
  const monthName = eventDate.toLocaleDateString("id-ID", { month: "long" }).toUpperCase();
  const yearNumber = eventDate.getFullYear();
  const dayName = eventDate.toLocaleDateString("id-ID", { weekday: "long" }).toUpperCase();

  return (
    <section className="relative w-full min-h-[90vh] py-16 px-6 flex flex-col justify-between overflow-hidden bg-[#0a0a0c] text-[#fdfbf7]">
      {/* ── AMBIENT PHOTO BACKGROUND DARI GALERI ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgPhoto}
          alt="Editorial Ambient"
          className="w-full h-full object-cover object-center opacity-35 scale-105"
        />
        {/* Editorial Vignette & Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]" />
      </div>

      {/* ── TOP BADGE & ISSUE INFO ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4 text-[10px] tracking-[0.25em] uppercase font-mono text-neutral-400"
      >
        <span>EDITORIAL JOURNAL</span>
        <span className="flex items-center gap-1.5 text-[#e8d5b5]">
          <Sparkles className="w-3 h-3" />
          <span>LOVE CHRONICLE</span>
        </span>
      </motion.div>

      {/* ── MAIN EDITORIAL DATE & HEADLINE ── */}
      <div className="relative z-10 my-auto py-8 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <span className="text-[11px] font-sans tracking-[0.4em] uppercase text-[#e8d5b5] block">
            {dayName} &bull; THE WEDDING DAY
          </span>

          {/* Large Architectural Number Date */}
          <div className="flex items-baseline justify-center gap-3 my-2">
            <span className="font-serif text-7xl sm:text-8xl font-light text-[#fdfbf7] tracking-tighter leading-none">
              {String(dayNumber).padStart(2, "0")}
            </span>
            <div className="text-left font-mono text-xs sm:text-sm text-neutral-300 leading-tight">
              <span className="block font-bold tracking-widest text-[#e8d5b5]">{monthName}</span>
              <span className="block tracking-wider text-neutral-400">{yearNumber}</span>
            </div>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-normal tracking-wide">
            {groomName} &amp; {brideName}
          </h2>
        </motion.div>

        {/* Editorial Love Quote / Holy Verse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md mx-auto p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm space-y-2"
        >
          <p className="font-serif italic text-sm sm:text-base text-neutral-200 leading-relaxed">
            &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
          </p>
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#e8d5b5] block">
            (QS. Ar-Rum: 21)
          </span>
        </motion.div>
      </div>

      {/* ── BOTTOM SECTION ACCENT ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 flex items-center justify-between text-[10px] tracking-widest uppercase font-mono text-neutral-500 pt-4 border-t border-white/10"
      >
        <span>CHAPTER ONE</span>
        <span className="flex items-center gap-1 text-neutral-400">
          <Heart className="w-3 h-3 text-[#e8d5b5]" />
          <span>ETERNAL BONDS</span>
        </span>
      </motion.div>
    </section>
  );
}

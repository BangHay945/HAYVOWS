"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

const EASE = [0.22, 1, 0.36, 1] as const;

function CornerFiligree({ className = "w-5 h-5 text-[#d5be9b]" }: { className?: string }) {
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

export function VintageRoyalFooter({ context }: TemplateComponentProps) {
  const couple = context.wedding?.couple;
  const galleries = context.wedding?.galleries ?? [];

  const groomName = couple?.groomNickname || couple?.groomName || "Alexander";
  const brideName = couple?.brideNickname || couple?.brideName || "Sara";
  const groomFather = couple?.groomFather;
  const groomMother = couple?.groomMother;
  const brideFather = couple?.brideFather;
  const brideMother = couple?.brideMother;

  const groomInitial = (couple?.groomNickname || couple?.groomName || "A").charAt(0).toUpperCase();
  const brideInitial = (couple?.brideNickname || couple?.brideName || "S").charAt(0).toUpperCase();

  const bgPhoto =
    couple?.couplePhoto ||
    galleries[galleries.length - 1]?.imageUrl ||
    galleries[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

  return (
    <footer className="relative w-full min-h-[100dvh] flex flex-col justify-between items-center text-center px-6 py-12 sm:py-16 select-none overflow-hidden bg-[#141517]">
      {/* ── CINEMATIC BACKGROUND PHOTO WITH DEEP VIGNETTE ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgPhoto}
          alt={`${groomName} & ${brideName}`}
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.08] scale-105"
        />
        {/* Radial & Gradient Wash for Perfect Text Legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(20,21,23,0.65) 0%, rgba(20,21,23,0.88) 70%, rgba(20,21,23,0.98) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141517] via-transparent to-[#141517]/90" />
      </div>

      {/* ── ARCHITECTURAL CORNER FILIGREES FRAME ── */}
      <div className="absolute inset-4 sm:inset-6 pointer-events-none rounded-2xl border border-[#d5be9b]/25 z-10">
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
      </div>

      {/* ── TOP: Gratitude Category Inscription ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative z-20 flex flex-col items-center gap-2 pt-2"
      >
        <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.35em] text-[#d5be9b] uppercase">
          UNGKAPAN TERIMA KASIH
        </span>
        <div className="w-10 h-px bg-[#d5be9b]/40" />
      </motion.div>

      {/* ── CENTER: Grand Closing Signature & Message ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        className="relative z-20 flex flex-col items-center my-auto py-6 max-w-sm sm:max-w-md space-y-5"
      >
        {/* Monogram Seal with Concentric Engraving */}
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#1c1e22]/90 border border-[#d5be9b]/50 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-center relative group mx-auto">
          <div className="absolute inset-1 rounded-full border border-dashed border-[#d5be9b]/35 animate-[spin_60s_linear_infinite]" />
          <span className="text-xl sm:text-2xl font-serif text-[#f8f6f0] tracking-wider select-none">
            {groomInitial}&bull;{brideInitial}
          </span>
          <div className="absolute -inset-1 rounded-full bg-[#c06c54]/15 blur-sm pointer-events-none" />
        </div>

        {/* Mempelai Names in Grand Editorial Serif */}
        <div className="space-y-1">
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#d5be9b] uppercase block">
            KAMI YANG BERBAHAGIA
          </span>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#f8f6f0] tracking-wide leading-tight">
            <span>{groomName}</span>
            <span className="font-serif italic text-2xl sm:text-3xl text-[#d5be9b] mx-2">
              &amp;
            </span>
            <span>{brideName}</span>
          </h3>
        </div>

        {/* Heartfelt Gratitude Text */}
        <p className="text-xs sm:text-sm text-[#b8b5ad] font-serif italic leading-relaxed px-2 pt-1 max-w-xs mx-auto">
          &ldquo;Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu untuk mengiringi awal perjalanan suci kami.&rdquo;
        </p>

        {/* Family Names Sign-off */}
        {(groomFather || brideFather) && (
          <div className="pt-2 text-center border-t border-white/10 w-full max-w-xs mx-auto">
            <span className="text-[9px] font-sans tracking-[0.2em] text-[#d5be9b] uppercase block mb-1">
              Beserta Keluarga Besar:
            </span>
            <p className="text-[11px] text-[#f8f6f0]/90 font-serif leading-snug">
              {groomFather && <span>Keluarga {groomFather}</span>}
              {groomFather && brideFather && <span> &amp; </span>}
              {brideFather && <span>Keluarga {brideFather}</span>}
            </p>
          </div>
        )}
      </motion.div>

      {/* ── BOTTOM: Final Greeting & Official Hayvows Backlink ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="relative z-20 flex flex-col items-center gap-3 pb-2 w-full max-w-xs"
      >
        <div className="flex items-center gap-3 text-[#d5be9b]/50">
          <div className="w-10 h-px bg-current" />
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#d5be9b] uppercase">
            SAMPAI JUMPA
          </span>
          <div className="w-10 h-px bg-current" />
        </div>

        {/* Mandatory Official Hayvows Backlink */}
        <div className="space-y-1">
          <span className="text-[10px] font-sans tracking-[0.2em] text-[#7c7970] block">
            DIGITAL WEDDING INVITATION CREATED WITH
          </span>
          <a
            href="https://www.hayvows.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-serif font-medium text-[#d5be9b] hover:text-[#f8f6f0] transition-colors"
          >
            <span>Hayvows</span>
            <span className="text-[10px] text-[#7c7970] font-sans">&bull; www.hayvows.com</span>
          </a>
        </div>
      </motion.div>
    </footer>
  );
}

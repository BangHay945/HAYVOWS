"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { MailOpen, QrCode, Sparkles } from "lucide-react";

interface CoverProps extends TemplateComponentProps {
  onOpen: () => void;
  onOpenTicket?: () => void;
}

export function EditorialCover({ context, onOpen, onOpenTicket }: CoverProps) {
  const { wedding, guest } = context;
  const couple = wedding.couple;
  const events = wedding.events ?? [];
  const firstEvent = events[0];

  const groomName = couple?.groomNickname || couple?.groomName || "Alexander";
  const brideName = couple?.brideNickname || couple?.brideName || "Sara";

  // Ambil foto-foto dari galeri dan foto berdua untuk background slideshow cover
  const galleryPhotos = (wedding.galleries || []).map((g) => g.imageUrl);
  const allPhotos: string[] = [
    couple?.couplePhoto,
    ...galleryPhotos,
    couple?.groomPhoto,
    couple?.bridePhoto,
  ].filter((p): p is string => Boolean(p && p.trim().length > 0));

  // Fallback jika belum ada foto
  const photos = allPhotos.length > 0 ? allPhotos : [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slideshow setiap 5 detik
  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const formattedDate = firstEvent?.date
    ? new Date(firstEvent.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "The Wedding Day";

  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-between overflow-hidden bg-[#0a0a0c] text-[#fdfbf7] select-none">
      {/* ── BACKGROUND PHOTO SLIDESHOW (KEN BURNS CROSSFADE) ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={photos[currentSlide]}
              alt="Prewedding Backdrop"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Film Grain & Dark Editorial Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/55 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(10,10,12,0.85)_100%)]" />
      </div>

      {/* ── TOP EDITORIAL MASTHEAD ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 pt-7 px-6 text-center space-y-1.5"
      >
        <div className="flex items-center justify-center gap-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#e8d5b5] font-semibold border-b border-white/15 pb-2.5 max-w-sm mx-auto">
          <span>THE WEDDING ISSUE</span>
          <span>&bull;</span>
          <span>VOL. 2026</span>
          <span>&bull;</span>
          <span>SPECIAL EDIT</span>
        </div>
        <p className="text-[9px] tracking-[0.4em] uppercase text-neutral-400 font-sans">
          A Celebration of True Love &amp; Devotion
        </p>
      </motion.header>

      {/* ── CENTER TYPOGRAPHY (EDITORIAL HERO TITLE) ── */}
      <div className="relative z-10 my-auto px-6 text-center max-w-md mx-auto space-y-3 py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-1"
        >
          <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.45em] text-[#e8d5b5]/90 block mb-2 font-medium">
            WE INVITE YOU TO WITNESS
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight text-[#fdfbf7] leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            {groomName}
          </h1>
          <span className="font-serif italic text-3xl sm:text-4xl text-[#e8d5b5] block py-0.5">
            &amp;
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-light tracking-tight text-[#fdfbf7] leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            {brideName}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-2 flex items-center justify-center gap-3 text-xs tracking-widest uppercase text-white/80 font-mono"
        >
          <span className="w-8 h-px bg-white/30" />
          <span>{formattedDate}</span>
          <span className="w-8 h-px bg-white/30" />
        </motion.div>

        {/* Slideshow Indicator Dots */}
        {photos.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-3">
            {photos.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all duration-500 ${
                  currentSlide === idx ? "w-6 bg-[#e8d5b5]" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM CARD: GUEST NAME & OPEN INVITATION BUTTON ── */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 pb-8 px-5 sm:px-6 w-full max-w-md mx-auto space-y-3.5"
      >
        {/* Guest Badge */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shadow-2xl space-y-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-sans font-medium">
            Dear Esteemed Guest:
          </p>
          <h2 className="text-base sm:text-lg font-bold text-[#fdfbf7] truncate tracking-wide">
            {guest?.name || "Tamu Undangan"}
          </h2>
          {guest?.address && (
            <p className="text-[11px] text-[#e8d5b5] truncate font-sans">
              {guest.address}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onOpen}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#e8d5b5] via-[#f5ede0] to-[#d8c3a0] hover:from-[#f3e7cf] hover:to-[#e0cdad] active:scale-[0.98] text-[#111115] font-bold text-xs uppercase tracking-[0.2em] shadow-[0_8px_32px_rgba(232,213,181,0.3)] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <MailOpen className="w-4 h-4 text-[#111115] transition-transform group-hover:scale-110" />
            <span>Buka Undangan</span>
          </button>

          {guest && onOpenTicket && (
            <motion.button
              type="button"
              onClick={onOpenTicket}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.98] text-[#e8d5b5] font-mono text-[11px] uppercase tracking-[0.2em] border border-[#e8d5b5]/40 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <QrCode className="w-4 h-4 text-[#e8d5b5]" />
              <span>Lihat Tiket QR / E-Pass</span>
            </motion.button>
          )}
        </div>
      </motion.footer>
    </div>
  );
}

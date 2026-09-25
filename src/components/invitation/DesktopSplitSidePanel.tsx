"use client";

import { useState, useEffect } from "react";
import type { WeddingContextData } from "@/types/template";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";

interface DesktopSplitSidePanelProps {
  context: WeddingContextData;
  themeSlug: "nature-floral" | "eternal-noir" | "batik-jawa" | "modern-monogram";
}

export function DesktopSplitSidePanel({
  context,
  themeSlug,
}: DesktopSplitSidePanelProps) {
  const { wedding, guest } = context;
  const couple = wedding.couple;
  const groomName = couple?.groomNickname || couple?.groomName || "Pengantin Pria";
  const brideName = couple?.brideNickname || couple?.brideName || "Pengantin Wanita";
  const coupleTitle = `${groomName} & ${brideName}`;
  const firstEvent = wedding.events && wedding.events.length > 0 ? wedding.events[0] : null;

  // Inisial monogram
  const groomInitial = (couple?.groomNickname || couple?.groomName || "A").charAt(0).toUpperCase();
  const brideInitial = (couple?.brideNickname || couple?.brideName || "S").charAt(0).toUpperCase();
  const monogramText = `${groomInitial}&${brideInitial}`;

  // Kumpulkan seluruh foto dari couple dan galeri foto mempelai untuk slideshow dinamis
  const rawImages: (string | null | undefined)[] = [
    couple?.couplePhoto,
    couple?.groomPhoto,
    couple?.bridePhoto,
    ...(wedding.galleries || []).map((g) => g.imageUrl),
  ];

  const slideImages = Array.from(
    new Set(rawImages.filter((img): img is string => Boolean(img && img.trim().length > 0)))
  );

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Otomatis ganti slide foto setiap 6 detik jika terdapat lebih dari 1 foto
  useEffect(() => {
    if (slideImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slideImages.length]);

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!firstEvent?.date) return;
    const target = new Date(`${firstEvent.date}T${firstEvent.startTime || "09:00"}:00`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [firstEvent?.date, firstEvent?.startTime]);

  // Format event date
  const formattedEventDate = firstEvent?.date
    ? new Date(firstEvent.date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Hari Bahagia";

  // Theme-specific styles & color palettes
  const getThemeStyles = () => {
    switch (themeSlug) {
      case "eternal-noir":
        return {
          bgGradient: "from-[#0d0d0d] via-[#141414] to-[#080808]",
          overlayGradient: "from-black/80 via-black/60 to-[#0a0a0a]/95",
          accentGold: "text-[#d4af37]",
          accentGoldBg: "bg-[#d4af37]/15 border-[#d4af37]/40 text-[#f5d77f]",
          cardBg: "bg-black/60 border-white/10 backdrop-blur-md",
          fontTitle: "font-serif text-[#f5e6c8]",
          fontBody: "font-sans text-slate-300",
          particleColor: "bg-[#d4af37]/20",
          ornamentBorder: "border-[#d4af37]/30",
        };
      case "batik-jawa":
        return {
          bgGradient: "from-[#2D1B0E] via-[#3D2B1F] to-[#1A0F08]",
          overlayGradient: "from-[#2D1B0E]/85 via-[#2D1B0E]/70 to-[#1A0F08]/95",
          accentGold: "text-[#D4A853]",
          accentGoldBg: "bg-[#B8860B]/20 border-[#D4A853]/40 text-[#FDF6E3]",
          cardBg: "bg-[#2D1B0E]/70 border-[#D4A853]/30 backdrop-blur-md",
          fontTitle: "font-serif text-[#FDF6E3]",
          fontBody: "font-sans text-[#EDE0C4]",
          particleColor: "bg-[#D4A853]/20",
          ornamentBorder: "border-[#D4A853]/30",
        };
      case "modern-monogram":
        return {
          bgGradient: "from-[#2b241d] via-[#3a3128] to-[#1e1914]",
          overlayGradient: "from-[#2b241d]/85 via-[#2b241d]/65 to-[#1e1914]/95",
          accentGold: "text-[#c5a880]",
          accentGoldBg: "bg-[#c5a880]/20 border-[#c5a880]/50 text-[#ffffff]",
          cardBg: "bg-black/40 border-white/15 backdrop-blur-md text-white",
          fontTitle: "font-serif text-white",
          fontBody: "font-sans text-slate-200",
          particleColor: "bg-white/20",
          ornamentBorder: "border-[#c5a880]/40",
        };
      case "nature-floral":
      default:
        return {
          bgGradient: "from-[#1a2f26] via-[#243f33] to-[#13231c]",
          overlayGradient: "from-[#13231c]/85 via-[#1a2f26]/65 to-[#0e1914]/95",
          accentGold: "text-[#c5a880]",
          accentGoldBg: "bg-[#c5a880]/20 border-[#c5a880]/40 text-[#fef08a]",
          cardBg: "bg-black/40 border-white/15 backdrop-blur-md",
          fontTitle: "font-serif text-[#fdfbf7]",
          fontBody: "font-sans text-emerald-100/90",
          particleColor: "bg-[#c5a880]/20",
          ornamentBorder: "border-[#c5a880]/30",
        };
    }
  };

  const style = getThemeStyles();

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between flex-1 sticky top-0 h-screen overflow-hidden select-none p-8 xl:p-12 relative bg-gradient-to-b ${style.bgGradient}`}
      aria-label="Panel Visual Desktop Undangan"
    >
      {/* BACKGROUND LAYER: SLIDESHOW FOTO GALERI DENGAN CROSS-FADE & KEN BURNS EFFECT */}
      {slideImages.length > 0 ? (
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={slideImages[currentSlideIndex]}
              src={slideImages[currentSlideIndex]}
              alt={coupleTitle}
              className="w-full h-full object-cover object-center absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.13 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{
                opacity: { duration: 1.6, ease: "easeInOut" },
                scale: { duration: 7, ease: "easeOut" },
              }}
            />
          </AnimatePresence>

          {/* Vignette & Gradient Overlay untuk menjaga kontras teks tetap optimal */}
          <div className={`absolute inset-0 bg-gradient-to-t ${style.overlayGradient}`} />
        </div>
      ) : (
        /* FALLBACK KANVAS ARTISTIK KETIKA TANPA FOTO */
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#c5a880]/10 blur-3xl" />

          {/* Motif Grid / Ornaments Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[240px] xl:text-[320px] font-serif font-extrabold tracking-widest text-white/40 select-none">
              {monogramText}
            </span>
          </div>

          {/* Decorative Corner Borders */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-white/20 rounded-tl-2xl" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-white/20 rounded-br-2xl" />
        </div>
      )}

      {/* TOP HEADER: BRAND / MONOGRAM BADGE */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-lg ${style.accentGoldBg}`}>
            <span className="font-serif font-bold text-sm tracking-wider">
              {monogramText}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-white/70 block">
              The Wedding Celebration
            </span>
            <span className="text-xs font-serif font-semibold text-white tracking-wide">
              {formattedEventDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-white/90 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#fef08a]" />
          <span>Undangan Resmi</span>
        </div>
      </header>

      {/* CENTER HERO: NAMA MEMPELAI & QUOTE */}
      <main className="relative z-10 my-auto py-6 max-w-xl space-y-5">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest"
          >
            <Heart className="w-3 h-3 text-[#fef08a] fill-[#fef08a]" />
            <span>Walimatul &bull; Urs</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`text-4xl xl:text-5xl font-bold tracking-tight leading-tight drop-shadow-lg ${style.fontTitle}`}
          >
            {groomName}
            <span className={`block text-2xl xl:text-3xl font-light italic my-1 ${style.accentGold}`}>
              &amp;
            </span>
            {brideName}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-xs xl:text-sm leading-relaxed italic line-clamp-3 text-white/80 ${style.fontBody}`}
        >
          &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.&rdquo;
        </motion.p>

        {/* COUNTDOWN TIMER BOX */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`p-4 rounded-2xl border shadow-xl ${style.cardBg}`}
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 block mb-2.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#fef08a]" />
            <span>Hitung Mundur Hari Bahagia</span>
          </span>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xl xl:text-2xl font-bold font-mono text-white block">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/70">Hari</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xl xl:text-2xl font-bold font-mono text-white block">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/70">Jam</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xl xl:text-2xl font-bold font-mono text-white block">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/70">Menit</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xl xl:text-2xl font-bold font-mono text-[#fef08a] block">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#fef08a]">Detik</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* BOTTOM FOOTER: SAPAAN TAMU & SCROLL HINT */}
      <footer className="relative z-10 space-y-3 pt-4 border-t border-white/15">
        {guest && (
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${style.cardBg}`}>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider block">
                Kepada Yth. Tamu Undangan:
              </span>
              <h4 className="text-sm font-bold text-white truncate mt-0.5">
                {guest.name}
              </h4>
              {guest.address && (
                <p className="text-[11px] text-white/70 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-[#fef08a] shrink-0" />
                  <span>{guest.address}</span>
                </p>
              )}
            </div>

            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white/15 border border-white/20 text-white shrink-0">
              {guest.category || "Reguler"}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-white/60 pt-1">
          <span>&copy; {wedding.slug}. All rights reserved.</span>
          <span className="hidden xl:inline italic text-white/50">
            Gulir panel kanan untuk membuka isi undangan &darr;
          </span>
        </div>
      </footer>
    </aside>
  );
}

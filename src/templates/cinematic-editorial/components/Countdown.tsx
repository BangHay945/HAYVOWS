"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { Calendar, Clock, Bell } from "lucide-react";

export function EditorialCountdown({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const events = wedding.events ?? [];
  const firstEvent = events[0];

  const targetDateStr = firstEvent?.date
    ? `${firstEvent.date}T${firstEvent.startTime || "08:00"}:00`
    : "2026-10-18T08:00:00";

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDateStr).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  // Foto background dinamis dari galeri
  const galleryPhotos = (wedding.galleries || []).map((g) => g.imageUrl);
  const countdownBg =
    galleryPhotos[3] ||
    wedding.couple?.couplePhoto ||
    galleryPhotos[0] ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = () => {
    if (!firstEvent) return "#";
    const startDate = new Date(targetDateStr);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 jam kemudian

    const formatGCal = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const title = encodeURIComponent(
      `Pernikahan ${wedding.couple?.groomNickname || "Alexander"} & ${wedding.couple?.brideNickname || "Sara"}`
    );
    const details = encodeURIComponent(
      `Menghadiri acara pernikahan ${wedding.couple?.groomName} & ${wedding.couple?.brideName}.\nDetail undangan: https://hayvows.com/invitation/${wedding.slug}`
    );
    const location = encodeURIComponent(
      `${firstEvent.venue || "Lokasi Acara"}, ${firstEvent.address || ""}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCal(
      startDate
    )}/${formatGCal(endDate)}&details=${details}&location=${location}`;
  };

  return (
    <section className="relative w-full py-16 px-5 sm:px-6 overflow-hidden bg-[#0a0a0c] text-[#fdfbf7]">
      {/* ── AMBIENT PHOTO BACKGROUND DARI GALERI ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={countdownBg}
          alt="Ambient Countdown"
          className="w-full h-full object-cover object-center opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-black/85 to-[#0a0a0c]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-1.5"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[#e8d5b5] block">
            COUNTDOWN TO FOREVER
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-light tracking-wide">
            Menuju Hari Bahagia
          </h2>
        </motion.div>

        {/* Architectural Countdown Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-4 gap-2 sm:gap-3 p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md shadow-2xl"
        >
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#fdfbf7] block leading-none">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#e8d5b5]">
              Hari
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#fdfbf7] block leading-none">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#e8d5b5]">
              Jam
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#fdfbf7] block leading-none">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#e8d5b5]">
              Menit
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
            <span className="font-serif text-3xl sm:text-4xl font-light text-[#e8d5b5] block leading-none">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400">
              Detik
            </span>
          </div>
        </motion.div>

        {/* Add to Calendar Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <a
            href={generateGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs text-[#fdfbf7] font-mono tracking-wider transition-all hover:scale-105"
          >
            <Calendar className="w-3.5 h-3.5 text-[#e8d5b5]" />
            <span>Simpan ke Google Calendar</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

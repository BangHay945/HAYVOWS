"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

const EASE = [0.22, 1, 0.36, 1] as const;

export function VintageRoyalCountdown({ context }: TemplateComponentProps) {
  const events = context.wedding?.events ?? [];
  const firstEvent = events[0];
  const targetDateStr = firstEvent?.date;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    if (!targetDateStr) return;
    const target = new Date(targetDateStr).getTime();
    if (isNaN(target)) return;

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: isNaN(d) ? 0 : d,
        hours: isNaN(h) ? 0 : h,
        minutes: isNaN(m) ? 0 : m,
        seconds: isNaN(s) ? 0 : s,
        isPast: false,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const couple = context.wedding?.couple;
  const groomName = couple?.groomNickname || couple?.groomName || "Pengantin";
  const brideName = couple?.brideNickname || couple?.brideName || "Mempelai";

  // Google Calendar Link generator
  const createGoogleCalendarUrl = () => {
    if (!targetDateStr) return "#";
    const d = new Date(targetDateStr);
    const startIso = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endIso = new Date(d.getTime() + 4 * 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const title = encodeURIComponent(`The Wedding of ${groomName} & ${brideName}`);
    const location = encodeURIComponent(firstEvent?.venue || "Tuscan Estate");
    const details = encodeURIComponent("Undangan Pernikahan Resmi Hayvows");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  return (
    <section className="relative w-full px-5 sm:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
      {/* Translucent Backdrop Veil */}
      <div className="absolute inset-0 bg-[#141517]/75 backdrop-blur-xs pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="space-y-3"
        >
          <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] text-[#d5be9b] uppercase">
            Waktu Menuju Hari Bahagia
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#f8f6f0] tracking-wide">
            Counting Down The Days
          </h2>
          <div className="w-10 h-px bg-[#d5be9b]/40 mx-auto mt-2" />
        </motion.div>

        {/* 4 Counter Boxes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="grid grid-cols-4 gap-2.5 sm:gap-4"
        >
          {[
            { label: "Hari", value: timeLeft.days },
            { label: "Jam", value: timeLeft.hours },
            { label: "Menit", value: timeLeft.minutes },
            { label: "Detik", value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1c1e22]/90 backdrop-blur-md border border-white/10 rounded-2xl py-4 sm:py-5 px-1 flex flex-col items-center justify-center shadow-lg transition-transform hover:-translate-y-1 duration-300"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-[#f8f6f0] tracking-tight">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] text-[#d5be9b] uppercase mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Save The Date Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        >
          <a
            href={createGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#1c1e22] hover:bg-[#d5be9b] border border-[#d5be9b]/40 hover:border-[#d5be9b] text-[#f8f6f0] hover:text-[#141517] text-xs font-sans font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer shadow-md group"
          >
            <CalendarIcon className="w-4 h-4 text-[#d5be9b] group-hover:text-[#141517] transition-colors" />
            <span className="group-hover:text-[#141517] transition-colors">Simpan Di Kalender</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

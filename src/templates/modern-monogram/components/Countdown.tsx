"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Plus } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export function MonogramCountdown({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const event = wedding.events?.[0];

  const targetDateStr = event?.date || "2026-10-24T09:00:00Z";
  const targetDate = new Date(targetDateStr).getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const groom = wedding.couple?.groomNickname || wedding.couple?.groomName || "Alex";
  const bride = wedding.couple?.brideNickname || wedding.couple?.brideName || "Sara";

  // Google Calendar URL generator
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Pernikahan ${groom} & ${bride}`);
    const details = encodeURIComponent(
      `Menghadiri acara pernikahan ${groom} & ${bride}. Lokasi: ${event?.venue || "Grand Ballroom"}`
    );
    const location = encodeURIComponent(event?.address || event?.venue || "Indonesia");
    
    // Formatting YYYYMMDDTHHmmssZ
    const d = new Date(targetDateStr);
    const startStr = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endStr = new Date(d.getTime() + 4 * 3600 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
  };

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6"
      >
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8c7e72] uppercase block">
            MENGHITUNG HARI
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Menuju Hari Bahagia
          </h2>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto pt-2">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#faf8f5] border border-slate-200/80">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2d4a3e] block">
              {timeLeft.days}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider block mt-0.5">
              Hari
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#faf8f5] border border-slate-200/80">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2d4a3e] block">
              {timeLeft.hours}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider block mt-0.5">
              Jam
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#faf8f5] border border-slate-200/80">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2d4a3e] block">
              {timeLeft.minutes}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider block mt-0.5">
              Menit
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#faf8f5] border border-slate-200/80">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2d4a3e] block">
              {timeLeft.seconds}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider block mt-0.5">
              Detik
            </span>
          </div>
        </div>

        {/* Calendar Add Button */}
        <div className="pt-2">
          <a
            href={createGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold shadow-2xs hover:border-slate-300 transition-all hover:scale-102"
          >
            <Calendar className="w-3.5 h-3.5 text-[#2d4a3e]" />
            <span>Simpan ke Google Calendar</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

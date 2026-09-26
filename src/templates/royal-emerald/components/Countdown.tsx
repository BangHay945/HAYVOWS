"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { CalendarPlus } from "lucide-react";
import { RoyalDivider } from "./Ornaments";

function useCountdown(targetDate: string) {
  const [diff, setDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    passed: false,
  });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = Date.now();
      const delta = target - now;
      if (delta <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: true });
        return;
      }
      setDiff({
        days: Math.floor(delta / 86400000),
        hours: Math.floor((delta % 86400000) / 3600000),
        minutes: Math.floor((delta % 3600000) / 60000),
        seconds: Math.floor((delta % 60000) / 1000),
        passed: false,
      });
    };

    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return diff;
}

export function RoyalCountdown({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  const mainEvent = events[0];
  const { days, hours, minutes, seconds, passed } = useCountdown(mainEvent?.date || "");

  if (!mainEvent?.date) return null;

  const timeBlocks = [
    { label: "Hari", value: days },
    { label: "Jam", value: hours },
    { label: "Menit", value: minutes },
    { label: "Detik", value: seconds },
  ];

  const groom = context.wedding.couple?.groomNickname || context.wedding.couple?.groomName || "Mempelai Pria";
  const bride = context.wedding.couple?.brideNickname || context.wedding.couple?.brideName || "Mempelai Wanita";
  const mainTitleEncoded = encodeURIComponent(`The Wedding of ${groom} & ${bride}`);
  const mainLocationEncoded = encodeURIComponent(
    `${mainEvent?.venue || ""} ${mainEvent?.address || ""}`.trim()
  );
  const mainDateClean = mainEvent?.date ? mainEvent.date.replace(/-/g, "") : "";
  const mainCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${mainTitleEncoded}&dates=${mainDateClean}T010000Z/${mainDateClean}T140000Z&location=${mainLocationEncoded}`;

  return (
    <section className="relative w-full py-16 px-6 bg-[#02241b] text-[#fdfbf7] overflow-hidden">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center relative z-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold mb-2">
          {passed ? "Hari Bahagia Telah Tiba" : "Menghitung Hari Bahagia"}
        </p>
        <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#fdfbf7] tracking-wide">
          {passed ? "Momen Sakral Dimulai" : "Menuju Momen Sakral"}
        </h3>
        <RoyalDivider className="max-w-[180px] mx-auto my-4" />

        {/* 4 Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-4 gap-3 sm:gap-6 mt-4 w-full"
        >
          {timeBlocks.map((block) => (
            <div
              key={block.label}
              className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-[#063c2f]/50 backdrop-blur-md border border-[#d4af37]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative group hover:border-[#d4af37]/60 transition-colors"
            >
              <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-[#ffd700] tracking-wider leading-none tabular-nums">
                {String(block.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium mt-2">
                {block.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Simpan ke Kalender Button */}
        <div className="mt-8">
          <a
            href={mainCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-full border border-[#d4af37]/60 bg-[#02241b]/90 hover:bg-[#d4af37] hover:text-[#02241b] text-xs font-serif tracking-wider uppercase font-semibold text-[#d4af37] transition-all duration-300 shadow-[0_2px_12px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.45)] cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-[#ffd700] shrink-0" />
            <span>Simpan ke Kalender</span>
          </a>
        </div>
      </div>
    </section>
  );
}

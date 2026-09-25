"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useCountdown(targetDate: string) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: false });

  useEffect(() => {
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

export function NoirCountdown({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  const mainEvent = events[0];
  if (!mainEvent) return null;

  const { days, hours, minutes, seconds, passed } = useCountdown(mainEvent.date);

  const units = [
    { label: "Hari", value: days },
    { label: "Jam", value: hours },
    { label: "Menit", value: minutes },
    { label: "Detik", value: seconds },
  ];

  return (
    <section className="relative w-full min-h-[100dvh] bg-[#fafafa] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Top decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

      <div className="text-center max-w-xl mx-auto space-y-12">
        {/* Eyebrow */}
        <div>
          <p className="font-noir-sans text-[9px] tracking-[0.45em] uppercase text-[#888888] mb-3">
            Menghitung Hari
          </p>
          <h2 className="font-noir-serif text-3xl sm:text-4xl font-light text-[#0a0a0a] tracking-wide">
            {passed ? "Hari Bahagia Telah Tiba" : "Menuju Hari Istimewa"}
          </h2>
          <div className="w-8 h-px bg-[#c9a84c] mx-auto mt-5" />
        </div>

        {/* Countdown Numbers */}
        {!passed && (
          <div className="flex items-end justify-center gap-3 sm:gap-6">
            {units.map(({ label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <span className="font-noir-serif text-5xl sm:text-7xl font-light text-[#0a0a0a] leading-none tabular-nums">
                  {pad(value)}
                </span>
                <span className="font-noir-sans text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-[#888888] mt-2">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Event date info */}
        <div className="space-y-1">
          <p className="font-noir-serif text-lg sm:text-xl italic text-[#0a0a0a] font-light">
            {new Date(mainEvent.date).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="font-noir-sans text-[10px] tracking-[0.25em] uppercase text-[#888888]">
            {mainEvent.venue}
          </p>
        </div>

        {/* Save to calendar */}
        <a
          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            `Pernikahan ${context.wedding.couple?.groomNickname || ""} & ${context.wedding.couple?.brideNickname || ""}`
          )}&dates=${mainEvent.date.replace(/-/g, "")}T080000Z/${mainEvent.date.replace(/-/g, "")}T150000Z&details=${encodeURIComponent(mainEvent.venue)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-[#0a0a0a] hover:border-[#c9a84c] hover:text-[#c9a84c] text-[#0a0a0a] font-noir-sans text-[9px] tracking-[0.3em] uppercase px-8 py-3.5 transition-all duration-300"
        >
          Simpan ke Kalender
        </a>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
    </section>
  );
}

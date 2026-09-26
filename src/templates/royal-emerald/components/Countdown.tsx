"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
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
      </div>
    </section>
  );
}

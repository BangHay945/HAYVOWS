"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { RoyalDivider } from "./Ornaments";

export function RoyalCountdown({ context }: TemplateComponentProps) {
  const events = context.wedding.events ?? [];
  const targetDateStr = events[0]?.date;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDateStr) return;
    const target = new Date(targetDateStr).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!targetDateStr) return null;

  const timeBlocks = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <section className="relative w-full py-16 px-6 bg-[#02241b] text-[#fdfbf7] overflow-hidden">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center relative z-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold mb-2">
          Menghitung Hari Bahagia
        </p>
        <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#fdfbf7] tracking-wide">
          Menuju Momen Sakral
        </h3>
        <RoyalDivider className="max-w-[180px] mx-auto my-4" />

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-4 w-full">
          {timeBlocks.map((block, idx) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-[#063c2f]/50 backdrop-blur-md border border-[#d4af37]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative group hover:border-[#d4af37]/60 transition-colors"
            >
              <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-[#fdfbf7] tracking-wider leading-none">
                {String(block.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium mt-2">
                {block.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

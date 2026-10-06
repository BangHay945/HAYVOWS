"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

const EASE = [0.22, 1, 0.36, 1] as const;

export function VintageRoyalStory({ context }: TemplateComponentProps) {
  const stories = context.wedding?.stories ?? [];

  if (stories.length === 0) return null;

  return (
    <section className="relative w-full px-5 sm:px-8 py-16 sm:py-24 bg-[#141517]/95 border-b border-white/5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center mb-14 space-y-3"
      >
        <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] text-[#d5be9b] uppercase">
          Kisah &bull; Perjalanan Kami
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#f8f6f0] tracking-wide">
          Chapters of Love
        </h2>
        <div className="w-10 h-px bg-[#d5be9b]/40 mx-auto mt-2" />
        <p className="max-w-md mx-auto text-xs sm:text-sm text-[#b8b5ad] font-serif italic pt-1">
          Setiap babak tertulis indah dalam takdir yang mempertemukan dua hati.
        </p>
      </motion.div>

      {/* Timeline Stories */}
      <div className="relative max-w-lg mx-auto pl-6 sm:pl-8 border-l border-[#d5be9b]/25 space-y-12">
        {stories.map((item, index) => {
          const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
          const chapterNum = romanNumerals[index] || String(index + 1);

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
              className="relative group"
            >
              {/* Timeline Wax Stamp Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-[#1c1e22] border border-[#d5be9b] flex items-center justify-center text-[10px] font-serif text-[#d5be9b] shadow-md">
                {chapterNum}
              </div>

              {/* Story Card */}
              <div className="bg-[#1c1e22]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 transition-all duration-300 group-hover:border-[#d5be9b]/40">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-[10px] font-sans tracking-[0.25em] text-[#d5be9b] uppercase">
                    Chapter {chapterNum}
                  </span>
                  {item.date && (
                    <span className="text-[11px] font-mono text-[#b8b5ad] bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                      {item.date}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-serif text-[#f8f6f0] tracking-wide mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#b8b5ad] leading-relaxed whitespace-pre-line font-sans">
                  {item.description}
                </p>

                {item.image && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-[#141517]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full max-h-56 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

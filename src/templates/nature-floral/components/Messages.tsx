"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { playFloralSound } from "../sound";

export function FloralMessages({ context }: TemplateComponentProps) {
  const { messages } = context;
  const [index, setIndex] = useState(0);

  if (!messages || messages.length === 0) return null;
  const current = messages[index];

  const handlePrev = () => {
    playFloralSound("click");
    setIndex(Math.max(0, index - 1));
  };

  const handleNext = () => {
    playFloralSound("click");
    setIndex(Math.min(messages.length - 1, index + 1));
  };

  return (
    <section id="section-messages" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f7f4ee]">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-[#5a7263] mb-2">
            <span className="text-sm">💬</span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
              WISHES &amp; PRAYERS
            </span>
            <span className="text-sm">💬</span>
          </div>
          <h2 className="font-serif-floral text-2xl sm:text-3xl font-semibold text-[#2d4a3e]">
            Untaian Doa &amp; Ucapan
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-3" />
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#d8cfc4] shadow-xs text-center min-h-[160px] flex flex-col justify-between"
            >
              <div>
                <p className="font-serif-floral text-lg font-bold text-[#2d4a3e]">
                  {current.guest?.name ?? "Tamu Terhormat"}
                </p>
                <div className="w-10 h-[1px] bg-[#c5a880]/50 mx-auto my-2" />
                <p className="text-xs sm:text-sm text-[#4a5e52] italic leading-relaxed pt-1">
                  &ldquo;{current.message}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-[#c5a880] pt-4">
                <span>❀</span>
                <span>❀</span>
                <span>❀</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-4 text-xs font-semibold text-[#2d4a3e]">
            <button
              onClick={handlePrev}
              disabled={index === 0}
              className="px-4 py-2 rounded-xl bg-white border border-[#d8cfc4] hover:bg-[#e8eee5] disabled:opacity-30 transition-all cursor-pointer shadow-2xs"
            >
              ← Sebelumnya
            </button>
            <span className="text-[#7a8c7e] text-xs">
              {index + 1} dari {messages.length}
            </span>
            <button
              onClick={handleNext}
              disabled={index === messages.length - 1}
              className="px-4 py-2 rounded-xl bg-white border border-[#d8cfc4] hover:bg-[#e8eee5] disabled:opacity-30 transition-all cursor-pointer shadow-2xs"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { RoyalDivider, DiamondGem } from "./Ornaments";

export function RoyalStory({ context }: TemplateComponentProps) {
  const stories = context.wedding.stories ?? [];
  if (stories.length === 0) return null;

  return (
    <section className="relative w-full py-24 px-6 overflow-hidden bg-[#02241b] text-[#fdfbf7]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold">
            Kisah Cinta
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-normal tracking-wide mt-1">
            Untaian Cerita
          </h2>
          <RoyalDivider className="max-w-[180px] mx-auto my-3" />
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative w-full pl-6 sm:pl-8 border-l border-[#d4af37]/35 space-y-12">
          {stories.map((story, idx) => (
            <motion.div
              key={story.id || idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative group"
            >
              {/* Gem Marker on Timeline */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-[#02241b] border border-[#d4af37] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.6)]">
                <span className="w-2 h-2 rotate-45 bg-[#ffd700]" />
              </div>

              {/* Story Card */}
              <div className="p-6 rounded-2xl bg-[#063c2f]/40 backdrop-blur-md border border-[#d4af37]/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#d4af37]/60 transition-colors">
                {story.date && (
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-medium block mb-1">
                    {story.date}
                  </span>
                )}
                <h3 className="font-serif text-xl sm:text-2xl text-[#fdfbf7] font-semibold tracking-wide">
                  {story.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#b8c9c1] mt-2.5 leading-relaxed font-light">
                  {story.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { BookOpen, Sparkles, Heart } from "lucide-react";

export function EditorialStory({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const stories = wedding.stories ?? [];

  if (stories.length === 0) return null;

  // Foto galeri untuk selingan visual di cerita
  const galleryPhotos = (wedding.galleries || []).map((g) => g.imageUrl);

  return (
    <section className="relative w-full py-20 px-5 sm:px-6 overflow-hidden bg-[#0a0a0c] text-[#fdfbf7]">
      <div className="relative z-10 max-w-md mx-auto space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] tracking-[0.3em] uppercase font-mono text-[#e8d5b5]">
            <BookOpen className="w-3 h-3" />
            <span>THE MEMOIR</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-light tracking-wide">
            Kisah Cinta Kami
          </h2>
          <p className="text-xs text-neutral-400 font-sans max-w-xs mx-auto">
            Untaian babak perjalanan cinta yang mempertemukan dan menyatukan kami berdua.
          </p>
        </motion.div>

        {/* Timeline Stories / Chapters */}
        <div className="relative border-l border-white/15 pl-6 ml-3 sm:ml-4 space-y-8">
          {stories.map((item, idx) => {
            const photoAccent = galleryPhotos[idx % galleryPhotos.length];

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="relative space-y-3"
              >
                {/* Timeline Dot Marker */}
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#0a0a0c] border-2 border-[#e8d5b5] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#e8d5b5]" />
                </div>

                {/* Chapter Tag & Date */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-[#e8d5b5] font-semibold tracking-wider">
                    CHAPTER {idx + 1}
                  </span>
                  <span className="text-neutral-400 tracking-wider">
                    {item.date}
                  </span>
                </div>

                {/* Story Card */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-5 space-y-3 shadow-xl">
                  {photoAccent && (
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
                      <img
                        src={photoAccent}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="font-serif text-xl font-normal text-[#fdfbf7] tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

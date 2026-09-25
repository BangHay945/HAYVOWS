"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function NoirStory({ context }: TemplateComponentProps) {
  const stories = context.wedding.stories ?? [];
  if (stories.length === 0) return null;

  return (
    <section className="relative w-full bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-20 sm:py-28 overflow-hidden">
      {/* Eyebrow */}
      <div className="text-center mb-14">
        <p className="font-noir-sans text-[9px] tracking-[0.45em] uppercase text-[#555555] mb-3">
          Perjalanan Cinta
        </p>
        <h2 className="font-noir-serif text-3xl sm:text-4xl font-light text-[#fafafa] tracking-wide">
          Kisah Kita
        </h2>
        <div className="w-8 h-px bg-[#c9a84c] mx-auto mt-4" />
      </div>

      {/* Timeline */}
      <div className="relative w-full max-w-lg mx-auto">
        {/* Vertical gold line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9a84c]/50 to-transparent" />

        <div className="space-y-8 sm:space-y-10">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="relative pl-10 sm:pl-12"
            >
              {/* Node on timeline */}
              <div className="absolute left-4 top-5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#c9a84c] border-2 border-[#0a0a0a] z-10 shadow-[0_0_8px_rgba(201,168,76,0.5)]" />

              {/* Story card */}
              <div className="bg-[#111111] border border-[#222222] p-5 sm:p-6 w-full hover:border-[#c9a84c]/30 transition-colors duration-300">
                <span className="font-noir-sans text-[9px] tracking-[0.3em] uppercase text-[#c9a84c] block mb-1.5">
                  {story.date}
                </span>
                <h3 className="font-noir-serif text-lg sm:text-xl font-light text-[#fafafa] mb-2 tracking-wide">
                  {story.title}
                </h3>
                <p className="font-noir-sans text-xs sm:text-sm text-[#777777] leading-relaxed">
                  {story.description}
                </p>
                {story.image && (
                  <div className="mt-4 border border-[#222222] overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-auto object-cover max-h-56 filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

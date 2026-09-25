"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function FloralStory({ context }: TemplateComponentProps) {
  const stories = context.wedding.stories ?? [];
  if (stories.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f7f4ee]">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[#5a7263] mb-2">
            <span className="text-sm">🌸</span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
              LOVE JOURNEY
            </span>
            <span className="text-sm">🌸</span>
          </div>
          <h2 className="font-serif-floral text-2xl sm:text-3xl font-semibold text-[#2d4a3e]">
            Kisah Cinta Kami
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-3" />
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#c5a880]/50 space-y-10 sm:space-y-12">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative"
            >
              {/* Botanical Node Circle */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-[#fbf8f3] border-2 border-[#c5a880] flex items-center justify-center text-[10px] text-[#2d4a3e] shadow-2xs">
                ❀
              </div>

              {/* Story Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#d8cfc4] shadow-xs">
                <span className="inline-block text-[11px] font-semibold text-[#7a8c7e] tracking-wider uppercase mb-1">
                  {story.date}
                </span>
                <h3 className="font-serif-floral text-lg sm:text-xl font-bold text-[#2d4a3e]">
                  {story.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#63756b] mt-2 leading-relaxed">
                  {story.description}
                </p>
                {story.image && (
                  <div className="mt-3 rounded-xl overflow-hidden max-h-48 border border-[#e8ded1]">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
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

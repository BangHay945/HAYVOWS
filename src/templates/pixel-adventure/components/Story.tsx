"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function PixelStory({ context }: TemplateComponentProps) {
  const stories = context.wedding.stories ?? [];
  if (stories.length === 0) return null;

  return (
    <section className="bg-[#F2F2F2] py-16 px-6">
      <div className="max-w-md mx-auto">
        <h2 className="font-mono text-2xl font-bold text-center mb-8 border-b-4 border-[#FFD700] pb-4">
          ► OUR QUEST ◄
        </h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-[#111111]" />
          <div className="space-y-6">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 border-4 border-[#111111] bg-[#FFD700] flex items-center justify-center shrink-0 z-10 font-mono text-xs font-bold">
                  {story.date.slice(0, 4)}
                </div>
                <div className="border-4 border-[#111111] bg-white p-4 flex-1 shadow-[4px_4px_0px_#111111]">
                  <h3 className="font-mono font-bold text-sm">{story.title}</h3>
                  <p className="font-mono text-xs text-[#555] mt-1">{story.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

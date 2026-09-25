"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function PixelGallery({ context, onTrack }: TemplateComponentProps) {
  const galleries = context.wedding.galleries ?? [];
  const [selected, setSelected] = useState<string | null>(null);
  if (galleries.length === 0) return null;

  return (
    <section className="bg-[#F2F2F2] py-16 px-6">
      <div className="max-w-md mx-auto">
        <h2 className="font-mono text-2xl font-bold text-center mb-8 border-b-4 border-[#FFD700] pb-4">
          ► MEMORIES ◄
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {galleries.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                setSelected(item.imageUrl);
                onTrack?.("gallery_view");
              }}
              whileHover={{ scale: 1.05 }}
              className="aspect-square border-4 border-[#111111] overflow-hidden bg-[#ddd] cursor-pointer"
            >
              <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <img src={selected} alt="" className="max-w-full max-h-full border-4 border-[#FFD700]" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

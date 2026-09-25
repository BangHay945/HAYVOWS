"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function FloralGallery({ context, onTrack }: TemplateComponentProps) {
  const galleries = context.wedding.galleries ?? [];
  const [selected, setSelected] = useState<string | null>(null);
  if (galleries.length === 0) return null;

  return (
    <section id="section-gallery" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f7f4ee]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[#5a7263] mb-2">
            <span className="text-sm">📸</span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
              GALLERY
            </span>
            <span className="text-sm">📸</span>
          </div>
          <h2 className="font-serif-floral text-2xl sm:text-3xl font-semibold text-[#2d4a3e]">
            Galeri Momen Indah
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {galleries.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelected(item.imageUrl);
                onTrack?.("gallery_view");
              }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-[#e8ded1] border border-[#d8cfc4] shadow-xs cursor-pointer group"
            >
              <img
                src={item.imageUrl}
                alt={item.caption || "Momen Indah"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2.5 text-center">
                  <p className="text-[11px] text-white font-medium truncate">
                    {item.caption}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden border-2 border-[#c5a880] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected}
                alt=""
                className="w-full h-full max-h-[85vh] object-contain bg-black"
              />
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/90 cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

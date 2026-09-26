"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { X, ZoomIn } from "lucide-react";
import { RoyalDivider, RoyalCrown } from "./Ornaments";

export function RoyalGallery({ context }: TemplateComponentProps) {
  const galleries = context.wedding.galleries ?? [];
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (galleries.length === 0) return null;

  return (
    <section className="relative w-full py-24 px-6 overflow-hidden bg-[#022c22] text-[#fdfbf7]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <RoyalCrown className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold">
            Galeri Kenangan
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-normal tracking-wide mt-1">
            Momen Berharga
          </h2>
          <RoyalDivider className="max-w-[180px] mx-auto my-3" />
        </motion.div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full">
          {galleries.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (idx % 6) * 0.1 }}
              onClick={() => setSelectedPhoto(item.imageUrl)}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-[#d4af37]/40 shadow-lg cursor-pointer group bg-[#02241b]"
            >
              <img
                src={item.imageUrl}
                alt={item.caption || `Galeri ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay with zoom icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#02241b]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs text-[#fdfbf7] font-serif truncate">
                    {item.caption || "Lihat Foto"}
                  </p>
                  <ZoomIn className="w-4 h-4 text-[#ffd700] shrink-0 ml-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-[#fdfbf7] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border-2 border-[#d4af37]/60 shadow-[0_0_40px_rgba(212,175,55,0.4)]"
            >
              <img
                src={selectedPhoto}
                alt="Enlarged view"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

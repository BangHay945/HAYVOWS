"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Film } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";
import { isYouTubeUrl, extractYouTubeId } from "@/lib/utils/youtube";

const EASE = [0.22, 1, 0.36, 1] as const;

export function VintageRoyalGallery({ context }: TemplateComponentProps) {
  const galleries = context.wedding?.galleries ?? [];
  const videoUrl = (context.wedding as any)?.videoUrl as string | undefined;

  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  if (galleries.length === 0 && !videoUrl) return null;

  const ytId = videoUrl ? extractYouTubeId(videoUrl) : null;
  const isYT = videoUrl ? isYouTubeUrl(videoUrl) : false;

  return (
    <section className="relative w-full px-5 sm:px-8 py-16 sm:py-24 bg-[#141517]/95 border-b border-white/5">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-center mb-12 sm:mb-16 space-y-3"
      >
        <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] text-[#d5be9b] uppercase">
          Koleksi Momen Bahagia
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#f8f6f0] tracking-wide">
          Fine Art Gallery
        </h2>
        <div className="w-10 h-px bg-[#d5be9b]/40 mx-auto mt-2" />
        <p className="max-w-md mx-auto text-xs sm:text-sm text-[#b8b5ad] font-serif italic pt-1">
          Kilas balik memori indah dalam bingkai keabadian cinta.
        </p>
      </motion.div>

      {/* Video Highlight (if provided) */}
      {videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-lg mx-auto mb-10 overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[#1c1e22]"
        >
          <div className="px-4 py-3 bg-[#1c1e22] border-b border-white/5 flex items-center gap-2 text-xs font-serif text-[#d5be9b]">
            <Film className="w-4 h-4" />
            <span>Cinematic Film Highlight</span>
          </div>
          <div className="relative aspect-video w-full bg-black">
            {isYT && ytId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
                title="Wedding Highlight Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Photo Grid — Archival Fine Art Mosaic */}
      {galleries.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
          {galleries.map((item, idx) => {
            const isSpanTwo = idx % 5 === 0;

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.7, delay: (idx % 6) * 0.08, ease: EASE }}
                className={`relative rounded-xl overflow-hidden cursor-pointer group border border-white/10 bg-[#1c1e22] ${
                  isSpanTwo ? "col-span-2 aspect-[16/10]" : "aspect-[3/4]"
                }`}
                onClick={() => setActivePhoto(item.imageUrl)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.caption || `Gallery ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette hover wash */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                    <ZoomIn className="w-4 h-4 text-[#d5be9b]" />
                  </div>
                </div>

                {item.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent text-[11px] text-[#f8f6f0] font-serif italic truncate">
                    {item.caption}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none cursor-pointer"
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              aria-label="Tutup Galeri"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer z-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto}
                alt="Selected Gallery"
                className="max-h-[85vh] w-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
  Grid,
  Layers,
} from "lucide-react";

export function EditorialGallery({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const galleries = wedding.galleries ?? [];

  // Fallback foto jika galeri kosong
  const displayPhotos =
    galleries.length > 0
      ? galleries
      : [
          {
            id: "gal-1",
            imageUrl:
              "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            caption: "Prewedding Chapter I",
          },
          {
            id: "gal-2",
            imageUrl:
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
            caption: "Moments in Love",
          },
          {
            id: "gal-3",
            imageUrl:
              "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
            caption: "Together Forever",
          },
          {
            id: "gal-4",
            imageUrl:
              "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
            caption: "Golden Sunset Memories",
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(true);
  const [viewMode, setViewMode] = useState<"slideshow" | "grid">("slideshow");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Auto Slideshow Timer
  useEffect(() => {
    if (!isPlayingSlideshow || viewMode !== "slideshow" || displayPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlayingSlideshow, viewMode, displayPhotos.length]);

  const activePhoto = displayPhotos[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };

  return (
    <section className="relative w-full py-20 px-5 sm:px-6 overflow-hidden bg-[#0a0a0c] text-[#fdfbf7]">
      {/* ── AMBIENT BACKGROUND MENGIKUTI FOTO AKTIF SLIDESHOW ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activePhoto.id || currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={activePhoto.imageUrl}
              alt="Ambient Slideshow"
              className="w-full h-full object-cover object-center filter blur-md scale-110"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-black/85 to-[#0a0a0c]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] tracking-[0.3em] uppercase font-mono text-[#e8d5b5]">
            <Sparkles className="w-3 h-3" />
            <span>VISUAL LOOKBOOK</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-light tracking-wide">
            Galeri Prewedding
          </h2>
          <p className="text-xs text-neutral-400 font-sans max-w-xs mx-auto">
            Potret dokumentasi cinta dan kebahagiaan kami dalam bingkai sinematik.
          </p>

          {/* Toggle View Mode Buttons */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setViewMode("slideshow")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                viewMode === "slideshow"
                  ? "bg-[#e8d5b5] text-neutral-900 font-bold shadow-md"
                  : "bg-white/[0.06] text-neutral-300 hover:bg-white/[0.12] border border-white/10"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Slideshow</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#e8d5b5] text-neutral-900 font-bold shadow-md"
                  : "bg-white/[0.06] text-neutral-300 hover:bg-white/[0.12] border border-white/10"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid Lookbook</span>
            </button>
          </div>
        </motion.div>

        {/* ── MODE 1: CINEMATIC SLIDESHOW ── */}
        {viewMode === "slideshow" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Slide Card */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/15 shadow-2xl group">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-full h-full cursor-pointer"
                  onClick={() => setLightboxImage(activePhoto.imageUrl)}
                >
                  <img
                    src={activePhoto.imageUrl}
                    alt={activePhoto.caption || "Gallery Slide"}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

              {/* Top Bar: Photo Counter & Zoom */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono tracking-widest text-white/90">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-white/20 text-[#e8d5b5] text-[10px]">
                  PHOTO {String(currentIndex + 1).padStart(2, "0")} / {String(displayPhotos.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxImage(activePhoto.imageUrl)}
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
                  title="Perbesar Foto"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/90 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                title="Foto Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/90 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                title="Foto Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Caption & Autoplay Control */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="space-y-0.5 max-w-[70%]">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#e8d5b5] block">
                    EDITORIAL SHOT
                  </span>
                  <p className="text-sm font-serif italic text-white line-clamp-1">
                    {activePhoto.caption || "The Wedding Journal Moments"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
                  className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white text-[11px] font-mono flex items-center gap-1.5 hover:bg-black/80 transition-colors cursor-pointer"
                >
                  {isPlayingSlideshow ? (
                    <>
                      <Pause className="w-3 h-3 text-[#e8d5b5]" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-[#e8d5b5]" />
                      <span>Putar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Thumbnail Filmstrip Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {displayPhotos.map((photo, idx) => (
                <button
                  key={photo.id || idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlayingSlideshow(false);
                  }}
                  className={`relative w-14 h-18 sm:w-16 sm:h-20 rounded-lg overflow-hidden shrink-0 transition-all border-2 cursor-pointer ${
                    currentIndex === idx
                      ? "border-[#e8d5b5] scale-105 shadow-[0_0_12px_rgba(232,213,181,0.5)]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo.imageUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── MODE 2: MASONRY LOOKBOOK GRID ── */}
        {viewMode === "grid" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            {displayPhotos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => setLightboxImage(photo.imageUrl)}
                className={`relative rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg cursor-pointer group ${
                  idx % 3 === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[3/4]"
                }`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || `Gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs font-serif italic text-white line-clamp-1">
                    {photo.caption || `Chapter ${idx + 1}`}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── LIGHTBOX FULLSCREEN MODAL ── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            title="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}

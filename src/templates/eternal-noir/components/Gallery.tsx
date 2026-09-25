"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export function NoirGallery({ context }: TemplateComponentProps) {
  const galleries = context.wedding.galleries ?? [];
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (galleries.length === 0) return null;

  return (
    <section className="relative w-full bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-20 sm:py-28 overflow-hidden">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

      {/* Eyebrow */}
      <div className="text-center mb-10">
        <p className="font-noir-sans text-[9px] tracking-[0.45em] uppercase text-[#666666] mb-3">
          Momen Bersama
        </p>
        <h2 className="font-noir-serif text-3xl sm:text-4xl font-light text-[#fafafa] tracking-wide">
          Galeri Foto
        </h2>
        <div className="w-8 h-px bg-[#c9a84c] mx-auto mt-4" />
        <p className="font-noir-sans text-[10px] text-[#777777] mt-3 tracking-wide">
          Sentuh atau arahkan kursor ke foto untuk melihat warna aslinya
        </p>
      </div>

      {/* Mosaic grid — grayscale, hover colorize */}
      <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-2.5">
        {galleries.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            onClick={() => setLightbox(photo.imageUrl)}
            className={`relative overflow-hidden cursor-pointer group border border-[#1f1f1f] bg-[#111111] hover:border-[#c9a84c]/40 transition-colors duration-300 ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
            style={{ aspectRatio: i === 0 ? "4/3" : "1" }}
          >
            <img
              src={photo.imageUrl}
              alt={photo.caption || `Foto ${i + 1}`}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              style={{
                filter: "grayscale(1) brightness(0.85)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "grayscale(0) brightness(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "grayscale(1) brightness(0.85)";
              }}
            />
            {/* Caption overlay */}
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-noir-sans text-[9px] text-[#fafafa] tracking-wider">
                  {photo.caption}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 text-white/60 hover:text-[#c9a84c] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.93 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.93 }}
              src={lightbox}
              alt="Foto Mempelai"
              className="max-w-full max-h-[85dvh] object-contain border border-[#222222]"
              style={{ filter: "grayscale(0)" }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

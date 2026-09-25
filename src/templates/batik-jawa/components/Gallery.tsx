"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { UkiranCorner, SulurDivider, KawungBorder } from "./Ornaments";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function BatikJawaGallery({ context }: TemplateComponentProps) {
  const galleries = context.wedding.galleries ?? [];
  const [selected, setSelected] = useState<number | null>(null);

  if (galleries.length === 0) return null;

  const goNext = () => setSelected((s) => (s !== null ? (s + 1) % galleries.length : null));
  const goPrev = () => setSelected((s) => (s !== null ? (s - 1 + galleries.length) % galleries.length : null));

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-[#FDF6E3]">
      {/* Kawung border atas & bawah */}
      <div className="absolute top-0 left-0 right-0">
        <KawungBorder color="#B8860B" height={18} />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <KawungBorder color="#B8860B" height={18} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p
            className="font-jawa-body text-[10px] tracking-[0.45em] uppercase text-[#8B6E5A] mb-3"
            style={{ fontStyle: "normal" }}
          >
            Momen Berharga
          </p>
          <h2 className="font-jawa-serif text-3xl sm:text-4xl text-[#3D2B1F]">
            Galeri Kenangan
          </h2>
          <div className="mt-5">
            <SulurDivider color="#B8860B" height={22} />
          </div>
        </motion.div>

        {/* Grid foto */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
          {galleries.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="relative cursor-pointer group"
              onClick={() => setSelected(i)}
            >
              {/* Ornamen sudut */}
              <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <UkiranCorner color="#B8860B" size={18} />
              </div>
              <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: "scaleX(-1)" }}>
                <UkiranCorner color="#B8860B" size={18} />
              </div>
              <div className="absolute bottom-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: "scaleY(-1)" }}>
                <UkiranCorner color="#B8860B" size={18} />
              </div>
              <div className="absolute bottom-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: "scale(-1,-1)" }}>
                <UkiranCorner color="#B8860B" size={18} />
              </div>

              {/* Foto */}
              <div
                className="aspect-square overflow-hidden border"
                style={{ borderColor: "#D9C9A0" }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption || `Foto ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: "sepia(0.08) brightness(0.96)" }}
                />
              </div>

              {/* Overlay hover */}
              <div className="absolute inset-0 bg-[#2D1B0E]/0 group-hover:bg-[#2D1B0E]/30 transition-all duration-300 flex items-center justify-center border" style={{ borderColor: "transparent" }}>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity font-jawa-body text-[#D4A853] text-[10px] tracking-widest uppercase" style={{ fontStyle: "normal" }}>
                  Lihat
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-[100] flex items-center justify-center px-4"
            style={{ background: "rgba(45,27,14,0.95)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleries[selected].imageUrl}
                alt={galleries[selected].caption || `Foto ${selected + 1}`}
                className="w-full max-h-[75vh] object-contain border"
                style={{ borderColor: "rgba(184,134,11,0.35)" }}
              />
              {galleries[selected].caption && (
                <p className="text-center font-jawa-body text-[#D4A853] text-xs mt-3" style={{ fontStyle: "italic" }}>
                  {galleries[selected].caption}
                </p>
              )}

              {/* Navigasi */}
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#D4A853] hover:text-[#EDE0C4] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#D4A853] hover:text-[#EDE0C4] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center text-[#D4A853] hover:text-[#EDE0C4] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ZoomIn } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export function MonogramGallery({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const rawGalleries = wedding.galleries || [];

  // Default curated photos for Basic Monogram (up to 5 photos)
  const defaultPhotos = [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      caption: "Momen Janji Suci",
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      caption: "Cinta & Kasih Sayang",
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      caption: "Genggaman Selamanya",
    },
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
      caption: "Senyuman Bahagia",
    },
  ];

  const photos =
    rawGalleries.length > 0
      ? rawGalleries.slice(0, 5).map((p, i) => ({
          id: p.id || `photo-${i}`,
          url: p.imageUrl,
          caption: p.caption || "Momen Bahagia",
        }))
      : defaultPhotos;

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-10 space-y-2">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8c7e72] uppercase block">
          GALERI KENANGAN
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Momen Romantis
        </h2>
        <div className="w-12 h-0.5 bg-[#c5a880] mx-auto rounded-full mt-2" />
      </div>

      {/* Grid Layout Editorial (4-5 Photos) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((item, idx) => {
          const isLarge = idx === 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => setSelectedPhoto(item.url)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-100 shadow-2xs border border-slate-200/80 ${
                isLarge ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-md">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedPhoto}
              alt="Preview Momen"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GalleryPhoto {
  id?: string;
  imageUrl?: string;
  url?: string;
  src?: string;
  caption?: string;
  alt?: string;
}

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// Grid layout helpers
// Pattern: 0=wide(16/9), 1=square, 2=square, 3=wide(16/9), 4=square, 5=square, …
// ---------------------------------------------------------------------------

interface SlotConfig {
  colSpan: "col-span-2" | "col-span-1";
  aspectClass: string;
  aspect: string;
}

function getSlotConfig(index: number): SlotConfig {
  const pos = index % 3;
  if (pos === 0) {
    return { colSpan: "col-span-2", aspectClass: "", aspect: "16 / 9" };
  }
  return { colSpan: "col-span-1", aspectClass: "", aspect: "1 / 1" };
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

interface LightboxProps {
  photo: GalleryPhoto;
  onClose: () => void;
}

function Lightbox({ photo, onClose }: LightboxProps) {
  const src = (photo.imageUrl || photo.url || photo.src || "").trim();
  const caption = photo.caption ?? photo.alt ?? "";

  if (!src) return null;

  return (
    <motion.div
      key="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0d0e]/95 backdrop-blur-md px-4"
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Tutup"
        className="
          absolute top-6 right-6
          text-[#f5f3ef]/70 hover:text-[#d4c4b0]
          transition-colors duration-300
          z-10
        "
      >
        <X size={22} strokeWidth={1.2} />
      </button>

      {/* Image */}
      <motion.div
        key="lightbox-image-wrap"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-3xl w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption || "Galeri foto"}
          className="w-full max-h-[80vh] object-contain mx-auto block rounded-lg shadow-2xl"
          style={{ borderRadius: 0 }}
        />

        {caption && (
          <p className="mt-4 text-center font-ci-serif text-sm italic font-light text-[#dcd8cf]">
            {caption}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Photo Tile
// ---------------------------------------------------------------------------

interface PhotoTileProps {
  photo: GalleryPhoto;
  index: number;
  onClick: () => void;
}

function PhotoTile({ photo, index, onClick }: PhotoTileProps) {
  const { colSpan, aspect } = getSlotConfig(index);
  const src = (photo.imageUrl || photo.url || photo.src || "").trim();
  const alt = photo.caption ?? photo.alt ?? `Foto ${index + 1}`;

  if (!src) return null;

  return (
    <motion.div
      className={`${colSpan} relative overflow-hidden cursor-pointer group`}
      style={{ aspectRatio: aspect }}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 1.2,
        delay: (index % 6) * 0.08,
        ease: EASE,
      }}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 1.2,
          delay: (index % 6) * 0.08,
          ease: EASE,
        }}
        whileHover={{ scale: 1.04 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover block"
          style={{
            borderRadius: 0,
            transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CinematicIvoryGallery({ context }: TemplateComponentProps) {
  const rawGalleries = context.wedding?.galleries ?? [];
  const galleries: GalleryPhoto[] = rawGalleries
    .map((g) => ({
      id: g.id,
      imageUrl: g.imageUrl,
      url: g.imageUrl,
      src: g.imageUrl,
      caption: g.caption,
    }))
    .filter((g) => Boolean((g.imageUrl || "").trim()));

  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  if (galleries.length === 0) return null;

  return (
    <section className="relative bg-[#121316] py-24 sm:py-28 px-6 text-[#f5f3ef]">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-2xl mx-auto">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-center mb-14"
        >
          <p className="font-ci-sans text-[8px] tracking-[0.5em] uppercase text-[#8a8b90] mb-4">
            MOMEN BERSAMA
          </p>
          <h2 className="font-ci-serif text-3xl sm:text-4xl font-light text-[#f5f3ef]">
            Galeri Foto
          </h2>
          {/* Hairline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            style={{ originX: 0.5 }}
            className="w-8 h-px bg-[#d4c4b0] mx-auto mt-5"
          />
        </motion.div>

        {/* ── Asymmetric grid ── */}
        <div className="grid grid-cols-2 gap-1.5">
          {galleries.map((photo, i) => (
            <PhotoTile
              key={photo.id ?? i}
              photo={photo}
              index={i}
              onClick={() => setActivePhoto(photo)}
            />
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {activePhoto && (
          <Lightbox
            photo={activePhoto}
            onClose={() => setActivePhoto(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import type { WeddingData } from "@/types/template";

interface BackgroundSlideshowProps {
  context: {
    wedding: WeddingData;
  };
}

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
];

export function CinematicIvoryBackgroundSlideshow({ context }: BackgroundSlideshowProps) {
  const { wedding } = context;

  // Collect all photos from galleries, couple photo, groom & bride
  const photos = useMemo(() => {
    const rawGalleries = (wedding?.galleries || [])
      .map((g) => g.imageUrl?.trim())
      .filter((url): url is string => Boolean(url));

    const couplePhoto = wedding?.couple?.couplePhoto?.trim();
    const groomPhoto = wedding?.couple?.groomPhoto?.trim();
    const bridePhoto = wedding?.couple?.bridePhoto?.trim();

    const candidates = [
      couplePhoto,
      ...rawGalleries,
      groomPhoto,
      bridePhoto,
      ...DEFAULT_PHOTOS,
    ].filter((url): url is string => Boolean(url));

    // Deduplicate preserving order
    return Array.from(new Set(candidates));
  }, [wedding]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-y-0 right-0 w-full lg:w-[500px] pointer-events-none z-0 overflow-hidden select-none"
      style={{
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}
    >
      {/* Slideshow image layers */}
      {photos.map((photoUrl, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={photoUrl + index}
            className="absolute inset-0 transition-opacity duration-1500 ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt=""
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.12]"
              style={{
                transform: isActive ? "scale(1.05)" : "scale(1.0)",
                transition: "transform 7s ease-out",
                willChange: "transform, opacity",
              }}
            />
          </div>
        );
      })}

      {/* Global dark cinematic atmospheric tint & vignette */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,13,14,0.40) 0%, rgba(12,13,14,0.20) 40%, rgba(12,13,14,0.50) 100%)",
        }}
      />
    </div>
  );
}

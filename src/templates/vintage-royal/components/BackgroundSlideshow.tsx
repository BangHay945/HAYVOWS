"use client";

import { useState, useEffect, useMemo } from "react";
import type { WeddingContextData } from "@/types/template";

interface BackgroundSlideshowProps {
  context: WeddingContextData;
}

const DEFAULT_VINTAGE_PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
];

export function VintageRoyalBackgroundSlideshow({ context }: BackgroundSlideshowProps) {
  const { wedding } = context;

  const photos = useMemo(() => {
    const rawGalleries = ((wedding?.galleries as Array<{ imageUrl?: string }>) || [])
      .map((g) => g.imageUrl?.trim())
      .filter((url): url is string => Boolean(url));

    const couplePhoto = wedding?.couple?.couplePhoto?.trim();
    const groomPhoto = wedding?.couple?.groomPhoto?.trim();
    const bridePhoto = wedding?.couple?.bridePhoto?.trim();

    const candidates = [
      ...rawGalleries,
      couplePhoto,
      groomPhoto,
      bridePhoto,
      ...DEFAULT_VINTAGE_PHOTOS,
    ].filter((url): url is string => Boolean(url));

    return Array.from(new Set(candidates));
  }, [wedding]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos.length, currentIndex]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-y-0 right-0 w-full lg:w-[500px] pointer-events-none z-0 overflow-hidden select-none"
      style={{
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}
    >
      {/* Slideshow image cross-fade layers */}
      {photos.map((photoUrl, index) => {
        const isCurrent = index === currentIndex;
        const isPrev = index === prevIndex;
        const zIndex = isCurrent ? 2 : isPrev ? 1 : 0;

        return (
          <div
            key={photoUrl + index}
            className="absolute inset-0"
            style={{
              zIndex,
              opacity: isCurrent ? 1 : isPrev ? 1 : 0,
              transition: isCurrent ? "opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt=""
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover object-center"
              style={{
                transform: isCurrent ? "scale(1.05)" : "scale(1.0)",
                transition: "transform 7s ease-out",
                willChange: "transform, opacity",
              }}
            />
          </div>
        );
      })}

      {/* Warm Tuscan Film Grain & Translucent Veil */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,21,23,0.45) 0%, rgba(20,21,23,0.30) 40%, rgba(20,21,23,0.60) 100%)",
        }}
      />
    </div>
  );
}

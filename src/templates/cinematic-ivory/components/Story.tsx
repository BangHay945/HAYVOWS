"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { TemplateComponentProps } from "@/types/template";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoryItem {
  id?: string | number;
  date?: string;
  year?: string;
  title: string;
  description?: string;
  photo?: string;
  image?: string | null;
}

// ─── Story Item ───────────────────────────────────────────────────────────────

interface StoryEntryProps {
  item: StoryItem;
  index: number;
}

function StoryEntry({ item, index }: StoryEntryProps) {
  const dateLabel = item.date || item.year || "";
  const delay = index * 0.15;
  const photoUrl = (item.photo || item.image || "").trim();

  return (
    <motion.div
      className="relative pl-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {/* Dot on vertical line */}
      <div
        className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full -translate-x-[5px] shadow-[0_0_10px_rgba(212,196,176,0.5)]"
        style={{ backgroundColor: "#d4c4b0" }}
      />

      {/* Date / Year */}
      {dateLabel && (
        <span
          className="font-ci-sans uppercase tracking-[0.3em] block mb-2 font-medium"
          style={{ fontSize: "10px", color: "#d4c4b0" }}
        >
          {dateLabel}
        </span>
      )}

      {/* Title */}
      <h3
        className="font-ci-serif text-2xl font-light leading-snug mb-3 text-[#f5f3ef]"
      >
        {item.title}
      </h3>

      {/* Separator */}
      <div
        style={{ width: 24, height: 1, backgroundColor: "rgba(212, 196, 176, 0.35)" }}
        className="mb-4"
      />

      {/* Description */}
      {item.description && (
        <p
          className="font-ci-sans text-xs sm:text-sm leading-relaxed mb-6 text-[#b0b0b8]"
        >
          {item.description}
        </p>
      )}

      {/* Photo — full width, 16:9, GPU reveal */}
      {photoUrl && (
        <motion.div
          className="relative w-full overflow-hidden border border-white/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
          style={{ aspectRatio: "16/9", transform: "translateZ(0)" }}
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: EASE }}
        >
          <Image
            src={photoUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CinematicIvoryStory({ context }: TemplateComponentProps) {
  const rawStories = context.wedding?.stories ?? [];
  const couple = context.wedding?.couple;

  if (rawStories.length === 0) return null;

  const groom =
    couple?.groomNickname || couple?.groomName || "Alexander";
  const bride =
    couple?.brideNickname || couple?.brideName || "Sara";

  const stories: StoryItem[] = rawStories.map((s) => ({
    id: s.id,
    date: s.date,
    title: s.title,
    description: s.description,
    photo: s.image ?? (s as any).imageUrl ?? undefined,
  }));

  return (
    <section style={{ backgroundColor: "#121316" }} className="py-20 sm:py-28 relative z-10">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-lg mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-3 mb-16 text-center">
          <motion.span
            className="font-ci-sans uppercase tracking-[0.5em] text-[8px] text-[#8a8b90]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            PERJALANAN CINTA
          </motion.span>

          <motion.h2
            className="font-ci-serif text-3xl sm:text-4xl font-light italic text-[#f5f3ef]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
          >
            Kisah Kita
          </motion.h2>

          <motion.p
            className="font-ci-serif text-sm tracking-[0.3em] text-[#d4c4b0]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            {groom} &amp; {bride}
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line — animated scaleY */}
          <motion.div
            className="absolute top-0 bottom-0"
            style={{
              left: 0,
              width: 1,
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              transformOrigin: "top center",
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE }}
          />

          {/* Story items */}
          <div className="flex flex-col space-y-16 sm:space-y-20">
            {stories.map((item, index) => (
              <StoryEntry
                key={item.id ?? index}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

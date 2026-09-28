"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { TemplateComponentProps } from "@/types/template";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Sub-components ──────────────────────────────────────────────────────────

interface PersonBlockProps {
  label: string;
  name: string;
  fatherName?: string;
  motherName?: string;
  instagram?: string;
  photoUrl?: string;
  initial: string;
}

function PersonBlock({
  label,
  name,
  fatherName,
  motherName,
  instagram,
  photoUrl,
  initial,
}: PersonBlockProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Photo Frame — Editorial 3:4 Aspect Ratio */}
      <div
        className="relative w-full overflow-hidden border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.7)] bg-[#121316] rounded-2xl"
        style={{ aspectRatio: "3/4" }}
      >
        {photoUrl ? (
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ transform: "translateZ(0)" }}
          >
            <Image
              src={photoUrl}
              alt={name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            {/* Subtle bottom vignette on photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0e]/60 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        ) : (
          /* Dark placeholder with initial */
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#121316]"
          >
            <span
              className="font-ci-serif font-light select-none text-[#252830]"
              style={{ fontSize: "120px" }}
            >
              {initial}
            </span>
          </div>
        )}
      </div>

      {/* Editorial Typography below photo */}
      <motion.div
        className="pt-6 pb-2 flex flex-col items-center text-center gap-2 max-w-sm"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      >
        {/* Label */}
        <span
          className="font-ci-sans uppercase tracking-[0.45em] text-[8px] text-[#d4c4b0]"
        >
          {label}
        </span>

        {/* Name */}
        <h3
          className="font-ci-serif text-3xl font-light leading-tight text-[#f5f3ef]"
        >
          {name}
        </h3>

        {/* Hairline separator */}
        <div style={{ width: 24, height: 1, backgroundColor: "rgba(212, 196, 176, 0.4)" }} className="my-1" />

        {/* Parents */}
        {(fatherName || motherName) && (
          <div className="flex flex-col gap-0.5">
            <span
              className="font-ci-sans text-[8px] uppercase tracking-[0.2em] text-[#72737a]"
            >
              {label.includes("PRIA") ? "Putra dari" : "Putri dari"}
            </span>
            <span
              className="font-ci-serif italic font-light text-sm text-[#dcd8cf]"
            >
              {[fatherName, motherName].filter(Boolean).join(" & ")}
            </span>
          </div>
        )}

        {/* Instagram */}
        {instagram && (
          <a
            href={`https://instagram.com/${instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ci-sans text-[8px] tracking-[0.25em] text-[#8a8b90] hover:text-[#f5f3ef] transition-colors uppercase mt-1"
          >
            @{instagram.replace(/^@/, "")}
          </a>
        )}
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CinematicIvoryCouple({ context }: TemplateComponentProps) {
  const couple = context.wedding?.couple;

  const groom = {
    name: couple?.groomName || "Alexander",
    fatherName: couple?.groomFather,
    motherName: couple?.groomMother,
    instagram: couple?.groomInstagram,
    photoUrl:
      couple?.groomPhoto && couple.groomPhoto.trim()
        ? couple.groomPhoto.trim()
        : undefined,
    initial: ((couple?.groomNickname || couple?.groomName || "A")[0] ?? "A").toUpperCase(),
  };

  const bride = {
    name: couple?.brideName || "Sara",
    fatherName: couple?.brideFather,
    motherName: couple?.brideMother,
    instagram: couple?.brideInstagram,
    photoUrl:
      couple?.bridePhoto && couple.bridePhoto.trim()
        ? couple.bridePhoto.trim()
        : undefined,
    initial: ((couple?.brideNickname || couple?.brideName || "S")[0] ?? "S").toUpperCase(),
  };

  return (
    <section style={{ backgroundColor: "#0c0d0e" }} className="py-20 sm:py-28 relative z-10">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Section Header */}
      <div className="flex flex-col items-center gap-3 mb-16 px-6 text-center">
        <motion.span
          className="font-ci-sans uppercase tracking-[0.45em] text-[9px] text-[#8a8b90]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          KEDUA MEMPELAI
        </motion.span>

        <motion.div
          style={{
            width: 32,
            height: 1,
            backgroundColor: "#d4c4b0",
            transformOrigin: "left center",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        />

        <motion.h2
          className="font-ci-serif text-3xl sm:text-4xl font-light text-[#f5f3ef]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        >
          Dengan Penuh Cinta
        </motion.h2>
      </div>

      {/* Groom */}
      <div className="max-w-lg mx-auto px-6">
        <PersonBlock
          label="PENGANTIN PRIA"
          name={groom.name}
          fatherName={groom.fatherName}
          motherName={groom.motherName}
          instagram={groom.instagram}
          photoUrl={groom.photoUrl}
          initial={groom.initial}
        />
      </div>

      {/* Gold '&' divider */}
      <motion.div
        className="flex items-center justify-center py-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
      >
        <span
          className="font-ci-serif italic text-4xl text-[#d4c4b0]"
          style={{ lineHeight: 1 }}
        >
          &amp;
        </span>
      </motion.div>

      {/* Bride */}
      <div className="max-w-lg mx-auto px-6">
        <PersonBlock
          label="PENGANTIN WANITA"
          name={bride.name}
          fatherName={bride.fatherName}
          motherName={bride.motherName}
          instagram={bride.instagram}
          photoUrl={bride.photoUrl}
          initial={bride.initial}
        />
      </div>
    </section>
  );
}

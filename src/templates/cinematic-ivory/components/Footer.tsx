"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 1, ease: EASE, delay },
});

const hairlineExpand = (delay = 0) => ({
  initial: { scaleX: 0, opacity: 0 },
  whileInView: { scaleX: 1, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 1.1, ease: EASE, delay },
  style: { originX: 0.5 },
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CinematicIvoryFooter({ context }: TemplateComponentProps) {
  const couple = context.wedding?.couple;
  const groomName: string = couple?.groomNickname || couple?.groomName || "";
  const brideName: string = couple?.brideNickname || couple?.brideName || "";
  const groomFather: string = couple?.groomFather || "";
  const brideFather: string = couple?.brideFather || "";
  const groomMother: string = couple?.groomMother || "";
  const brideMother: string = couple?.brideMother || "";
  const quote: string =
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri supaya kamu cenderung dan merasa tenteram kepadanya.";
  const couplePhoto: string | null =
    couple?.couplePhoto && couple.couplePhoto.trim()
      ? couple.couplePhoto.trim()
      : couple?.groomPhoto && couple.groomPhoto.trim()
        ? couple.groomPhoto.trim()
        : null;

  return (
    <section className="relative overflow-hidden bg-[#0c0d0e]/82 backdrop-blur-[2px]" style={{ minHeight: "100vh" }}>
      {/* ── Translucent dark wash over stationary slideshow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(12,13,14,0.96) 0%, rgba(12,13,14,0.78) 50%, rgba(12,13,14,0.65) 100%)",
        }}
        aria-hidden
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center text-[#f5f3ef]">
        {/* Eyebrow */}
        <motion.p
          {...fadeUp(0)}
          className="font-ci-sans text-[8px] tracking-[0.6em] uppercase mb-8 text-[#d4c4b0]"
        >
          Terima Kasih
        </motion.p>

        {/* Hairline top */}
        <motion.div
          {...hairlineExpand(0.1)}
          className="w-10 h-px bg-[#d4c4b0]/40 mb-10"
        />

        {/* Groom name */}
        {groomName && (
          <motion.h2
            {...fadeUp(0.2)}
            className="font-ci-serif font-light text-5xl sm:text-6xl tracking-[0.1em] leading-none text-[#f5f3ef]"
          >
            {groomName}
          </motion.h2>
        )}

        {/* Ampersand */}
        <motion.span
          {...fadeUp(0.3)}
          className="block font-ci-serif italic text-xl text-[#d4c4b0] my-5"
          aria-label="dan"
        >
          &amp;
        </motion.span>

        {/* Bride name */}
        {brideName && (
          <motion.h2
            {...fadeUp(0.4)}
            className="font-ci-serif font-light text-5xl sm:text-6xl tracking-[0.1em] leading-none text-[#f5f3ef]"
          >
            {brideName}
          </motion.h2>
        )}

        {/* Hairline bottom */}
        <motion.div
          {...hairlineExpand(0.5)}
          className="w-10 h-px bg-[#d4c4b0]/40 mt-10 mb-10"
        />

        {/* Quote */}
        {quote && (
          <motion.p
            {...fadeUp(0.6)}
            className="font-ci-serif italic text-sm leading-relaxed max-w-xs text-[#dcd8cf]"
          >
            &ldquo;{quote}&rdquo;
          </motion.p>
        )}

        {/* Family names */}
        {(groomFather || brideFather) && (
          <motion.div {...fadeUp(0.7)} className="mt-10 space-y-1">
            {groomFather && (
              <p className="font-ci-sans text-[9px] tracking-[0.25em] uppercase text-[#8a8b90]">
                Putra dari Bpk. {groomFather}
                {groomMother ? ` & Ibu. ${groomMother}` : ""}
              </p>
            )}
            {brideFather && (
              <p className="font-ci-sans text-[9px] tracking-[0.25em] uppercase text-[#8a8b90]">
                Putri dari Bpk. {brideFather}
                {brideMother ? ` & Ibu. ${brideMother}` : ""}
              </p>
            )}
          </motion.div>
        )}

        {/* Copyright */}
        <motion.p
          {...fadeUp(0.85)}
          className="absolute bottom-8 font-ci-sans text-[8px] tracking-[0.3em] uppercase text-[#72737a]"
        >
          Dibuat dengan{" "}
          <a
            href="https://hayvows.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d4c4b0] hover:text-[#f5f3ef] transition-colors duration-300"
          >
            HayVows
          </a>
        </motion.p>
      </div>
    </section>
  );
}

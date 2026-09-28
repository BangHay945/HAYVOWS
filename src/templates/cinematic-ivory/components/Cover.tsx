"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, ExternalLink, Sparkles } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoverProps extends TemplateComponentProps {
  onOpen: () => void;
  onOpenTicket?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

function formatEventDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d
    .toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp = (delay: number, duration: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration, ease: EASE },
});

const revealText = (delay: number, duration: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration, ease: EASE },
});

const scaleX = (delay: number, duration: number) => ({
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  transition: { delay, duration, ease: EASE },
});

const subtleFadeUp = (delay: number, duration: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration, ease: EASE },
});

// ─── Component ────────────────────────────────────────────────────────────────

export function CinematicIvoryCover({
  context,
  onOpen,
  onOpenTicket,
}: CoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  const couple = context.wedding?.couple;
  const events = context.wedding?.events;
  const guest = context.guest;

  const groomName =
    couple?.groomNickname || couple?.groomName || "Alexander";
  const brideName =
    couple?.brideNickname || couple?.brideName || "Sara";
  const couplePhoto =
    couple?.couplePhoto && couple.couplePhoto.trim()
      ? couple.couplePhoto.trim()
      : null;
  const eventDate = events?.[0]?.date;
  const displayDate = formatEventDate(eventDate);

  // ── Opening transition ────────────────────────────────────────────────────

  function handleOpen() {
    if (isOpening) return;
    setIsOpening(true);
    onOpen();
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Ken Burns keyframe injection */}
      <style>{`
        @keyframes ci-ken-burns {
          from { transform: scale(1.08) translateZ(0); }
          to   { transform: scale(1.0) translateZ(0);  }
        }
      `}</style>

      <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-end overflow-hidden bg-[#0c0d0e]">
        {/* ── Background Photo / Ambient Dark Atmosphere ────────────────── */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
          }}
        >
          {couplePhoto ? (
            <img
              src={couplePhoto}
              alt={`${groomName} & ${brideName}`}
              className="w-full h-full object-cover"
              style={{
                animation: "ci-ken-burns 16s linear forwards",
                transformOrigin: "center center",
                willChange: "transform",
                filter: "brightness(0.85) contrast(1.1)",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              }}
              draggable={false}
            />
          ) : (
            /* Dark midnight gradient fallback */
            <div
              className="w-full h-full"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, #1e2026 0%, #0c0d0e 85%)",
              }}
            />
          )}
        </div>

        {/* ── Deep Cinematic Film Vignette ──────────────────────────────── */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(12,13,14,0.96) 0%, rgba(12,13,14,0.65) 45%, rgba(12,13,14,0.25) 75%, rgba(12,13,14,0.60) 100%)",
          }}
        />

        {/* ── Top Micro-Label & Editorial Masthead (Clean & Centered) ─────── */}
        <div
          className="absolute top-6 left-0 right-0 z-20 flex justify-center items-center gap-2 px-4 pointer-events-none"
          style={{
            fontSize: "8px",
            letterSpacing: "0.45em",
            color: "#dcd8cf",
            fontFamily: "var(--font-ci-sans, 'Montserrat', sans-serif)",
            textTransform: "uppercase",
          }}
        >
          <Sparkles className="w-2.5 h-2.5 text-[#d4c4b0]" />
          <span>UNDANGAN PERNIKAHAN &bull; CINEMATIC FILM</span>
        </div>

        {/* ── Main Content (bottom-aligned) ─────────────────────────────── */}
        <div className="relative z-20 w-full flex flex-col items-center pb-12 sm:pb-16 px-6">
          {/* Label: THE WEDDING OF */}
          <motion.p
            {...fadeUp(0.7, 1.0)}
            className="mb-3 text-center"
            style={{
              fontSize: "8.5px",
              letterSpacing: "0.5em",
              color: "#d4c4b0",
              fontFamily: "var(--font-ci-sans, 'Montserrat', sans-serif)",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            THE WEDDING OF
          </motion.p>

          {/* Groom Name */}
          <div className="overflow-hidden">
            <motion.h1
              {...revealText(1.0, 1.2)}
              className="text-center"
              style={{
                fontFamily:
                  "var(--font-ci-serif, 'Cormorant Garamond', serif)",
                fontSize: "clamp(2.8rem, 10vw, 5.2rem)",
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: "0.04em",
                color: "#f5f3ef",
              }}
            >
              {groomName}
            </motion.h1>
          </div>

          {/* Ampersand divider line */}
          <div className="flex items-center gap-4 my-2.5 w-44 sm:w-48">
            <motion.div
              {...scaleX(1.4, 0.8)}
              className="flex-1 h-px origin-left"
              style={{ background: "#d4c4b0" }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
              style={{
                fontFamily:
                  "var(--font-ci-serif, 'Cormorant Garamond', serif)",
                fontSize: "1.4rem",
                fontWeight: 300,
                color: "#d4c4b0",
                lineHeight: 1,
              }}
            >
              &amp;
            </motion.span>
            <motion.div
              {...scaleX(1.4, 0.8)}
              className="flex-1 h-px origin-right"
              style={{ background: "#d4c4b0" }}
            />
          </div>

          {/* Bride Name */}
          <div className="overflow-hidden">
            <motion.h1
              {...revealText(1.6, 1.2)}
              className="text-center"
              style={{
                fontFamily:
                  "var(--font-ci-serif, 'Cormorant Garamond', serif)",
                fontSize: "clamp(2.8rem, 10vw, 5.2rem)",
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: "0.04em",
                color: "#f5f3ef",
              }}
            >
              {brideName}
            </motion.h1>
          </div>

          {/* Event Date */}
          {displayDate && (
            <motion.p
              {...fadeUp(2.0, 0.9)}
              className="mt-4 text-center"
              style={{
                fontFamily:
                  "var(--font-ci-serif, 'Cormorant Garamond', serif)",
                fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                fontStyle: "italic",
                letterSpacing: "0.15em",
                color: "#dcd8cf",
              }}
            >
              {displayDate}
            </motion.p>
          )}

          {/* ── Guest Name Plaque (Translucent Midnight Glass Card) ──────── */}
          {guest && (
            <motion.div
              {...subtleFadeUp(2.3, 0.8)}
              className="mt-6 text-center px-6 py-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              style={{
                border: "1px solid rgba(212,196,176,0.25)",
                background: "rgba(18, 19, 22, 0.85)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                maxWidth: "290px",
                width: "100%",
              }}
            >
              <p
                style={{
                  fontSize: "7.5px",
                  letterSpacing: "0.35em",
                  color: "#8a8b90",
                  fontFamily:
                    "var(--font-ci-sans, 'Montserrat', sans-serif)",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <p
                style={{
                  fontFamily:
                    "var(--font-ci-serif, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.1rem, 4vw, 1.35rem)",
                  fontWeight: 400,
                  color: "#f5f3ef",
                  fontStyle: "italic",
                  letterSpacing: "0.02em",
                }}
              >
                {guest.name}
              </p>
              {guest.category && (
                <span
                  className="inline-block mt-1 font-ci-sans text-[7.5px] uppercase tracking-[0.25em] text-[#d4c4b0]"
                >
                  {guest.category}
                </span>
              )}
            </motion.div>
          )}

          {/* ── CTA Actions: BUKA UNDANGAN & LIHAT E-PASS ───────────────── */}
          <motion.div
            {...subtleFadeUp(2.6, 0.8)}
            className="mt-6 flex flex-col items-center gap-3 w-full max-w-xs"
          >
            {/* Primary BUKA UNDANGAN Button */}
            <motion.button
              onClick={handleOpen}
              disabled={isOpening}
              animate={
                isOpening
                  ? { opacity: 0, scale: 1.03 }
                  : { opacity: 1, scale: 1 }
              }
              transition={
                isOpening
                  ? { duration: 0.4, ease: EASE }
                  : { duration: 0 }
              }
              whileHover={
                !isOpening
                  ? {
                      backgroundColor: "#d4c4b0",
                      color: "#0c0d0e",
                      borderColor: "#d4c4b0",
                    }
                  : {}
              }
              whileTap={!isOpening ? { scale: 0.97 } : {}}
              className="relative w-full max-w-[240px] justify-center py-3.5 px-6 text-[9.5px] tracking-[0.3em] uppercase rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] disabled:cursor-default transition-all duration-300 flex items-center gap-2 cursor-pointer"
              style={{
                fontFamily:
                  "var(--font-ci-sans, 'Montserrat', sans-serif)",
                border: "1px solid rgba(212,196,176,0.6)",
                color: "#f5f3ef",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(6px)",
                fontWeight: 500,
              }}
            >
              <Sparkles className="w-3 h-3 text-[#d4c4b0]" />
              <span>Buka Undangan</span>
            </motion.button>

            {/* E-Pass QR Button — placed cleanly below Buka Undangan */}
            {onOpenTicket && (
              <motion.button
                type="button"
                onClick={onOpenTicket}
                disabled={isOpening}
                animate={
                  isOpening
                    ? { opacity: 0 }
                    : { opacity: 1 }
                }
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03, borderColor: "rgba(212,196,176,0.8)" }}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-white/15 bg-black/40 hover:bg-white/[0.08] backdrop-blur-md text-[8.5px] uppercase tracking-[0.25em] text-[#d4c4b0] hover:text-[#f5f3ef] transition-all cursor-pointer shadow-sm"
                style={{
                  fontFamily: "var(--font-ci-sans, 'Montserrat', sans-serif)",
                }}
              >
                <QrCode size={11} strokeWidth={1.5} className="text-[#d4c4b0] group-hover:text-[#f5f3ef] transition-colors duration-300" />
                <span>Lihat E-Pass &bull; QR Code</span>
              </motion.button>
            )}
          </motion.div>

          {/* Platform backlink */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0, duration: 0.8, ease: EASE }}
            className="mt-6 flex items-center gap-1.5"
            style={{
              fontSize: "8px",
              letterSpacing: "0.25em",
              color: "#72737a",
              fontFamily: "var(--font-ci-sans, 'Montserrat', sans-serif)",
              textTransform: "uppercase",
            }}
          >
            <span>Dibuat dengan</span>
            <a
              href="https://hayvows.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 hover:text-[#f5f3ef] transition-colors"
              style={{ color: "#dcd8cf" }}
            >
              hayvows.com
              <ExternalLink size={8} strokeWidth={1.5} />
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

function CornerFiligree({ className = "w-5 h-5 text-[#d5be9b]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M2 34V12C2 6.477 6.477 2 12 2H34"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6 30V14C6 9.582 9.582 6 14 6H30"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="2" cy="34" r="1" fill="currentColor" />
      <circle cx="34" cy="2" r="1" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

interface MemberSlideProps {
  type: "groom" | "bride";
  name: string;
  nickname: string;
  father?: string;
  mother?: string;
  instagram?: string;
  photo: string;
}

function MemberSlide({
  type,
  name,
  nickname,
  father,
  mother,
  instagram,
  photo,
}: MemberSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Background Photo Transformation (Smooth entrance zoom-out & exit shrink)
  const photoScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1.08, 1, 1, 0.95]);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.3]);

  // Top Category Badge Transformation (Slides down into view, drifts up out of view)
  const topBadgeY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [-25, 0, 0, -25]);
  const topBadgeOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  // Bottom Content Transformation (Glides up into view, drifts up on exit)
  const bottomContentY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [35, 0, 0, -35]);
  const bottomContentOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  // Corner Filigree Frame (Expands gracefully into view, shrinks gently on exit)
  const frameScale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.95, 1, 1, 0.95]);
  const frameOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  const isGroom = type === "groom";
  const categoryTitle = isGroom ? "MEMPELAI PRIA" : "MEMPELAI WANITA";
  const englishSubtitle = isGroom ? "THE GROOM" : "THE BRIDE";
  const parentPrefix = isGroom ? "Putra tercinta dari pasangan:" : "Putri tercinta dari pasangan:";

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[100dvh] flex flex-col justify-between items-center text-center px-6 pt-8 pb-6 sm:pt-10 sm:pb-8 overflow-hidden border-b border-white/10"
    >
      {/* ── BACKGROUND PHOTO WITH SCROLL-LINKED ENTER & EXIT ANIMATION ── */}
      <motion.div
        style={{ scale: photoScale, opacity: photoOpacity }}
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-[center_6%] sm:object-[center_4%] filter brightness-[0.9] contrast-[1.02]"
        />
        {/* Top Vignette - Soft & gentle */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#141517]/70 via-transparent to-transparent h-24" />
        {/* Bottom Smooth 8-Stop Easing Scrim - Zero banding or harsh lines */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,21,23,0.96) 0%, rgba(20,21,23,0.90) 14%, rgba(20,21,23,0.78) 26%, rgba(20,21,23,0.56) 38%, rgba(20,21,23,0.32) 50%, rgba(20,21,23,0.12) 62%, rgba(20,21,23,0.03) 72%, transparent 82%)",
          }}
        />
      </motion.div>

      {/* ── DELICATE CORNER FILIGREE FRAME (ANIMATED ENTER & EXIT) ── */}
      <motion.div
        style={{ scale: frameScale, opacity: frameOpacity }}
        className="absolute inset-3 sm:inset-5 pointer-events-none rounded-2xl border border-[#d5be9b]/30 z-10 will-change-transform"
      >
        <div className="absolute top-1 left-1">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
        <div className="absolute top-1 right-1 -scale-x-100">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
        <div className="absolute bottom-1 left-1 -scale-y-100">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
        <div className="absolute bottom-1 right-1 -scale-x-100 -scale-y-100">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
      </motion.div>

      {/* ── TOP: CATEGORY BADGE (ANIMATED ENTER & EXIT) ── */}
      <motion.div
        style={{ y: topBadgeY, opacity: topBadgeOpacity }}
        className="relative z-20 flex flex-col items-center gap-1 pt-1 will-change-transform"
      >
        <div className="px-3 py-0.5 rounded-full bg-[#141517]/85 backdrop-blur-md border border-[#d5be9b]/40 shadow-lg">
          <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.3em] text-[#d5be9b] uppercase font-semibold">
            {categoryTitle}
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.25em] text-[#b8b5ad] uppercase">
          {englishSubtitle}
        </span>
      </motion.div>

      {/* ── BOTTOM: PROFILE DETAILS (ANCHORED LOW TO CLEAR FACE & ELIMINATE VOID) ── */}
      <motion.div
        style={{ y: bottomContentY, opacity: bottomContentOpacity }}
        className="relative z-20 flex flex-col items-center max-w-[300px] sm:max-w-xs w-full space-y-1.5 sm:space-y-2 pb-3 sm:pb-5 will-change-transform"
      >
        <span className="text-[10px] sm:text-[11px] font-serif italic text-[#d5be9b] tracking-wider">
          {nickname}
        </span>

        <h3 className="text-xl sm:text-2xl font-serif text-[#f8f6f0] tracking-wide leading-snug">
          {name}
        </h3>

        <div className="w-8 h-px bg-[#d5be9b]/50 mx-auto" />

        <p className="text-[11px] sm:text-xs text-[#b8b5ad] leading-relaxed max-w-[280px]">
          {parentPrefix}
          <br />
          <strong className="text-[#f8f6f0] font-normal block mt-0.5">
            {father}
          </strong>
          <span className="text-[10px] text-[#d5be9b] font-serif italic">&amp;</span>
          <strong className="text-[#f8f6f0] font-normal block">
            {mother}
          </strong>
        </p>

        {instagram && (
          <div className="pt-1">
            <a
              href={`https://instagram.com/${instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-white/10 hover:border-[#d5be9b] bg-[#141517]/85 hover:bg-[#d5be9b] text-[#d5be9b] hover:text-[#141517] text-[10px] sm:text-[11px] font-sans tracking-wider transition-all duration-300 shadow-md group cursor-pointer"
            >
              <InstagramIcon className="w-3 h-3 fill-current text-[#d5be9b] group-hover:text-[#141517] transition-colors" />
              <span className="text-[#d5be9b] group-hover:text-[#141517] transition-colors">@{instagram.replace("@", "")}</span>
              <span className="text-[9px] text-[#d5be9b] group-hover:text-[#141517] group-hover:translate-x-0.5 transition-all">
                &rarr;
              </span>
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function VintageRoyalCouple({ context }: TemplateComponentProps) {
  const couple = context.wedding?.couple;

  const groomName = couple?.groomName || "Alexander Pratama, S.T.";
  const groomNickname = couple?.groomNickname || "Alexander";
  const groomFather = couple?.groomFather || "Bpk. Hendra Pratama";
  const groomMother = couple?.groomMother || "Ibu Ratna Dewi";
  const groomInstagram = couple?.groomInstagram;
  const groomPhoto =
    couple?.groomPhoto ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";

  const brideName = couple?.brideName || "Sara Clarissa, B.A.";
  const brideNickname = couple?.brideNickname || "Sara";
  const brideFather = couple?.brideFather || "Bpk. Gunawan Wijaya";
  const brideMother = couple?.brideMother || "Ibu Silvia Wijaya";
  const brideInstagram = couple?.brideInstagram;
  const bridePhoto =
    couple?.bridePhoto ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  // Section Header Entrance/Exit Scroll Animation
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headerProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });
  const headerOpacity = useTransform(headerProgress, [0, 0.3, 0.7, 1], [0.2, 1, 1, 0.2]);
  const headerY = useTransform(headerProgress, [0, 0.3, 0.7, 1], [25, 0, 0, -25]);

  // Interstitial Connector Animation
  const connectorRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: connectorProgress } = useScroll({
    target: connectorRef,
    offset: ["start end", "end start"],
  });
  const connectorScale = useTransform(connectorProgress, [0, 0.5, 1], [0.85, 1.05, 0.85]);
  const connectorOpacity = useTransform(connectorProgress, [0, 0.5, 1], [0.4, 1, 0.4]);

  return (
    <section className="relative w-full bg-[#141517] overflow-hidden select-none">
      {/* ── SECTION PROLOGUE HEADER ── */}
      <div
        ref={headerRef}
        className="relative w-full px-6 py-14 sm:py-20 text-center bg-[#141517]/95 border-t border-b border-white/5"
      >
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="max-w-md mx-auto space-y-3 will-change-transform"
        >
          <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.35em] text-[#d5be9b] uppercase block">
            MEMPELAI YANG BERBAHAGIA
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#f8f6f0] tracking-wide font-light">
            Kedua Mempelai
          </h2>

          <div className="w-12 h-px bg-[#d5be9b]/40 mx-auto" />

          <p className="text-xs sm:text-sm text-[#b8b5ad] font-serif italic pt-1 leading-relaxed px-4">
            &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.&rdquo;
          </p>
        </motion.div>
      </div>

      {/* ════════════ SCREEN 1: MEMPELAI PRIA (THE GROOM) ════════════ */}
      <MemberSlide
        type="groom"
        name={groomName}
        nickname={groomNickname}
        father={groomFather}
        mother={groomMother}
        instagram={groomInstagram}
        photo={groomPhoto}
      />

      {/* ── INTERSTITIAL CONNECTOR (Between Groom & Bride) ── */}
      <div
        ref={connectorRef}
        className="relative w-full py-8 sm:py-10 bg-[#141517] flex items-center justify-center border-b border-white/5 z-20"
      >
        <motion.div
          style={{ scale: connectorScale, opacity: connectorOpacity }}
          className="flex items-center gap-4 text-[#d5be9b]/50 will-change-transform"
        >
          <div className="w-16 sm:w-24 h-px bg-current" />
          <div className="w-10 h-10 rounded-full bg-[#1c1e22] border border-[#d5be9b]/50 flex items-center justify-center shadow-lg">
            <span className="font-serif italic text-lg text-[#d5be9b] select-none">
              &amp;
            </span>
          </div>
          <div className="w-16 sm:w-24 h-px bg-current" />
        </motion.div>
      </div>

      {/* ════════════ SCREEN 2: MEMPELAI WANITA (THE BRIDE) ════════════ */}
      <MemberSlide
        type="bride"
        name={brideName}
        nickname={brideNickname}
        father={brideFather}
        mother={brideMother}
        instagram={brideInstagram}
        photo={bridePhoto}
      />
    </section>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export interface NoirHeroProps extends TemplateComponentProps {
  onReadyToScroll?: () => void;
  isLocked?: boolean;
}

const VERSE_FULL_TEXT =
  "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";

export function NoirHero({ context, onReadyToScroll }: NoirHeroProps) {
  const couple = context.wedding.couple;
  const groom = couple?.groomNickname || couple?.groomName || "Alexander";
  const bride = couple?.brideNickname || couple?.brideName || "Sara";

  // Animation sequence steps:
  // 0: Initial mount / corner accents & background reveal
  // 1: Top header & Basmalah reveal
  // 2: Typewriter text actively writing
  // 3: Typewriter finished -> reference & couple watermark reveal
  // 4: Scroll indicator appears -> calls onReadyToScroll()
  const [animStep, setAnimStep] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const readyCallbackRef = useRef(onReadyToScroll);
  readyCallbackRef.current = onReadyToScroll;

  // Function to finish typing immediately (e.g. if tapped)
  const finishImmediately = useCallback(() => {
    if (isCompleted) return;
    setDisplayedText(VERSE_FULL_TEXT);
    setIsTyping(false);
    setAnimStep(3);
    setTimeout(() => {
      setAnimStep(4);
      setIsCompleted(true);
      readyCallbackRef.current?.();
    }, 400);
  }, [isCompleted]);

  // Sequence controller
  useEffect(() => {
    // Step 0 -> 1: Show top elements after 400ms
    const t1 = setTimeout(() => {
      setAnimStep(1);
    }, 400);

    // Step 1 -> 2: Start typewriter after 1000ms
    const t2 = setTimeout(() => {
      setAnimStep(2);
      setIsTyping(true);
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (animStep !== 2 || isCompleted) return;

    let currentIndex = 0;
    let timerId: NodeJS.Timeout | null = null;

    const typeNextChar = () => {
      if (currentIndex < VERSE_FULL_TEXT.length) {
        currentIndex++;
        setDisplayedText(VERSE_FULL_TEXT.slice(0, currentIndex));

        const lastChar = VERSE_FULL_TEXT[currentIndex - 1];
        // Organic handwriting pacing: relaxed, readable cadence with pauses at punctuation
        let delay = 45;
        if (lastChar === "," || lastChar === ";") delay = 220;
        else if (lastChar === ".") delay = 380;

        timerId = setTimeout(typeNextChar, delay);
      } else {
        // Typing done -> trigger step 3
        setIsTyping(false);
        setAnimStep(3);

        // After a calm pause, reveal scroll indicator and unlock scroll
        setTimeout(() => {
          setAnimStep(4);
          setIsCompleted(true);
          readyCallbackRef.current?.();
        }, 800);
      }
    };

    timerId = setTimeout(typeNextChar, 300);

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [animStep, isCompleted]);

  const handleScrollDown = () => {
    const el = document.getElementById("section-couple");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      onClick={animStep >= 2 && !isCompleted ? finishImmediately : undefined}
      className="relative w-full min-h-[100svh] min-h-screen bg-[#0a0a0a] flex flex-col justify-between items-center px-6 py-8 sm:py-12 select-none"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Background container with GPU isolated layer */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ transform: "translateZ(0)" }}
      >
        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
            transform: "translateZ(0)",
          }}
        />

        {/* Warm Ambient Gold Radial Glow in Center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(201,168,76,0.06)_0%,transparent_65%)]" />

        {/* Editorial Luxury Corner Accents */}
        <motion.div
          initial={isCompleted ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Top-Left */}
          <div className="absolute top-5 left-5 w-4 h-4 sm:w-5 sm:h-5 border-t border-l border-[#c9a84c]/30">
            <div className="w-1 h-1 bg-[#c9a84c]/50 absolute top-0.5 left-0.5" />
          </div>
          {/* Top-Right */}
          <div className="absolute top-5 right-5 w-4 h-4 sm:w-5 sm:h-5 border-t border-r border-[#c9a84c]/30">
            <div className="w-1 h-1 bg-[#c9a84c]/50 absolute top-0.5 right-0.5" />
          </div>
          {/* Bottom-Left */}
          <div className="absolute bottom-5 left-5 w-4 h-4 sm:w-5 sm:h-5 border-b border-l border-[#c9a84c]/30">
            <div className="w-1 h-1 bg-[#c9a84c]/50 absolute bottom-0.5 left-0.5" />
          </div>
          {/* Bottom-Right */}
          <div className="absolute bottom-5 right-5 w-4 h-4 sm:w-5 sm:h-5 border-b border-r border-[#c9a84c]/30">
            <div className="w-1 h-1 bg-[#c9a84c]/50 absolute bottom-0.5 right-0.5" />
          </div>
        </motion.div>
      </div>

      {/* TOP SECTION: Luxury Crest, Basmalah, & Eyebrow */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2 sm:pt-4 text-center">
        {animStep >= 1 && (
          <motion.div
            key="hero-top"
            initial={isCompleted ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center space-y-2 sm:space-y-3"
          >
            {/* Gold Diamond Ornament */}
            <div className="flex items-center justify-center gap-2.5 opacity-80">
              <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
              <div className="w-1.5 h-1.5 rotate-45 border border-[#c9a84c] bg-[#c9a84c]/20" />
              <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
            </div>

            {/* Bismillah Calligraphy */}
            <p
              className="font-serif text-[#c9a84c]/90 text-sm sm:text-base tracking-[0.2em] font-normal"
              style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Eyebrow Label */}
            <p className="font-noir-sans text-[8px] sm:text-[9px] tracking-[0.45em] uppercase text-[#777777]">
              Firman Allah SWT.
            </p>

            {/* Top Hairline Divider */}
            <motion.div
              initial={isCompleted ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-14 sm:w-16 h-px bg-[#c9a84c]/70 mx-auto origin-center"
            />
          </motion.div>
        )}
      </div>

      {/* CENTER SECTION: Typewriter Quranic Ayat with Editorial Quote */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center justify-center my-auto px-2 sm:px-4 text-center">
        {/* Giant Watermark Quote Mark */}
        <div
          aria-hidden="true"
          className="absolute -top-10 sm:-top-14 left-1/2 -translate-x-1/2 text-5xl sm:text-7xl font-serif text-[#c9a84c]/[0.07] pointer-events-none select-none"
        >
          &ldquo;
        </div>

        {/* The Typing Verse Text */}
        <div className="min-h-[140px] sm:min-h-[150px] flex items-center justify-center px-1">
          {animStep >= 2 && (
            <p className="font-noir-serif text-lg sm:text-xl md:text-2xl text-[#fafafa] font-light italic leading-relaxed sm:leading-loose">
              &ldquo;{displayedText}
              {/* Golden Writing Cursor */}
              {isTyping && (
                <span className="inline-block w-[2px] h-[0.95em] bg-[#c9a84c] ml-1 align-baseline animate-pulse shadow-[0_0_8px_rgba(201,168,76,0.8)]" />
              )}
              {animStep >= 3 ? "”" : ""}
            </p>
          )}
        </div>

        {/* Bottom Hairline, Surah Reference & Watermark */}
        <div className="w-full flex flex-col items-center mt-3 sm:mt-5 space-y-2.5">
          {animStep >= 3 && (
            <motion.div
              key="hero-verse-meta"
              initial={isCompleted ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-2.5"
            >
              {/* Gold Hairline */}
              <motion.div
                initial={isCompleted ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-12 sm:w-14 h-px bg-[#c9a84c]/60 mx-auto origin-center"
              />

              {/* Ayat Reference */}
              <motion.p
                initial={isCompleted ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-noir-sans text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[#c9a84c] font-medium"
              >
                QS. Ar-Rum : 21
              </motion.p>

              {/* Couple Watermark with Flanking Lines */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="w-6 h-px bg-[#262626]" />
                <span className="font-noir-serif text-[11px] sm:text-xs text-[#555555] tracking-[0.35em] uppercase">
                  {groom} &amp; {bride}
                </span>
                <span className="w-6 h-px bg-[#262626]" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: Final Scroll Indicator (Appears LAST) */}
      <div className="relative z-10 w-full flex flex-col items-center pb-2 sm:pb-3">
        {animStep >= 4 && (
          <motion.button
            key="hero-scroll-btn"
            type="button"
            onClick={handleScrollDown}
            initial={isCompleted ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer py-1 px-4 transition-transform active:scale-95"
            aria-label="Gulir ke bawah untuk melihat undangan"
          >
            <span className="font-noir-sans text-[8.5px] sm:text-[9.5px] tracking-[0.35em] uppercase text-[#c9a84c]/90 group-hover:text-[#dfbe65] transition-colors">
              Gulir Ke Bawah
            </span>
            <div className="w-6 h-6 rounded-full border border-[#c9a84c]/40 group-hover:border-[#c9a84c] flex items-center justify-center transition-colors shadow-[0_0_12px_rgba(201,168,76,0.15)] animate-bounce">
              <ChevronDown className="w-3.5 h-3.5 text-[#c9a84c]" />
            </div>
          </motion.button>
        )}
      </div>
    </section>
  );
}

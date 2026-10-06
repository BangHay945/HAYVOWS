"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import type { TemplateLayoutProps } from "@/types/template";
import { AnimatePresence, motion } from "framer-motion";
import { MonogramCover } from "./components/Cover";
import { MonogramHero } from "./components/Hero";
import { MonogramCouple } from "./components/Couple";
import { MonogramCountdown } from "./components/Countdown";
import { MonogramEvent } from "./components/Event";
import { MonogramGallery } from "./components/Gallery";
import { MonogramGift } from "./components/Gift";
import { MonogramMessages } from "./components/Messages";
import { MonogramFooter } from "./components/Footer";
import { MonogramMusicButton } from "./components/MusicButton";
import { DesktopSplitSidePanel } from "@/components/invitation/DesktopSplitSidePanel";
import { MODERN_MONOGRAM_THEME } from "./theme";
import { parseThemeConfig } from "@/lib/wedding/themeConfig";

export function MonogramLayout({
  context,
  isOpen,
  onOpen,
  onOpenTicket,
}: TemplateLayoutProps) {
  const themeConfig = useMemo(
    () => parseThemeConfig(context.wedding.themeConfig, "modern-monogram"),
    [context.wedding.themeConfig]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preset romantic music only (no custom upload or youtube)
  const presetMusicUrl = MODERN_MONOGRAM_THEME.presetMusic;

  // Handle open invitation with audio autoplay
  const handleOpen = () => {
    onOpen();
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio autoplay blocked by browser policy:", err);
      });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.warn);
    }
  };

  return (
    <div
      data-hy-theme="modern-monogram"
      className={`relative w-full ${!isOpen ? "h-[100dvh] max-h-[100dvh] overflow-hidden" : "min-h-[100dvh]"} flex flex-col lg:flex-row bg-[#1e1914] text-slate-800 font-sans selection:bg-[#2d4a3e]/15 selection:text-[#2d4a3e]`}
    >
      {/* Dynamic Hayvows Curated Colorway Engine */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-hy-theme="modern-monogram"] {
              --hy-accent: ${themeConfig.accentColor};
              --hy-accent-dark: ${themeConfig.accentSecondary};
            }
            [data-hy-theme="modern-monogram"] .text-\\[\\#c5a880\\] {
              color: var(--hy-accent, #c5a880) !important;
            }
            [data-hy-theme="modern-monogram"] .bg-\\[\\#c5a880\\] {
              background-color: var(--hy-accent, #c5a880) !important;
            }
            [data-hy-theme="modern-monogram"] .border-\\[\\#c5a880\\] {
              border-color: var(--hy-accent, #c5a880) !important;
            }
            [data-hy-theme="modern-monogram"] .text-\\[\\#2d4a3e\\] {
              color: var(--hy-accent-dark, #2d4a3e) !important;
            }
            [data-hy-theme="modern-monogram"] .bg-\\[\\#2d4a3e\\] {
              background-color: var(--hy-accent-dark, #2d4a3e) !important;
            }
            [data-hy-theme="modern-monogram"] .border-\\[\\#2d4a3e\\] {
              border-color: var(--hy-accent-dark, #2d4a3e) !important;
            }
          `,
        }}
      />

      {/* Audio Element with Built-in Romantic Preset */}
      <audio
        ref={audioRef}
        src={presetMusicUrl}
        loop
        preload="auto"
      />

      {/* DESKTOP LEFT FIXED PANEL (Statis / Diam) */}
      <DesktopSplitSidePanel context={context} themeSlug="modern-monogram" />

      {/* RIGHT COLUMN (500px Lebar di Layar Desktop, Scrollable Content) */}
      <div className={`w-full lg:w-[500px] lg:min-w-[500px] lg:max-w-[500px] ${!isOpen ? "h-[100dvh] max-h-[100dvh] overflow-hidden" : "min-h-[100dvh]"} bg-[#faf8f5] relative shadow-2xl lg:border-l border-[#c5a880]/20 flex flex-col justify-start`}>
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="cover"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden"
            >
              <MonogramCover
                context={context}
                onOpen={handleOpen}
                onOpenTicket={onOpenTicket}
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full relative"
            >
              {/* Floating Music Button (Fixed at Top Right of 500px Frame) */}
              <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-40 select-none">
                <MonogramMusicButton
                  isPlaying={isPlaying}
                  onToggle={toggleMusic}
                />
              </div>

              {/* Main Invitation Sections */}
              <main className="w-full divide-y divide-slate-100">
                <MonogramHero context={context} />
                <MonogramCouple context={context} />
                {themeConfig.sections.countdown && <MonogramCountdown context={context} />}
                <MonogramEvent context={context} />
                {themeConfig.sections.gallery && (context.wedding.galleries ?? []).length > 0 && <MonogramGallery context={context} />}
                {themeConfig.sections.gift && <MonogramGift context={context} />}
                {themeConfig.sections.messages && <MonogramMessages context={context} />}
              </main>

              {/* Footer */}
              <MonogramFooter context={context} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

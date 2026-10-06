"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { TemplateLayoutProps, RSVPSubmitData } from "@/types/template";
import { AnimatePresence, motion } from "framer-motion";
import { isYouTubeUrl, extractYouTubeId } from "@/lib/utils/youtube";
import { Gift as GiftIcon } from "lucide-react";

import { EditorialCover } from "./components/Cover";
import { EditorialHero } from "./components/Hero";
import { EditorialCouple } from "./components/Couple";
import { EditorialCountdown } from "./components/Countdown";
import { EditorialStory } from "./components/Story";
import { EditorialEvent } from "./components/Event";
import { EditorialGallery } from "./components/Gallery";
import { EditorialRSVP } from "./components/RSVP";
import { EditorialMessages } from "./components/Messages";
import { EditorialGift } from "./components/Gift";
import { EditorialFooter } from "./components/Footer";
import { EditorialMusicButton } from "./components/MusicButton";
import { DesktopSplitSidePanel } from "@/components/invitation/DesktopSplitSidePanel";
import { CINEMATIC_EDITORIAL_THEME } from "./theme";
import { parseThemeConfig } from "@/lib/wedding/themeConfig";

export function EditorialLayout({
  context,
  isOpen,
  onOpen,
  onOpenTicket,
}: TemplateLayoutProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const shouldPlayRef = useRef(false);

  const musicUrl =
    context.wedding.musics?.[0]?.fileUrl || CINEMATIC_EDITORIAL_THEME.presetMusic;
  const isYT = isYouTubeUrl(musicUrl);
  const ytId = extractYouTubeId(musicUrl);

  // YouTube Background Audio handler
  const sendYtCommand = useCallback((func: string, args: any[] = []) => {
    if (ytIframeRef.current?.contentWindow) {
      try {
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args }),
          "*"
        );
      } catch {}
    }
    if (ytPlayerRef.current) {
      try {
        if (func === "playVideo") {
          ytPlayerRef.current.unMute?.();
          ytPlayerRef.current.setVolume?.(100);
          ytPlayerRef.current.playVideo?.();
        } else if (func === "pauseVideo") {
          ytPlayerRef.current.pauseVideo?.();
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!isYT || !ytId) return;
    const handleMsg = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onStateChange") {
          if (data.info === 1) setIsPlaying(true);
          else if (data.info === 2) setIsPlaying(false);
          else if (data.info === 0) sendYtCommand("playVideo");
        }
      } catch {}
    };
    window.addEventListener("message", handleMsg);
    return () => {
      window.removeEventListener("message", handleMsg);
    };
  }, [isYT, ytId, sendYtCommand]);

  useEffect(() => {
    if (isYT) return;
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [isYT, musicUrl]);

  const handleOpen = () => {
    onOpen();
    if (isYT) {
      shouldPlayRef.current = true;
      setIsPlaying(true);
      sendYtCommand("playVideo");
    } else {
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio(musicUrl);
        audio.loop = true;
        audio.preload = "auto";
        audioRef.current = audio;
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.warn("Autoplay blocked:", e));
    }
  };

  const toggleMusic = () => {
    if (isYT) {
      if (isPlaying) {
        shouldPlayRef.current = false;
        sendYtCommand("pauseVideo");
        setIsPlaying(false);
      } else {
        shouldPlayRef.current = true;
        sendYtCommand("playVideo");
        setIsPlaying(true);
      }
    } else {
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio(musicUrl);
        audio.loop = true;
        audio.preload = "auto";
        audioRef.current = audio;
      }
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.warn("Play failed:", e));
      }
    }
  };

  const submitRSVP = async (data: RSVPSubmitData) => {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "RSVP failed");
    }
  };

  const themeConfig = useMemo(
    () => parseThemeConfig(context.wedding.themeConfig, "cinematic-editorial"),
    [context.wedding.themeConfig]
  );

  const visibleSections = useMemo(
    () => [
      { id: "section-hero", label: "Editorial" },
      { id: "section-couple", label: "Mempelai" },
      ...(themeConfig.sections.countdown
        ? [{ id: "section-countdown", label: "Hitung Mundur" }]
        : []),
      ...(themeConfig.sections.story && (context.wedding.stories ?? []).length > 0
        ? [{ id: "section-story", label: "Kisah Cinta" }]
        : []),
      { id: "section-event", label: "Agenda Acara" },
      ...(themeConfig.sections.gallery && (context.wedding.galleries ?? []).length > 0
        ? [{ id: "section-gallery", label: "Galeri Foto" }]
        : []),
      ...(themeConfig.sections.rsvp
        ? [{ id: "section-rsvp", label: "RSVP Kehadiran" }]
        : []),
      ...(themeConfig.sections.messages
        ? [{ id: "section-messages", label: "Untaian Doa" }]
        : []),
      { id: "section-footer", label: "Penutup" },
    ],
    [context.wedding.stories, context.wedding.galleries, themeConfig.sections]
  );

  useEffect(() => {
    if (!isOpen) return;

    let removeListener: (() => void) | null = null;
    const timer = setTimeout(() => {
      const updateActive = () => {
        const scrollY = window.scrollY + window.innerHeight * 0.4;
        let found = 0;
        visibleSections.forEach((sec, i) => {
          const el = document.getElementById(sec.id);
          if (el && el.offsetTop <= scrollY) found = i;
        });
        setActiveSection(found);
      };

      updateActive();
      window.addEventListener("scroll", updateActive, { passive: true });
      removeListener = () => window.removeEventListener("scroll", updateActive);
    }, 700);

    return () => {
      clearTimeout(timer);
      removeListener?.();
    };
  }, [isOpen, visibleSections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const props = { context, onRSVPSubmit: submitRSVP };

  return (
    <div
      data-hy-theme="editorial"
      className={`relative w-full flex flex-col lg:flex-row bg-[#0a0a0c] font-sans selection:bg-[#e8d5b5] selection:text-[#0a0a0c] ${
        !isOpen ? "h-[100dvh] max-h-[100dvh] overflow-hidden" : "min-h-[100dvh]"
      }`}
    >
      {/* Dynamic Hayvows Curated Colorway & Veil Engine */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-hy-theme="editorial"] {
              --hy-accent: ${themeConfig.accentColor};
              --hy-accent-dark: ${themeConfig.accentSecondary};
              --hy-veil-rgba: ${themeConfig.veilRgba};
            }
            [data-hy-theme="editorial"] .text-\\[\\#e8d5b5\\] {
              color: var(--hy-accent, #e8d5b5) !important;
            }
            [data-hy-theme="editorial"] .bg-\\[\\#e8d5b5\\] {
              background-color: var(--hy-accent, #e8d5b5) !important;
            }
            [data-hy-theme="editorial"] .border-\\[\\#e8d5b5\\] {
              border-color: var(--hy-accent, #e8d5b5) !important;
            }
            [data-hy-theme="editorial"] .ring-\\[\\#e8d5b5\\] {
              --tw-ring-color: var(--hy-accent, #e8d5b5) !important;
            }
            [data-hy-theme="editorial"] .text-\\[\\#e8d5b5\\]\\/40 {
              color: color-mix(in srgb, var(--hy-accent, #e8d5b5) 40%, transparent) !important;
            }
            [data-hy-theme="editorial"] .text-\\[\\#e8d5b5\\]\\/70 {
              color: color-mix(in srgb, var(--hy-accent, #e8d5b5) 70%, transparent) !important;
            }
            [data-hy-theme="editorial"] .bg-\\[\\#e8d5b5\\]\\/15 {
              background-color: color-mix(in srgb, var(--hy-accent, #e8d5b5) 15%, transparent) !important;
            }
            [data-hy-theme="editorial"] .bg-\\[\\#e8d5b5\\]\\/30 {
              background-color: color-mix(in srgb, var(--hy-accent, #e8d5b5) 30%, transparent) !important;
            }
            [data-hy-theme="editorial"] .bg-\\[\\#e8d5b5\\]\\/60 {
              background-color: color-mix(in srgb, var(--hy-accent, #e8d5b5) 60%, transparent) !important;
            }
            [data-hy-theme="editorial"] .border-\\[\\#e8d5b5\\]\\/25,
            [data-hy-theme="editorial"] .border-\\[\\#e8d5b5\\]\\/30,
            [data-hy-theme="editorial"] .border-\\[\\#e8d5b5\\]\\/40,
            [data-hy-theme="editorial"] .border-\\[\\#e8d5b5\\]\\/50 {
              border-color: color-mix(in srgb, var(--hy-accent, #e8d5b5) 35%, transparent) !important;
            }
            [data-hy-theme="editorial"] .hover\\:border-\\[\\#e8d5b5\\]\\/30:hover,
            [data-hy-theme="editorial"] .hover\\:border-\\[\\#e8d5b5\\]\\/40:hover,
            [data-hy-theme="editorial"] .hover\\:border-\\[\\#e8d5b5\\]:hover {
              border-color: var(--hy-accent, #e8d5b5) !important;
            }
            [data-hy-theme="editorial"] .hover\\:bg-\\[\\#f3e7cf\\]:hover {
              background-color: color-mix(in srgb, var(--hy-accent, #e8d5b5) 85%, white) !important;
            }
            [data-hy-theme="editorial"] .hover\\:text-\\[\\#111115\\]:hover,
            [data-hy-theme="editorial"] .hover\\:text-\\[\\#111115\\]:hover *,
            [data-hy-theme="editorial"] .group:hover .group-hover\\:text-\\[\\#111115\\],
            [data-hy-theme="editorial"] .group:hover .group-hover\\:text-\\[\\#111115\\] * {
              color: #111115 !important;
              fill: currentColor !important;
            }
            [data-hy-theme="editorial"] .focus\\:border-\\[\\#e8d5b5\\]:focus {
              border-color: var(--hy-accent, #e8d5b5) !important;
            }
            [data-hy-theme="editorial"] .focus\\:ring-\\[\\#e8d5b5\\]:focus {
              --tw-ring-color: var(--hy-accent, #e8d5b5) !important;
            }
            [data-hy-theme="editorial"] .selection\\:bg-\\[\\#e8d5b5\\] *::selection {
              background-color: var(--hy-accent, #e8d5b5) !important;
            }
          `,
        }}
      />
      {/* YouTube hidden iframe */}
      {isYT && ytId && (
        <div
          className="fixed bottom-0 right-0 w-24 h-14 pointer-events-none opacity-[0.001] z-0 overflow-hidden"
          aria-hidden="true"
        >
          <iframe
            ref={ytIframeRef}
            id="editorial-youtube-bgm-iframe"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=0&loop=1&playlist=${ytId}&playsinline=1&controls=0`}
            allow="autoplay; encrypted-media"
            className="w-full h-full border-0"
            title="Editorial Background Music"
          />
        </div>
      )}

      {/* DESKTOP LEFT FIXED PANEL */}
      <DesktopSplitSidePanel context={context} themeSlug="cinematic-editorial" />

      {/* RIGHT COLUMN (500px on Desktop, Full Width on Mobile) */}
      <div
        className={`w-full lg:w-[500px] lg:min-w-[500px] lg:max-w-[500px] bg-[#0a0a0c] relative shadow-2xl lg:border-l border-white/10 flex flex-col justify-start ${
          !isOpen ? "h-[100dvh] max-h-[100dvh] overflow-hidden" : "min-h-[100dvh]"
        }`}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="cover"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden"
            >
              <EditorialCover {...props} onOpen={handleOpen} onOpenTicket={onOpenTicket} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full relative"
            >
              {/* Floating Music Button (Fixed at Bottom Left of Frame) */}
              <div className="fixed bottom-6 left-4 sm:bottom-8 sm:left-6 lg:left-auto lg:right-[436px] z-50 select-none">
                <EditorialMusicButton isPlaying={isPlaying} onToggle={toggleMusic} />
              </div>

              {/* Floating Gift Button (Fixed at Bottom Right of Frame) */}
              {themeConfig.sections.gift && (context.wedding.giftAccounts ?? []).length > 0 && (
                <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 select-none">
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsGiftModalOpen(true)}
                    className="w-12 h-12 rounded-full bg-[#111115]/95 backdrop-blur-md border border-[#e8d5b5] text-[#e8d5b5] shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex items-center justify-center cursor-pointer transition-all hover:border-white hover:scale-105 relative group"
                    title="Amplop Digital / Tanda Kasih"
                    aria-label="Amplop Digital / Tanda Kasih"
                  >
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8d5b5] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e8d5b5] border-2 border-[#111115]"></span>
                    </span>
                    <GiftIcon className="w-5 h-5 text-[#e8d5b5] transition-transform group-hover:scale-110" />
                  </motion.button>
                </div>
              )}

              {/* Dot navigation — fixed on right edge */}
              <nav className="fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 items-center select-none">
                {visibleSections.map((sec, i) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    title={sec.label}
                    aria-label={sec.label}
                    className={`transition-all duration-500 cursor-pointer rounded-full ${
                      activeSection === i
                        ? "w-1.5 h-4 bg-[#e8d5b5]"
                        : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"
                    }`}
                  />
                ))}
              </nav>

              {/* Invitation Sections */}
              <div id="section-hero">
                <EditorialHero {...props} />
              </div>
              <div id="section-couple">
                <EditorialCouple {...props} />
              </div>

              {themeConfig.sections.countdown && (
                <div id="section-countdown">
                  <EditorialCountdown {...props} />
                </div>
              )}

              {themeConfig.sections.story && (context.wedding.stories ?? []).length > 0 && (
                <div id="section-story">
                  <EditorialStory {...props} />
                </div>
              )}

              <div id="section-event">
                <EditorialEvent {...props} />
              </div>

              {themeConfig.sections.gallery && (context.wedding.galleries ?? []).length > 0 && (
                <div id="section-gallery">
                  <EditorialGallery {...props} />
                </div>
              )}

              {themeConfig.sections.rsvp && (
                <div id="section-rsvp">
                  <EditorialRSVP {...props} />
                </div>
              )}

              {themeConfig.sections.messages && (
                <div id="section-messages">
                  <EditorialMessages {...props} />
                </div>
              )}

              <div id="section-footer">
                <EditorialFooter {...props} />
              </div>

              {/* Digital Gift Modal */}
              {themeConfig.sections.gift && (
                <EditorialGift
                  {...props}
                  isModalOpen={isGiftModalOpen}
                  setIsModalOpen={setIsGiftModalOpen}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

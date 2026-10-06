"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { TemplateLayoutProps, RSVPSubmitData } from "@/types/template";
import { AnimatePresence, motion } from "framer-motion";
import { isYouTubeUrl, extractYouTubeId } from "@/lib/utils/youtube";
import { Gift as GiftIcon } from "lucide-react";
import { VintageRoyalBackgroundSlideshow } from "./components/BackgroundSlideshow";
import { VintageRoyalCover } from "./components/Cover";
import { VintageRoyalHero } from "./components/Hero";
import { VintageRoyalCouple } from "./components/Couple";
import { VintageRoyalStory } from "./components/Story";
import { VintageRoyalCountdown } from "./components/Countdown";
import { VintageRoyalEvent } from "./components/Event";
import { VintageRoyalGallery } from "./components/Gallery";
import { VintageRoyalRSVP } from "./components/RSVP";
import { VintageRoyalGift } from "./components/Gift";
import { VintageRoyalFooter } from "./components/Footer";
import { VintageRoyalMusicButton } from "./components/MusicButton";
import { DesktopSplitSidePanel } from "@/components/invitation/DesktopSplitSidePanel";
import { VINTAGE_ROYAL_THEME } from "./theme";
import { parseThemeConfig } from "@/lib/wedding/themeConfig";

export function VintageRoyalLayout({
  context,
  isOpen,
  onOpen,
  onOpenTicket,
}: TemplateLayoutProps) {
  const themeConfig = useMemo(
    () => parseThemeConfig(context.wedding.themeConfig, "vintage-royal"),
    [context.wedding.themeConfig]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const shouldPlayRef = useRef(false);

  const musicUrl =
    context.wedding.musics?.[0]?.fileUrl ||
    VINTAGE_ROYAL_THEME.presetMusic ||
    VINTAGE_ROYAL_THEME.fallbackMusic;
  const isYT = isYouTubeUrl(musicUrl);
  const ytId = extractYouTubeId(musicUrl);

  // YouTube audio player handler
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
    return () => window.removeEventListener("message", handleMsg);
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
    if (isYT) {
      shouldPlayRef.current = true;
      setIsPlaying(true);
      sendYtCommand("unMute");
      sendYtCommand("setVolume", [100]);
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
    onOpen();
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

  const visibleSections = useMemo(
    () => [
      { id: "vr-hero", label: "Pembuka" },
      { id: "vr-couple", label: "Mempelai" },
      ...(themeConfig.sections.story && (context.wedding.stories ?? []).length > 0
        ? [{ id: "vr-story", label: "Kisah" }]
        : []),
      ...(themeConfig.sections.countdown ? [{ id: "vr-countdown", label: "Waktu" }] : []),
      { id: "vr-event", label: "Acara" },
      ...(themeConfig.sections.gallery && (context.wedding.galleries ?? []).length > 0
        ? [{ id: "vr-gallery", label: "Galeri" }]
        : []),
      ...(themeConfig.sections.rsvp ? [{ id: "vr-rsvp", label: "RSVP & Doa" }] : []),
      { id: "vr-footer", label: "Penutup" },
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
      data-hy-theme="vintage-royal"
      className={`relative w-full flex flex-col lg:flex-row bg-[#141517] text-[#f8f6f0] selection:bg-[#d5be9b] selection:text-[#141517] ${
        !isOpen ? "h-[100dvh] max-h-[100dvh] overflow-hidden" : "min-h-[100dvh]"
      }`}
    >
      {/* Dynamic Curated Colorway Engine */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-hy-theme="vintage-royal"] {
              --hy-accent: ${themeConfig.accentColor || "#d5be9b"};
              --hy-accent-dark: ${themeConfig.accentSecondary || "#9b8058"};
            }
            [data-hy-theme="vintage-royal"] .text-\\[\\#d5be9b\\] {
              color: var(--hy-accent, #d5be9b) !important;
            }
            [data-hy-theme="vintage-royal"] .bg-\\[\\#d5be9b\\] {
              background-color: var(--hy-accent, #d5be9b) !important;
            }
            [data-hy-theme="vintage-royal"] .border-\\[\\#d5be9b\\] {
              border-color: var(--hy-accent, #d5be9b) !important;
            }
            [data-hy-theme="vintage-royal"] .border-\\[\\#d5be9b\\]\\/30,
            [data-hy-theme="vintage-royal"] .border-\\[\\#d5be9b\\]\\/40 {
              border-color: color-mix(in srgb, var(--hy-accent, #d5be9b) 40%, transparent) !important;
            }
            [data-hy-theme="vintage-royal"] .hover\\:text-\\[\\#d5be9b\\]:hover {
              color: var(--hy-accent, #d5be9b) !important;
            }
            [data-hy-theme="vintage-royal"] .hover\\:bg-\\[\\#d5be9b\\]:hover {
              background-color: var(--hy-accent, #d5be9b) !important;
            }
            [data-hy-theme="vintage-royal"] .hover\\:border-\\[\\#d5be9b\\]:hover {
              border-color: var(--hy-accent, #d5be9b) !important;
            }
            /* High-priority dark text & icons on accent background hover */
            [data-hy-theme="vintage-royal"] .hover\\:text-\\[\\#141517\\]:hover,
            [data-hy-theme="vintage-royal"] .hover\\:text-\\[\\#141517\\]:hover *,
            [data-hy-theme="vintage-royal"] .group:hover .group-hover\\:text-\\[\\#141517\\],
            [data-hy-theme="vintage-royal"] .group:hover .group-hover\\:text-\\[\\#141517\\] * {
              color: #141517 !important;
              fill: currentColor !important;
            }
            [data-hy-theme="vintage-royal"] .hover\\:text-\\[\\#f8f6f0\\]:hover,
            [data-hy-theme="vintage-royal"] .group:hover .group-hover\\:text-\\[\\#f8f6f0\\] {
              color: #f8f6f0 !important;
            }
            [data-hy-theme="vintage-royal"] .vintage-royal-music-btn {
              border-color: color-mix(in srgb, var(--hy-accent, #d5be9b) 45%, transparent) !important;
            }
            [data-hy-theme="vintage-royal"] .vintage-royal-music-btn svg {
              color: var(--hy-accent, #d5be9b) !important;
            }
          `,
        }}
      />

      {/* YouTube hidden player */}
      {isYT && ytId && (
        <div
          className="fixed bottom-0 right-0 w-24 h-14 pointer-events-none opacity-[0.001] z-0 overflow-hidden"
          aria-hidden="true"
        >
          <iframe
            ref={ytIframeRef}
            id="vr-youtube-bgm-iframe"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=0&loop=1&playlist=${ytId}&playsinline=1&controls=0`}
            allow="autoplay; encrypted-media"
            className="w-full h-full border-0"
            title="Vintage Royal Background Music"
          />
        </div>
      )}

      {/* DESKTOP LEFT FIXED PANEL (Statis / Diam) */}
      <DesktopSplitSidePanel context={context} themeSlug="vintage-royal" />

      {/* RIGHT COLUMN (500px Lebar di Layar Desktop, Scrollable Content) */}
      <div
        className={`w-full lg:w-[500px] lg:min-w-[500px] lg:max-w-[500px] bg-[#141517] relative shadow-2xl lg:border-l border-white/10 flex flex-col justify-start ${
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
              <VintageRoyalCover {...props} onOpen={handleOpen} onOpenTicket={onOpenTicket} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full relative"
            >
              {/* Fixed Depth Background Slideshow */}
              <VintageRoyalBackgroundSlideshow context={context} />

              {/* Floating Music Button — bottom-left of 500px frame */}
              <div className="fixed bottom-6 left-4 sm:bottom-8 sm:left-6 lg:left-auto lg:right-[436px] z-50 select-none">
                <VintageRoyalMusicButton isPlaying={isPlaying} onToggle={toggleMusic} />
              </div>

              {/* Floating Gift Button — bottom-right of 500px frame */}
              {(context.wedding.giftAccounts ?? []).length > 0 && themeConfig.sections.gift && (
                <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 select-none">
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsGiftModalOpen(true)}
                    className="w-11 h-11 rounded-full bg-[#141517]/95 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all shadow-[0_4px_24px_rgba(0,0,0,0.6)] group border border-[#d5be9b]/40 hover:border-[#d5be9b]"
                    title="Amplop Digital"
                    aria-label="Amplop Digital"
                  >
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d5be9b] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d5be9b]" />
                    </span>
                    <GiftIcon className="w-5 h-5 text-[#d5be9b] transition-transform group-hover:scale-110" />
                  </motion.button>
                </div>
              )}

              {/* Dot Navigation Sidebar */}
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
                        ? "w-1.5 h-4 bg-[#d5be9b]"
                        : "w-1.5 h-1.5 bg-[#7c7970]/60 hover:bg-[#d5be9b]/70"
                    }`}
                  />
                ))}
              </nav>

              {/* Main Content Sections */}
              <div id="vr-hero"><VintageRoyalHero {...props} /></div>
              <div id="vr-couple"><VintageRoyalCouple {...props} /></div>

              {themeConfig.sections.story && (context.wedding.stories ?? []).length > 0 && (
                <div id="vr-story"><VintageRoyalStory {...props} /></div>
              )}

              {themeConfig.sections.countdown && (
                <div id="vr-countdown"><VintageRoyalCountdown {...props} /></div>
              )}

              <div id="vr-event"><VintageRoyalEvent {...props} /></div>

              {themeConfig.sections.gallery && (context.wedding.galleries ?? []).length > 0 && (
                <div id="vr-gallery"><VintageRoyalGallery {...props} /></div>
              )}

              {themeConfig.sections.rsvp && (
                <div id="vr-rsvp"><VintageRoyalRSVP {...props} /></div>
              )}

              <div id="vr-footer"><VintageRoyalFooter {...props} /></div>

              {/* Gift Modal Popup */}
              {themeConfig.sections.gift && (
                <VintageRoyalGift
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

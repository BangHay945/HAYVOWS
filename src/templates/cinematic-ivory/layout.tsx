"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { TemplateLayoutProps, RSVPSubmitData } from "@/types/template";
import { AnimatePresence, motion } from "framer-motion";
import { isYouTubeUrl, extractYouTubeId } from "@/lib/utils/youtube";
import { Gift as GiftIcon } from "lucide-react";

import { CinematicIvoryCover } from "./components/Cover";
import { CinematicIvoryHero } from "./components/Hero";
import { CinematicIvoryCouple } from "./components/Couple";
import { CinematicIvoryStory } from "./components/Story";
import { CinematicIvoryEvent } from "./components/Event";
import { CinematicIvoryGallery } from "./components/Gallery";
import { CinematicIvoryRSVP } from "./components/RSVP";
import { CinematicIvoryGift } from "./components/Gift";
import { CinematicIvoryFooter } from "./components/Footer";
import { CinematicIvoryMusicButton } from "./components/MusicButton";
import { DesktopSplitSidePanel } from "@/components/invitation/DesktopSplitSidePanel";
import { CINEMATIC_IVORY_THEME } from "./theme";

export function CinematicIvoryLayout({
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
    context.wedding.musics?.[0]?.fileUrl || CINEMATIC_IVORY_THEME.presetMusic;
  const isYT = isYouTubeUrl(musicUrl);
  const ytId = extractYouTubeId(musicUrl);

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
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
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

  const visibleSections = useMemo(
    () => [
      { id: "section-hero", label: "Pembuka" },
      { id: "section-couple", label: "Mempelai" },
      ...((context.wedding.stories ?? []).length > 0
        ? [{ id: "section-story", label: "Kisah Cinta" }]
        : []),
      { id: "section-event", label: "Agenda Acara" },
      ...((context.wedding.galleries ?? []).length > 0
        ? [{ id: "section-gallery", label: "Galeri Foto" }]
        : []),
      { id: "section-rsvp", label: "RSVP & Doa" },
      { id: "section-footer", label: "Penutup" },
    ],
    [context.wedding.stories, context.wedding.galleries]
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
      className={`relative w-full flex flex-col lg:flex-row bg-[#0c0d0e] text-[#f5f3ef] ${
        !isOpen ? "h-[100dvh] max-h-[100dvh] overflow-hidden" : "min-h-[100dvh]"
      }`}
    >
      {/* YouTube hidden iframe */}
      {isYT && ytId && (
        <div
          className="fixed bottom-0 right-0 w-24 h-14 pointer-events-none opacity-[0.001] z-0 overflow-hidden"
          aria-hidden="true"
        >
          <iframe
            ref={ytIframeRef}
            id="ci-youtube-bgm-iframe"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=0&loop=1&playlist=${ytId}&playsinline=1&controls=0`}
            allow="autoplay; encrypted-media"
            className="w-full h-full border-0"
            title="Cinematic Ivory Background Music"
          />
        </div>
      )}

      {/* Desktop Left Fixed Panel */}
      <DesktopSplitSidePanel context={context} themeSlug="cinematic-ivory" />

      {/* Right Column — 500px on Desktop, Full Width on Mobile */}
      <div
        className={`w-full lg:w-[500px] lg:min-w-[500px] lg:max-w-[500px] bg-[#0c0d0e] relative shadow-2xl lg:border-l border-white/10 flex flex-col justify-start ${
          !isOpen ? "h-[100dvh] max-h-[100dvh] overflow-hidden" : "min-h-[100dvh]"
        }`}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="cover"
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden"
            >
              <CinematicIvoryCover
                {...props}
                onOpen={handleOpen}
                onOpenTicket={onOpenTicket}
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full relative bg-[#0c0d0e]"
            >
              {/* Floating Music Button */}
              <div className="fixed bottom-6 left-4 sm:bottom-8 sm:left-6 lg:left-auto lg:right-[436px] z-50 select-none">
                <CinematicIvoryMusicButton
                  isPlaying={isPlaying}
                  onToggle={toggleMusic}
                />
              </div>

              {/* Floating Gift Button */}
              {(context.wedding.giftAccounts ?? []).length > 0 && (
                <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 select-none">
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.06, borderColor: "#d4c4b0" }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setIsGiftModalOpen(true)}
                    className="w-11 h-11 rounded-full bg-[#16171b]/95 backdrop-blur-md border border-white/15 text-[#f5f3ef] shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer transition-colors duration-300 relative group"
                    title="Amplop Digital / Tanda Kasih"
                    aria-label="Amplop Digital / Tanda Kasih"
                  >
                    {/* Subtle indicator dot */}
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4c4b0] opacity-60" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4c4b0] border-2 border-[#16171b]" />
                    </span>
                    <GiftIcon className="w-4.5 h-4.5 text-[#f5f3ef]" />
                  </motion.button>
                </div>
              )}

              {/* Dot navigation — fixed right edge of 500px frame */}
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
                        ? "w-1.5 h-4 bg-[#f5f3ef]"
                        : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"
                    }`}
                  />
                ))}
              </nav>

              {/* Invitation Sections */}
              <div id="section-hero">
                <CinematicIvoryHero {...props} />
              </div>
              <div id="section-couple">
                <CinematicIvoryCouple {...props} />
              </div>

              {(context.wedding.stories ?? []).length > 0 && (
                <div id="section-story">
                  <CinematicIvoryStory {...props} />
                </div>
              )}

              <div id="section-event">
                <CinematicIvoryEvent {...props} />
              </div>

              {(context.wedding.galleries ?? []).length > 0 && (
                <div id="section-gallery">
                  <CinematicIvoryGallery {...props} />
                </div>
              )}

              <div id="section-rsvp">
                <CinematicIvoryRSVP {...props} />
              </div>
              <div id="section-footer">
                <CinematicIvoryFooter {...props} />
              </div>

              {/* Digital Gift Modal */}
              <CinematicIvoryGift
                {...props}
                isModalOpen={isGiftModalOpen}
                setIsModalOpen={setIsGiftModalOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { TemplateLayoutProps, RSVPSubmitData } from "@/types/template";
import { AnimatePresence, motion } from "framer-motion";
import { isYouTubeUrl, extractYouTubeId } from "@/lib/utils/youtube";
import { Gift as GiftIcon } from "lucide-react";
import { BatikJawaCover } from "./components/Cover";
import { BatikJawaHero } from "./components/Hero";
import { BatikJawaCouple } from "./components/Couple";
import { BatikJawaCountdown } from "./components/Countdown";
import { BatikJawaStory } from "./components/Story";
import { BatikJawaEvent } from "./components/Event";
import { BatikJawaGallery } from "./components/Gallery";
import { BatikJawaRSVP } from "./components/RSVP";
import { BatikJawaGift } from "./components/Gift";
import { BatikJawaFooter } from "./components/Footer";
import { BatikJawaMusicButton } from "./components/MusicButton";
import { DesktopSplitSidePanel } from "@/components/invitation/DesktopSplitSidePanel";
import { BATIK_JAWA_THEME } from "./theme";

export function BatikJawaLayout({
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
    context.wedding.musics?.[0]?.fileUrl ||
    BATIK_JAWA_THEME.presetMusic ||
    BATIK_JAWA_THEME.fallbackMusic;
  const isYT = isYouTubeUrl(musicUrl);
  const ytId = extractYouTubeId(musicUrl);

  // YouTube support
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
    let isMounted = true;
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
      isMounted = false;
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

  const visibleSections = useMemo(() => [
    { id: "section-hero", label: "Pembuka" },
    { id: "section-couple", label: "Mempelai" },
    ...((context.wedding.stories ?? []).length > 0
      ? [{ id: "section-story", label: "Kisah" }]
      : []),
    { id: "section-countdown", label: "Waktu" },
    { id: "section-event", label: "Acara" },
    ...((context.wedding.galleries ?? []).length > 0
      ? [{ id: "section-gallery", label: "Galeri" }]
      : []),
    { id: "section-rsvp", label: "Kehadiran" },
    { id: "section-footer", label: "Penutup" },
  ], [context.wedding.stories, context.wedding.galleries]);

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
    <div className="relative w-full min-h-[100dvh] flex flex-col lg:flex-row font-jawa-body bg-[#1A0F08]">
      {/* YouTube hidden iframe */}
      {isYT && ytId && (
        <div className="fixed bottom-0 right-0 w-24 h-14 pointer-events-none opacity-[0.001] z-0 overflow-hidden" aria-hidden="true">
          <iframe
            ref={ytIframeRef}
            id="batik-youtube-bgm-iframe"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=0&loop=1&playlist=${ytId}&playsinline=1&controls=0`}
            allow="autoplay; encrypted-media"
            className="w-full h-full border-0"
            title="Wedding Background Music"
          />
        </div>
      )}

      {/* DESKTOP LEFT FIXED PANEL (Statis / Diam) */}
      <DesktopSplitSidePanel context={context} themeSlug="batik-jawa" />

      {/* RIGHT COLUMN (500px Lebar di Layar Desktop, Scrollable Content) */}
      <div className="w-full lg:w-[500px] lg:min-w-[500px] lg:max-w-[500px] min-h-[100dvh] bg-[#2D1B0E] relative shadow-2xl lg:border-l border-[#D4A853]/20 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="cover"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full min-h-[100dvh]"
            >
              <BatikJawaCover {...props} onOpen={handleOpen} onOpenTicket={onOpenTicket} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full relative"
            >
              {/* Tombol musik — fixed di kiri bawah frame 500px kanan */}
              <div className="fixed bottom-6 left-4 sm:bottom-8 sm:left-6 lg:left-auto lg:right-[436px] z-50 select-none">
                <BatikJawaMusicButton isPlaying={isPlaying} onToggle={toggleMusic} />
              </div>

              {/* Tombol amplop digital — fixed di kanan bawah frame 500px kanan */}
              {(context.wedding.giftAccounts ?? []).length > 0 && (
                <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 select-none">
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsGiftModalOpen(true)}
                    className="w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-all relative group"
                    style={{
                      background: "rgba(61,43,31,0.9)",
                      border: "1px solid rgba(184,134,11,0.6)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                    }}
                    title="Amplop Digital"
                    aria-label="Amplop Digital"
                  >
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8860B] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B8860B]" style={{ border: "2px solid #3D2B1F" }}></span>
                    </span>
                    <GiftIcon className="w-5 h-5 text-[#D4A853] transition-transform group-hover:scale-110" />
                  </motion.button>
                </div>
              )}

              {/* Navigasi titik — fixed di kanan frame 500px */}
              <nav className="fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 items-center select-none">
                {visibleSections.map((sec, i) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    title={sec.label}
                    aria-label={sec.label}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      activeSection === i
                        ? "w-2 h-2 scale-150"
                        : "w-1.5 h-1.5 hover:opacity-80"
                    }`}
                    style={{
                      background: activeSection === i ? "#B8860B" : "#8B6E5A",
                    }}
                  />
                ))}
              </nav>

              {/* Sections — urutan selang-seling gelap/krem */}
              <div id="section-hero"><BatikJawaHero {...props} /></div>
              <div id="section-couple"><BatikJawaCouple {...props} /></div>

              {(context.wedding.stories ?? []).length > 0 && (
                <div id="section-story"><BatikJawaStory {...props} /></div>
              )}

              <div id="section-countdown"><BatikJawaCountdown {...props} /></div>

              <div id="section-event"><BatikJawaEvent {...props} /></div>

              {(context.wedding.galleries ?? []).length > 0 && (
                <div id="section-gallery"><BatikJawaGallery {...props} /></div>
              )}

              <div id="section-rsvp"><BatikJawaRSVP {...props} /></div>

              <div id="section-footer"><BatikJawaFooter {...props} /></div>

              {/* Gift Modal */}
              <BatikJawaGift
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

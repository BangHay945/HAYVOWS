"use client";
import { useState, useRef, useEffect } from "react";
import type {
  TemplateLayoutProps,
  RSVPSubmitData,
} from "@/types/template";
import { motion, AnimatePresence } from "framer-motion";
import { isYouTubeUrl, extractYouTubeId } from "@/lib/utils/youtube";
import { FloralCover } from "./components/Cover";
import { FloralHero } from "./components/Hero";
import { FloralCouple } from "./components/Couple";
import { FloralCountdown } from "./components/Countdown";
import { FloralStory } from "./components/Story";
import { FloralEvent } from "./components/Event";
import { FloralGallery } from "./components/Gallery";
import { FloralRSVP } from "./components/RSVP";
import { FloralMessages } from "./components/Messages";
import { FloralGift } from "./components/Gift";
import { FloralFooter } from "./components/Footer";
import { FloralMusicButton } from "./components/MusicButton";
import { MobileNavigation } from "./components/MobileNavigation";
import { Gift } from "lucide-react";
import { playFloralSound } from "./sound";
import { DesktopSplitSidePanel } from "@/components/invitation/DesktopSplitSidePanel";

export function FloralLayout({
  context,
  isOpen,
  onOpen,
  onOpenTicket,
}: TemplateLayoutProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const shouldPlayRef = useRef(false);

  const defaultBgm = "/music/presets/canon-in-d.mp3";
  const musicUrl = context.wedding.musics?.[0]?.fileUrl || defaultBgm;
  const isYT = isYouTubeUrl(musicUrl);
  const ytId = extractYouTubeId(musicUrl);

  const sendYtCommand = (func: string, args: any[] = []) => {
    if (ytIframeRef.current?.contentWindow) {
      try {
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args }),
          "*"
        );
      } catch (err) {
        console.warn("YouTube postMessage error:", err);
      }
    }
    if (ytPlayerRef.current) {
      try {
        if (func === "playVideo") {
          ytPlayerRef.current.unMute?.();
          ytPlayerRef.current.setVolume?.(100);
          ytPlayerRef.current.playVideo?.();
        } else if (func === "pauseVideo") {
          ytPlayerRef.current.pauseVideo?.();
        } else if (func === "unMute") {
          ytPlayerRef.current.unMute?.();
        }
      } catch (err) {
        console.warn("YouTube YT.Player command error:", err);
      }
    }
  };

  // 1. YouTube Iframe Listener & Player Setup
  useEffect(() => {
    if (!isYT || !ytId) return;

    let isMounted = true;

    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onStateChange") {
          if (data.info === 1) {
            setIsPlaying(true);
          } else if (data.info === 2) {
            setIsPlaying(false);
          } else if (data.info === 0) {
            sendYtCommand("playVideo");
          }
        }
      } catch {}
    };

    window.addEventListener("message", handleWindowMessage);

    const initYT = () => {
      if (!isMounted || !window.YT || !window.YT.Player) return;
      try {
        ytPlayerRef.current = new window.YT.Player("floral-youtube-bgm-iframe", {
          events: {
            onReady: (e: any) => {
              if (!isMounted) return;
              ytPlayerRef.current = e.target;
              if (shouldPlayRef.current) {
                e.target.unMute();
                e.target.setVolume(100);
                e.target.playVideo();
                setIsPlaying(true);
              }
            },
            onStateChange: (e: any) => {
              if (!isMounted) return;
              if (e.data === 1) setIsPlaying(true);
              else if (e.data === 2) setIsPlaying(false);
              else if (e.data === 0) e.target.playVideo();
            },
            onError: (err: any) => {
              console.warn("YouTube Player error:", err);
            },
          },
        });
      } catch (err) {
        console.warn("YouTube API init error:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevReady) prevReady();
        initYT();
      };
      if (!document.getElementById("yt-iframe-api-script")) {
        const script = document.createElement("script");
        script.id = "yt-iframe-api-script";
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
      window.removeEventListener("message", handleWindowMessage);
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
      }
    };
  }, [isYT, ytId]);

  // 2. Fallback Autoplay on interaction
  useEffect(() => {
    if (!isYT || !isOpen) return;

    const handleInteraction = () => {
      if (shouldPlayRef.current && !isPlaying) {
        sendYtCommand("unMute");
        sendYtCommand("setVolume", [100]);
        sendYtCommand("playVideo");
      }
    };

    window.addEventListener("pointerdown", handleInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
    };
  }, [isYT, isOpen, isPlaying]);

  // 3. HTML5 Audio Handler
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

  const track = (event: string, metadata?: Record<string, unknown>) => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weddingId: context.wedding.id,
        guestId: context.guest?.id,
        event,
        metadata,
      }),
    }).catch(() => {});
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

  const handleOpen = () => {
    onOpen();
    track("invitation_open");

    if (isYT) {
      shouldPlayRef.current = true;
      setIsPlaying(true);
      sendYtCommand("unMute");
      sendYtCommand("setVolume", [100]);
      sendYtCommand("playVideo");

      [350, 800, 1500, 2500].forEach((delay) => {
        setTimeout(() => {
          if (shouldPlayRef.current) {
            sendYtCommand("unMute");
            sendYtCommand("setVolume", [100]);
            sendYtCommand("playVideo");
          }
        }, delay);
      });
    } else if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio autoplay blocked:", err);
        });
    }
  };

  const toggleMusic = () => {
    if (isYT) {
      if (isPlaying) {
        shouldPlayRef.current = false;
        sendYtCommand("pauseVideo");
        setIsPlaying(false);
        track("music_pause");
      } else {
        shouldPlayRef.current = true;
        sendYtCommand("unMute");
        sendYtCommand("setVolume", [100]);
        sendYtCommand("playVideo");
        setIsPlaying(true);
        track("music_play");
      }
    } else {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        track("music_pause");
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Audio play failed:", err);
          });
        track("music_play");
      }
    }
  };

  const props = { context, onRSVPSubmit: submitRSVP, onTrack: track };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col lg:flex-row bg-[#13231c] font-sans-floral text-[#2d4a3e] relative selection:bg-[#e8eee5] selection:text-[#2d4a3e]">
      {/* Resilient YouTube Player Iframe */}
      {isYT && ytId && (
        <div
          className="fixed bottom-0 right-0 w-24 h-14 pointer-events-none opacity-[0.001] z-0 overflow-hidden"
          aria-hidden="true"
        >
          <iframe
            ref={ytIframeRef}
            id="floral-youtube-bgm-iframe"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=0&loop=1&playlist=${ytId}&playsinline=1&controls=0&disablekb=1&modestbranding=1&rel=0`}
            allow="autoplay; encrypted-media"
            className="w-full h-full border-0"
            title="Wedding Background Music"
          />
        </div>
      )}

      {/* DESKTOP LEFT FIXED PANEL (Statis / Diam) */}
      <DesktopSplitSidePanel context={context} themeSlug="nature-floral" />

      {/* RIGHT COLUMN (500px Lebar di Layar Desktop, Scrollable Content) */}
      <div className="w-full lg:w-[500px] lg:min-w-[500px] lg:max-w-[500px] min-h-[100dvh] bg-[#fbf8f3] relative shadow-2xl lg:border-l border-[#c5a880]/20 flex flex-col justify-start">
        {/* Top-Right Floating Controls (Gift Button & Music Button Parallel - Only Shown When Invitation is Opened) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="fixed top-3.5 right-3.5 sm:top-4 sm:right-4 z-50 flex items-center gap-2 select-none"
            >
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  playFloralSound("open");
                  setIsGiftModalOpen(true);
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#2d4a3e] via-[#385b4d] to-[#4c7361] text-[#fef08a] border border-[#c5a880] shadow-md flex items-center justify-center cursor-pointer transition-all relative group hover:brightness-110"
                title="Kirim Tanda Kasih / Amplop Digital"
                aria-label="Kirim Tanda Kasih / Amplop Digital"
              >
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a880] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c5a880] border border-white"></span>
                </span>
                <Gift className="w-4 h-4 text-[#fef08a] transition-transform group-hover:rotate-12" />
              </motion.button>

              <FloralMusicButton
                isPlaying={isPlaying}
                onToggle={toggleMusic}
                className="relative top-auto right-auto z-auto"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="cover"
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full min-h-[100dvh]"
            >
              <FloralCover {...props} onOpen={handleOpen} onOpenTicket={onOpenTicket} />
            </motion.div>
          ) : (
            <motion.div
              key="invitation-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full pb-24 sm:pb-28"
            >
              <FloralHero {...props} />
              <FloralCouple {...props} />
              <FloralCountdown {...props} />
              <FloralStory {...props} />
              <FloralEvent {...props} />
              <FloralGallery {...props} />
              <FloralRSVP {...props} />
              <FloralMessages {...props} />
              <FloralGift
                {...props}
                isModalOpen={isGiftModalOpen}
                setIsModalOpen={setIsGiftModalOpen}
              />
              <FloralFooter {...props} />

              {/* Mobile Floating Bottom Menu */}
              <MobileNavigation />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";
import { useState, useRef, useEffect } from "react";
import type { TemplateLayoutProps, RSVPSubmitData, TemplateComponentProps } from "@/types/template";
import { motion, AnimatePresence } from "framer-motion";
import { isYouTubeUrl, extractYouTubeId } from "@/lib/utils/youtube";

export interface BaseLayoutProps extends TemplateLayoutProps {
  bgClassName?: string;
  defaultBgm?: string;
  MusicButton: React.ComponentType<{ isPlaying: boolean; onToggle: () => void; className?: string }>;
  Cover: React.ComponentType<TemplateComponentProps & { onOpen: () => void; onOpenTicket?: () => void }>;
  GameWorld: React.ComponentType<TemplateComponentProps>;
}

export function BaseLayout({
  context,
  isOpen,
  onOpen,
  onOpenTicket,
  bgClassName = "bg-[#18040a]",
  defaultBgm = "/wedding-bgm.mp3",
  MusicButton,
  Cover,
  GameWorld,
}: BaseLayoutProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const shouldPlayRef = useRef(false);

  const musicUrl = context.wedding.musics?.[0]?.fileUrl || defaultBgm;
  const isYT = isYouTubeUrl(musicUrl);
  const ytId = extractYouTubeId(musicUrl);

  // Helper untuk mengirim perintah ke YouTube Iframe secara aman (via postMessage dan YT.Player)
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

    // Dengarkan balasan status dari YouTube iframe via postMessage
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onStateChange") {
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
          if (data.info === 1) {
            setIsPlaying(true);
          } else if (data.info === 2) {
            setIsPlaying(false);
          } else if (data.info === 0) {
            // Loop playback
            sendYtCommand("playVideo");
          }
        } else if (data?.event === "initialDelivery" || data?.event === "onReady") {
          // Iframe sudah siap menerima perintah
          if (shouldPlayRef.current) {
            sendYtCommand("unMute");
            sendYtCommand("setVolume", [100]);
            sendYtCommand("playVideo");
            setIsPlaying(true);
          }
        }
      } catch {}
    };

    window.addEventListener("message", handleWindowMessage);

    // Integrasi tambahan dengan YouTube Iframe API jika tersedia
    const initYT = () => {
      if (!isMounted || !window.YT || !window.YT.Player) return;
      try {
        ytPlayerRef.current = new window.YT.Player("youtube-bgm-iframe", {
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
              console.warn("YouTube Player error event:", err);
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

  // 2. Fallback Autoplay pada interaksi klik tamu pertama
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

  // 3. Standard HTML5 Audio Handler
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

      // Putar langsung seketika
      sendYtCommand("unMute");
      sendYtCommand("setVolume", [100]);
      sendYtCommand("playVideo");

      // Coba ulang dengan interval bertingkat untuk mengatasi latency iframe
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
          console.warn("Audio autoplay blocked or failed:", err);
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
    <div className={`w-screen h-[100dvh] overflow-hidden select-none font-pixel relative ${bgClassName}`}>
      {/* Resilient YouTube Player Iframe */}
      {isYT && ytId && (
        <div
          className="fixed bottom-0 right-0 w-24 h-14 pointer-events-none opacity-[0.001] z-0 overflow-hidden"
          aria-hidden="true"
        >
          <iframe
            ref={ytIframeRef}
            id="youtube-bgm-iframe"
            src={`https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=0&loop=1&playlist=${ytId}&playsinline=1&controls=0&disablekb=1&modestbranding=1&rel=0`}
            allow="autoplay; encrypted-media"
            className="w-full h-full border-0"
            title="Wedding Background Music"
          />
        </div>
      )}

      <MusicButton
        isPlaying={isPlaying}
        onToggle={toggleMusic}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50"
      />

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="cover"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Cover {...props} onOpen={handleOpen} onOpenTicket={onOpenTicket} />
          </motion.div>
        ) : (
          <motion.div
            key="game-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full"
          >
            <GameWorld {...props} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

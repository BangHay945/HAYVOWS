"use client";

import { useEffect, useState, use, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Clock,
  Heart,
  Crown,
  Users,
  Maximize2,
  Minimize2,
  Tv,
  Video,
  Settings,
  X,
  CheckCircle2,
  Images,
  ExternalLink,
  Volume2,
  VolumeX,
  Camera,
} from "lucide-react";
import { isYouTubeUrl, extractYouTubeId } from "@/lib/utils/youtube";

// Theme configuration helper for Layar Sapa
interface DisplayThemeConfig {
  slug: string;
  themeLabel: string;
  isMono: boolean;
  fontTitle: string;
  fontBody: string;
  bgGradient: string;
  orb1Color: string;
  orb2Color: string;
  vignette: string;
  cardBg: string;
  cardBorder: string;
  subCardBg: string;
  lightBar: string;
  accentText: string;
  accentSubText: string;
  accentBadgeBg: string;
  headerIconGradient: string;
  headerIconColor: string;
  avatarGradient: string;
  avatarTextColor: string;
  livePillBg: string;
  btnAction: string;
}

function getDisplayTheme(slug?: string): DisplayThemeConfig {
  const s = slug?.toLowerCase() || "nature-floral";

  if (s.includes("batik") || s.includes("jawa")) {
    return {
      slug: "batik-jawa",
      themeLabel: "Batik Jawa Heritage",
      isMono: false,
      fontTitle: "font-serif",
      fontBody: "font-sans",
      bgGradient: "bg-gradient-to-br from-[#2D1B0E] via-[#1A0F08] to-[#0E0704]",
      orb1Color: "bg-[#D4A853]/15",
      orb2Color: "bg-[#7C2D12]/20",
      vignette: "bg-gradient-to-t from-[#0E0704]/95 via-[#1A0F08]/80 to-[#0E0704]/90",
      cardBg: "bg-[#1A0F08]/90",
      cardBorder: "border-[#D4A853]/40",
      subCardBg: "bg-[#2D1B0E]/60 border-[#D4A853]/20",
      lightBar: "bg-gradient-to-r from-[#B8860B] via-[#D4A853] to-[#B8860B]",
      accentText: "text-[#D4A853]",
      accentSubText: "text-[#EDE0C4]",
      accentBadgeBg: "bg-[#D4A853]/15 border-[#D4A853]/40 text-[#D4A853]",
      headerIconGradient: "bg-gradient-to-tr from-[#B8860B] to-[#D4A853]",
      headerIconColor: "text-[#1A0F08]",
      avatarGradient: "bg-gradient-to-tr from-[#B8860B] to-[#D4A853]",
      avatarTextColor: "text-[#1A0F08]",
      livePillBg: "text-[#D4A853]",
      btnAction: "bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D4A853] border border-[#D4A853]/40",
    };
  }

  if (s.includes("noir") || s.includes("eternal")) {
    return {
      slug: "eternal-noir",
      themeLabel: "Eternal Luxury Noir",
      isMono: false,
      fontTitle: "font-serif",
      fontBody: "font-sans",
      bgGradient: "bg-gradient-to-br from-[#141414] via-[#0A0A0A] to-[#020202]",
      orb1Color: "bg-[#D4AF37]/12",
      orb2Color: "bg-white/5",
      vignette: "bg-gradient-to-t from-black/95 via-[#0A0A0A]/85 to-black/90",
      cardBg: "bg-[#0D0D0D]/90",
      cardBorder: "border-[#D4AF37]/40",
      subCardBg: "bg-white/5 border-white/10",
      lightBar: "bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37]",
      accentText: "text-[#D4AF37]",
      accentSubText: "text-[#F5D77F]",
      accentBadgeBg: "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]",
      headerIconGradient: "bg-gradient-to-tr from-[#997A15] to-[#D4AF37]",
      headerIconColor: "text-black",
      avatarGradient: "bg-gradient-to-tr from-[#997A15] to-[#D4AF37]",
      avatarTextColor: "text-black",
      livePillBg: "text-[#D4AF37]",
      btnAction: "bg-[#1F1F1F] hover:bg-[#2A2A2A] text-[#D4AF37] border border-[#D4AF37]/30",
    };
  }

  if (s.includes("monogram") || s.includes("modern")) {
    return {
      slug: "modern-monogram",
      themeLabel: "Modern Warm Monogram",
      isMono: false,
      fontTitle: "font-serif",
      fontBody: "font-sans",
      bgGradient: "bg-gradient-to-br from-[#2B241D] via-[#1E1914] to-[#120E0B]",
      orb1Color: "bg-[#C5A880]/15",
      orb2Color: "bg-[#8C6D4F]/20",
      vignette: "bg-gradient-to-t from-[#120E0B]/95 via-[#1E1914]/80 to-[#120E0B]/90",
      cardBg: "bg-[#1E1914]/90",
      cardBorder: "border-[#C5A880]/40",
      subCardBg: "bg-[#2B241D]/60 border-[#C5A880]/20",
      lightBar: "bg-gradient-to-r from-[#8C6D4F] via-[#C5A880] to-[#8C6D4F]",
      accentText: "text-[#C5A880]",
      accentSubText: "text-[#E6D5C3]",
      accentBadgeBg: "bg-[#C5A880]/15 border-[#C5A880]/40 text-[#C5A880]",
      headerIconGradient: "bg-gradient-to-tr from-[#8C6D4F] to-[#C5A880]",
      headerIconColor: "text-[#1E1914]",
      avatarGradient: "bg-gradient-to-tr from-[#8C6D4F] to-[#C5A880]",
      avatarTextColor: "text-[#1E1914]",
      livePillBg: "text-[#C5A880]",
      btnAction: "bg-[#3A3128] hover:bg-[#493E33] text-[#C5A880] border border-[#C5A880]/40",
    };
  }

  if (s.includes("cyberpunk")) {
    return {
      slug: "pixel-cyberpunk",
      themeLabel: "Pixel Cyberpunk Neon",
      isMono: true,
      fontTitle: "font-mono",
      fontBody: "font-mono",
      bgGradient: "bg-gradient-to-br from-[#0A1128] via-[#050811] to-[#02040A]",
      orb1Color: "bg-[#00F0FF]/20",
      orb2Color: "bg-[#FF007F]/20",
      vignette: "bg-gradient-to-t from-[#02040A]/95 via-[#050811]/80 to-[#02040A]/90",
      cardBg: "bg-[#0A1128]/90",
      cardBorder: "border-[#00F0FF]/40",
      subCardBg: "bg-[#00F0FF]/5 border-[#00F0FF]/20",
      lightBar: "bg-gradient-to-r from-[#00F0FF] via-[#FF007F] to-[#00F0FF]",
      accentText: "text-[#00F0FF]",
      accentSubText: "text-[#FF007F]",
      accentBadgeBg: "bg-[#00F0FF]/15 border-[#00F0FF]/40 text-[#00F0FF]",
      headerIconGradient: "bg-gradient-to-tr from-[#00F0FF] to-[#FF007F]",
      headerIconColor: "text-[#050811]",
      avatarGradient: "bg-gradient-to-tr from-[#00F0FF] to-[#FF007F]",
      avatarTextColor: "text-[#050811]",
      livePillBg: "text-[#00F0FF]",
      btnAction: "bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]/50",
    };
  }

  if (s.includes("pixel") || s.includes("adventure") || s.includes("rpg")) {
    return {
      slug: "pixel-adventure",
      themeLabel: "Pixel RPG Adventure",
      isMono: true,
      fontTitle: "font-mono",
      fontBody: "font-mono",
      bgGradient: "bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617]",
      orb1Color: "bg-[#FBBF24]/20",
      orb2Color: "bg-[#34D399]/20",
      vignette: "bg-gradient-to-t from-[#020617]/95 via-[#0F172A]/80 to-[#020617]/90",
      cardBg: "bg-[#0F172A]/90",
      cardBorder: "border-[#FBBF24]/40",
      subCardBg: "bg-slate-800/60 border-[#FBBF24]/20",
      lightBar: "bg-gradient-to-r from-[#FBBF24] via-[#34D399] to-[#60A5FA]",
      accentText: "text-[#FBBF24]",
      accentSubText: "text-[#34D399]",
      accentBadgeBg: "bg-[#FBBF24]/15 border-[#FBBF24]/40 text-[#FBBF24]",
      headerIconGradient: "bg-gradient-to-tr from-[#FBBF24] to-[#34D399]",
      headerIconColor: "text-[#0F172A]",
      avatarGradient: "bg-gradient-to-tr from-[#FBBF24] to-[#34D399]",
      avatarTextColor: "text-[#0F172A]",
      livePillBg: "text-[#FBBF24]",
      btnAction: "bg-[#1E293B] hover:bg-[#334155] text-[#FBBF24] border border-[#FBBF24]/40",
    };
  }

  // Default: Nature Floral (Botanical Sage)
  return {
    slug: "nature-floral",
    themeLabel: "Nature Floral Emerald",
    isMono: false,
    fontTitle: "font-serif",
    fontBody: "font-sans",
    bgGradient: "bg-gradient-to-br from-[#1E342B] via-[#15251F] to-[#0D1713]",
    orb1Color: "bg-[#C9A84C]/15",
    orb2Color: "bg-[#2D4A3E]/30",
    vignette: "bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-slate-950/85",
    cardBg: "bg-slate-900/90",
    cardBorder: "border-[#C9A84C]/40",
    subCardBg: "bg-white/5 border-white/10",
    lightBar: "bg-gradient-to-r from-amber-400 via-[#FEF08A] to-amber-500",
    accentText: "text-[#C9A84C]",
    accentSubText: "text-[#FEF08A]",
    accentBadgeBg: "bg-gradient-to-r from-amber-500/20 to-yellow-400/20 border-amber-400/50 text-[#FEF08A]",
    headerIconGradient: "bg-gradient-to-tr from-[#C9A84C] to-[#E6CA75]",
    headerIconColor: "text-[#15251F]",
    avatarGradient: "bg-gradient-to-tr from-[#C9A84C] to-[#E6CA75]",
    avatarTextColor: "text-[#15251F]",
    livePillBg: "text-[#C9A84C]",
    btnAction: "bg-[#2D4A3E] hover:bg-[#233A30] text-[#FEF08A] border border-[#C9A84C]/30",
  };
}

export default function ReceptionDisplayPage({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}) {
  const { weddingSlug } = use(params);
  const [data, setData] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMessageIdx, setActiveMessageIdx] = useState(0);

  // Video Background Config (YouTube / Google Drive / Direct MP4 URL)
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoInputDraft, setVideoInputDraft] = useState<string>("");

  // Auto Check-in Welcome Banner State
  const [activeCheckInGuest, setActiveCheckInGuest] = useState<any | null>(null);
  const [lastAnnouncedGuestId, setLastAnnouncedGuestId] = useState<string | null>(null);
  const [bannerSecondsLeft, setBannerSecondsLeft] = useState<number>(10);

  // Photo Slideshow Index
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Dynamic Theme Selection based on template slug
  const theme = useMemo(
    () => getDisplayTheme(data?.wedding?.templateSlug),
    [data?.wedding?.templateSlug]
  );

  // Load custom video URL from localStorage if available
  useEffect(() => {
    try {
      const savedVideo = localStorage.getItem(`hvw_display_video_${weddingSlug}`);
      if (savedVideo) {
        setVideoUrl(savedVideo);
        setVideoInputDraft(savedVideo);
      }
    } catch {
      // ignore
    }
  }, [weddingSlug]);

  // Live Clock Ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll recent check-in arrivals & messages
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/wedding/${weddingSlug}/guestbook/recent`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setData(json);

            // Check if there is a newly checked-in guest to announce
            const latest = json.recentCheckedIn?.[0];
            if (latest && latest.id !== lastAnnouncedGuestId) {
              setLastAnnouncedGuestId(latest.id);
              setActiveCheckInGuest(latest);
              setBannerSecondsLeft(10);
            }
          }
        }
      } catch {
        // ignore network glitches
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // 3s polling for fast check-in reaction
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [weddingSlug, lastAnnouncedGuestId]);

  // Countdown timer for Welcome Splash Banner (10s -> 0s -> back to Standby)
  useEffect(() => {
    if (!activeCheckInGuest) return;

    const timer = setInterval(() => {
      setBannerSecondsLeft((prev) => {
        if (prev <= 1) {
          setActiveCheckInGuest(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCheckInGuest]);

  // Rotate Messages Carousel
  useEffect(() => {
    if (!data?.recentMessages || data.recentMessages.length <= 1) return;
    const msgTimer = setInterval(() => {
      setActiveMessageIdx((prev) => (prev + 1) % data.recentMessages.length);
    }, 5000);
    return () => clearInterval(msgTimer);
  }, [data?.recentMessages]);

  // Extract gallery photos for slideshow fallback
  const slideImages = useMemo(() => {
    const list: string[] = [];
    if (data?.wedding?.couplePhoto) list.push(data.wedding.couplePhoto);
    if (data?.wedding?.galleries?.length > 0) {
      list.push(...data.wedding.galleries);
    }
    return Array.from(new Set(list));
  }, [data?.wedding]);

  // Rotate Photo Slideshow every 7 seconds
  useEffect(() => {
    if (slideImages.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideImages.length);
    }, 7000);
    return () => clearInterval(slideTimer);
  }, [slideImages.length]);

  // Save video background
  const handleSaveVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setVideoUrl(videoInputDraft.trim());
    try {
      localStorage.setItem(`hvw_display_video_${weddingSlug}`, videoInputDraft.trim());
    } catch {
      // ignore
    }
    setIsVideoModalOpen(false);
  };

  const handleClearVideo = () => {
    setVideoUrl("");
    setVideoInputDraft("");
    try {
      localStorage.removeItem(`hvw_display_video_${weddingSlug}`);
    } catch {
      // ignore
    }
    setIsVideoModalOpen(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Video embed helpers
  const getEmbedInfo = (url: string) => {
    if (!url) return null;

    if (isYouTubeUrl(url)) {
      const ytId = extractYouTubeId(url);
      if (ytId) {
        return {
          type: "youtube",
          src: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
        };
      }
    }

    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return {
          type: "gdrive",
          src: `https://drive.google.com/file/d/${match[1]}/preview`,
        };
      }
    }

    // Direct MP4 / WebM
    return {
      type: "direct",
      src: url,
    };
  };

  const videoEmbed = getEmbedInfo(videoUrl);
  const messagesList = data?.recentMessages || [];
  const activeMessage =
    messagesList.length > 0
      ? messagesList[activeMessageIdx % messagesList.length]
      : null;

  return (
    <div
      className={`min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden relative ${
        theme.isMono ? "font-mono" : "font-sans"
      }`}
    >
      {/* ───────────────── 1. DYNAMIC BACKGROUND LAYER ───────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {videoEmbed ? (
          videoEmbed.type === "youtube" || videoEmbed.type === "gdrive" ? (
            <div className="w-full h-full overflow-hidden relative">
              <iframe
                src={videoEmbed.src}
                title="Cinematic Prewedding Background"
                className="w-full h-full scale-135 pointer-events-none border-0 absolute inset-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              src={videoEmbed.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center absolute inset-0"
            />
          )
        ) : slideImages.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <motion.img
              key={slideImages[currentSlideIndex]}
              src={slideImages[currentSlideIndex]}
              alt="Galeri Prewedding"
              className="w-full h-full object-cover object-center absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.14 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{
                opacity: { duration: 2, ease: "easeInOut" },
                scale: { duration: 8, ease: "easeOut" },
              }}
            />
          </AnimatePresence>
        ) : (
          /* Dynamic Theme Abstract Canvas */
          <div className={`w-full h-full ${theme.bgGradient}`}>
            <div
              className={`absolute top-1/4 left-1/4 w-96 h-96 ${theme.orb1Color} rounded-full blur-3xl`}
            />
            <div
              className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${theme.orb2Color} rounded-full blur-3xl`}
            />
          </div>
        )}

        {/* Cinematic Vignette Overlay (Ensures ultra-crisp readable text) */}
        <div className={`absolute inset-0 ${theme.vignette} backdrop-blur-[2px]`} />
      </div>

      {/* ───────────────── 2. TOP HEADER ───────────────── */}
      <header className="relative z-20 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl ${theme.headerIconGradient} flex items-center justify-center ${theme.headerIconColor} font-bold shadow-xl border border-white/20`}
          >
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.25em] ${theme.accentText} block`}
            >
              The Official Wedding Reception
            </span>
            <h1
              className={`text-lg sm:text-xl font-bold ${theme.fontTitle} tracking-wide text-white drop-shadow-sm`}
            >
              {data?.wedding?.eventName || "Resepsi & Perayaan Pernikahan"}
            </h1>
            <p className="text-xs text-white/70 tracking-wider uppercase flex items-center gap-2">
              <span>{data?.wedding?.eventVenue || "Grand Ballroom"}</span>
              {data?.wedding?.eventDate && (
                <>
                  <span>&bull;</span>
                  <span>
                    {new Date(data.wedding.eventDate).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Live Clock & Control Actions */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="font-mono text-base sm:text-lg font-bold text-white tracking-widest drop-shadow-sm">
              {currentTime}
            </div>
            <div
              className={`text-[10px] ${theme.livePillBg} font-bold flex items-center justify-end gap-1.5 uppercase tracking-wider`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE RECEPTION MONITOR</span>
            </div>
          </div>

          {/* Video Background Settings Button */}
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Pengaturan Video Sinematik Latar"
          >
            <Video className={`w-4 h-4 ${theme.accentSubText}`} />
            <span className="hidden md:inline">
              {videoUrl ? "Video Aktif" : "Set Video"}
            </span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ───────────────── 3. CENTER DISPLAY AREA ───────────────── */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center my-6 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeCheckInGuest ? (
            /* ───────── A. GRAND WELCOME CHECK-IN SPLASH BANNER (10s) ───────── */
            <motion.div
              key={activeCheckInGuest.id}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`w-full max-w-4xl p-8 sm:p-12 rounded-3xl ${theme.cardBg} border-2 ${theme.cardBorder} shadow-2xl backdrop-blur-xl text-center space-y-6 relative overflow-hidden`}
            >
              {/* Top Dynamic Light Bar */}
              <div className={`absolute top-0 inset-x-0 h-2 ${theme.lightBar}`} />

              {/* Celebration Sparkles Badge */}
              <div
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-xs sm:text-sm font-bold tracking-widest uppercase shadow-lg animate-pulse ${theme.accentBadgeBg}`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Selamat Datang &bull; Tamu Kehormatan</span>
                <Sparkles className="w-4 h-4" />
              </div>

              {/* Guest Name in Grand Typography */}
              <div className="space-y-3">
                <h2
                  className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold ${theme.fontTitle} text-white tracking-tight drop-shadow-xl`}
                >
                  {activeCheckInGuest.name}
                </h2>

                {activeCheckInGuest.address && (
                  <p
                    className={`text-lg sm:text-2xl ${theme.accentSubText} font-medium flex items-center justify-center gap-2`}
                  >
                    <MapPin className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.accentText}`} />
                    <span>{activeCheckInGuest.address}</span>
                  </p>
                )}
              </div>

              {/* Table & Pax Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
                {activeCheckInGuest.category?.toLowerCase().includes("vip") && (
                  <span
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl ${theme.headerIconGradient} ${theme.headerIconColor} font-extrabold text-sm sm:text-base shadow-xl`}
                  >
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>TAMU VIP</span>
                  </span>
                )}

                <span className="px-5 py-2 rounded-2xl bg-white/15 border border-white/25 text-white font-bold text-sm sm:text-base shadow-md">
                  Alokasi:{" "}
                  <strong className={theme.accentSubText}>
                    {activeCheckInGuest.tableNumber || "Meja Resepsi"}
                  </strong>
                </span>

                <span className="px-5 py-2 rounded-2xl bg-white/15 border border-white/25 text-white/90 font-semibold text-sm sm:text-base shadow-md">
                  Presensi: {activeCheckInGuest.checkedInPax || 1} Pax
                </span>
              </div>

              {/* Progress Countdown Ribbon */}
              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-white/50">
                <span>Kembali ke mode stanby dalam</span>
                <span className={`font-mono font-bold ${theme.accentSubText} text-sm`}>
                  {bannerSecondsLeft}s
                </span>
              </div>
            </motion.div>
          ) : (
            /* ───────── B. GRAND CINEMATIC STANDBY MODE ───────── */
            <motion.div
              key="standby"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Couple Monogram & Warm Welcome */}
              <div className="lg:col-span-7 text-left space-y-6">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 ${theme.accentSubText} text-xs font-bold tracking-widest uppercase backdrop-blur-md`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Wedding of</span>
                </div>

                <div className="space-y-3">
                  <h2
                    className={`text-4xl sm:text-6xl font-extrabold ${theme.fontTitle} text-white tracking-tight leading-none drop-shadow-lg`}
                  >
                    {data?.wedding?.groomName || "Adrian"}
                    <span className={`text-3xl sm:text-5xl ${theme.accentText} italic font-light mx-3`}>
                      &amp;
                    </span>
                    {data?.wedding?.brideName || "Nadia"}
                  </h2>
                  <p className="text-sm sm:text-base text-white/75 max-w-lg leading-relaxed italic">
                    &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.&rdquo;
                  </p>
                </div>
              </div>

              {/* Right Column: Live Wishes Slideshow Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div
                  className={`p-6 sm:p-8 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-2xl backdrop-blur-xl text-left space-y-5 max-w-md w-full relative overflow-hidden flex flex-col justify-between min-h-[340px]`}
                >
                  {/* Top Dynamic Light Bar */}
                  <div className={`absolute top-0 inset-x-0 h-1.5 ${theme.lightBar}`} />

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${theme.accentBadgeBg}`}>
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest ${theme.accentSubText} block`}
                        >
                          Buku Doa Tamu
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          Untaian Doa &amp; Harapan
                        </h3>
                      </div>
                    </div>

                    {messagesList.length > 0 && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15">
                        {activeMessageIdx + 1} / {messagesList.length}
                      </span>
                    )}
                  </div>

                  {/* Message Animated Body */}
                  <div className="flex-1 flex flex-col justify-center my-auto min-h-[140px]">
                    <AnimatePresence mode="wait">
                      {activeMessage ? (
                        <motion.div
                          key={activeMessage.id || activeMessageIdx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.5 }}
                          className="space-y-3"
                        >
                          {/* Guest Name & Avatar */}
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full ${theme.avatarGradient} ${theme.avatarTextColor} font-bold text-xs flex items-center justify-center shadow-md`}
                            >
                              {(activeMessage.guestName || "T").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-white truncate">
                                {activeMessage.guestName}
                              </h4>
                              <span className={`text-[10px] ${theme.accentSubText} font-medium block`}>
                                Tamu Undangan
                              </span>
                            </div>
                          </div>

                          {/* Message Quote */}
                          <p
                            className={`text-sm sm:text-base text-slate-200 italic leading-relaxed line-clamp-4 ${theme.subCardBg} p-4 rounded-2xl border`}
                          >
                            &ldquo;{activeMessage.message}&rdquo;
                          </p>
                        </motion.div>
                      ) : (
                        <div className="text-center py-6 space-y-2 text-white/60">
                          <Heart className={`w-8 h-8 mx-auto ${theme.accentText}/60`} />
                          <p className="text-xs italic">
                            Belum ada ucapan doa. Doa dari para tamu undangan akan tampil di sini secara bergantian.
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Progress Bar & Pagination Dots */}
                  {messagesList.length > 1 && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        {messagesList.slice(0, 8).map((_: any, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveMessageIdx(idx)}
                            className={`h-1 rounded-full transition-all cursor-pointer ${
                              idx === activeMessageIdx % Math.min(messagesList.length, 8)
                                ? `w-4 ${theme.accentSubText.replace("text-", "bg-")}`
                                : "w-1.5 bg-white/30 hover:bg-white/60"
                            }`}
                            aria-label={`Doa ke-${idx + 1}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-white/50 italic">
                        Otomatis berganti setiap 5 detik
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ───────────────── 4. BOTTOM FOOTER ───────────────── */}
      <footer className="relative z-20 space-y-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Left: Live Event Rundown & Schedule (Single Row) */}
          <div
            className={`md:col-span-8 ${theme.cardBg} backdrop-blur-md rounded-2xl py-2.5 px-4 border ${theme.cardBorder} flex items-center gap-3 overflow-hidden`}
          >
            <div className="flex items-center gap-2 shrink-0">
              <div className={`p-1.5 rounded-lg ${theme.accentBadgeBg} shrink-0`}>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[10px] uppercase font-extrabold ${theme.accentText} tracking-wider whitespace-nowrap`}
              >
                Rundown Acara:
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs text-white/90 scrollbar-none min-w-0">
              {data?.wedding?.events && data.wedding.events.length > 0 ? (
                data.wedding.events.map((evt: any, i: number) => (
                  <div
                    key={evt.id || i}
                    className={`inline-flex items-center gap-1.5 shrink-0 ${theme.subCardBg} px-2.5 py-1 rounded-xl border text-xs`}
                  >
                    <span className={`font-mono font-bold ${theme.accentSubText}`}>
                      {evt.startTime || "09:00"}
                      {evt.endTime ? ` - ${evt.endTime}` : ""}
                    </span>
                    <span className="text-white font-medium">{evt.title}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-300 italic truncate">
                  Sesi Akad Nikah &amp; Resepsi Pernikahan berlangsung hari ini.
                </span>
              )}
            </div>
          </div>

          {/* Right: Live Arrival Counter */}
          <div
            className={`md:col-span-4 ${theme.cardBg} backdrop-blur-md rounded-2xl py-2.5 px-4 border ${theme.cardBorder} flex items-center justify-between`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white/80">Presensi Tamu Tiba</span>
            </div>
            <div className="flex items-baseline gap-1.5 font-bold">
              <span className={`text-xl sm:text-2xl ${theme.accentSubText}`}>
                {data?.stats?.totalCheckedIn || 0}
              </span>
              <span className="text-xs text-white/50">
                / {data?.stats?.totalGuests || 0} ({data?.stats?.attendanceRate || 0}%)
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ───────────────── 5. VIDEO BACKGROUND CONFIG MODAL ───────────────── */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-lg w-full text-left space-y-5 shadow-2xl text-white`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Video className={`w-5 h-5 ${theme.accentSubText}`} />
                <h3 className="font-bold text-lg text-white">Video Sinematik Layar Sapa</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVideoUrl} className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Masukkan tautan video prewedding dari <strong>YouTube</strong>, <strong>Google Drive</strong>, atau <strong>URL MP4</strong> langsung. Video akan berputar otomatis tanpa memberatkan server.
              </p>

              <div>
                <label className="font-semibold text-slate-200 block mb-1.5">
                  Tautan Video (YouTube / Google Drive / MP4):
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... atau Google Drive URL"
                  value={videoInputDraft}
                  onChange={(e) => setVideoInputDraft(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#c9a84c] text-xs font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1 text-[11px] text-slate-400">
                <p>&bull; <strong>YouTube</strong>: Mendukung format link biasa, shorts, atau live.</p>
                <p>&bull; <strong>Google Drive</strong>: Pastikan link diset ke <em>Siapa saja yang memiliki link dapat melihat</em>.</p>
                <p>&bull; <strong>Kosongkan</strong>: Jika kosong, layar otomatis menggunakan <em>Slideshow Foto Galeri</em>.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {videoUrl && (
                  <button
                    type="button"
                    onClick={handleClearVideo}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold cursor-pointer"
                  >
                    Hapus Video
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl ${theme.btnAction} font-bold cursor-pointer shadow-md`}
                >
                  Terapkan Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

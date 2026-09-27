"use client";

import { useEffect, useState, useRef, use, useCallback } from "react";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  RefreshCw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  Users,
  MapPin,
  Sparkles,
  ArrowLeft,
  X,
  Search,
  Check,
  Zap,
  UserPlus,
  Clock,
  Loader2,
  Phone,
  UserCheck,
} from "lucide-react";
import { OnTheSpotGuestModal } from "@/components/dashboard/OnTheSpotGuestModal";

function HighlightMatch({ text, tokens }: { text?: string | null; tokens?: string[] }) {
  if (!text) return null;
  if (!tokens || tokens.length === 0) return <>{text}</>;

  const validTokens = tokens
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (validTokens.length === 0) return <>{text}</>;

  const regex = new RegExp(`(${validTokens.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-emerald-400/30 text-emerald-300 font-semibold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function ReceptionQRScannerPage({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}) {
  const { weddingSlug } = use(params);

  // Wedding & Counter State
  const [weddingData, setWeddingData] = useState<{
    id: string;
    coupleTitle: string;
    checkedInCount: number;
    totalGuests: number;
  } | null>(null);

  // Camera & Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Scanned Guest & Welcome State
  const [scannedGuest, setScannedGuest] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [autoDismissTimer, setAutoDismissTimer] = useState<number>(3);

  // Manual Input State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualQuery, setManualQuery] = useState("");
  const [manualSearchResults, setManualSearchResults] = useState<any[]>([]);
  const [isSearchingManual, setIsSearchingManual] = useState(false);

  // On The Spot Modal State
  const [isOnTheSpotModalOpen, setIsOnTheSpotModalOpen] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);
  const autoDismissIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scannerContainerId = "fullscreen-qr-scanner-region";

  // Audio & Haptic Feedback
  const playSuccessChime = useCallback(() => {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch {
      // Audio autoplay restrictions or not supported
    }

    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch {
      // Haptics not supported
    }
  }, [isSoundEnabled]);

  // Fetch wedding info & live check-in stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/wedding/${weddingSlug}/guestbook/recent`);
      if (res.ok) {
        const json = await res.json();
        const couple = json.wedding?.couple;
        const coupleTitle = couple
          ? `${couple.groomNickname || couple.groomName} & ${couple.brideNickname || couple.brideName}`
          : json.wedding?.name || "Pernikahan";

        setWeddingData({
          id: json.wedding?.id || weddingSlug,
          coupleTitle,
          checkedInCount: json.stats?.totalCheckedIn ?? json.recentCheckedIn?.length ?? 0,
          totalGuests: json.stats?.totalGuests ?? (json.wedding?._count?.guests ?? 0) ?? 0,
        });
      }
    } catch {
      // ignore
    }
  }, [weddingSlug]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Fullscreen Handler with cross-browser support
  const toggleFullscreen = async () => {
    try {
      const doc = document as any;
      const el = document.documentElement as any;
      const isFs = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isFs) {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
          await el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
          await el.msRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (e) {
      console.warn("Fullscreen toggle error:", e);
    }
  };

  // Synchronize fullscreen state & ensure camera video doesn't pause
  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as any;
      const isFs = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFs);

      // Ensure video element remains playing
      const container = document.getElementById(scannerContainerId);
      const video = container?.querySelector("video");
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    document.addEventListener("mozfullscreenchange", handleFsChange);
    document.addEventListener("MSFullscreenChange", handleFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
      document.removeEventListener("mozfullscreenchange", handleFsChange);
      document.removeEventListener("MSFullscreenChange", handleFsChange);
    };
  }, []);

  // Debounced smart search for manual modal input
  useEffect(() => {
    if (!isManualModalOpen) return;

    const query = manualQuery.trim();
    const timer = setTimeout(async () => {
      setIsSearchingManual(true);
      try {
        const targetId = weddingData?.id || weddingSlug;
        const res = await fetch(`/api/wedding/${targetId}/checkin?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setManualSearchResults(data.guests || []);
        }
      } catch {
        // ignore
      } finally {
        setIsSearchingManual(false);
      }
    }, query ? 120 : 0);

    return () => clearTimeout(timer);
  }, [manualQuery, isManualModalOpen, weddingData?.id, weddingSlug]);

  // Start Camera Scanner
  const startCamera = useCallback(async (facing: "environment" | "user") => {
    setCameraError(null);
    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: facing },
        {
          fps: 15,
        },
        (decodedText) => {
          if (!isProcessingRef.current) {
            handleScanSuccess(decodedText);
          }
        },
        () => {}
      );

      setIsScanning(true);

      // Check for torch capability
      try {
        const track = (html5QrCode as any).videoTrack;
        if (track && track.getCapabilities) {
          const caps = track.getCapabilities();
          setHasTorch(Boolean(caps?.torch));
        }
      } catch {}
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        err?.message || "Tidak dapat mengakses kamera. Pastikan izin kamera aktif pada browser Anda."
      );
      setIsScanning(false);
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
      setIsScanning(false);
    }
  }, []);

  // Initialize camera on mount & restart when facing mode changes
  useEffect(() => {
    startCamera(cameraFacing);
    return () => {
      stopCamera();
    };
  }, [cameraFacing, startCamera, stopCamera]);

  // Switch Camera Front / Back
  const toggleCameraFacing = async () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
  };

  // Toggle Torch
  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorch) return;
    try {
      const nextTorch = !torchOn;
      await (scannerRef.current as any).applyVideoConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.error("Torch error:", err);
    }
  };

  // Process Check-in
  const handleScanSuccess = async (tokenOrSlug: string) => {
    if (isProcessingRef.current || !tokenOrSlug.trim()) return;
    isProcessingRef.current = true;
    setLoading(true);
    setErrorMessage(null);

    playSuccessChime();

    try {
      const targetId = weddingData?.id || weddingSlug;
      const res = await fetch(`/api/wedding/${targetId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrCode: tokenOrSlug.trim(),
          checkedInPax: 1,
          souvenirTaken: true,
          giftType: "none",
        }),
      });

      const json = await res.json();
      setLoading(false);

      if (!res.ok || !json.success) {
        setErrorMessage(json.error || "Data tiket QR tidak ditemukan.");
        setTimeout(() => {
          setErrorMessage(null);
          isProcessingRef.current = false;
        }, 2500);
        return;
      }

      // Check-in success! Show welcome card & trigger countdown
      setScannedGuest(json.guest);
      fetchStats();

      // Start countdown auto-dismiss (3 seconds)
      setAutoDismissTimer(3);
      if (autoDismissIntervalRef.current) clearInterval(autoDismissIntervalRef.current);

      autoDismissIntervalRef.current = setInterval(() => {
        setAutoDismissTimer((prev) => {
          if (prev <= 1) {
            dismissGuestWelcome();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setLoading(false);
      setErrorMessage("Koneksi internet bermasalah saat check-in.");
      setTimeout(() => {
        setErrorMessage(null);
        isProcessingRef.current = false;
      }, 2500);
    }
  };

  // Dismiss guest welcome modal & immediately resume scanning
  const dismissGuestWelcome = () => {
    if (autoDismissIntervalRef.current) clearInterval(autoDismissIntervalRef.current);
    setScannedGuest(null);
    setErrorMessage(null);
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 400);
  };

  // Quick Pax Update directly from welcome card
  const handleUpdatePax = async (delta: number) => {
    if (!scannedGuest) return;
    const currentPax = scannedGuest.checkedInPax || scannedGuest.guestCount || 1;
    const nextPax = Math.max(1, currentPax + delta);

    try {
      const targetId = weddingData?.id || weddingSlug;
      const res = await fetch(`/api/wedding/${targetId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: scannedGuest.id,
          checkedInPax: nextPax,
          souvenirTaken: scannedGuest.souvenirTaken !== undefined ? scannedGuest.souvenirTaken : true,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setScannedGuest(json.guest);
      }
    } catch {}
  };

  // Quick Souvenir Toggle
  const handleToggleSouvenir = async () => {
    if (!scannedGuest) return;
    const nextSouvenir = !scannedGuest.souvenirTaken;

    try {
      const targetId = weddingData?.id || weddingSlug;
      const res = await fetch(`/api/wedding/${targetId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: scannedGuest.id,
          souvenirTaken: nextSouvenir,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setScannedGuest(json.guest);
      }
    } catch {}
  };

  // Handle Instant Check-in for a Specific Guest from Search
  const handleCheckInGuestFromSearch = async (guest: any, customPax?: number) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setLoading(true);
    setErrorMessage(null);

    playSuccessChime();

    try {
      const targetId = weddingData?.id || weddingSlug;
      const res = await fetch(`/api/wedding/${targetId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guest.id,
          checkedInPax: customPax || guest.guestCount || 1,
          souvenirTaken: true,
          giftType: "none",
        }),
      });

      const json = await res.json();
      setLoading(false);

      if (res.ok && json.success) {
        setIsManualModalOpen(false);
        setManualQuery("");
        setManualSearchResults([]);
        setScannedGuest(json.guest);
        fetchStats();

        // Start countdown auto-dismiss (3 seconds)
        setAutoDismissTimer(3);
        if (autoDismissIntervalRef.current) clearInterval(autoDismissIntervalRef.current);
        autoDismissIntervalRef.current = setInterval(() => {
          setAutoDismissTimer((prev) => {
            if (prev <= 1) {
              dismissGuestWelcome();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrorMessage(json.error || "Gagal check-in tamu.");
        setTimeout(() => {
          setErrorMessage(null);
          isProcessingRef.current = false;
        }, 2500);
      }
    } catch {
      setLoading(false);
      setErrorMessage("Koneksi bermasalah saat check-in.");
      setTimeout(() => {
        setErrorMessage(null);
        isProcessingRef.current = false;
      }, 2500);
    }
  };

  // Handle Manual Form Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    // Smart auto-select top match if available
    if (manualSearchResults.length > 0) {
      await handleCheckInGuestFromSearch(manualSearchResults[0]);
      return;
    }

    setIsManualModalOpen(false);
    await handleScanSuccess(manualQuery);
    setManualQuery("");
  };

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-[#07090e] text-white flex flex-col overflow-hidden select-none touch-none">
      {/* ── TOP NAV & CONTROLS BAR ── */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-3 z-30 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/guestbook"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white truncate tracking-wide">
              {weddingData?.coupleTitle || "Pemindai QR Resepsi"}
            </h1>
            <p className="text-[10px] sm:text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kiosk Scanner Aktif</span>
            </p>
          </div>
        </div>

        {/* Right Tools: Flip Camera, Mute, Fullscreen */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Flip Camera Button */}
          <button
            type="button"
            onClick={toggleCameraFacing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-semibold transition-all cursor-pointer"
            title="Ganti Kamera Depan / Belakang"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">
              {cameraFacing === "environment" ? "Kamera Belakang" : "Kamera Depan"}
            </span>
          </button>

          {/* Torch Button (if available) */}
          {hasTorch && (
            <button
              type="button"
              onClick={toggleTorch}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                torchOn
                  ? "bg-amber-400 text-slate-950 font-bold"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title="Lampu Kilat / Flashlight"
            >
              <Zap className="w-4 h-4" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            title={isSoundEnabled ? "Suara Beep Aktif" : "Suara Beep Senyap"}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-300" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── CAMERA REGION & SCANNER FRAME ── */}
      <main className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {/* Camera Viewport Mount */}
        <div
          id={scannerContainerId}
          className="absolute inset-0 w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_#qr-shaded-region]:!hidden [&_canvas]:!hidden"
        />

        {/* Camera Fallback / Error Alert */}
        {cameraError && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Akses Kamera Terhalang</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {cameraError}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startCamera(cameraFacing)}
                className="px-4 py-2.5 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Coba Nyalakan Lagi
              </button>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Input Manual
              </button>
            </div>
          </div>
        )}

        {/* Global style to completely hide html5-qrcode internal shaded boxes and white borders */}
        <style jsx global>{`
          #fullscreen-qr-scanner-region #qr-shaded-region,
          #fullscreen-qr-scanner-region > div:not(video):not([class*="custom"]),
          #qr-shaded-region {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `}</style>

        {/* Cinematic Scanner Target Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 p-6">
          {/* Scanning Box */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-white/20 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-emerald-950/5">
            {/* Glowing Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />

            {/* Sweeping Animated Laser Beam */}
            <motion.div
              animate={{ top: ["2%", "96%", "2%"] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_#34d399]"
            >
              <div className="w-full h-full bg-emerald-300 blur-[1px]" />
            </motion.div>
          </div>

          {/* Scanning Prompt Text */}
          <p className="mt-6 text-xs sm:text-sm font-medium text-white/90 bg-black/60 backdrop-blur-md py-1.5 px-4 rounded-full border border-white/15 tracking-wide">
            Arahkan kamera ke QR Code Tiket E-Pass Tamu
          </p>
        </div>

        {/* Error Notification Toast */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-4 right-4 z-40 max-w-sm mx-auto bg-rose-600/90 backdrop-blur-md text-white text-xs font-semibold py-3 px-4 rounded-2xl shadow-2xl border border-rose-400/50 flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── VERIFIED GUEST CELEBRATION SHEET / MODAL ── */}
        <AnimatePresence>
          {scannedGuest && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute inset-x-4 bottom-6 sm:bottom-10 max-w-md mx-auto z-40 bg-slate-900/95 backdrop-blur-xl border-2 border-emerald-500/80 rounded-3xl p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.9)] text-white space-y-4"
            >
              {/* Top Badge & Timer */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                      CHECK-IN BERHASIL ✓
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Tamu resmi tercatat hadir
                    </span>
                  </div>
                </div>

                {/* Auto Dismiss Countdown */}
                <button
                  type="button"
                  onClick={dismissGuestWelcome}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-mono text-emerald-300 border border-emerald-400/30 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Tutup & Pindai Selanjutnya"
                >
                  <span>Lanjut ({autoDismissTimer}s)</span>
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              {/* Guest Identity Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide leading-tight">
                    {scannedGuest.name}
                  </h2>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold border ${
                      scannedGuest.category?.toLowerCase().includes("vip")
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/50"
                        : "bg-white/10 text-white/90 border-white/20"
                    }`}
                  >
                    {scannedGuest.category || "Reguler"}
                  </span>
                </div>

                {scannedGuest.address && (
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Domisili: {scannedGuest.address}</span>
                  </p>
                )}
              </div>

              {/* Grid: Table & Real Pax Quick Adjust */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Table Number */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                    Nomor Meja
                  </span>
                  <span className="text-base font-bold text-amber-300 font-mono mt-0.5 block">
                    {scannedGuest.tableNumber || "Bebas"}
                  </span>
                </div>

                {/* Pax Stepper */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                      Jumlah Pax
                    </span>
                    <span className="text-base font-bold text-white font-mono mt-0.5 block">
                      {scannedGuest.checkedInPax || scannedGuest.guestCount || 1} Org
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdatePax(-1)}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                      title="Kurangi Pax"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdatePax(1)}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                      title="Tambah Pax"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Souvenir Taken Quick Toggle */}
              <button
                type="button"
                onClick={handleToggleSouvenir}
                className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                  scannedGuest.souvenirTaken
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    : "bg-white/5 border-white/15 text-slate-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">🎁</span>
                  <span>Souvenir Pernikahan</span>
                </span>
                <span className="font-bold text-[11px] uppercase tracking-wider font-mono">
                  {scannedGuest.souvenirTaken ? "Sudah Diambil ✓" : "Belum Diambil"}
                </span>
              </button>

              {/* Instant Next Scan CTA */}
              <button
                type="button"
                onClick={dismissGuestWelcome}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Pindai Tamu Berikutnya</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── BOTTOM DOCK CONTROLS ── */}
      <footer className="h-16 px-3 sm:px-6 bg-slate-900/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-2 z-30 shrink-0">
        {/* Attendance Counter */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono text-slate-300 shrink-0">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>
            <strong className="text-emerald-400 text-sm">{weddingData?.checkedInCount ?? 0}</strong> Hadir
          </span>
          {Boolean(weddingData?.totalGuests) && (
            <span className="text-slate-500 hidden sm:inline">/ {weddingData?.totalGuests} Undangan</span>
          )}
        </div>

        {/* Action Buttons: Tambah Tamu OTS & Input Manual */}
        <div className="flex items-center gap-2">
          {/* Button: Tambah Tamu On the Spot */}
          <button
            type="button"
            onClick={() => setIsOnTheSpotModalOpen(true)}
            className="flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-emerald-950/40 shrink-0"
            title="Tambah Tamu Hadir Tanpa Undangan Sebelumnya"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#fef08a]" />
            <span>Tamu On the Spot</span>
          </button>

          {/* Button: Input Manual / Cari */}
          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs transition-all cursor-pointer border border-white/10 shrink-0"
            title="Cari Nama Tamu atau Input Token Manual"
          >
            <Keyboard className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Input Manual / Cari</span>
            <span className="sm:hidden">Cari</span>
          </button>
        </div>
      </footer>

      {/* ── ON THE SPOT GUEST MODAL ── */}
      <OnTheSpotGuestModal
        isOpen={isOnTheSpotModalOpen}
        onClose={() => setIsOnTheSpotModalOpen(false)}
        weddingId={weddingData?.id || weddingSlug}
        initialName={manualQuery}
        onSuccess={(newGuest) => {
          fetchStats();
          if (newGuest) {
            playSuccessChime();
            setScannedGuest(newGuest);
            setAutoDismissTimer(4);
            if (autoDismissIntervalRef.current) clearInterval(autoDismissIntervalRef.current);
            autoDismissIntervalRef.current = setInterval(() => {
              setAutoDismissTimer((prev) => {
                if (prev <= 1) {
                  dismissGuestWelcome();
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }
        }}
      />

      {/* ── MANUAL INPUT DRAWER / MODAL ── */}
      <AnimatePresence>
        {isManualModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => {
              setIsManualModalOpen(false);
              setManualQuery("");
              setManualSearchResults([]);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4 max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-amber-300">
                  <Keyboard className="w-5 h-5" />
                  <h3 className="font-bold text-base text-white">Pencarian Pintar & Check-in Manual</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsManualModalOpen(false);
                    setManualQuery("");
                    setManualSearchResults([]);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Smart Search Form */}
              <form onSubmit={handleManualSubmit} className="space-y-3 flex-1 flex flex-col min-h-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualQuery}
                    onChange={(e) => setManualQuery(e.target.value)}
                    placeholder="Ketik nama (bebas ejaan / gelar), meja, no. HP..."
                    autoFocus
                    className="w-full pl-10 pr-16 py-3 bg-white/5 border border-white/20 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder:text-slate-500 font-sans"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {manualQuery && (
                      <button
                        type="button"
                        onClick={() => setManualQuery("")}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                        title="Hapus pencarian"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isSearchingManual && (
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    )}
                  </div>
                </div>

                {/* Smart Features Hint */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-white/5 py-1.5 px-3 rounded-xl border border-white/5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="leading-tight">
                    Toleran salah ketik (typo), gelar (Bpk/Ibu/dr), urutan kata terbalik, atau nomor meja.
                  </span>
                </div>

                {/* Live Search Matching Guests List */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-64 sm:max-h-72">
                  {manualSearchResults.length > 0 && (
                    <>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider uppercase px-1">
                        <span>
                          {manualQuery.trim()
                            ? `Hasil Pencarian (${manualSearchResults.length})`
                            : `Daftar Tamu Tersedia (${manualSearchResults.length})`}
                        </span>
                        {manualQuery.trim() && (
                          <span className="text-[10px] text-emerald-400 lowercase font-normal">
                            Tekan Enter untuk check-in teratas
                          </span>
                        )}
                      </div>

                      {manualSearchResults.map((g, idx) => (
                        <div
                          key={g.id}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            idx === 0 && manualQuery.trim()
                              ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                              : "bg-white/5 hover:bg-white/10 border-white/10"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-sm text-white truncate">
                                <HighlightMatch
                                  text={g.name}
                                  tokens={g.matchedTokens && g.matchedTokens.length > 0 ? g.matchedTokens : [manualQuery]}
                                />
                              </span>

                              {/* Smart Match Reason Badge */}
                              {g.matchReason && manualQuery.trim() && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold border ${
                                    g.matchReason.includes("Mirip") || g.matchReason.includes("Ejaan")
                                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                      : g.matchReason.includes("Persis")
                                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                      : g.matchReason.includes("Meja")
                                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                                      : g.matchReason.includes("Telepon")
                                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                      : "bg-white/10 text-slate-300 border-white/10"
                                  }`}
                                >
                                  {g.matchReason}
                                </span>
                              )}

                              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono bg-white/10 text-slate-300">
                                {g.category || "Reguler"}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-400 flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                              {g.tableNumber && (
                                <span className="text-cyan-300 font-medium">Meja {g.tableNumber}</span>
                              )}
                              {g.address && (
                                <span className="truncate max-w-[140px] sm:max-w-[180px]">{g.address}</span>
                              )}
                              {g.phone && (
                                <span className="font-mono text-[10px] text-slate-400">{g.phone}</span>
                              )}
                              <span>{g.guestCount || 1} Pax</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="shrink-0 flex items-center">
                            {g.checkedIn ? (
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5" />
                                <span>Hadir</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleCheckInGuestFromSearch(g)}
                                className="text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 px-3.5 py-2 rounded-xl shrink-0 transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Check-in</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Not found state with button to add on the spot */}
                  {manualQuery.trim().length >= 2 && manualSearchResults.length === 0 && !isSearchingManual && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3 my-2">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Tamu &quot;<span className="text-white font-semibold">{manualQuery}</span>&quot; tidak ditemukan dalam daftar undangan.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsManualModalOpen(false);
                          setIsOnTheSpotModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-emerald-950/50"
                      >
                        <UserPlus className="w-4 h-4 text-[#fef08a]" />
                        <span>+ Daftarkan Tamu On-the-Spot</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsManualModalOpen(false);
                      setManualQuery("");
                      setManualSearchResults([]);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={!manualQuery.trim() || loading}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? "Memproses..." : "Check-in (Enter)"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

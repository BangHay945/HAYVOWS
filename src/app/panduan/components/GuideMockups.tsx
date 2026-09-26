"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  QrCode,
  Tv,
  MessageCircle,
  Gamepad2,
  Gift,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Users,
  Send,
  Play,
  RotateCcw,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   0. PARALLAX MOCKUP WRAPPER (DESKTOP PARALLAX & MOBILE NATIVE)
───────────────────────────────────────────────────────────── */
export function ParallaxMockupWrapper({
  children,
  badgeText,
}: {
  children: React.ReactNode;
  badgeText?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkMedia = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkMedia();
    window.addEventListener("resize", checkMedia);
    return () => window.removeEventListener("resize", checkMedia);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth desktop parallax spring translation
  const smoothY = useSpring(
    useTransform(scrollYProgress, [0, 1], [-28, 28]),
    { stiffness: 100, damping: 24, mass: 0.6 }
  );

  const smoothRotate = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [-0.8, 0, 0.8]),
    { stiffness: 100, damping: 24 }
  );

  // Secondary floating depth badge floating in reverse
  const badgeY = useSpring(
    useTransform(scrollYProgress, [0, 1], [22, -22]),
    { stiffness: 90, damping: 20 }
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Decorative desktop parallax floating depth badge */}
      {badgeText && isDesktop && (
        <motion.div
          style={{ y: badgeY }}
          className="hidden lg:flex absolute -top-4 -right-2 z-20 items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-emerald-400/50 text-[10px] font-mono font-bold text-emerald-300 shadow-xl pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{badgeText}</span>
        </motion.div>
      )}

      {/* Main Parallax Motion Card on Desktop */}
      <motion.div
        style={{
          y: isDesktop ? smoothY : 0,
          rotateZ: isDesktop ? smoothRotate : 0,
        }}
        whileHover={isDesktop ? { scale: 1.015, transition: { duration: 0.25 } } : undefined}
        className="w-full transition-shadow duration-300"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   1. EKOSISTEM WORKFLOW BANNER (INFOGRAFIS ALUR RESEPSI PINTAR)
───────────────────────────────────────────────────────────── */
export function EkosistemWorkflowBanner() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const stages = [
    {
      step: "01",
      shortLabel: "Cetak & QR",
      title: "Desain & Cetak Fisik",
      subtitle: "Undangan Kertas + Stiker QR",
      desc: "Unduh file stiker QR 300 DPI dari dashboard untuk ditempel di amplop fisik percetakan Anda.",
      badge: "Format 300 DPI",
      icon: Printer,
      color: "from-amber-500/20 to-orange-500/10 border-amber-300/60 text-amber-800",
      activeBorder: "border-amber-500 ring-2 ring-amber-400/30",
    },
    {
      step: "02",
      shortLabel: "Sebar WA",
      title: "Distribusi WhatsApp",
      subtitle: "Kirim Personal 1-Klik",
      desc: "Sebarkan tautan personal ke WhatsApp kerabat. Nama tamu langsung tertera di sampul & tiket QR.",
      badge: "Unlimited Tamu",
      icon: MessageCircle,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-300/60 text-emerald-800",
      activeBorder: "border-emerald-500 ring-2 ring-emerald-400/30",
    },
    {
      step: "03",
      shortLabel: "Meja Resepsi",
      title: "Meja Resepsi Hari H",
      subtitle: "Scan Kamera HP 1 Detik",
      desc: "Panitia memindai tiket QR di ponsel tamu. Bebas antrean tanpa perlu download aplikasi.",
      badge: "1 Detik Scan",
      icon: QrCode,
      color: "from-blue-500/20 to-indigo-500/10 border-blue-300/60 text-blue-800",
      activeBorder: "border-blue-500 ring-2 ring-blue-400/30",
    },
    {
      step: "04",
      shortLabel: "Layar TV",
      title: "Layar TV & Katering",
      subtitle: "Sambutan Otomatis di Gedung",
      desc: "Nama tamu langsung disambut di layar TV gedung resepsi, dan porsi konsumsi katering terhitung presisi.",
      badge: "Live 3 Detik",
      icon: Tv,
      color: "from-purple-500/20 to-pink-500/10 border-purple-300/60 text-purple-800",
      activeBorder: "border-purple-500 ring-2 ring-purple-400/30",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#1a2d25] to-slate-950 rounded-3xl p-4 sm:p-6 lg:p-8 text-white border border-emerald-500/30 shadow-xl overflow-hidden relative">
      <div className="relative z-10 space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[#fef08a] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Peta Alur Kerja Ekosistem Resepsi Pintar</span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
              Bagaimana Seluruh Fitur Hayvows Saling Terhubung?
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Dari persiapan undangan fisik &amp; digital hingga penyambutan tamu di gedung resepsi, semua tersambung dalam satu database terpadu.
            </p>
          </div>

          <div className="text-[10px] sm:text-[11px] font-mono text-emerald-300/90 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Alur Otomatis Real-time</span>
          </div>
        </div>

        {/* Mobile View: Quick Step Pills Selector (Snappy, Compact & No Vertical Clutter) */}
        <div className="flex sm:hidden overflow-x-auto gap-2 pb-1 no-scrollbar">
          {stages.map((stg, i) => {
            const isSelected = activeStep === i;
            return (
              <button
                key={stg.step}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                    : "bg-white/10 text-slate-300 border border-white/10"
                }`}
              >
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/20">
                  {stg.step}
                </span>
                <span>{stg.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop View: 4 Connected Stages Side-by-Side */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stg, i) => {
            const Icon = stg.icon;
            const isSelected = activeStep === i;
            return (
              <button
                key={stg.step}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`text-left p-4 rounded-2xl transition-all cursor-pointer bg-white/5 hover:bg-white/10 border ${
                  isSelected ? stg.activeBorder + " bg-white/10 scale-[1.02]" : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono font-bold text-xs">
                    {stg.step}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/15">
                    {stg.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h3 className="font-bold text-white text-xs sm:text-sm">{stg.title}</h3>
                </div>

                <p className="text-[11px] font-semibold text-emerald-300/90 mb-1.5">{stg.subtitle}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{stg.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Active Stage Highlight Banner */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <p className="text-slate-200 text-xs leading-relaxed">
              <strong className="text-white">Tahap {stages[activeStep].step} ({stages[activeStep].title}):</strong>{" "}
              {stages[activeStep].desc}
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#fef08a] shrink-0 font-mono hidden sm:inline">
            &larr; Klik tiap kartu di atas untuk melihat detail
          </span>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. SIMULASI MOCKUP: BUKU TAMU DIGITAL & TIKET QR
───────────────────────────────────────────────────────────── */
export function QrScannerSimulation() {
  const [isScanned, setIsScanned] = useState(false);
  const [mode, setMode] = useState<"camera" | "search">("camera");
  const [searchName, setSearchName] = useState("");

  const handleScan = () => {
    setIsScanned(true);
  };

  const handleReset = () => {
    setIsScanned(false);
    setSearchName("");
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 text-white border-2 border-emerald-500/50 shadow-2xl space-y-3.5 sm:space-y-4 overflow-hidden relative">
      {/* Top Phone Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">Scanner Meja Resepsi (Browser HP)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400">Siap Scan</span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
        <button
          type="button"
          onClick={() => {
            setMode("camera");
            setIsScanned(false);
          }}
          className={`py-2 rounded-lg font-bold transition-all text-center cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 ${
            mode === "camera"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>📷 Kamera Scan</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("search");
            setIsScanned(false);
          }}
          className={`py-2 rounded-lg font-bold transition-all text-center cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 ${
            mode === "search"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>🔍 Cari Nama</span>
        </button>
      </div>

      {/* Main Viewport */}
      {mode === "camera" ? (
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-white/15 min-h-[240px] sm:min-h-[270px] flex flex-col items-center justify-center p-3 sm:p-4">
          {!isScanned ? (
            <>
              {/* Viewfinder Reticle */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border-2 border-dashed border-emerald-400/70 flex flex-col items-center justify-center p-3 bg-emerald-500/5">
                {/* Laser scan line animation */}
                <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse top-1/2 -translate-y-1/2" />
                
                <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-300/70 mb-1.5" />
                <span className="text-[10px] font-mono text-emerald-300 text-center">
                  Arahkan ke QR Tamu
                </span>
              </div>

              <p className="text-[11px] text-slate-400 text-center mt-2.5">
                Membaca barcode tamu dalam <strong>1 detik</strong> tanpa aplikasi
              </p>

              <button
                type="button"
                onClick={handleScan}
                className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Simulasikan Scan Tiket Tamu</span>
              </button>
            </>
          ) : (
            /* Result Card */
            <div className="w-full bg-emerald-950/80 border border-emerald-500/80 rounded-2xl p-4 text-center space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                  ✓ Check-in Berhasil (1 Detik)
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-white mt-1">Budi Santoso &amp; Rekan</h4>
                <p className="text-[11px] text-emerald-200/80">Kategori: Tamu VIP Keluarga</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/40 p-2 sm:p-2.5 rounded-xl border border-white/10 text-left">
                <div>
                  <span className="text-slate-400 block text-[10px]">Rombongan:</span>
                  <span className="font-bold text-emerald-300">2 Orang (Pax)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Souvenir:</span>
                  <span className="font-bold text-[#fef08a]">1 Paket Diambil</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan Tamu Selanjutnya</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Manual Search Mode */
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-white/15 p-3.5 sm:p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Ketik nama (contoh: 'Hendra')..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
              <div className="truncate">
                <p className="font-bold text-white truncate">dr. Hendra Wijaya, Sp.A</p>
                <p className="text-[10px] text-slate-400">Undangan Fisik &bull; 2 Pax</p>
              </div>
              <button
                type="button"
                onClick={() => setIsScanned(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all cursor-pointer shrink-0"
              >
                Check-in
              </button>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
              <div className="truncate">
                <p className="font-bold text-white truncate">Hendra Setiawan &amp; Istri</p>
                <p className="text-[10px] text-slate-400">Rekan Kantor &bull; 2 Pax</p>
              </div>
              <button
                type="button"
                onClick={() => setIsScanned(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all cursor-pointer shrink-0"
              >
                Check-in
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            Solusi cepat jika tamu lupa membawa smartphone atau tiket tertinggal.
          </p>
        </div>
      )}

      {/* Footer Info Bar */}
      <div className="text-[10px] sm:text-[11px] text-slate-400 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
        <span>Bisa dibuka di 5 HP panitia sekaligus</span>
        <span className="text-emerald-400 font-bold">Sinkron Real-time</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. SIMULASI MOCKUP: LAYAR SAPA TV / VIDEOTRON GEDUNG
───────────────────────────────────────────────────────────── */
export function TvDisplaySimulation() {
  const [selectedGuest, setSelectedGuest] = useState(0);

  const guestSamples = [
    { name: "Bapak Budi Santoso & Keluarga", note: "Keluarga Besar Mempelai Pria", time: "Baru Saja Check-in" },
    { name: "dr. Hendra Wijaya & Pasangan", note: "Rekan Dokter Spesialis", time: "1 Menit Lalu" },
    { name: "Ibu Siti Rahmawati, S.E.", note: "Sahabat Kuliah Mempelai Wanita", time: "2 Menit Lalu" },
  ];

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 text-white border-2 border-indigo-500/50 shadow-2xl space-y-3.5 sm:space-y-4 overflow-hidden relative">
      {/* Top TV Frame Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Tv className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">Layar TV Gedung (Kabel HDMI)</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE DISPLAY</span>
        </div>
      </div>

      {/* Smart TV Bezel & Screen */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-950 via-[#161d42] to-slate-950 border-4 border-slate-700 shadow-inner aspect-[16/9] min-h-[190px] sm:min-h-[220px] flex flex-col justify-between p-3.5 sm:p-5 text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

        {/* Screen Top Bar */}
        <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-mono">
          <span>THE WEDDING OF DIMAS &amp; ANINDYA</span>
          <span className="text-indigo-300">Minggu, 25 Okt 2026</span>
        </div>

        {/* Screen Dynamic Greeting Message */}
        <div className="relative z-10 space-y-1.5 my-auto animate-in fade-in duration-300">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-[9px] sm:text-[11px] font-bold tracking-wider uppercase">
            Selamat Datang di Resepsi Pernikahan
          </div>
          <h3 className="text-sm sm:text-xl font-extrabold text-[#fef08a] drop-shadow-md">
            {guestSamples[selectedGuest].name}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            {guestSamples[selectedGuest].note} &bull; Merupakan kebahagiaan atas kehadiran Anda.
          </p>
        </div>

        {/* Screen Bottom Bar */}
        <div className="relative z-10 flex items-center justify-between text-[8px] sm:text-[9px] text-slate-400 border-t border-white/10 pt-1.5">
          <span>Gedung Sasana Kriya Ballroom</span>
          <span className="text-emerald-400 font-bold">Otomatis Update Tiap Tamu Scan</span>
        </div>
      </div>

      {/* TV Stand Visual Base */}
      <div className="w-16 sm:w-20 h-1.5 sm:h-2 bg-slate-700 rounded-full mx-auto -mt-2 shadow-md" />

      {/* Interactive Controller */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] text-slate-400 block font-medium">
          Uji Coba Ganti Sapaan Tamu di Layar TV:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {guestSamples.map((g, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedGuest(idx)}
              className={`p-2 rounded-xl text-[10px] font-bold text-left transition-all border cursor-pointer ${
                selectedGuest === idx
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-xs"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <span className="block truncate">{g.name}</span>
              <span className="text-[9px] text-slate-400 block font-normal">{g.time}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Connection Info */}
      <div className="text-[10px] sm:text-[11px] text-slate-400 bg-white/5 p-2 sm:p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Laptop className="w-3.5 h-3.5 text-indigo-400" />
          <span>Laptop Resepsionis</span>
        </span>
        <span className="text-indigo-300 font-mono text-[9px] sm:text-[10px]">── HDMI ──&gt;</span>
        <span className="flex items-center gap-1">
          <Monitor className="w-3.5 h-3.5 text-indigo-400" />
          <span>TV / Videotron</span>
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. SIMULASI MOCKUP: FORMAT WHATSAPP GENERATOR 1-KLIK
───────────────────────────────────────────────────────────── */
export function WhatsAppChatSimulation() {
  const [guestName, setGuestName] = useState("Budi Santoso");

  const nameOptions = ["Budi Santoso", "dr. Hendra Wijaya", "Siti Rahmawati", "Keluarga Om Joko"];

  return (
    <div className="bg-[#0b141a] rounded-3xl p-4 sm:p-6 text-white border-2 border-emerald-600/50 shadow-2xl space-y-3.5 sm:space-y-4 overflow-hidden relative">
      {/* WhatsApp App Header */}
      <div className="bg-[#1f2c34] -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 p-3 sm:p-4 rounded-t-3xl border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#128c7e] text-white flex items-center justify-center font-bold text-xs">
            {guestName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-xs text-white leading-tight">{guestName}</h4>
            <span className="text-[10px] text-emerald-400 font-medium">Online &bull; WhatsApp</span>
          </div>
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
          Format Otomatis
        </span>
      </div>

      {/* WhatsApp Message Bubble */}
      <div className="space-y-2 pt-1">
        <div className="max-w-[95%] sm:max-w-[90%] ml-auto bg-[#005c4b] text-white rounded-2xl rounded-tr-xs p-3 sm:p-3.5 shadow-md space-y-1.5 text-xs leading-relaxed">
          <p className="text-[11px]">
            Kepada Yth. <strong className="text-[#fef08a]">{guestName}</strong> &amp; Keluarga,
          </p>
          <p className="text-[11px] text-slate-200">
            Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir di hari bahagia pernikahan kami:
          </p>
          <p className="text-[11px] font-bold text-white">
            Dimas Prasetyo &amp; Anindya Larasati
          </p>
          <p className="text-[10px] text-emerald-200">
            🗓️ Minggu, 25 Oktober 2026 &bull; Gedung Sasana Kriya
          </p>

          {/* Rich Open Graph Link Card */}
          <div className="rounded-xl overflow-hidden bg-[#025141] border border-white/15 p-2 space-y-1 mt-1.5">
            <div className="h-16 bg-gradient-to-r from-emerald-900 to-slate-900 rounded-lg flex items-center justify-center text-center p-2">
              <span className="text-[10px] font-bold text-emerald-200">
                💌 Buka Undangan Resmi &amp; Tiket QR
              </span>
            </div>
            <p className="text-[11px] font-bold text-white truncate">
              The Wedding of Dimas &amp; Anindya
            </p>
            <p className="text-[9px] text-emerald-300 font-mono truncate">
              hayvows.com/invitation/dimas-anindya/{guestName.toLowerCase().replace(/\s+/g, "-")}
            </p>
          </div>

          <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-300 pt-0.5">
            <span>09:41</span>
            <span className="text-cyan-300 font-bold">✓✓</span>
          </div>
        </div>
      </div>

      {/* Interactive Name Toggle */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <span className="text-[11px] text-slate-400 block font-medium">
          Coba Personalisasi Nama Tamu:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {nameOptions.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setGuestName(name)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                guestName === name
                  ? "bg-emerald-500 text-slate-950 shadow-xs font-extrabold"
                  : "bg-white/10 text-slate-300 hover:bg-white/15"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Bullet */}
      <div className="text-[10px] sm:text-[11px] text-slate-400 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
        <span>Kirim 1-Klik tanpa simpan nomor</span>
        <span className="text-emerald-400 font-bold">Tamu Unlimited</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. SIMULASI MOCKUP: GAME RETRO 2D PIXEL RPG
───────────────────────────────────────────────────────────── */
export function PixelRpgSimulation() {
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const dialogues = [
    {
      speaker: "NPC Aria (Pemandu Gerbang)",
      text: "Selamat datang Pengembara! Masuki Pulau Langit untuk membuka fitur RSVP & galeri foto mempelai!",
    },
    {
      speaker: "Ksatria Dimas (Mempelai Pria)",
      text: "Terima kasih sudah datang jauh-jauh! Petualangan hidup baru kami dimulai hari ini!",
    },
    {
      speaker: "Putri Anindya (Mempelai Wanita)",
      text: "Jangan lupa periksa Peti Tanda Kasih di dekat air mancur untuk menitipkan doa restu ya!",
    },
  ];

  const handleNextDialogue = () => {
    setDialogueIndex((prev) => (prev + 1) % dialogues.length);
  };

  return (
    <div className="bg-[#0c102a] rounded-3xl p-4 sm:p-6 text-white border-2 border-amber-400/70 shadow-2xl space-y-3.5 sm:space-y-4 overflow-hidden relative">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-amber-300">16-Bit Retro Engine (60 FPS)</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-black/40 px-2 py-0.5 rounded border border-emerald-400/30">
          ● Browser Mobile Ready
        </span>
      </div>

      {/* Retro Pixel Screen */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#182357] via-[#0f1738] to-[#070b1c] border-2 border-amber-400/50 p-3 sm:p-4 aspect-[4/3] min-h-[220px] sm:min-h-[250px] flex flex-col justify-between">
        {/* Floating Clouds & Island Scenery */}
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-amber-200/70">
          <span>HP: 100/100</span>
          <span>LOCATION: SKY ISLAND</span>
        </div>

        {/* Pixel Sprite Scene */}
        <div className="my-auto text-center space-y-1.5 relative">
          <div className="inline-flex items-center justify-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl bg-black/40 border border-amber-400/30 backdrop-blur-xs">
            {/* NPC Sprite */}
            <div className="text-center">
              <span className="text-xl sm:text-2xl block animate-bounce">🧝‍♀️</span>
              <span className="text-[8px] sm:text-[9px] font-mono text-amber-300">Aria [NPC]</span>
            </div>
            {/* Groom Sprite */}
            <div className="text-center">
              <span className="text-xl sm:text-2xl block">🤵</span>
              <span className="text-[8px] sm:text-[9px] font-mono text-emerald-300">Dimas</span>
            </div>
            {/* Bride Sprite */}
            <div className="text-center">
              <span className="text-xl sm:text-2xl block">👰</span>
              <span className="text-[8px] sm:text-[9px] font-mono text-pink-300">Anindya</span>
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] font-mono text-slate-300">
            Tamu bebas berjalan menggunakan D-Pad virtual di layar HP
          </p>
        </div>

        {/* Retro Dialogue Box */}
        <div className="bg-black/90 border-2 border-amber-400/80 rounded-xl p-2.5 sm:p-3 text-left space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-amber-300">
            <span>{dialogues[dialogueIndex].speaker}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400">Tekan [A] Lanjut &rarr;</span>
          </div>
          <p className="text-[10px] sm:text-[11px] font-mono text-white leading-relaxed">
            &ldquo;{dialogues[dialogueIndex].text}&rdquo;
          </p>
        </div>
      </div>

      {/* Retro Controls Simulator */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="text-[9px] sm:text-[10px] font-mono text-slate-400">
          <span>Kontrol: D-Pad / Layar Sentuh</span>
        </div>
        <button
          type="button"
          onClick={handleNextDialogue}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <span>Tombol [A] Aksi Dialog</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. SIMULASI MOCKUP: AMPLOP DIGITAL & TRANSFER BANK LANGSUNG
───────────────────────────────────────────────────────────── */
export function BankCardSimulation() {
  const [selectedBank, setSelectedBank] = useState<"bca" | "mandiri">("bca");
  const [copied, setCopied] = useState(false);

  const bankData = {
    bca: {
      name: "Bank Central Asia (BCA)",
      accNumber: "8820 4918 2011",
      holder: "DIMAS PRASITYO & ANINDYA",
      bgColor: "from-blue-900 via-indigo-950 to-slate-900",
    },
    mandiri: {
      name: "Bank Mandiri",
      accNumber: "1370 0192 8472",
      holder: "ANINDYA LARASATI",
      bgColor: "from-amber-900/90 via-slate-900 to-blue-950",
    },
  };

  const current = bankData[selectedBank];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.accNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 text-white border-2 border-rose-500/50 shadow-2xl space-y-3.5 sm:space-y-4 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold text-slate-200">Amplop Digital (Transfer Bank)</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
          0% Biaya Potongan
        </span>
      </div>

      {/* Bank Toggle */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => {
            setSelectedBank("bca");
            setCopied(false);
          }}
          className={`py-2 rounded-xl font-bold transition-all text-center cursor-pointer border min-h-[40px] ${
            selectedBank === "bca"
              ? "bg-blue-600 text-white border-blue-400 shadow-xs"
              : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
          }`}
        >
          Rekening BCA
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedBank("mandiri");
            setCopied(false);
          }}
          className={`py-2 rounded-xl font-bold transition-all text-center cursor-pointer border min-h-[40px] ${
            selectedBank === "mandiri"
              ? "bg-amber-600 text-white border-amber-400 shadow-xs"
              : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
          }`}
        >
          Rekening Mandiri
        </button>
      </div>

      {/* VIP Bank Card Frame */}
      <div
        className={`rounded-2xl p-4 sm:p-6 bg-gradient-to-br ${current.bgColor} border border-white/20 shadow-xl space-y-3 sm:space-y-4 relative overflow-hidden transition-all duration-300`}
      >
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-bold tracking-wider text-white">{current.name}</span>
          {/* Gold Microchip icon */}
          <div className="w-7 h-5 sm:w-8 sm:h-6 rounded-md bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-500 shadow-xs" />
        </div>

        <div className="relative z-10 space-y-1">
          <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest">Nomor Rekening:</span>
          <p className="font-mono text-base sm:text-xl font-extrabold tracking-widest text-[#fef08a]">
            {current.accNumber}
          </p>
          <p className="text-xs font-semibold text-slate-200">{current.holder}</p>
        </div>

        {/* Copy Button */}
        <div className="relative z-10 pt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all border border-white/30 cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Nomor Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Nomor Rekening</span>
              </>
            )}
          </button>
          <span className="text-[10px] text-emerald-300/80 font-mono">0% Admin Fee</span>
        </div>

        {/* Shimmer light effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Confirmation Feature Note */}
      <div className="text-[10px] sm:text-[11px] text-slate-400 bg-white/5 p-2.5 sm:p-3 rounded-xl border border-white/10 space-y-1">
        <p className="font-semibold text-white flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tamu Dapat Unggah Bukti Struk Transfer</span>
        </p>
        <p className="text-[10px] text-slate-400">
          Uang 100% langsung masuk ke m-banking Anda. Notifikasi konfirmasi tercatat otomatis di dashboard.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. SIMULASI MOCKUP: MULAI KILAT 5 MENIT (ROADMAP STEPPER)
───────────────────────────────────────────────────────────── */
export function QuickStartRoadmapSimulation() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Daftar Gratis",
      time: "0.5 Min",
      desc: "Isi nama & email di form pendaftaran kilat.",
      preview: "Form pendaftaran praktis tanpa kartu kredit.",
    },
    {
      title: "2. Pilih Desain",
      time: "1.5 Min",
      desc: "Pilih tema (Royal Emerald, Pixel RPG, Adat Jawa).",
      preview: "Koleksi tema modern langsung aktif siap pakai.",
    },
    {
      title: "3. Isi Jadwal",
      time: "2.0 Min",
      desc: "Lengkapi tanggal akad, resepsi, dan peta Google Maps.",
      preview: "Peta lokasi gedung langsung terintegrasi otomatis.",
    },
    {
      title: "4. Unduh & Sebar",
      time: "1.0 Min",
      desc: "Unduh file cetak 300 DPI dan bagikan tautan via WA.",
      preview: "Undangan siap disebar ke kerabat tercinta!",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 text-white border-2 border-blue-500/50 shadow-2xl space-y-3.5 sm:space-y-4 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-200">Alur Kilat Onboarding</span>
        </div>
        <span className="text-[10px] font-mono text-amber-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
          ⏱️ Total: 5 Menit
        </span>
      </div>

      {/* Interactive Step Buttons */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {steps.map((st, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveStep(idx)}
            className={`p-2.5 sm:p-3 rounded-xl text-left transition-all border cursor-pointer ${
              activeStep === idx
                ? "bg-blue-600 text-white border-blue-400 shadow-md scale-[1.02]"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs">{st.title}</span>
              <span className="text-[9px] font-mono text-blue-200">{st.time}</span>
            </div>
            <p className="text-[10px] text-slate-300 line-clamp-1">{st.desc}</p>
          </button>
        ))}
      </div>

      {/* Active Step Live Preview Screen */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-white/15 space-y-2 text-center">
        <span className="text-[9px] sm:text-[10px] font-mono text-blue-300 uppercase tracking-wider block">
          Tahap Aktif: {steps[activeStep].title}
        </span>
        <h4 className="text-xs sm:text-sm font-bold text-white">{steps[activeStep].preview}</h4>
        <p className="text-[10px] sm:text-[11px] text-slate-400 max-w-sm mx-auto">
          {steps[activeStep].desc} Seluruh data dapat Anda revisi sewaktu-waktu tanpa batas.
        </p>

        <div className="pt-1.5">
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <span>Mulai Buat Undangan Sekarang</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Guarantee note */}
      <div className="text-[10px] sm:text-[11px] text-slate-400 bg-white/5 p-2 sm:p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
        <span>Bebas coba semua fitur gratis</span>
        <span className="text-emerald-400 font-bold">Tanpa Kartu Kredit</span>
      </div>
    </div>
  );
}

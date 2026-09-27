"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Crown,
  Heart,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   0. STICKY MOCKUP WRAPPER (TETAP DIAM DI DESKTOP, RESPONSIVE DI MOBILE)
───────────────────────────────────────────────────────────── */
export function ParallaxMockupWrapper({
  children,
}: {
  children: React.ReactNode;
  badgeText?: string;
}) {
  return (
    <div className="relative w-full">
      {/* Main Mockup Card: Tetap diam (rock-solid still) saat tahapan di sebelah kiri discroll */}
      <div className="w-full">
        {children}
      </div>
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
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 text-white border border-emerald-500/40 shadow-xl space-y-3 sm:space-y-3.5 overflow-hidden relative">
      {/* Top Phone Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200 truncate">Scanner Meja Resepsi</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">Siap Scan</span>
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
      <div className="text-[10px] sm:text-[11px] text-slate-400 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
        <span className="truncate">Bisa dibuka di 5 HP panitia</span>
        <span className="text-emerald-400 font-bold shrink-0 whitespace-nowrap">Sinkron Real-time</span>
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
    {
      name: "Bapak Budi Santoso & Keluarga",
      shortName: "Budi Santoso",
      category: "VIP",
      table: "Meja VIP A1",
      pax: "2 Pax",
      location: "Jakarta Selatan",
      time: "Live Check-in",
    },
    {
      name: "dr. Hendra Wijaya & Pasangan",
      shortName: "dr. Hendra",
      category: "VIP",
      table: "Meja B4",
      pax: "2 Pax",
      location: "Surabaya",
      time: "1m lalu",
    },
    {
      name: "Ibu Siti Rahmawati, S.E.",
      shortName: "Siti Rahmawati",
      category: "Keluarga",
      table: "Meja C2",
      pax: "1 Pax",
      location: "Bandung",
      time: "2m lalu",
    },
  ];

  const current = guestSamples[selectedGuest];

  return (
    <div className="bg-slate-950 rounded-2xl sm:rounded-3xl p-3 sm:p-5 text-white border border-indigo-500/40 shadow-xl space-y-2.5 sm:space-y-3.5 overflow-hidden relative">
      {/* Top TV Frame Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Tv className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200 truncate">Layar Sapa TV (/display)</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-red-300 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30 shrink-0 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold">LIVE TV</span>
        </div>
      </div>

      {/* Smart TV Bezel & Screen (Matching actual /display/[weddingSlug] UI) */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-[#0e1638] to-slate-950 border border-slate-700 sm:border-2 shadow-2xl p-3 sm:p-4 text-center space-y-2 sm:space-y-3">
        {/* Dynamic Light Bar at top of Screen */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400" />
        
        {/* Ambient Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-indigo-500/20 blur-2xl pointer-events-none" />

        {/* Screen Top Bar */}
        <div className="relative z-10 flex items-center justify-between text-[8px] sm:text-[9px] text-slate-400 font-mono border-b border-white/10 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400 fill-rose-400 shrink-0" />
            <span className="tracking-wider uppercase font-bold text-slate-300 truncate">
              The Official Reception
            </span>
          </div>
          <span className="text-indigo-300 font-semibold shrink-0">19:42 WIB</span>
        </div>

        {/* Dynamic Grand Welcome Banner */}
        <div className="relative z-10 py-0.5 sm:py-1 space-y-1.5 sm:space-y-2 animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 via-yellow-300/25 to-amber-400/20 border border-amber-300/40 text-[#fef08a] text-[8px] sm:text-[10px] font-bold tracking-wider uppercase shadow">
            <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
            <span>Selamat Datang &bull; Tamu Kehormatan</span>
            <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
          </div>

          <h3 className="text-sm sm:text-lg font-bold text-white tracking-tight drop-shadow-md leading-tight">
            {current.name}
          </h3>

          <p className="text-[10px] sm:text-[11px] text-indigo-200/80 font-medium flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
            <span>{current.location}</span>
          </p>

          {/* Table & Pax Badges (Clean single row on all mobile screens) */}
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-0.5 text-[9px] sm:text-[10px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-xs whitespace-nowrap">
              <Crown className="w-2.5 h-2.5" />
              <span>{current.category}</span>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-white font-medium whitespace-nowrap">
              <strong className="text-[#fef08a]">{current.table}</strong>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-slate-200 whitespace-nowrap">
              {current.pax}
            </span>
          </div>
        </div>

        {/* Screen Bottom Bar */}
        <div className="relative z-10 flex items-center justify-between text-[8px] sm:text-[9px] text-slate-400 border-t border-white/10 pt-1.5 gap-2">
          <span className="truncate">Sasana Kriya Ballroom</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Auto-Sync</span>
          </span>
        </div>
      </div>

      {/* Interactive Controller: Live Reception Check-in Feed (Horizontal Tabs) */}
      <div className="space-y-1 pt-0.5">
        <div className="flex items-center justify-between text-[11px] text-slate-300 px-0.5">
          <span className="font-semibold text-slate-200">Simulasikan Tamu Masuk Resepsi:</span>
          <span className="text-[10px] text-indigo-300 font-mono">Pilih Tamu &darr;</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {guestSamples.map((g, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedGuest(idx)}
              className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedGuest === idx
                  ? "bg-indigo-600/90 text-white border-indigo-400 shadow-xs ring-1 ring-indigo-400/80"
                : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              <p className="text-[11px] font-bold truncate leading-tight text-white">{g.shortName}</p>
              <p className="text-[9px] text-amber-300/80 font-mono mt-0.5">{g.category} &bull; {g.pax}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Connection Info Footnote */}
      <div className="text-[10px] text-slate-400 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center justify-center gap-2 overflow-hidden">
        <span className="flex items-center gap-1 text-slate-300 font-medium">
          <Laptop className="w-3 h-3 text-indigo-400 shrink-0" />
          <span>Laptop Meja</span>
        </span>
        <span className="text-indigo-400 font-mono font-bold text-[9px]">── HDMI ──&gt;</span>
        <span className="flex items-center gap-1 text-slate-300 font-medium">
          <Monitor className="w-3 h-3 text-indigo-400 shrink-0" />
          <span>TV Gedung</span>
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
    <div className="bg-[#0b141a] rounded-3xl p-4 sm:p-5 text-white border border-emerald-600/40 shadow-xl space-y-3 sm:space-y-3.5 overflow-hidden relative">
      {/* WhatsApp App Header */}
      <div className="bg-[#1f2c34] -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 p-3 sm:p-3.5 rounded-t-3xl border-b border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#128c7e] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {guestName.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-white leading-tight truncate">{guestName}</h4>
            <span className="text-[10px] text-emerald-400 font-medium block truncate">Online &bull; WhatsApp</span>
          </div>
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 shrink-0 whitespace-nowrap">
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
      <div className="text-[10px] sm:text-[11px] text-slate-400 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
        <span className="truncate">Kirim 1-Klik tanpa simpan nomor</span>
        <span className="text-emerald-400 font-bold shrink-0 whitespace-nowrap">Tamu Unlimited</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. SIMULASI MOCKUP: GAME RETRO 2D PIXEL RPG
───────────────────────────────────────────────────────────── */
export function PixelRpgSimulation() {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const features = [
    {
      title: "Jelajah Bebas",
      icon: "🕹️",
      desc: "Tamu menggerakkan avatar sendiri di pulau langit dengan joystick virtual di HP atau tombol keyboard.",
    },
    {
      title: "5 NPC Interaktif",
      icon: "🧚",
      desc: "Bicara dengan Guide Aria, Pengawal Istana, dan Mempelai untuk membuka kisah cinta, jadwal, & galeri foto.",
    },
    {
      title: "RSVP & Amplop",
      icon: "📜",
      desc: "Konfirmasi kehadiran dan tanda kasih dibuka langsung dari dalam quest game tanpa keluar halaman.",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 text-white border border-amber-500/40 shadow-xl space-y-3 sm:space-y-3.5 overflow-hidden">
      {/* 1. Browser/Console Frame Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-300 ml-1 truncate">
            hayvows.com/invitation/alex-sara
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-400/30 shrink-0 whitespace-nowrap">
          🎮 2D RPG
        </span>
      </div>

      {/* 2. Official High-Resolution Gameplay Showcase Image from Web */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-lg group aspect-[16/9]">
        <img
          src="/assets/templates/pixel-adventure/banner.jpg"
          alt="Gameplay Undangan 2D Pixel RPG Hayvows"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />

        {/* Live Playable Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/50 text-[10px] font-bold text-amber-300 shadow">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Tampilan Asli In-Game</span>
        </div>

        {/* Bottom Banner Title */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-xs gap-2">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-amber-300 font-bold uppercase tracking-wider block drop-shadow truncate">
              Tema Eksklusif #1 di Indonesia
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold text-white drop-shadow truncate">
              The Royal Sky Island Wedding
            </h4>
          </div>
          <Link
            href="/invitation/alex-sara/budi-santoso"
            target="_blank"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] sm:text-[11px] shadow transition-all hover:scale-105 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>Buka Demo</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 3. Interactive Feature Tabs */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400 block font-medium">
          Fitur Utama Game RPG:
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {features.map((f, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedFeature(i)}
              className={`p-1.5 sm:p-2 rounded-xl text-left transition-all border cursor-pointer min-w-0 ${
                selectedFeature === i
                  ? "bg-amber-400/20 border-amber-400/60 text-amber-200 shadow-xs"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              <span className="text-sm block mb-0.5">{f.icon}</span>
              <span className="text-[10px] font-bold block truncate">{f.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Active Feature Description */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
        <p className="font-bold text-amber-300 text-[11px] flex items-center gap-1.5">
          <span>{features[selectedFeature].icon}</span>
          <span>{features[selectedFeature].title}</span>
        </p>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {features[selectedFeature].desc}
        </p>
      </div>

      {/* 5. Primary Direct Play Button */}
      <Link
        href="/invitation/alex-sara/budi-santoso"
        target="_blank"
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        <Play className="w-3.5 h-3.5 fill-slate-950" />
        <span>Coba Mainkan Demo Game Asli (1-Klik)</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
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
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 text-white border border-rose-500/40 shadow-xl space-y-3 sm:space-y-3.5 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Gift className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200 truncate">Amplop Digital (Bank)</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 shrink-0 whitespace-nowrap">
          0% Potongan
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
        <div className="relative z-10 pt-1 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all border border-white/30 cursor-pointer active:scale-95 shrink-0"
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
          <span className="text-[10px] text-emerald-300/80 font-mono shrink-0 whitespace-nowrap">0% Fee</span>
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
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 text-white border border-blue-500/40 shadow-xl space-y-3 sm:space-y-3.5 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200 truncate">Alur Kilat Onboarding</span>
        </div>
        <span className="text-[10px] font-mono text-amber-300 bg-white/5 px-2 py-0.5 rounded border border-white/10 shrink-0 whitespace-nowrap">
          ⏱️ 5 Menit
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
      <div className="text-[10px] sm:text-[11px] text-slate-400 bg-white/5 p-2 sm:p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
        <span className="truncate">Bebas coba semua fitur gratis</span>
        <span className="text-emerald-400 font-bold shrink-0 whitespace-nowrap">Tanpa Kartu Kredit</span>
      </div>
    </div>
  );
}

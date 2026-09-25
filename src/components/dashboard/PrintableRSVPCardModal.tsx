"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  X,
  Download,
  Printer,
  Sparkles,
  Copy,
  Check,
  QrCode,
  Sliders,
  Palette,
  Eye,
  Layers,
  Heart,
  Calendar,
} from "lucide-react";

export interface PrintableRSVPCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingSlug: string;
  coupleTitle: string;
  eventDate?: string;
}

interface SizeOption {
  id: string;
  label: string;
  shape: "circle" | "square" | "rect-v" | "rect-h";
  widthMm: number;
  heightMm: number;
  fileTag: string;
  description: string;
}

const SIZE_OPTIONS: SizeOption[] = [
  {
    id: "dia-5cm",
    label: "Stiker Bulat Ø 5 cm",
    shape: "circle",
    widthMm: 50,
    heightMm: 50,
    fileTag: "Diameter-5cm",
    description: "Ukuran standar segel amplop atau stiker sisipan undangan",
  },
  {
    id: "dia-6cm",
    label: "Stiker Bulat Ø 6 cm",
    shape: "circle",
    widthMm: 60,
    heightMm: 60,
    fileTag: "Diameter-6cm",
    description: "Ukuran stiker bulat medium, sangat jelas dipindai kamera",
  },
  {
    id: "dia-7cm",
    label: "Stiker Bulat Ø 7 cm",
    shape: "circle",
    widthMm: 70,
    heightMm: 70,
    fileTag: "Diameter-7cm",
    description: "Ukuran stiker bulat besar untuk amplop eksklusif",
  },
  {
    id: "sq-6cm",
    label: "Kartu Kotak 6 x 6 cm",
    shape: "square",
    widthMm: 60,
    heightMm: 60,
    fileTag: "6x6cm",
    description: "Kartu sisipan kecil kotak mungil & elegan",
  },
  {
    id: "sq-8cm",
    label: "Kartu Kotak 8 x 8 cm",
    shape: "square",
    widthMm: 80,
    heightMm: 80,
    fileTag: "8x8cm",
    description: "Kartu sisipan medium proporsional",
  },
  {
    id: "rect-a7",
    label: "Kartu Vertikal 7 x 10 cm (A7)",
    shape: "rect-v",
    widthMm: 70,
    heightMm: 100,
    fileTag: "7x10cm-A7",
    description: "Ukuran standar kartu RSVP formal internasional (A7)",
  },
  {
    id: "rect-land",
    label: "Kartu Horizontal 10 x 7 cm",
    shape: "rect-h",
    widthMm: 100,
    heightMm: 70,
    fileTag: "10x7cm",
    description: "Kartu sisipan lanskap horizontal",
  },
];

type ThemeOption = {
  id: string;
  name: string;
  bg: string;
  border: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  qrDark: string;
  qrLight: string;
};

const THEMES: ThemeOption[] = [
  {
    id: "emerald-gold",
    name: "Emerald & Botanical Gold",
    bg: "#FAFAF7",
    border: "#C9A84C",
    accent: "#2D4A3E",
    textPrimary: "#1E342B",
    textSecondary: "#65766D",
    qrDark: "#1E342B",
    qrLight: "#FAFAF7",
  },
  {
    id: "ivory-charcoal",
    name: "Modern Ivory Luxury",
    bg: "#FFFFFF",
    border: "#E2E8F0",
    accent: "#0F172A",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    qrDark: "#000000",
    qrLight: "#FFFFFF",
  },
  {
    id: "kraton-gold",
    name: "Batik Jawa Kraton Heritage",
    bg: "#FDF6E3",
    border: "#D4A853",
    accent: "#7C2D12",
    textPrimary: "#2D1B0E",
    textSecondary: "#8C6239",
    qrDark: "#3D2B1F",
    qrLight: "#FDF6E3",
  },
  {
    id: "eternal-noir",
    name: "Eternal Luxury Noir",
    bg: "#0D0D0D",
    border: "#D4AF37",
    accent: "#D4AF37",
    textPrimary: "#FFFFFF",
    textSecondary: "#CCCCCC",
    qrDark: "#D4AF37",
    qrLight: "#141414",
  },
];

export function PrintableRSVPCardModal({
  isOpen,
  onClose,
  weddingSlug,
  coupleTitle,
  eventDate,
}: PrintableRSVPCardModalProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string>("dia-5cm");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("emerald-gold");
  const [cardHeader, setCardHeader] = useState<string>("RSVP & DO'A RESTU");
  const [cardInstruction, setCardInstruction] = useState<string>(
    "Pindai kamera untuk konfirmasi kehadiran & doa restu"
  );
  const [cardDeadline, setCardDeadline] = useState<string>("Mohon konfirmasi sebelum H-7");
  const [showCropGuide, setShowCropGuide] = useState<boolean>(true);

  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedSize = SIZE_OPTIONS.find((s) => s.id === selectedSizeId) || SIZE_OPTIONS[0];
  const selectedTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];

  // Full URL for Public RSVP
  const origin = typeof window !== "undefined" ? window.location.origin : "https://hayvows.com";
  const rsvpUrl = `${origin}/invitation/${weddingSlug}/rsvp`;

  // Generate QR code data URL
  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(rsvpUrl, {
      width: 600,
      margin: 1,
      color: {
        dark: selectedTheme.qrDark,
        light: selectedTheme.qrLight,
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => console.error("Error generating QR:", err));
  }, [isOpen, rsvpUrl, selectedTheme]);

  // Copy Link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(rsvpUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // High-Resolution 300 DPI Canvas Rendering & Download
  const handleDownloadCard = () => {
    if (!qrDataUrl) return;

    setIsGenerating(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // 300 DPI calculation (1 mm ≈ 11.811 pixels at 300 DPI)
    const scale = 11.811;
    const canvasWidth = Math.round(selectedSize.widthMm * scale);
    const canvasHeight = Math.round(selectedSize.heightMm * scale);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const isCircle = selectedSize.shape === "circle";
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Draw Background
    ctx.fillStyle = selectedTheme.bg;
    if (isCircle) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerX, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Draw Decorative Borders
    ctx.strokeStyle = selectedTheme.border;
    ctx.lineWidth = Math.max(3, Math.round(scale * 0.4));

    if (isCircle) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerX - Math.round(scale * 2.5), 0, Math.PI * 2);
      ctx.stroke();

      // Inner thin ring
      ctx.strokeStyle = `${selectedTheme.border}66`;
      ctx.lineWidth = Math.max(1.5, Math.round(scale * 0.2));
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerX - Math.round(scale * 4), 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Rounded Rectangle Border
      const padding = Math.round(scale * 3);
      const radius = Math.round(scale * 3);
      ctx.beginPath();
      ctx.roundRect(padding, padding, canvasWidth - padding * 2, canvasHeight - padding * 2, radius);
      ctx.stroke();
    }

    // Load QR Code Image onto Canvas
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.onload = () => {
      // Typography scaling
      const fontSizeTitle = Math.round(scale * 2.6);
      const fontSizeHeader = Math.round(scale * 1.8);
      const fontSizeSub = Math.round(scale * 1.4);
      const fontSizeSmall = Math.round(scale * 1.1);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 1. Header Tag
      ctx.font = `bold ${fontSizeHeader}px sans-serif`;
      ctx.fillStyle = selectedTheme.accent;
      const headerY = centerY - canvasHeight * 0.34;
      ctx.fillText(cardHeader.toUpperCase(), centerX, headerY);

      // 2. Couple Name
      ctx.font = `bold ${fontSizeTitle}px serif`;
      ctx.fillStyle = selectedTheme.textPrimary;
      const coupleY = headerY + Math.round(scale * 3.5);
      ctx.fillText(coupleTitle, centerX, coupleY);

      // 3. QR Code Presentation
      const qrSize = Math.round(Math.min(canvasWidth, canvasHeight) * 0.42);
      const qrX = centerX - qrSize / 2;
      const qrY = centerY - qrSize / 2 + Math.round(scale * 1.5);

      // QR white/light container box
      ctx.fillStyle = selectedTheme.qrLight;
      ctx.beginPath();
      ctx.roundRect(
        qrX - Math.round(scale * 1),
        qrY - Math.round(scale * 1),
        qrSize + Math.round(scale * 2),
        qrSize + Math.round(scale * 2),
        Math.round(scale * 1.5)
      );
      ctx.fill();

      // Draw QR
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // 4. Instructions below QR
      ctx.font = `500 ${fontSizeSub}px sans-serif`;
      ctx.fillStyle = selectedTheme.textSecondary;
      const instY = qrY + qrSize + Math.round(scale * 2.5);
      ctx.fillText(cardInstruction, centerX, instY);

      // 5. Deadline Notice
      if (cardDeadline) {
        ctx.font = `italic 600 ${fontSizeSmall}px serif`;
        ctx.fillStyle = selectedTheme.accent;
        const deadY = instY + Math.round(scale * 2.2);
        ctx.fillText(cardDeadline, centerX, deadY);
      }

      // 6. Download Trigger
      const cleanCouple = coupleTitle.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
      const filename = `RSVP-Card-${cleanCouple}-${selectedSize.fileTag}-300DPI.png`;

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png", 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
    };

    qrImg.src = qrDataUrl;
  };

  // Download Only Master QR
  const handleDownloadOnlyQR = () => {
    if (!qrDataUrl) return;
    const cleanCouple = coupleTitle.replace(/[^a-zA-Z0-9]/g, "-");
    const link = document.createElement("a");
    link.download = `Master-QR-RSVP-${cleanCouple}-${selectedSize.fileTag}.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full text-slate-900 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-900 p-5 sm:px-6 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c9a84c] to-[#e6ca75] text-[#15251f] flex items-center justify-center shadow-lg font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#fef08a]">
                  Studio Cetak Kartu &bull; 300 DPI Ready
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide">
                Desain Kartu &amp; Stiker QR RSVP Fisik
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Controls, Right Preview */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* ──────── Left Controls (Col 7) ──────── */}
          <div className="lg:col-span-6 space-y-5">
            {/* 1. Pilih Ukuran & Bentuk Kartu */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-[#2d4a3e]" />
                <span>1. Pilih Ukuran &amp; Diameter Siap Cetak:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedSizeId(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSizeId === opt.id
                        ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20"
                        : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{opt.label}</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold uppercase">
                        {opt.fileTag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Pilih Tema Warna Kartu */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Palette className="w-4 h-4 text-[#2d4a3e]" />
                <span>2. Tema &amp; Palet Warna:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setSelectedThemeId(th.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                      selectedThemeId === th.id
                        ? "bg-slate-100 border-slate-900 ring-2 ring-slate-900/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg border shadow-xs shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: th.bg, borderColor: th.border }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.accent }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 truncate">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Teks Kustom Kartu */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#2d4a3e]" />
                <span>3. Sesuaikan Teks pada Kartu:</span>
              </span>

              <div>
                <label className="text-slate-600 block mb-1">Judul Kartu:</label>
                <input
                  type="text"
                  value={cardHeader}
                  onChange={(e) => setCardHeader(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Instruksi Scan:</label>
                <input
                  type="text"
                  value={cardInstruction}
                  onChange={(e) => setCardInstruction(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Batas Waktu Konfirmasi (Deadline):</label>
                <input
                  type="text"
                  value={cardDeadline}
                  onChange={(e) => setCardDeadline(e.target.value)}
                  placeholder="Contoh: Mohon konfirmasi sebelum H-7"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                />
              </div>
            </div>

            {/* 4. Link Tautan Publik Form */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950">Tautan Langsung Form RSVP:</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2d4a3e] hover:underline cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Tersalin!" : "Salin Link"}</span>
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-emerald-100 truncate">
                {rsvpUrl}
              </p>
            </div>
          </div>

          {/* ──────── Right Live Preview (Col 5) ──────── */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-100 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>Live Preview Siap Cetak ({selectedSize.label})</span>
            </div>

            {/* Simulated Printed Card Card Container */}
            <div
              className={`shadow-2xl transition-all duration-300 relative flex flex-col items-center justify-center text-center p-6 ${
                selectedSize.shape === "circle"
                  ? "rounded-full w-72 h-72 aspect-square"
                  : selectedSize.shape === "rect-v"
                  ? "rounded-2xl w-64 h-88 aspect-[7/10]"
                  : selectedSize.shape === "rect-h"
                  ? "rounded-2xl w-84 h-64 aspect-[10/7]"
                  : "rounded-2xl w-72 h-72 aspect-square"
              }`}
              style={{
                backgroundColor: selectedTheme.bg,
                border: `3px solid ${selectedTheme.border}`,
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
              }}
            >
              {/* Inner Decorative Ring/Border */}
              <div
                className={`absolute inset-2 border pointer-events-none ${
                  selectedSize.shape === "circle" ? "rounded-full" : "rounded-xl"
                }`}
                style={{ borderColor: `${selectedTheme.border}66` }}
              />

              {/* Card Content Elements */}
              <div className="relative z-10 space-y-2 flex flex-col items-center justify-center">
                {/* Header Tag */}
                <span
                  className="text-[10px] font-bold uppercase tracking-widest block font-sans"
                  style={{ color: selectedTheme.accent }}
                >
                  {cardHeader}
                </span>

                {/* Couple Name */}
                <h3
                  className="text-lg font-bold font-serif leading-tight tracking-wide"
                  style={{ color: selectedTheme.textPrimary }}
                >
                  {coupleTitle}
                </h3>

                {/* QR Code Presentation Box */}
                <div
                  className="p-2 rounded-xl shadow-xs border my-1 inline-block"
                  style={{
                    backgroundColor: selectedTheme.qrLight,
                    borderColor: `${selectedTheme.border}55`,
                  }}
                >
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR RSVP Preview" className="w-28 h-28 object-contain" />
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center">
                      <QrCode className="w-8 h-8 animate-pulse text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Instruction */}
                <p
                  className="text-[10px] font-medium max-w-[200px] leading-tight"
                  style={{ color: selectedTheme.textSecondary }}
                >
                  {cardInstruction}
                </p>

                {/* Deadline */}
                {cardDeadline && (
                  <p
                    className="text-[9px] font-serif italic font-semibold pt-0.5"
                    style={{ color: selectedTheme.accent }}
                  >
                    {cardDeadline}
                  </p>
                )}
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <p className="text-[11px] font-mono text-slate-500 font-bold">
                Resolusi Ekspor: {selectedSize.widthMm * 12} &times; {selectedSize.heightMm * 12} px (300 DPI)
              </p>
              <p className="text-[10px] text-slate-400">
                Format file PNG berkualitas tinggi siap diserahkan langsung ke vendor percetakan.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-slate-50 p-4 sm:px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Nama File Unduhan: </span>
            <strong className="font-mono text-emerald-800">
              RSVP-Card-{coupleTitle.replace(/[^a-zA-Z0-9]/g, "-")}-{selectedSize.fileTag}-300DPI.png
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownloadOnlyQR}
              className="flex-1 sm:flex-none py-2.5 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Unduh Hanya QR
            </button>
            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={isGenerating || !qrDataUrl}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#fef08a]" />
              <span>{isGenerating ? "Merender 300 DPI..." : "Unduh Gambar Siap Cetak (PNG)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

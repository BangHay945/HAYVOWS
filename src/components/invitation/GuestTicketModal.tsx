"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import {
  X,
  Download,
  QrCode,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  Crown,
  Zap,
  Terminal,
} from "lucide-react";

export interface GuestTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  guestSlug: string;
  guestAddress?: string | null;
  guestCategory?: string | null;
  guestCount?: number;
  tableNumber?: string | null;
  sessionName?: string | null;
  coupleTitle: string;
  eventDate?: string;
  venueName?: string;
  qrCode?: string | null;
  weddingSlug: string;
  templateSlug?: string;
}

export function GuestTicketModal({
  isOpen,
  onClose,
  guestName,
  guestSlug,
  guestAddress,
  guestCategory = "Reguler",
  guestCount = 1,
  tableNumber,
  sessionName,
  coupleTitle,
  eventDate,
  venueName,
  qrCode,
  weddingSlug,
  templateSlug = "nature-floral",
}: GuestTicketModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);
  const ticketRef = useRef<HTMLDivElement>(null);

  const qrToken = qrCode || `HVW-${weddingSlug.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}-${guestSlug.toUpperCase()}`;

function formatDisplayDate(dateStr?: string | null): string | undefined {
  if (!dateStr) return undefined;
  if (!dateStr.includes("T") && !/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

  // Theme-specific QR colors & styles
  const isCyberpunk = templateSlug === "pixel-cyberpunk";
  const isNoir = templateSlug === "eternal-noir";
  const isBatik = templateSlug === "batik-jawa";
  const isPixel = templateSlug === "pixel-adventure";
  const isMonogram = templateSlug === "modern-monogram";
  const isEditorial = templateSlug === "cinematic-editorial";
  const isCinematicIvory = templateSlug === "cinematic-ivory";
  const isVintageRoyal = templateSlug === "vintage-royal";

  const qrColors = isCyberpunk
    ? { dark: "#00f0ff", light: "#0a0a14" }
    : isNoir
    ? { dark: "#c9a84c", light: "#121212" }
    : isBatik
    ? { dark: "#7C2D12", light: "#FDF6E3" }
    : isPixel
    ? { dark: "#000000", light: "#ffffff" }
    : isMonogram
    ? { dark: "#ffffff", light: "#18181b" }
    : isEditorial
    ? { dark: "#0d0d11", light: "#fdfbf7" }
    : isCinematicIvory
    ? { dark: "#0c0d0e", light: "#f5f3ef" }
    : isVintageRoyal
    ? { dark: "#141517", light: "#f8f6f0" }
    : { dark: "#2d4a3e", light: "#ffffff" }; // Nature Floral (Default)

  useEffect(() => {
    if (!isOpen) return;

    setIsGenerating(true);
    QRCode.toDataURL(qrToken, {
      width: 260,
      margin: 2,
      color: qrColors,
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        setQrDataUrl(url);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error("Gagal membuat QR Code:", err);
        setIsGenerating(false);
      });
  }, [isOpen, qrToken, templateSlug]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `Tiket-Undangan-${guestSlug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  const isVip = guestCategory?.toLowerCase().includes("vip");

  // 1. CYBERPUNK THEME
  if (isCyberpunk) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#0a0a14] rounded-none shadow-[0_0_30px_rgba(0,240,255,0.3)] border-2 border-[#00f0ff] text-white max-h-[92vh] flex flex-col font-mono overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#00f0ff]/20 via-[#ff003c]/20 to-[#00f0ff]/20 p-5 border-b-2 border-[#00f0ff] relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/40 text-[#00f0ff] flex items-center justify-center border border-[#00f0ff] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-1 text-[#fcee0a] text-[11px] font-bold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>[CYBER-PASS • E-TICKET]</span>
            </div>
            <h2 className="text-xl font-bold tracking-wider text-[#00f0ff] truncate uppercase">
              {coupleTitle}
            </h2>
            {eventDate && (
              <p className="text-xs text-white/70 mt-1 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-[#fcee0a]" />
                <span>{eventDate} {venueName ? `// ${venueName}` : ""}</span>
              </p>
            )}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1" ref={ticketRef}>
            {/* Identity */}
            <div className="p-4 bg-[#121224] border border-[#00f0ff]/50 space-y-2 relative overflow-hidden">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#00f0ff]/70 uppercase tracking-widest block">
                    &gt; GUEST_IDENTITY
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-wide">{guestName}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest ${isVip ? "bg-[#ff003c] text-white shadow-[0_0_8px_#ff003c]" : "bg-[#00f0ff] text-black font-bold"}`}>
                  {guestCategory || "REGULER"}
                </span>
              </div>

              {guestAddress && (
                <div className="text-xs text-[#00f0ff]/80 pt-1 border-t border-[#00f0ff]/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#fcee0a] shrink-0" />
                  <span>ORIGIN: {guestAddress}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#00f0ff]/30 text-xs">
                <div>
                  <span className="text-[10px] text-white/50 block">PAX_ALLOCATION</span>
                  <span className="font-bold text-[#fcee0a]">{guestCount} PERSON(S)</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block">SEAT_GRID</span>
                  <span className="font-bold text-[#00f0ff]">{tableNumber || "FREE_SEATING"}</span>
                </div>
              </div>
            </div>

            {/* QR Box */}
            <div className="flex flex-col items-center justify-center p-5 bg-[#0e0e1a] border-2 border-dashed border-[#00f0ff]/60 text-center">
              {qrDataUrl && (
                <div className="p-2 bg-[#0a0a14] border border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 mx-auto" />
                </div>
              )}
              <p className="mt-2 font-mono text-xs text-[#fcee0a] tracking-widest">{qrToken}</p>
              <p className="text-[10px] text-white/60 mt-2">SCAN_AT_RECEPTION_DESK // ACCESS_GRANTED</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#121224] border-t-2 border-[#00f0ff] flex gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_10px_#00f0ff]"
            >
              <Download className="w-4 h-4" />
              <span>SAVE_E_TICKET</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-transparent hover:bg-white/10 text-white border border-white/30 text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ETERNAL NOIR THEME (LUXURY ONYX & CHAMPAGNE GOLD)
  if (isNoir) {
    return (
      <div className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#0d0d0d] rounded-3xl shadow-2xl border border-[#c9a84c]/50 text-white max-h-[92vh] flex flex-col font-serif overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-b from-[#181818] to-[#0d0d0d] p-6 border-b border-[#c9a84c]/30 text-center relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#c9a84c] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#c9a84c] block mb-1">
              VIP ACCESS PASS
            </span>
            <h2 className="text-2xl font-bold tracking-wide text-white">{coupleTitle}</h2>
            {eventDate && <p className="text-xs text-white/60 font-sans mt-1">{eventDate} {venueName ? `• ${venueName}` : ""}</p>}
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 font-sans" ref={ticketRef}>
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#c9a84c]/30 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block font-serif">
                    Tamu Kehormatan
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white leading-snug">{guestName}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${isVip ? "bg-[#c9a84c]/20 text-[#fef08a] border-[#c9a84c]" : "bg-white/10 text-white border-white/20"}`}>
                  {guestCategory || "Reguler"}
                </span>
              </div>

              {guestAddress && (
                <div className="flex items-center gap-1.5 text-xs text-[#c9a84c] pt-1.5 border-t border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                  <span>Domisili: {guestAddress}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-white/40 block">Kuota Undangan</span>
                  <span className="font-bold text-white">{guestCount} Pax</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">Nomor Meja</span>
                  <span className="font-bold text-[#c9a84c]">{tableNumber || "Bebas"}</span>
                </div>
              </div>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#121212] border border-[#c9a84c]/40 text-center">
              {qrDataUrl && (
                <div className="p-3 bg-[#0a0a0a] rounded-2xl border border-[#c9a84c]/60 shadow-lg">
                  <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 mx-auto rounded-xl" />
                </div>
              )}
              <p className="font-mono text-xs text-[#c9a84c] tracking-widest mt-2">{qrToken}</p>
              <p className="text-[11px] text-white/50 mt-1 font-serif italic">Tunjukkan tiket QR ini pada resepsionis di lokasi acara.</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#141414] border-t border-[#c9a84c]/30 flex gap-2 font-sans shrink-0">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-[#c9a84c] hover:bg-[#b5953e] text-black font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Simpan Gambar E-Pass</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-2xl bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. BATIK JAWA HERITAGE THEME (KRATON BROWN & GOLD)
  if (isBatik) {
    return (
      <div className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#2D1B0E] rounded-3xl shadow-2xl border-2 border-[#B8860B]/60 text-[#FDF6E3] max-h-[92vh] flex flex-col font-serif overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3D2B1F] via-[#2D1B0E] to-[#3D2B1F] p-6 border-b border-[#B8860B]/40 text-center relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#D4A853] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4A853] block mb-1">
              SERAT TIKET HARIRESMI
            </span>
            <h2 className="text-2xl font-bold tracking-wide text-[#FDF6E3]">{coupleTitle}</h2>
            {eventDate && <p className="text-xs text-[#D4A853]/90 mt-1">{eventDate} {venueName ? `• ${venueName}` : ""}</p>}
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1" ref={ticketRef}>
            <div className="p-4 rounded-2xl bg-[#3D2B1F]/90 border border-[#B8860B]/40 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#D4A853]/70 uppercase tracking-wider block">
                    Katur Dhumateng:
                  </span>
                  <h3 className="text-lg font-bold text-[#FDF6E3] leading-snug">{guestName}</h3>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#B8860B]/30 text-[#fef08a] border border-[#B8860B]">
                  {guestCategory || "Reguler"}
                </span>
              </div>

              {guestAddress && (
                <div className="flex items-center gap-1.5 text-xs text-[#D4A853] pt-1.5 border-t border-[#B8860B]/30">
                  <MapPin className="w-3.5 h-3.5 text-[#D4A853] shrink-0" />
                  <span>Pinangka: {guestAddress}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#B8860B]/30 text-xs">
                <div>
                  <span className="text-[10px] text-white/50 block">Cacahing Tamu</span>
                  <span className="font-bold text-[#FDF6E3]">{guestCount} Pax</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block">Meja Palenggahan</span>
                  <span className="font-bold text-[#D4A853]">{tableNumber || "Bebas"}</span>
                </div>
              </div>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#3D2B1F]/60 border border-[#B8860B]/40 text-center">
              {qrDataUrl && (
                <div className="p-3 bg-[#FDF6E3] rounded-2xl border border-[#B8860B] shadow-md">
                  <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 mx-auto rounded-xl" />
                </div>
              )}
              <p className="font-mono text-xs text-[#D4A853] tracking-widest mt-2">{qrToken}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#3D2B1F] border-t border-[#B8860B]/40 flex gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-[#B8860B] hover:bg-[#9a7009] text-[#2D1B0E] font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Simpan Tiket QR</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-2xl bg-transparent hover:bg-white/10 text-white border border-[#B8860B]/40 text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. PIXEL ADVENTURE THEME (8-BIT RETRO RPG)
  if (isPixel) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#202531] rounded-none shadow-[6px_6px_0px_#000] border-4 border-[#fceb00] text-white max-h-[92vh] flex flex-col font-mono overflow-hidden">
          {/* Header */}
          <div className="bg-[#1a1c23] p-5 border-b-4 border-[#fceb00] text-center relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-[#fceb00] text-black font-bold flex items-center justify-center border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#fceb00] font-bold block uppercase tracking-wider mb-1">
              ⭐ ITEM: QUEST_PASS_TICKET ⭐
            </span>
            <h2 className="text-lg font-bold text-white uppercase">{coupleTitle}</h2>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1" ref={ticketRef}>
            <div className="p-4 bg-[#14161d] border-2 border-white space-y-2">
              <span className="text-[10px] text-[#fceb00] block">PLAYER_NAME:</span>
              <h3 className="text-base font-bold text-white">{guestName}</h3>
              {guestAddress && <p className="text-xs text-white/70">ORIGIN: {guestAddress}</p>}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/20">
                <div>PAX: <span className="text-[#fceb00]">{guestCount}</span></div>
                <div>TABLE: <span className="text-[#fceb00]">{tableNumber || "ANY"}</span></div>
              </div>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-black">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 mx-auto" />}
              <p className="font-mono text-xs text-black font-bold mt-2">{qrToken}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#1a1c23] border-t-4 border-[#fceb00] flex gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 bg-[#fceb00] hover:bg-[#e0d200] text-black font-bold text-xs border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD_ITEM</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-[#2b303c] text-white border-2 border-black text-xs font-bold cursor-pointer"
            >
              EXIT
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. CINEMATIC EDITORIAL THEME (THE WEDDING JOURNAL / VOGUE LUXURY)
  if (isEditorial) {
    return (
      <div className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#0d0d11] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-[#e8d5b5]/40 text-[#fdfbf7] max-h-[92vh] flex flex-col font-sans overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-b from-[#181822] via-[#121218] to-[#0d0d11] p-6 border-b border-white/10 text-center relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#e8d5b5] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Tutup Tiket"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#e8d5b5] font-semibold">
                THE WEDDING JOURNAL • GUEST PASS
              </span>
            </div>
            <h2 className="text-2xl font-serif font-light tracking-tight text-[#fdfbf7] leading-snug">
              {coupleTitle}
            </h2>
            {eventDate && (
              <p className="text-[11px] text-neutral-400 font-mono tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#e8d5b5]" />
                <span>{eventDate}</span>
                {venueName && <span>• {venueName}</span>}
              </p>
            )}
          </div>

          {/* Ticket Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1" ref={ticketRef}>
            {/* Guest Identity Card */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#e8d5b5] block">
                    ESTEEMED GUEST
                  </span>
                  <h3 className="text-lg font-serif text-[#fdfbf7] font-normal leading-snug mt-0.5">
                    {guestName}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                    isVip
                      ? "bg-[#e8d5b5]/20 text-[#fef08a] border-[#e8d5b5]"
                      : "bg-white/10 text-white/90 border-white/20"
                  }`}
                >
                  {guestCategory || "Reguler"}
                </span>
              </div>

              {guestAddress && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-300 pt-2 border-t border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-[#e8d5b5] shrink-0" />
                  <span className="font-sans">Domisili: {guestAddress}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
                    Alokasi Kuota
                  </span>
                  <span className="font-bold text-[#fdfbf7] font-mono">{guestCount} Pax</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
                    Nomor Meja
                  </span>
                  <span className="font-bold text-[#e8d5b5] font-mono">{tableNumber || "Bebas"}</span>
                </div>
              </div>

              {sessionName && (
                <div className="text-xs text-neutral-300 bg-white/[0.03] p-2 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider">
                    Sesi Acara
                  </span>
                  <span className="font-medium text-white">{sessionName}</span>
                </div>
              )}
            </div>

            {/* QR Code Presentation Box */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-[#e8d5b5]/30 text-center">
              {isGenerating ? (
                <div className="w-44 h-44 flex items-center justify-center">
                  <span className="text-xs text-neutral-400 font-mono animate-pulse">Menyiapkan QR Pass...</span>
                </div>
              ) : qrDataUrl ? (
                <div className="space-y-2.5">
                  <div className="p-3 bg-[#fdfbf7] rounded-2xl border border-[#e8d5b5] shadow-xl inline-block">
                    <img
                      src={qrDataUrl}
                      alt={`QR Code Presensi ${guestName}`}
                      className="w-44 h-44 object-contain mx-auto rounded-xl"
                    />
                  </div>
                  <p className="font-mono text-xs font-bold text-[#e8d5b5] tracking-widest">
                    {qrToken}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-rose-400">Gagal memuat kode QR</p>
              )}

              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-neutral-400 max-w-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#e8d5b5] shrink-0" />
                <p className="text-[11px] font-serif italic leading-tight text-neutral-300">
                  Tunjukkan tiket E-Pass ini kepada resepsionis di lokasi acara untuk presensi cepat.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#111116] border-t border-white/10 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!qrDataUrl}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#e8d5b5] via-[#f5ede0] to-[#d8c3a0] hover:from-[#f3e7cf] hover:to-[#e0cdad] active:scale-[0.98] text-[#111115] font-bold text-xs uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(232,213,181,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#111115]" />
              <span>Simpan Gambar QR</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl font-mono text-xs uppercase tracking-wider border border-white/20 hover:bg-white/10 text-white/90 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. CINEMATIC IVORY / DARK CINEMATIC FILM THEME (MIDNIGHT NOIR & PLATINUM)
  if (isCinematicIvory) {
    return (
      <div className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#0c0d0e] rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.9)] border border-[#d4c4b0]/40 text-[#f5f3ef] max-h-[92vh] flex flex-col font-sans overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-b from-[#18191f] via-[#121317] to-[#0c0d0e] p-6 border-b border-white/10 text-center relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#d4c4b0] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Tutup Tiket"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <Sparkles className="w-3 h-3 text-[#d4c4b0]" />
              <span className="text-[9.5px] font-mono tracking-[0.3em] uppercase text-[#d4c4b0] font-semibold">
                OFFICIAL GUEST PASS &bull; ISSUE 2026
              </span>
            </div>
            <h2 className="text-2xl font-serif font-light tracking-tight text-[#f5f3ef] leading-snug">
              {coupleTitle}
            </h2>
            {eventDate && (
              <p className="text-[11px] text-[#b0b0b8] font-sans tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                <Calendar className="w-3 h-3 text-[#d4c4b0]" />
                <span>{eventDate}</span>
                {venueName && <span>• {venueName}</span>}
              </p>
            )}
          </div>

          {/* Ticket Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1" ref={ticketRef}>
            {/* Guest Identity Card */}
            <div className="p-4 rounded-2xl bg-[#141519] border border-white/10 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#d4c4b0] block">
                    TAMU KEHORMATAN
                  </span>
                  <h3 className="text-lg font-serif text-[#f5f3ef] font-normal leading-snug mt-0.5">
                    {guestName}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                    isVip
                      ? "bg-[#d4c4b0]/20 text-[#f5f3ef] border-[#d4c4b0]"
                      : "bg-white/10 text-white/90 border-white/20"
                  }`}
                >
                  {guestCategory || "Reguler"}
                </span>
              </div>

              {guestAddress && (
                <div className="flex items-center gap-1.5 text-xs text-[#b0b0b8] pt-2 border-t border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-[#d4c4b0] shrink-0" />
                  <span>Domisili: {guestAddress}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-[#8a8b90] block uppercase tracking-wider">
                    Alokasi Kuota
                  </span>
                  <span className="font-bold text-[#f5f3ef]">{guestCount} Pax</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8a8b90] block uppercase tracking-wider">
                    Nomor Meja
                  </span>
                  <span className="font-bold text-[#d4c4b0]">{tableNumber || "Bebas"}</span>
                </div>
              </div>

              {sessionName && (
                <div className="text-xs text-[#b0b0b8] bg-white/[0.03] p-2 rounded-xl border border-white/10">
                  <span className="text-[10px] text-[#8a8b90] block uppercase tracking-wider">
                    Sesi Acara
                  </span>
                  <span className="font-medium text-[#f5f3ef]">{sessionName}</span>
                </div>
              )}
            </div>

            {/* QR Code Presentation Box */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#121316] border border-white/10 text-center">
              {isGenerating ? (
                <div className="w-44 h-44 flex items-center justify-center bg-[#141519] rounded-2xl border border-white/10">
                  <QrCode className="w-8 h-8 text-[#d4c4b0] animate-pulse" />
                </div>
              ) : qrDataUrl ? (
                <div className="space-y-2.5">
                  <div className="p-3.5 bg-[#f5f3ef] rounded-2xl border border-[#d4c4b0]/50 shadow-xl inline-block">
                    <img
                      src={qrDataUrl}
                      alt={`QR Code Presensi ${guestName}`}
                      className="w-44 h-44 object-contain mx-auto rounded-xl block"
                    />
                  </div>
                  <p className="font-mono text-xs font-bold text-[#d4c4b0] tracking-widest">
                    {qrToken}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-rose-400">Gagal memuat kode QR</p>
              )}

              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#8a8b90] max-w-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4c4b0] shrink-0" />
                <p className="text-[11px] font-serif italic leading-tight text-[#dcd8cf]">
                  Tunjukkan tiket E-Pass ini kepada resepsionis di lokasi acara untuk presensi cepat.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#121316] border-t border-white/10 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!qrDataUrl}
              className="flex-1 py-3 px-4 rounded-full bg-[#d4c4b0] hover:bg-[#c2b09a] active:scale-[0.98] text-[#0c0d0e] font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              <Download className="w-4 h-4 text-[#0c0d0e]" />
              <span>Simpan Gambar E-Pass</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-full text-xs uppercase tracking-wider border border-white/20 hover:bg-white/10 text-white/90 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 7. VINTAGE ROYAL THEME (TUSCAN ESTATE / WARM CHARCOAL & ANTIQUE GOLD)
  if (isVintageRoyal) {
    return (
      <div className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#141517] rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.9)] border border-[#d5be9b]/35 text-[#f8f6f0] max-h-[92vh] flex flex-col font-sans overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-b from-[#1c1e22] via-[#16171a] to-[#141517] p-6 border-b border-[#d5be9b]/20 text-center relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#d5be9b] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Tutup Tiket"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Crest / Subtitle */}
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Crown className="w-3.5 h-3.5 text-[#d5be9b]" />
              <span className="text-[9.5px] font-sans tracking-[0.3em] uppercase text-[#d5be9b] font-medium">
                ROYAL INVITATION &bull; GUEST PASS
              </span>
            </div>

            {/* Couple Heading */}
            <h2 className="text-2xl font-serif font-normal tracking-wide text-[#f8f6f0] leading-snug">
              {coupleTitle}
            </h2>

            {/* Tuscan Fleuron Hairline */}
            <div className="flex items-center justify-center gap-2 my-2 opacity-70">
              <div className="w-10 h-px bg-[#d5be9b]/40" />
              <span className="text-[10px] text-[#d5be9b] select-none">✦</span>
              <div className="w-10 h-px bg-[#d5be9b]/40" />
            </div>

            {/* Event Date & Venue */}
            {eventDate && (
              <p className="text-[11px] text-[#b8b5ad] font-sans tracking-wider flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d5be9b]" />
                <span>{formatDisplayDate(eventDate)}</span>
                {venueName && <span>&bull; {venueName}</span>}
              </p>
            )}
          </div>

          {/* Ticket Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1" ref={ticketRef}>
            {/* Guest Identity Card */}
            <div className="p-4 rounded-2xl bg-[#1c1e22] border border-[#d5be9b]/25 space-y-3 relative shadow-inner">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#d5be9b] block">
                    Tamu Kehormatan
                  </span>
                  <h3 className="text-lg font-serif text-[#f8f6f0] font-normal leading-snug mt-0.5">
                    {guestName}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                    isVip
                      ? "bg-[#9b3b32]/25 text-[#f8f6f0] border-[#d5be9b]/60 shadow-[0_0_12px_rgba(155,59,50,0.3)]"
                      : "bg-[#141517] text-[#d5be9b] border-[#d5be9b]/30"
                  }`}
                >
                  {isVip && <Crown className="w-2.5 h-2.5 text-[#d5be9b]" />}
                  {guestCategory || "Reguler"}
                </span>
              </div>

              {guestAddress && (
                <div className="flex items-center gap-1.5 text-xs text-[#b8b5ad] pt-2 border-t border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-[#d5be9b] shrink-0" />
                  <span className="font-sans">Domisili: {guestAddress}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] font-sans text-[#7c7970] block uppercase tracking-wider">
                    Alokasi Kuota
                  </span>
                  <span className="font-medium text-[#f8f6f0]">{guestCount} Pax</span>
                </div>
                <div>
                  <span className="text-[10px] font-sans text-[#7c7970] block uppercase tracking-wider">
                    Nomor Meja
                  </span>
                  <span className="font-medium text-[#d5be9b]">{tableNumber || "Bebas / Menyesuaikan"}</span>
                </div>
              </div>

              {sessionName && (
                <div className="text-xs text-[#b8b5ad] bg-white/[0.03] p-2 rounded-xl border border-white/10">
                  <span className="text-[10px] font-sans text-[#7c7970] block uppercase tracking-wider">
                    Sesi Acara
                  </span>
                  <span className="font-medium text-[#f8f6f0]">{sessionName}</span>
                </div>
              )}
            </div>

            {/* QR Code Presentation Box */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#1c1e22]/70 border border-[#d5be9b]/30 text-center relative overflow-hidden">
              {/* Tuscan filigree corner brackets */}
              <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#d5be9b]/40 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#d5be9b]/40 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#d5be9b]/40 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#d5be9b]/40 pointer-events-none" />

              {isGenerating ? (
                <div className="w-44 h-44 flex items-center justify-center bg-[#141517] rounded-2xl border border-white/10">
                  <QrCode className="w-8 h-8 text-[#d5be9b] animate-pulse" />
                </div>
              ) : qrDataUrl ? (
                <div className="space-y-2.5">
                  <div className="p-3 bg-[#f8f6f0] rounded-2xl border-2 border-[#d5be9b]/60 shadow-[0_8px_30px_rgba(0,0,0,0.6)] inline-block">
                    <img
                      src={qrDataUrl}
                      alt={`QR Code Presensi ${guestName}`}
                      className="w-44 h-44 object-contain mx-auto rounded-xl block"
                    />
                  </div>
                  <p className="font-mono text-xs font-semibold text-[#d5be9b] tracking-widest">
                    {qrToken}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-rose-400">Gagal memuat kode QR</p>
              )}

              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#b8b5ad] max-w-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d5be9b] shrink-0" />
                <p className="text-[11px] font-serif italic leading-tight text-[#b8b5ad]">
                  Tunjukkan kode QR ini kepada penerima tamu di lokasi acara untuk presensi cepat.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#18191d] border-t border-white/10 flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 w-full">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!qrDataUrl}
                className="flex-1 h-11 px-4 rounded-xl bg-[#141517] hover:bg-[#d5be9b] active:scale-[0.98] border border-[#d5be9b]/50 hover:border-[#d5be9b] text-[#f8f6f0] hover:text-[#141517] font-sans font-medium text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md group"
              >
                <Download className="w-4 h-4 text-[#d5be9b] group-hover:text-[#141517] transition-colors" />
                <span className="group-hover:text-[#141517] transition-colors">Simpan Gambar E-Pass</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-5 rounded-xl text-xs uppercase font-sans tracking-wider border border-white/15 hover:border-[#d5be9b]/40 hover:bg-white/5 text-[#b8b5ad] hover:text-[#f8f6f0] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {/* Mandatory Official Hayvows Backlink */}
            <div className="text-center pt-1">
              <a
                href="https://www.hayvows.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9.5px] font-sans tracking-[0.25em] text-[#7c7970] hover:text-[#d5be9b] transition-colors"
              >
                WWW.HAYVOWS.COM
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 8. NATURE FLORAL & MODERN MONOGRAM (STANDARD ELEGANT HAYVOWS)
  return (
    <div className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 text-slate-900 max-h-[92vh] flex flex-col">
        {/* Header Ticket Banner */}
        <div className="bg-gradient-to-r from-[#2d4a3e] via-[#3a6151] to-[#2d4a3e] p-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup Tiket"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-white/20 text-[#fef08a]">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
              E-Pass • Tiket Masuk Undangan
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-white tracking-wide truncate">
            {coupleTitle}
          </h2>
          {eventDate && (
            <p className="text-xs text-emerald-100/90 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{eventDate}</span>
              {venueName && <span>• {venueName}</span>}
            </p>
          )}
        </div>

        {/* Ticket Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1" ref={ticketRef}>
          {/* Guest Identity Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Nama Tamu Undangan
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {guestName}
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                  isVip
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-emerald-100 text-[#2d4a3e] border border-emerald-300"
                }`}
              >
                {guestCategory || "Reguler"}
              </span>
            </div>

            {guestAddress && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium">Asal: {guestAddress}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block">Kuota Undangan</span>
                <span className="font-bold">{guestCount} Orang (Pax)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Nomor Meja</span>
                <span className="font-bold text-[#2d4a3e]">
                  {tableNumber || "Bebas / Menyesuaikan"}
                </span>
              </div>
            </div>

            {sessionName && (
              <div className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block">Sesi Acara</span>
                <span className="font-semibold text-slate-800">{sessionName}</span>
              </div>
            )}
          </div>

          {/* QR Code Presentation Box */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border-2 border-dashed border-[#2d4a3e]/30 text-center">
            {isGenerating ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <span className="text-xs text-slate-400 animate-pulse">Menyiapkan QR Code...</span>
              </div>
            ) : qrDataUrl ? (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-100 inline-block">
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Presensi ${guestName}`}
                    className="w-48 h-48 object-contain mx-auto rounded-xl"
                  />
                </div>
                <p className="font-mono text-[11px] font-semibold text-slate-500 tracking-wider">
                  {qrToken}
                </p>
              </div>
            ) : (
              <p className="text-xs text-rose-500">Gagal memuat kode QR</p>
            )}

            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 max-w-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-[11px] leading-tight text-left">
                Tunjukkan kode QR ini kepada penerima tamu di lokasi acara untuk presensi cepat tanpa antre.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#fef08a]" />
            <span>Simpan Gambar QR</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-2xl font-semibold text-xs border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

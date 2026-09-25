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

  // Theme-specific QR colors & styles
  const isCyberpunk = templateSlug === "pixel-cyberpunk";
  const isNoir = templateSlug === "eternal-noir";
  const isBatik = templateSlug === "batik-jawa";
  const isPixel = templateSlug === "pixel-adventure";
  const isMonogram = templateSlug === "modern-monogram";

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
        <div className="relative w-full max-w-md bg-[#0a0a14] rounded-none shadow-[0_0_30px_rgba(0,240,255,0.3)] border-2 border-[#00f0ff] text-white max-h-[92vh] flex flex-col font-mono">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#00f0ff]/20 via-[#ff003c]/20 to-[#00f0ff]/20 p-5 border-b-2 border-[#00f0ff] relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/40 text-[#00f0ff] flex items-center justify-center border border-[#00f0ff] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-1 text-[#fcee0a] text-[11px] font-bold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>[CYBER-PASS &bull; E-TICKET]</span>
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
          <div className="p-4 bg-[#121224] border-t-2 border-[#00f0ff] flex gap-2">
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
        <div className="relative w-full max-w-md bg-[#0d0d0d] rounded-2xl shadow-2xl border border-[#c9a84c]/50 text-white max-h-[92vh] flex flex-col font-serif">
          {/* Header */}
          <div className="bg-gradient-to-b from-[#181818] to-[#0d0d0d] p-6 border-b border-[#c9a84c]/30 text-center relative">
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
            {eventDate && <p className="text-xs text-white/60 font-sans mt-1">{eventDate} {venueName ? `&bull; ${venueName}` : ""}</p>}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1 font-sans" ref={ticketRef}>
            <div className="p-4 rounded-xl bg-[#141414] border border-[#c9a84c]/30 space-y-2.5">
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
            <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-[#121212] border border-[#c9a84c]/40 text-center">
              {qrDataUrl && (
                <div className="p-2.5 bg-[#0a0a0a] rounded-lg border border-[#c9a84c]/60 shadow-lg">
                  <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 mx-auto" />
                </div>
              )}
              <p className="font-mono text-xs text-[#c9a84c] tracking-widest mt-2">{qrToken}</p>
              <p className="text-[11px] text-white/50 mt-1 font-serif italic">Tunjukkan tiket QR ini pada resepsionis di lokasi acara.</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#141414] border-t border-[#c9a84c]/30 flex gap-2 font-sans">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#c9a84c] hover:bg-[#b5953e] text-black font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Simpan Gambar E-Pass</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs transition-colors cursor-pointer"
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
        <div className="relative w-full max-w-md bg-[#2D1B0E] rounded-2xl shadow-2xl border-2 border-[#B8860B]/60 text-[#FDF6E3] max-h-[92vh] flex flex-col font-serif">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3D2B1F] via-[#2D1B0E] to-[#3D2B1F] p-6 border-b border-[#B8860B]/40 text-center relative">
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
            {eventDate && <p className="text-xs text-[#D4A853]/90 mt-1">{eventDate} {venueName ? `&bull; ${venueName}` : ""}</p>}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1" ref={ticketRef}>
            <div className="p-4 rounded-xl bg-[#3D2B1F]/90 border border-[#B8860B]/40 space-y-2.5">
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
            <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-[#3D2B1F]/60 border border-[#B8860B]/40 text-center">
              {qrDataUrl && (
                <div className="p-2.5 bg-[#FDF6E3] rounded-lg border border-[#B8860B] shadow-md">
                  <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 mx-auto" />
                </div>
              )}
              <p className="font-mono text-xs text-[#D4A853] tracking-widest mt-2">{qrToken}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#3D2B1F] border-t border-[#B8860B]/40 flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#B8860B] hover:bg-[#9a7009] text-[#2D1B0E] font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Simpan Tiket QR</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-transparent hover:bg-white/10 text-white border border-[#B8860B]/40 text-xs transition-colors cursor-pointer"
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
        <div className="relative w-full max-w-md bg-[#202531] rounded-none shadow-[6px_6px_0px_#000] border-4 border-[#fceb00] text-white max-h-[92vh] flex flex-col font-mono">
          {/* Header */}
          <div className="bg-[#1a1c23] p-5 border-b-4 border-[#fceb00] text-center relative">
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
          <div className="p-4 bg-[#1a1c23] border-t-4 border-[#fceb00] flex gap-2">
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

  // 5. NATURE FLORAL & MODERN MONOGRAM (STANDARD ELEGANT HAYVOWS)
  return (
    <div className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 text-slate-900 max-h-[92vh] flex flex-col">
        {/* Header Ticket Banner */}
        <div className="bg-gradient-to-r from-[#2d4a3e] via-[#3a6151] to-[#2d4a3e] p-5 text-white relative">
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
              E-Pass &bull; Tiket Masuk Undangan
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-white tracking-wide truncate">
            {coupleTitle}
          </h2>
          {eventDate && (
            <p className="text-xs text-emerald-100/90 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{eventDate}</span>
              {venueName && <span>&bull; {venueName}</span>}
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
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100 inline-block">
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Presensi ${guestName}`}
                    className="w-48 h-48 object-contain mx-auto"
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
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#fef08a]" />
            <span>Simpan Gambar QR</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

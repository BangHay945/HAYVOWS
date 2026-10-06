"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, MailOpen } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

interface CoverProps extends TemplateComponentProps {
  onOpen: () => void;
  onOpenTicket?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function formatEventDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d
    .toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

function CornerFiligree({ className = "w-5 h-5 text-[#d5be9b]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M2 34V12C2 6.477 6.477 2 12 2H34"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6 30V14C6 9.582 9.582 6 14 6H30"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="2" cy="34" r="1" fill="currentColor" />
      <circle cx="34" cy="2" r="1" fill="currentColor" />
    </svg>
  );
}

export function VintageRoyalCover({
  context,
  onOpen,
  onOpenTicket,
}: CoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  const couple = context.wedding?.couple;
  const events = context.wedding?.events;
  const guest = context.guest;

  const groomName = couple?.groomNickname || couple?.groomName || "Alexander";
  const brideName = couple?.brideNickname || couple?.brideName || "Sara";
  const couplePhoto =
    couple?.couplePhoto?.trim() ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";
  const eventDate = events?.[0]?.date;
  const displayDate = formatEventDate(eventDate);

  // Monogram initials for the wax seal
  const groomInitial = (couple?.groomNickname || couple?.groomName || "A").charAt(0).toUpperCase();
  const brideInitial = (couple?.brideNickname || couple?.brideName || "S").charAt(0).toUpperCase();
  const monogram = `${groomInitial}&${brideInitial}`;

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    onOpen();
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center px-6 py-8 sm:py-12 select-none bg-[#141517]">
      {/* Background Image with Ken Burns Zoom & Tuscan Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={couplePhoto}
          alt={`${groomName} & ${brideName}`}
          className="w-full h-full object-cover object-center animate-[vr-zoom_20s_ease-out_infinite_alternate]"
          style={{ willChange: "transform" }}
        />
        {/* Architectural Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(20,21,23,0.38) 0%, rgba(20,21,23,0.76) 70%, rgba(20,21,23,0.96) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141517] via-transparent to-[#141517]/80" />
      </div>

      {/* Frame Hairline Arch Border with Corner Filigrees */}
      <div className="absolute inset-3 sm:inset-5 border border-[#d5be9b]/30 rounded-2xl pointer-events-none z-10">
        <div className="absolute top-1 left-1">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
        <div className="absolute top-1 right-1 -scale-x-100">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
        <div className="absolute bottom-1 left-1 -scale-y-100">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
        <div className="absolute bottom-1 right-1 -scale-x-100 -scale-y-100">
          <CornerFiligree className="w-5 h-5 text-[#d5be9b]" />
        </div>
      </div>

      {/* ── TOP: Brand & Category Subtitle ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative z-20 flex flex-col items-center gap-1.5 pt-2"
      >
        <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.35em] text-[#d5be9b] uppercase">
          THE WEDDING OF
        </span>
        <div className="w-8 h-px bg-[#d5be9b]/40" />
      </motion.div>

      {/* ── CENTER: Couple Names & Digital Wax Seal ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        className="relative z-20 flex flex-col items-center max-w-sm"
      >
        {/* Monogram Seal */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#1c1e22]/90 border border-[#d5be9b]/50 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center justify-center relative group">
            {/* Wax seal ring impression */}
            <div className="absolute inset-1 rounded-full border border-dashed border-[#d5be9b]/35 animate-[spin_60s_linear_infinite]" />
            <span className="text-xl sm:text-2xl font-serif font-light text-[#f8f6f0] tracking-wider select-none">
              {monogram}
            </span>
            {/* Soft ambient wax seal glow */}
            <div className="absolute -inset-1 rounded-full bg-[#c06c54]/15 blur-sm pointer-events-none" />
          </div>
        </div>

        {/* Heading Names */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#f8f6f0] tracking-wide leading-tight">
          <span>{groomName}</span>
          <span className="block text-2xl sm:text-3xl font-serif italic text-[#d5be9b] my-1">
            &amp;
          </span>
          <span>{brideName}</span>
        </h1>

        {displayDate && (
          <p className="mt-4 text-[11px] sm:text-xs font-sans tracking-[0.25em] text-[#b8b5ad] uppercase">
            {displayDate}
          </p>
        )}
      </motion.div>

      {/* ── BOTTOM: Guest Greeting & Action Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
        className="relative z-20 flex flex-col items-center gap-4 w-full max-w-xs pb-2"
      >
        {/* Guest Card */}
        {guest?.name && (
          <div className="w-full bg-[#1c1e22]/85 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-center shadow-lg">
            <span className="text-[10px] font-sans tracking-[0.2em] text-[#b8b5ad] uppercase block">
              Kepada Yth.
            </span>
            <span className="text-sm font-serif font-medium text-[#f8f6f0] tracking-wide truncate block mt-0.5">
              {guest.name}
            </span>
            {guest.tableNumber && (
              <span className="text-[10px] text-[#d5be9b] font-mono block mt-0.5">
                Meja / Kursi: {guest.tableNumber}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons: Open Invitation FIRST, QR Ticket SECOND */}
        <div className="w-full flex flex-col gap-2.5">
          {/* 1. Tombol Buka Undangan (Utama) */}
          <button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            className="w-full h-12 rounded-xl bg-[#18191d] hover:bg-[#d5be9b] border border-[#d5be9b]/50 hover:border-[#d5be9b] text-[#f8f6f0] hover:text-[#141517] text-xs font-sans font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.6)] group active:scale-[0.98]"
          >
            <MailOpen className="w-4 h-4 text-[#d5be9b] group-hover:text-[#141517] transition-colors" />
            <span className="group-hover:text-[#141517] transition-colors">Buka Undangan</span>
          </button>

          {/* 2. Tombol QR Code Tiket (Di Bawah Tombol Buka Undangan) */}
          {onOpenTicket && (
            <button
              type="button"
              onClick={onOpenTicket}
              className="w-full h-11 rounded-xl bg-[#1c1e22]/90 hover:bg-[#d5be9b] border border-white/10 hover:border-[#d5be9b] text-[#f8f6f0] hover:text-[#141517] text-xs font-sans font-medium tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group"
            >
              <QrCode className="w-4 h-4 text-[#d5be9b] group-hover:text-[#141517] transition-colors" />
              <span className="group-hover:text-[#141517] transition-colors">Lihat QR Code Tiket Tamu</span>
            </button>
          )}
        </div>

        {/* Mandatory Official Hayvows Backlink */}
        <div className="pt-1">
          <a
            href="https://www.hayvows.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-sans tracking-[0.2em] text-[#7c7970] hover:text-[#d5be9b] transition-colors"
          >
            THE WEDDING OF &bull; WWW.HAYVOWS.COM
          </a>
        </div>
      </motion.div>

      {/* Global CSS for subtle Ken Burns zoom */}
      <style>{`
        @keyframes vr-zoom {
          from { transform: scale(1.0); }
          to   { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

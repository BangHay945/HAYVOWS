"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { QrCode, MailOpen } from "lucide-react";
import { RoyalCrown, RoyalDivider, RoyalCorner, RoyalSeal } from "./Ornaments";

interface CoverProps extends TemplateComponentProps {
  onOpen: () => void;
  onOpenTicket?: () => void;
}

export function RoyalCover({ context, onOpen, onOpenTicket }: CoverProps) {
  const { wedding, guest } = context;
  const couple = wedding.couple;
  const events = wedding.events ?? [];
  const firstEvent = events[0];

  const coupleImage =
    couple?.couplePhoto && couple.couplePhoto.trim() !== ""
      ? couple.couplePhoto
      : null;

  const groomName = couple?.groomNickname || couple?.groomName || "Arthur";
  const brideName = couple?.brideNickname || couple?.brideName || "Guinevere";
  const coupleInitials = `${groomName.charAt(0)}&${brideName.charAt(0)}`;

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-[#02241b] text-[#fdfbf7] select-none">
      {/* Background Image / Texture with Emerald & Gold Vignette */}
      {coupleImage ? (
        <div className="absolute inset-0">
          <img
            src={coupleImage}
            alt={`${groomName} & ${brideName}`}
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.45) contrast(1.1) saturate(0.8)" }}
          />
          {/* Deep emerald velvet gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 35%, rgba(6,78,59,0.3) 0%, rgba(2,36,27,0.85) 60%, rgba(2,20,15,0.98) 100%)",
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #064e3b 0%, #022c22 45%, #021a13 100%)",
          }}
        />
      )}

      {/* Royal Corner Filigree Ornaments */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <RoyalCorner className="w-12 h-12 text-[#d4af37]/60" position="top-left" />
      </div>
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <RoyalCorner className="w-12 h-12 text-[#d4af37]/60" position="top-right" />
      </div>
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <RoyalCorner className="w-12 h-12 text-[#d4af37]/60" position="bottom-left" />
      </div>
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <RoyalCorner className="w-12 h-12 text-[#d4af37]/60" position="bottom-right" />
      </div>

      {/* Top Header / Royal Monogram */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 pt-10 text-center flex flex-col items-center"
      >
        <RoyalSeal initials={coupleInitials} className="w-16 h-16 sm:w-20 sm:h-20" />
        <p className="mt-4 text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-[#d4af37] font-semibold">
          The Royal Wedding Invitation
        </p>
      </motion.div>

      {/* Center Couple Names & Date */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 w-full max-w-md mx-auto px-6 text-center my-auto py-2"
      >
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#fdfbf7] leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {groomName}
        </h1>

        <RoyalDivider className="max-w-[220px] mx-auto my-3" />

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#fdfbf7] leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {brideName}
        </h1>

        {firstEvent?.date && (
          <p className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#d4af37] font-medium mt-4">
            {new Date(firstEvent.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </motion.div>

      {/* Bottom Guest Invitation & Open Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        className="relative z-10 w-full max-w-sm mx-auto px-6 pb-10 text-center flex flex-col items-center"
      >
        {/* Guest Pill */}
        <div className="w-full bg-[#063c2f]/80 backdrop-blur-md border border-[#d4af37]/40 rounded-2xl py-3 px-4 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#d4af37]/80 mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <p className="font-serif text-lg sm:text-xl text-[#fdfbf7] font-semibold tracking-wide">
            {guest?.name || "Tamu Undangan Terhormat"}
          </p>
          {guest?.address && (
            <p className="text-[10px] text-[#b8c9c1] mt-0.5 tracking-wider">
              {guest.address}
            </p>
          )}
        </div>

        {/* Open Button with Gold Shimmer */}
        <div className="w-full flex flex-col gap-2.5 items-center">
          <button
            type="button"
            onClick={onOpen}
            className="w-full relative group overflow-hidden py-3.5 px-6 rounded-xl font-serif text-sm tracking-[0.2em] uppercase font-bold text-[#02241b] shadow-[0_4px_25px_rgba(212,175,55,0.4)] transition-all duration-300 hover:shadow-[0_4px_35px_rgba(212,175,55,0.65)] hover:scale-[1.02] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #fff2cc 0%, #e5c158 50%, #aa820a 100%)",
            }}
          >
            {/* Shimmer reflection */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center justify-center gap-2">
              <MailOpen className="w-4 h-4 text-[#02241b]" />
              <span>Buka Undangan</span>
            </span>
          </button>

          {/* Optional E-Pass QR Ticket Button */}
          {onOpenTicket && (
            <button
              type="button"
              onClick={onOpenTicket}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#d4af37] hover:text-[#fff2cc] transition-colors py-1 cursor-pointer tracking-wider"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Lihat E-Pass Presensi QR</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

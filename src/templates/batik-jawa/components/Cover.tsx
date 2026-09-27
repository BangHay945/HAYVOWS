"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { GununganTop, SulurDivider } from "./Ornaments";
import { QrCode } from "lucide-react";

interface CoverProps extends TemplateComponentProps {
  onOpen: () => void;
  onOpenTicket?: () => void;
}

export function BatikJawaCover({ context, onOpen, onOpenTicket }: CoverProps) {
  const { wedding, guest } = context;
  const couple = wedding.couple;
  const events = wedding.events ?? [];
  const firstEvent = events[0];

  const coupleImage =
    couple?.couplePhoto && couple.couplePhoto.trim() !== ""
      ? couple.couplePhoto
      : null;

  const groomName = couple?.groomNickname || couple?.groomName || "Prasetyo";
  const brideName = couple?.brideNickname || couple?.brideName || "Kinanti";

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center overflow-hidden select-none touch-none bg-[#2D1B0E]">
      {/* Foto mempelai */}
      {coupleImage ? (
        <div className="absolute inset-0">
          <img
            src={coupleImage}
            alt={`${groomName} & ${brideName}`}
            className="w-full h-full object-cover"
            style={{ filter: "sepia(0.45) brightness(0.45) contrast(1.1)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(45,27,14,0.97) 0%, rgba(45,27,14,0.55) 50%, rgba(45,27,14,0.4) 100%)",
            }}
          />
        </div>
      ) : (
        /* Fallback: background tekstur batik coklat gelap */
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #4A2C12 0%, #2D1B0E 70%)",
          }}
        />
      )}

      {/* Pola background diagonal — motif parang sangat halus */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #B8860B 0px, #B8860B 1px, transparent 1px, transparent 12px)",
        }}
      />

      {/* Konten tengah */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 w-full max-w-sm mx-auto px-5 sm:px-8 py-3 sm:py-6 text-center flex flex-col items-center justify-center"
      >
        {/* Ornamen gunungan atas */}
        <GununganTop color="#B8860B" width={64} height={42} className="mb-2 sm:mb-3 opacity-90 sm:w-20 sm:h-14" />

        {/* Label */}
        <p
          className="font-jawa-body text-[9px] sm:text-[10px] tracking-[0.35em] sm:tracking-[0.45em] uppercase text-[#D4A853] mb-2 sm:mb-3 opacity-80"
          style={{ fontStyle: "normal" }}
        >
          Undangan Pernikahan
        </p>

        {/* Divider atas emas */}
        <SulurDivider color="#B8860B" width={180} height={16} className="mb-2 sm:mb-3 opacity-70" />

        {/* Nama pengantin pria */}
        <h1 className="font-jawa-serif text-3xl sm:text-4xl md:text-5xl text-[#EDE0C4] leading-tight tracking-wide">
          {groomName}
        </h1>

        {/* Pemisah & */}
        <div className="flex items-center justify-center gap-3 my-1 sm:my-2 w-full">
          <div className="flex-1 h-px max-w-[50px] sm:max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, #B8860B)" }} />
          <span className="font-jawa-serif text-[#B8860B] text-xl sm:text-2xl italic">&amp;</span>
          <div className="flex-1 h-px max-w-[50px] sm:max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, #B8860B)" }} />
        </div>

        {/* Nama pengantin wanita */}
        <h1 className="font-jawa-serif text-3xl sm:text-4xl md:text-5xl text-[#EDE0C4] leading-tight tracking-wide">
          {brideName}
        </h1>

        {/* Divider bawah emas */}
        <SulurDivider color="#B8860B" width={180} height={16} className="mt-2 sm:mt-3 mb-2 sm:mb-3 opacity-70" />

        {/* Tanggal acara */}
        {firstEvent?.date && (
          <p className="font-jawa-body text-[9px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-[#D4A853] mb-2 sm:mb-3">
            {new Date(firstEvent.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {/* Nama tamu */}
        <div className="mb-4 sm:mb-6">
          <p className="font-jawa-body text-[8px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#8B6E5A] mb-0.5">
            Kepada Yth.
          </p>
          <p className="font-jawa-serif text-base sm:text-xl text-[#EDE0C4] italic">
            {guest?.name || "Tamu Undangan"}
          </p>
        </div>

        {/* Tombol buka */}
        <motion.button
          type="button"
          onClick={onOpen}
          whileHover={{ backgroundColor: "rgba(184,134,11,0.15)", borderColor: "#D4A853" }}
          whileTap={{ scale: 0.97 }}
          className="w-full border border-[#B8860B]/60 text-[#D4A853] font-jawa-body text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase py-3 sm:py-3.5 px-5 sm:px-6 transition-all duration-300 cursor-pointer"
          style={{ fontStyle: "normal" }}
        >
          Buka Undangan
        </motion.button>

        {/* Tombol Tiket E-Pass QR */}
        {guest && onOpenTicket && (
          <motion.button
            type="button"
            onClick={onOpenTicket}
            whileHover={{ backgroundColor: "rgba(184,134,11,0.25)", borderColor: "#D4A853" }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-2 sm:mt-2.5 bg-[#3D2B1F]/80 border border-[#B8860B]/50 text-[#EDE0C4] font-jawa-body text-[9px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase py-2.5 sm:py-3 px-4 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            style={{ fontStyle: "normal" }}
          >
            <QrCode className="w-3.5 h-3.5 text-[#D4A853]" />
            <span>Lihat Tiket E-Pass QR</span>
          </motion.button>
        )}

        {/* Platform Backlink */}
        <p className="mt-2.5 sm:mt-4 text-[9px] sm:text-[10px] text-[#EDE0C4]/60 font-jawa-body tracking-wider text-center" style={{ fontStyle: "normal" }}>
          Undangan Digital &bull;{" "}
          <a
            href="https://www.hayvows.com"
            target="_blank"
            rel="noopener"
            className="text-[#D4A853] underline hover:text-[#EDE0C4] transition-colors font-medium"
          >
            Hayvows
          </a>
        </p>
      </motion.div>
    </div>
  );
}

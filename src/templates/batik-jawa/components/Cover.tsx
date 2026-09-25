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
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden select-none bg-[#2D1B0E]">
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
        className="relative z-10 w-full max-w-sm mx-auto px-8 text-center flex flex-col items-center"
      >
        {/* Ornamen gunungan atas */}
        <GununganTop color="#B8860B" width={80} height={54} className="mb-4 opacity-90" />

        {/* Label */}
        <p
          className="font-jawa-body text-[10px] tracking-[0.45em] uppercase text-[#D4A853] mb-4 opacity-80"
          style={{ fontStyle: "normal" }}
        >
          Undangan Pernikahan
        </p>

        {/* Divider atas emas */}
        <SulurDivider color="#B8860B" width={220} height={20} className="mb-4 opacity-70" />

        {/* Nama pengantin pria */}
        <h1 className="font-jawa-serif text-4xl sm:text-5xl text-[#EDE0C4] leading-tight tracking-wide">
          {groomName}
        </h1>

        {/* Pemisah & */}
        <div className="flex items-center justify-center gap-3 my-3 w-full">
          <div className="flex-1 h-px max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, #B8860B)" }} />
          <span className="font-jawa-serif text-[#B8860B] text-2xl italic">&amp;</span>
          <div className="flex-1 h-px max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, #B8860B)" }} />
        </div>

        {/* Nama pengantin wanita */}
        <h1 className="font-jawa-serif text-4xl sm:text-5xl text-[#EDE0C4] leading-tight tracking-wide">
          {brideName}
        </h1>

        {/* Divider bawah emas */}
        <SulurDivider color="#B8860B" width={220} height={20} className="mt-4 mb-4 opacity-70" />

        {/* Tanggal acara */}
        {firstEvent?.date && (
          <p className="font-jawa-body text-[10px] sm:text-[11px] tracking-[0.3em] text-[#D4A853] mb-4">
            {new Date(firstEvent.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {/* Nama tamu */}
        <div className="mb-8">
          <p className="font-jawa-body text-[9px] tracking-[0.3em] uppercase text-[#8B6E5A] mb-1">
            Kepada Yth.
          </p>
          <p className="font-jawa-serif text-lg sm:text-xl text-[#EDE0C4] italic">
            {guest?.name || "Tamu Undangan"}
          </p>
        </div>

        {/* Tombol buka */}
        <motion.button
          type="button"
          onClick={onOpen}
          whileHover={{ backgroundColor: "rgba(184,134,11,0.15)", borderColor: "#D4A853" }}
          whileTap={{ scale: 0.97 }}
          className="w-full border border-[#B8860B]/60 text-[#D4A853] font-jawa-body text-[11px] tracking-[0.3em] uppercase py-4 px-6 transition-all duration-300 cursor-pointer"
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
            className="w-full mt-3 bg-[#3D2B1F]/80 border border-[#B8860B]/50 text-[#EDE0C4] font-jawa-body text-[10px] sm:text-[11px] tracking-[0.2em] uppercase py-3 px-4 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            style={{ fontStyle: "normal" }}
          >
            <QrCode className="w-3.5 h-3.5 text-[#D4A853]" />
            <span>Lihat Tiket E-Pass QR</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

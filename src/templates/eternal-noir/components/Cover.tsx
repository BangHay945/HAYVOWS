"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { QrCode } from "lucide-react";

interface CoverProps extends TemplateComponentProps {
  onOpen: () => void;
  onOpenTicket?: () => void;
}

export function NoirCover({ context, onOpen, onOpenTicket }: CoverProps) {
  const { wedding, guest } = context;
  const couple = wedding.couple;
  const events = wedding.events ?? [];
  const firstEvent = events[0];

  const coupleImage =
    couple?.couplePhoto && couple.couplePhoto.trim() !== ""
      ? couple.couplePhoto
      : null;


  const groomName = couple?.groomNickname || couple?.groomName || "Alexander";
  const brideName = couple?.brideNickname || couple?.brideName || "Sara";

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-end overflow-hidden bg-[#0a0a0a] select-none">
      {/* Full-bleed Background — grayscale photo */}
      {coupleImage ? (
        <div className="absolute inset-0">
          <img
            src={coupleImage}
            alt={`${groomName} & ${brideName}`}
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(1) brightness(0.55)" }}
          />
          {/* Vignette overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.3) 45%, rgba(10,10,10,0.15) 100%)",
            }}
          />
        </div>
      ) : (
        /* Fallback if no photo: dark textured gradient */
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #1a1a1a 0%, #0a0a0a 70%)",
          }}
        />
      )}

      {/* Content — bottom aligned */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 w-full max-w-md mx-auto px-8 pb-14 text-center"
      >
        {/* Small top label */}
        <p className="font-noir-sans text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-[#888888] mb-6">
          Undangan Pernikahan
        </p>

        {/* Names */}
        <h1 className="font-noir-serif text-4xl sm:text-5xl font-light text-[#fafafa] leading-tight tracking-wide">
          {groomName}
        </h1>
        {/* Gold hairline divider */}
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#c9a84c] max-w-[80px]" />
          <span className="font-noir-serif text-[#c9a84c] text-xl font-light italic">&amp;</span>
          <div className="flex-1 h-px bg-[#c9a84c] max-w-[80px]" />
        </div>
        <h1 className="font-noir-serif text-4xl sm:text-5xl font-light text-[#fafafa] leading-tight tracking-wide">
          {brideName}
        </h1>

        {/* Event date */}
        {firstEvent?.date && (
          <p className="font-noir-sans text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#aaaaaa] mt-5">
            {new Date(firstEvent.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {/* Guest name */}
        <div className="mt-5 mb-8">
          <p className="font-noir-sans text-[9px] tracking-[0.25em] uppercase text-[#666666] mb-1">
            Kepada Yth.
          </p>
          <p className="font-noir-serif text-lg sm:text-xl text-[#fafafa] italic font-light">
            {guest?.name || "Tamu Undangan"}
          </p>
        </div>

        {/* CTA Button — border only */}
        <motion.button
          onClick={onOpen}
          whileHover={{ backgroundColor: "rgba(201,168,76,0.08)" }}
          whileTap={{ scale: 0.97 }}
          className="w-full border border-[#fafafa]/50 hover:border-[#c9a84c] text-[#fafafa] font-noir-sans text-[10px] sm:text-xs tracking-[0.35em] uppercase py-4 px-6 transition-all duration-300 cursor-pointer"
        >
          Buka Undangan
        </motion.button>

        {/* Button: Tiket E-Pass QR */}
        {guest && onOpenTicket && (
          <motion.button
            type="button"
            onClick={onOpenTicket}
            whileHover={{ backgroundColor: "rgba(201,168,76,0.15)", borderColor: "#c9a84c" }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-3 border border-[#c9a84c]/50 text-[#c9a84c] font-noir-sans text-[10px] sm:text-xs tracking-[0.25em] uppercase py-3 px-4 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <QrCode className="w-3.5 h-3.5 text-[#c9a84c]" />
            <span>Lihat Tiket E-Pass QR</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

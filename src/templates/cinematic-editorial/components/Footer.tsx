"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { Heart, Sparkles } from "lucide-react";

export function EditorialFooter({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const couple = wedding.couple;

  const groomName = couple?.groomNickname || couple?.groomName || "Alexander";
  const brideName = couple?.brideNickname || couple?.brideName || "Sara";

  // Foto background dinamis dari galeri
  const galleryPhotos = (wedding.galleries || []).map((g) => g.imageUrl);
  const footerBg =
    couple?.couplePhoto ||
    galleryPhotos[galleryPhotos.length - 1] ||
    galleryPhotos[0] ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

  return (
    <footer className="relative w-full min-h-[75vh] py-20 px-6 flex flex-col justify-between overflow-hidden bg-[#0a0a0c] text-[#fdfbf7]">
      {/* ── AMBIENT PHOTO BACKGROUND DARI GALERI / COUPLE PHOTO ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={footerBg}
          alt="Closing Backdrop"
          className="w-full h-full object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/80 to-[#0a0a0c]/90" />
      </div>

      {/* Top Editorial Label */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center space-y-1"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-[#e8d5b5] block font-semibold">
          THE FINAL CHAPTER
        </span>
        <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 font-sans block">
          A NEW JOURNEY COMMENCES
        </span>
      </motion.div>

      {/* Center Thank You Typography */}
      <div className="relative z-10 my-auto py-10 text-center max-w-md mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-2"
        >
          <p className="font-serif italic text-base sm:text-lg text-neutral-300 leading-relaxed">
            &ldquo;Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.&rdquo;
          </p>
          <div className="pt-4 space-y-1">
            <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#e8d5b5] block">
              KAMI YANG BERBAHAGIA,
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#fdfbf7] tracking-wide">
              {groomName} &amp; {brideName}
            </h2>
            <p className="text-xs text-neutral-400 font-sans">
              Beserta Seluruh Keluarga Besar Kedua Mempelai
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Copyright & Hayvows Credit */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 pt-6 border-t border-white/10 text-center space-y-1 text-[11px] font-mono text-neutral-500"
      >
        <p className="flex items-center justify-center gap-1.5 text-neutral-400">
          <span>Dibuat dengan</span>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
          <span>oleh</span>
          <a
            href="https://hayvows.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#e8d5b5] font-semibold hover:underline"
          >
            Hayvows
          </a>
        </p>
        <p className="text-[10px] text-neutral-600">
          &copy; {new Date().getFullYear()} {wedding.slug}. All Rights Reserved.
        </p>
      </motion.div>
    </footer>
  );
}

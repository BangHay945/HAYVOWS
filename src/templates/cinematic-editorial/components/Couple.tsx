"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { Heart, Sparkles } from "lucide-react";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function EditorialCouple({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const couple = wedding.couple;

  const groomName = couple?.groomName || "Alexander Pratama, S.T.";
  const groomNickname = couple?.groomNickname || "Alexander";
  const groomPhoto =
    couple?.groomPhoto ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80";
  const groomFather = couple?.groomFather || "Bpk. Hendra Pratama";
  const groomMother = couple?.groomMother || "Ibu Ratna Dewi";
  const groomInstagram = couple?.groomInstagram;

  const brideName = couple?.brideName || "Sara Anindya, S.Ked.";
  const brideNickname = couple?.brideNickname || "Sara";
  const bridePhoto =
    couple?.bridePhoto ||
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80";
  const brideFather = couple?.brideFather || "Bpk. Bambang Wijaya";
  const brideMother = couple?.brideMother || "Ibu Sri Rahayu";
  const brideInstagram = couple?.brideInstagram;

  // Foto background dinamis dari galeri
  const galleryPhotos = (wedding.galleries || []).map((g) => g.imageUrl);
  const bgPhoto =
    galleryPhotos[2] ||
    couple?.couplePhoto ||
    galleryPhotos[0] ||
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="relative w-full py-20 px-5 sm:px-6 overflow-hidden bg-[#0a0a0c] text-[#fdfbf7]">
      {/* ── AMBIENT PHOTO BACKGROUND DARI GALERI ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgPhoto}
          alt="Ambient Couple"
          className="w-full h-full object-cover object-center opacity-25 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c]/85 to-[#0a0a0c]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] tracking-[0.3em] uppercase font-mono text-[#e8d5b5]">
            <Sparkles className="w-3 h-3" />
            <span>THE PROTAGONISTS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-light tracking-wide">
            Kedua Mempelai
          </h2>
          <p className="text-xs text-neutral-400 font-sans max-w-xs mx-auto">
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk merayakan cinta kami.
          </p>
        </motion.div>

        {/* ── GROOM CARD (EDITORIAL PORTRAIT) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-5 space-y-4"
        >
          {/* Photo Frame */}
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 group">
            <img
              src={groomPhoto}
              alt={groomName}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-white/20 text-[9px] font-mono tracking-widest uppercase text-[#e8d5b5]">
              THE GROOM
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="font-serif italic text-2xl text-[#fdfbf7] block leading-tight">
                {groomNickname}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="text-center space-y-2 pt-1">
            <h3 className="font-serif text-xl font-normal text-[#fdfbf7] tracking-wide">
              {groomName}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Putra tercinta dari <br />
              <strong className="text-neutral-200">{groomFather}</strong> &amp;{" "}
              <strong className="text-neutral-200">{groomMother}</strong>
            </p>

            {groomInstagram && (
              <div className="pt-2">
                <a
                  href={`https://instagram.com/${groomInstagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs text-[#e8d5b5] font-mono transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>@{groomInstagram.replace("@", "")}</span>
                </a>
              </div>
            )}
          </div>
        </motion.div>

        {/* Ampersand Divider */}
        <div className="flex items-center justify-center gap-4 text-center">
          <span className="w-16 h-px bg-white/15" />
          <span className="font-serif italic text-3xl text-[#e8d5b5]">&amp;</span>
          <span className="w-16 h-px bg-white/15" />
        </div>

        {/* ── BRIDE CARD (EDITORIAL PORTRAIT) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-5 space-y-4"
        >
          {/* Photo Frame */}
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 group">
            <img
              src={bridePhoto}
              alt={brideName}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-white/20 text-[9px] font-mono tracking-widest uppercase text-[#e8d5b5]">
              THE BRIDE
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="font-serif italic text-2xl text-[#fdfbf7] block leading-tight">
                {brideNickname}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="text-center space-y-2 pt-1">
            <h3 className="font-serif text-xl font-normal text-[#fdfbf7] tracking-wide">
              {brideName}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Putri tercinta dari <br />
              <strong className="text-neutral-200">{brideFather}</strong> &amp;{" "}
              <strong className="text-neutral-200">{brideMother}</strong>
            </p>

            {brideInstagram && (
              <div className="pt-2">
                <a
                  href={`https://instagram.com/${brideInstagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs text-[#e8d5b5] font-mono transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>@{brideInstagram.replace("@", "")}</span>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

function PersonCard({
  name,
  nickname,
  father,
  mother,
  instagram,
  photo,
  label,
  fallbackPortrait,
}: {
  name: string;
  nickname: string;
  father: string;
  mother: string;
  instagram: string;
  photo?: string | null;
  label: string;
  fallbackPortrait: string;
}) {
  const isGroom = label.includes("PRIA") || label.includes("GROOM");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-2 sm:border-4 border-[#d4af37] bg-gradient-to-b from-[#161d42] to-[#0c102a] p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.7)] rounded-xl relative"
    >
      <div className="absolute -top-2 -left-2 w-3.5 h-3.5 bg-[#f6d776] border border-[#111] rotate-45" />
      <div className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-[#f6d776] border border-[#111] rotate-45" />

      <p className={`font-mono text-[11px] sm:text-xs font-bold tracking-widest mb-3 text-center ${isGroom ? "text-[#60a5fa]" : "text-[#f472b6]"}`}>
        {label}
      </p>

      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#f6d776] mx-auto mb-4 overflow-hidden bg-[#1e293b] shadow-[0_0_15px_rgba(246,215,118,0.3)]">
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <img src={fallbackPortrait} alt={name} className="w-full h-full object-cover" />
        )}
      </div>

      <h3 className="font-mono text-lg font-bold text-center text-white">{name || "-"}</h3>
      {nickname && <p className="font-mono text-xs text-center text-[#f6d776]">({nickname})</p>}

      <div className="mt-4 text-center font-mono text-xs text-[#cbd5e1] space-y-1 leading-relaxed border-t border-[#d4af37]/30 pt-3">
        <p className="text-[#94a3b8]">Putra/i tercinta dari:</p>
        <p className="font-bold text-white">{father || "-"}</p>
        <p className="text-[#f6d776]">&amp;</p>
        <p className="font-bold text-white">{mother || "-"}</p>
        {instagram && (
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 px-3 py-1 bg-[#1e293b] text-[#f6d776] text-xs font-bold rounded border border-[#f6d776]/40 hover:bg-[#f6d776] hover:text-[#0f172a] transition-all"
          >
            @{instagram}
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function PixelCouple({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;
  if (!couple) return null;
  return (
    <section className="bg-[#0e1230] py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <span className="text-[#f6d776] text-[10px] sm:text-xs uppercase tracking-widest block font-bold">
            ☀️ SOLSTICE HEROES 🌙
          </span>
          <h2 className="font-mono text-2xl font-bold text-white mt-1 border-b-2 border-[#d4af37]/60 pb-3 drop-shadow">
            KEDUA MEMPELAI
          </h2>
        </div>

        <div className="space-y-6">
          <PersonCard
            label="☀️ MEMPELAI PRIA"
            name={couple.groomName}
            nickname={couple.groomNickname}
            father={couple.groomFather}
            mother={couple.groomMother}
            instagram={couple.groomInstagram}
            photo={couple.groomPhoto}
            fallbackPortrait="/assets/templates/pixel-adventure/characters/portraits/portrait-groom.png"
          />
          <PersonCard
            label="🌙 MEMPELAI WANITA"
            name={couple.brideName}
            nickname={couple.brideNickname}
            father={couple.brideFather}
            mother={couple.brideMother}
            instagram={couple.brideInstagram}
            photo={couple.bridePhoto}
            fallbackPortrait="/assets/templates/pixel-adventure/characters/portraits/portrait-bride.png"
          />
        </div>
      </div>
    </section>
  );
}

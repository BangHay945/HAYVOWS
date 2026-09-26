"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { RoyalCrown, RoyalDivider, RoyalCorner } from "./Ornaments";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function RoyalCouple({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;
  if (!couple) return null;

  const groomName = couple.groomName || "Arthur Pendelton";
  const groomNickname = couple.groomNickname || "Arthur";
  const groomPhoto = couple.groomPhoto;
  const groomParents =
    couple.groomFather && couple.groomMother
      ? `Putra dari Bpk. ${couple.groomFather} & Ibu ${couple.groomMother}`
      : couple.groomFather
      ? `Putra dari Bpk. ${couple.groomFather}`
      : couple.groomMother
      ? `Putra dari Ibu ${couple.groomMother}`
      : null;

  const brideName = couple.brideName || "Guinevere Vivienne";
  const brideNickname = couple.brideNickname || "Guinevere";
  const bridePhoto = couple.bridePhoto;
  const brideParents =
    couple.brideFather && couple.brideMother
      ? `Putri dari Bpk. ${couple.brideFather} & Ibu ${couple.brideMother}`
      : couple.brideFather
      ? `Putri dari Bpk. ${couple.brideFather}`
      : couple.brideMother
      ? `Putri dari Ibu ${couple.brideMother}`
      : null;

  return (
    <section className="relative w-full py-24 px-6 overflow-hidden bg-[#022c22] text-[#fdfbf7]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,78,59,0.35)_0%,rgba(2,44,34,0.9)_70%,rgba(2,20,15,1)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold mb-2">
            Maha Suci Allah
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-normal tracking-wide">
            Sang Mempelai
          </h2>
          <p className="text-xs sm:text-sm text-[#b8c9c1] max-w-lg mt-3 leading-relaxed font-light">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:
          </p>
          <RoyalDivider className="max-w-[200px] mx-auto mt-4" />
        </motion.div>

        {/* Couple Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-start">
          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-[#063c2f]/40 backdrop-blur-md border border-[#d4af37]/35 shadow-[0_10px_35px_rgba(0,0,0,0.5)] relative group hover:border-[#d4af37]/70 transition-all duration-500"
          >
            {/* Top Corners */}
            <div className="absolute top-3 left-3 pointer-events-none opacity-50">
              <RoyalCorner className="w-8 h-8 text-[#d4af37]" position="top-left" />
            </div>
            <div className="absolute top-3 right-3 pointer-events-none opacity-50">
              <RoyalCorner className="w-8 h-8 text-[#d4af37]" position="top-right" />
            </div>

            {/* Photo Arch Frame */}
            <div className="relative w-44 h-56 sm:w-48 sm:h-60 rounded-t-[120px] rounded-b-2xl border-2 border-[#d4af37] p-1.5 shadow-[0_0_25px_rgba(212,175,55,0.3)] mb-6 bg-[#02241b] overflow-hidden">
              <div className="w-full h-full rounded-t-[112px] rounded-b-xl overflow-hidden bg-[#064e3b]">
                {groomPhoto ? (
                  <img
                    src={groomPhoto}
                    alt={groomName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#064e3b] to-[#02241b]">
                    <RoyalCrown className="w-12 h-12 text-[#d4af37]" />
                    <span className="font-serif text-3xl font-bold text-[#d4af37] mt-2">
                      {groomNickname.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#fdfbf7] font-semibold tracking-wide">
              {groomName}
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-medium mt-1">
              — {groomNickname} —
            </p>

            {groomParents && (
              <p className="text-xs sm:text-sm text-[#f4eedb] mt-4 leading-relaxed font-light px-2">
                {groomParents}
              </p>
            )}

            {couple.groomInstagram && (
              <a
                href={`https://instagram.com/${couple.groomInstagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 py-2 px-4 rounded-full border border-[#d4af37]/40 bg-[#02241b]/60 text-xs text-[#d4af37] hover:text-[#fff2cc] hover:border-[#d4af37] transition-all cursor-pointer"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@{couple.groomInstagram.replace("@", "")}</span>
              </a>
            )}
          </motion.div>

          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-[#063c2f]/40 backdrop-blur-md border border-[#d4af37]/35 shadow-[0_10px_35px_rgba(0,0,0,0.5)] relative group hover:border-[#d4af37]/70 transition-all duration-500"
          >
            {/* Top Corners */}
            <div className="absolute top-3 left-3 pointer-events-none opacity-50">
              <RoyalCorner className="w-8 h-8 text-[#d4af37]" position="top-left" />
            </div>
            <div className="absolute top-3 right-3 pointer-events-none opacity-50">
              <RoyalCorner className="w-8 h-8 text-[#d4af37]" position="top-right" />
            </div>

            {/* Photo Arch Frame */}
            <div className="relative w-44 h-56 sm:w-48 sm:h-60 rounded-t-[120px] rounded-b-2xl border-2 border-[#d4af37] p-1.5 shadow-[0_0_25px_rgba(212,175,55,0.3)] mb-6 bg-[#02241b] overflow-hidden">
              <div className="w-full h-full rounded-t-[112px] rounded-b-xl overflow-hidden bg-[#064e3b]">
                {bridePhoto ? (
                  <img
                    src={bridePhoto}
                    alt={brideName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#064e3b] to-[#02241b]">
                    <RoyalCrown className="w-12 h-12 text-[#d4af37]" />
                    <span className="font-serif text-3xl font-bold text-[#d4af37] mt-2">
                      {brideNickname.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#fdfbf7] font-semibold tracking-wide">
              {brideName}
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-medium mt-1">
              — {brideNickname} —
            </p>

            {brideParents && (
              <p className="text-xs sm:text-sm text-[#f4eedb] mt-4 leading-relaxed font-light px-2">
                {brideParents}
              </p>
            )}

            {couple.brideInstagram && (
              <a
                href={`https://instagram.com/${couple.brideInstagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 py-2 px-4 rounded-full border border-[#d4af37]/40 bg-[#02241b]/60 text-xs text-[#d4af37] hover:text-[#fff2cc] hover:border-[#d4af37] transition-all cursor-pointer"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@{couple.brideInstagram.replace("@", "")}</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

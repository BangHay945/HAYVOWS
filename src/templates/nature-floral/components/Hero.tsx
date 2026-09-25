"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function FloralHero({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const couple = wedding.couple;

  return (
    <section id="section-hero" className="relative py-16 sm:py-20 px-4 sm:px-6 bg-[#fbf8f3] text-center overflow-hidden">
      {/* Decorative leaf watermarks */}
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header Botanical Badge */}
          <div className="flex items-center justify-center gap-2 text-[#5a7263]">
            <span className="text-sm">🍃</span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
              WALIMATUL &apos;URS
            </span>
            <span className="text-sm">🍃</span>
          </div>

          <h2 className="font-serif-floral text-2xl sm:text-3xl text-[#2d4a3e] font-semibold">
            Pernikahan Suci Kami
          </h2>

          <div className="relative p-6 sm:p-8 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#e8ded1] shadow-xs">
            <p className="font-serif-floral text-sm sm:text-base text-[#4a5e52] italic leading-relaxed">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
            </p>
            <p className="text-xs font-semibold text-[#7a8c7e] mt-3 uppercase tracking-wider">
              (QS. Ar-Rum: 21)
            </p>
          </div>

          {/* Couple Small Dual Avatars */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-[#c5a880] to-[#5a7263] shadow-md overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#e8ded1]">
                {couple?.groomPhoto ? (
                  <img
                    src={couple.groomPhoto}
                    alt={couple.groomName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-[#2d4a3e]">
                    👨
                  </div>
                )}
              </div>
            </div>

            <div className="text-xl sm:text-2xl text-[#d8a499] animate-pulse">
              ❦
            </div>

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-[#d8a499] to-[#c5a880] shadow-md overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#e8ded1]">
                {couple?.bridePhoto ? (
                  <img
                    src={couple.bridePhoto}
                    alt={couple.brideName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-[#2d4a3e]">
                    👩
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="font-serif-floral text-xl sm:text-2xl text-[#2d4a3e] font-semibold">
              {couple?.groomNickname || couple?.groomName || "Alex"} &amp; {couple?.brideNickname || couple?.brideName || "Sara"}
            </h3>
            <p className="text-xs text-[#63756b] mt-1 font-medium">
              Dengan penuh syukur kami mengundang Anda untuk hadir berbagi kebahagiaan bersama kami.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

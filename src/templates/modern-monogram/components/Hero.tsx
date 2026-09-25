"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export function MonogramHero({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const groom = wedding.couple?.groomName || "Alex Pratama";
  const bride = wedding.couple?.brideName || "Sara Amelia";

  const coupleImage =
    wedding.couple?.couplePhoto ||
    wedding.galleries?.[0]?.imageUrl ||
    null;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-3xl mx-auto text-center space-y-8">
      {/* Small badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#c5a880]/40 text-[#8c7e72] text-[11px] font-semibold uppercase tracking-widest shadow-2xs"
      >
        <Heart className="w-3 h-3 text-[#c5a880] fill-[#c5a880]/30" />
        <span>KABAR BAHAGIA</span>
      </motion.div>

      {/* Greeting and Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="space-y-4"
      >
        <h2 className="font-serif-monogram text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-snug">
          Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan
        </h2>
        <div className="w-12 h-0.5 bg-[#c5a880] mx-auto rounded-full" />
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto font-light italic">
          &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
        </p>
        <p className="text-xs font-semibold text-[#2d4a3e] tracking-wider uppercase">
          (QS. Ar-Rum: 21)
        </p>
      </motion.div>

      {/* Couple Portrait Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="relative mx-auto max-w-sm sm:max-w-md pt-4"
      >
        <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 p-4 shadow-sm">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-[#2d4a3e] to-[#1c3329] relative flex items-center justify-center text-white">
            {coupleImage ? (
              <img
                src={coupleImage}
                alt="Foto Bersama Mempelai"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-20 h-20 rounded-full border border-white/30 bg-white/10 flex items-center justify-center mx-auto text-[#fef08a]">
                  <Heart className="w-8 h-8 fill-white/20 text-[#fef08a]" />
                </div>
                <p className="font-serif-monogram text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {groom} &amp; {bride}
                </p>
                <p className="text-xs text-emerald-100/80 font-light">
                  Menuju Kehidupan Baru yang Abadi
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

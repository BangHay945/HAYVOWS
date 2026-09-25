"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";

export function MonogramCouple({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const c = wedding.couple;

  const groomName = c?.groomName || "Alex Pratama, S.Kom";
  const brideName = c?.brideName || "Sara Amelia, B.A";

  const groomParents = c?.groomFather && c?.groomMother
    ? `Putra dari Bpk. ${c.groomFather} & Ibu ${c.groomMother}`
    : "Putra pertama dari Bpk. Hendra Pratama & Ibu Maya Santoso";

  const brideParents = c?.brideFather && c?.brideMother
    ? `Putri dari Bpk. ${c.brideFather} & Ibu ${c.brideMother}`
    : "Putri kedua dari Bpk. Bambang Wijaya & Ibu Rina Wijaya";

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12 space-y-2">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8c7e72] uppercase block">
          MEMPELAI YANG BERBAHAGIA
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Kedua Calon Pengantin
        </h2>
        <div className="w-12 h-0.5 bg-[#c5a880] mx-auto rounded-full mt-2" />
      </div>

      <div className="flex flex-col gap-8 max-w-md mx-auto relative">
        {/* Groom Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs text-center flex flex-col justify-between space-y-4 hover:border-[#c5a880]/50 transition-colors"
        >
          <div className="space-y-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full p-1 border border-[#c5a880] bg-white shadow-2xs">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                {c?.groomPhoto ? (
                  <img
                    src={c.groomPhoto}
                    alt={groomName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-serif text-2xl font-bold text-[#2d4a3e]">
                    {groomName.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#8c7e72] uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full inline-block">
                Mempelai Pria
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                {groomName}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                {groomParents}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Central Monogram & Divider */}
        <div className="flex items-center justify-center my-[-8px]">
          <div className="w-10 h-10 rounded-full bg-white border border-[#c5a880] flex items-center justify-center text-[#2d4a3e] font-serif text-lg font-bold shadow-xs">
            &amp;
          </div>
        </div>

        {/* Bride Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs text-center flex flex-col justify-between space-y-4 hover:border-[#c5a880]/50 transition-colors"
        >
          <div className="space-y-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full p-1 border border-[#c5a880] bg-white shadow-2xs">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                {c?.bridePhoto ? (
                  <img
                    src={c.bridePhoto}
                    alt={brideName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-serif text-2xl font-bold text-[#2d4a3e]">
                    {brideName.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#8c7e72] uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full inline-block">
                Mempelai Wanita
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                {brideName}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                {brideParents}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

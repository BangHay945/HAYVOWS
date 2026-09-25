"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function PixelHero({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const couple = wedding.couple;
  return (
    <section className="bg-[#F2F2F2] py-16 px-6">
      <div className="max-w-md mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-4 border-[#111111] bg-white p-8 shadow-[8px_8px_0px_#111111]">
          <p className="font-mono text-xs text-[#888] tracking-widest mb-4">WEDDING DAY</p>
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="w-20 h-20 border-4 border-[#111111] bg-[#FFD700] flex items-center justify-center overflow-hidden">
              {couple?.groomPhoto ? <img src={couple.groomPhoto} alt={couple.groomName} className="w-full h-full object-cover" /> : <span className="text-3xl">👨</span>}
            </div>
            <p className="font-mono text-2xl text-[#FFD700]">♥</p>
            <div className="w-20 h-20 border-4 border-[#111111] bg-[#FFD700] flex items-center justify-center overflow-hidden">
              {couple?.bridePhoto ? <img src={couple.bridePhoto} alt={couple.brideName} className="w-full h-full object-cover" /> : <span className="text-3xl">👩</span>}
            </div>
          </div>
          <h2 className="font-mono text-xl font-bold">{couple?.groomName || "Pengantin Pria"}</h2>
          <p className="font-mono text-sm text-[#888] my-1">&amp;</p>
          <h2 className="font-mono text-xl font-bold">{couple?.brideName || "Pengantin Wanita"}</h2>
        </motion.div>
      </div>
    </section>
  );
}

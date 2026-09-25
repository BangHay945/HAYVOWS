"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { KawungBorder, SulurDivider } from "./Ornaments";

export function BatikJawaHero({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;
  const groom = couple?.groomNickname || couple?.groomName || "Prasetyo";
  const bride = couple?.brideNickname || couple?.brideName || "Kinanti";

  return (
    <section className="relative w-full py-20 sm:py-28 flex flex-col items-center justify-center overflow-hidden bg-[#FDF6E3]">
      {/* Kawung border atas */}
      <div className="absolute top-0 left-0 right-0">
        <KawungBorder color="#B8860B" height={20} />
      </div>
      {/* Kawung border bawah */}
      <div className="absolute bottom-0 left-0 right-0">
        <KawungBorder color="#B8860B" height={20} />
      </div>

      {/* Pola latar halus */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #B8860B 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center px-6 space-y-6">
        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-jawa-body text-[10px] tracking-[0.45em] uppercase text-[#8B6E5A]"
          style={{ fontStyle: "normal" }}
        >
          Firman Allah Swt.
        </motion.p>

        {/* Ornamen divider atas */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="origin-center"
        >
          <SulurDivider color="#B8860B" height={24} />
        </motion.div>

        {/* Ayat suci */}
        <motion.blockquote
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-jawa-serif text-xl sm:text-2xl text-[#3D2B1F] leading-relaxed"
          style={{ fontStyle: "italic" }}
        >
          &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
          pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
          dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
          kasih dan sayang.&rdquo;
        </motion.blockquote>

        {/* Ornamen divider bawah */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="origin-center"
        >
          <SulurDivider color="#B8860B" height={24} />
        </motion.div>

        {/* Referensi ayat */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-jawa-body text-[10px] tracking-[0.35em] uppercase text-[#B8860B]"
          style={{ fontStyle: "normal" }}
        >
          QS. Ar-Rum : 21
        </motion.p>

        {/* Nama mempelai watermark */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-jawa-serif text-sm text-[#B8860B]/50 tracking-widest"
        >
          {groom} &amp; {bride}
        </motion.p>
      </div>
    </section>
  );
}

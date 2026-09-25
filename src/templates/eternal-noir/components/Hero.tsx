"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function NoirHero({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;
  const groom = couple?.groomNickname || couple?.groomName || "Alexander";
  const bride = couple?.brideNickname || couple?.brideName || "Sara";

  return (
    <section className="relative w-full min-h-[75vh] py-24 sm:py-32 bg-[#0a0a0a] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-noir-sans text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-[#555555]"
        >
          Firman Allah Swt.
        </motion.p>

        {/* Gold hairline top */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-16 h-px bg-[#c9a84c] mx-auto origin-center"
        />

        {/* Ayat */}
        <motion.blockquote
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-noir-serif text-xl sm:text-2xl md:text-3xl text-[#fafafa] font-light italic leading-relaxed"
        >
          &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
          pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
          dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
          kasih dan sayang.&rdquo;
        </motion.blockquote>

        {/* Gold hairline bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-16 h-px bg-[#c9a84c] mx-auto origin-center"
        />

        {/* Ayat reference */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-noir-sans text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]"
        >
          QS. Ar-Rum : 21
        </motion.p>

        {/* Couple names watermark */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-noir-serif text-sm text-[#444444] tracking-widest"
        >
          {groom} &amp; {bride}
        </motion.p>
      </div>
    </section>
  );
}

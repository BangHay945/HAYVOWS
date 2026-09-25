"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function NoirFooter({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;
  const groom = couple?.groomNickname || couple?.groomName || "Alexander";
  const bride = couple?.brideNickname || couple?.brideName || "Sara";
  const year = new Date().getFullYear();

  return (
    <section className="relative w-full bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-20 sm:py-28 overflow-hidden">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

      <div className="text-center space-y-10 max-w-lg mx-auto">
        {/* Thank you */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-noir-sans text-[9px] tracking-[0.45em] uppercase text-[#555555]"
        >
          Terima Kasih
        </motion.p>

        {/* Names — large editorial */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h2 className="font-noir-serif text-5xl sm:text-6xl font-light text-[#fafafa] tracking-widest leading-none">
            {groom}
          </h2>
          <div className="flex items-center justify-center gap-4 my-5">
            <div className="flex-1 h-px bg-[#c9a84c]/60 max-w-[60px]" />
            <span className="font-noir-serif text-[#c9a84c] text-2xl font-light italic">&amp;</span>
            <div className="flex-1 h-px bg-[#c9a84c]/60 max-w-[60px]" />
          </div>
          <h2 className="font-noir-serif text-5xl sm:text-6xl font-light text-[#fafafa] tracking-widest leading-none">
            {bride}
          </h2>
        </motion.div>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-noir-serif text-sm sm:text-base italic font-light text-[#444444] leading-relaxed max-w-xs mx-auto"
        >
          &ldquo;Semoga kebahagiaan senantiasa mengiringi setiap langkah perjalanan rumah tangga kami.&rdquo;
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-16 h-px bg-[#c9a84c] mx-auto origin-center"
        />

        {/* Family line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-1"
        >
          <p className="font-noir-sans text-[9px] tracking-[0.35em] uppercase text-[#444444]">
            Keluarga Besar
          </p>
          {couple?.groomFather && (
            <p className="font-noir-serif text-sm font-light italic text-[#555555]">
              {couple.groomFather} &amp; {couple?.groomMother}
            </p>
          )}
          {couple?.brideFather && (
            <p className="font-noir-serif text-sm font-light italic text-[#555555]">
              {couple.brideFather} &amp; {couple?.brideMother}
            </p>
          )}
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="font-noir-sans text-[8px] tracking-[0.3em] uppercase text-[#333333]"
        >
          Undangan Digital &copy; {year} — Hayvows
        </motion.p>
      </div>
    </section>
  );
}

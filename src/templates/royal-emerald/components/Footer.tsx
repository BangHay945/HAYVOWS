"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { RoyalCrown, RoyalDivider } from "./Ornaments";

export function RoyalFooter({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;
  const groomName = couple?.groomNickname || couple?.groomName || "Arthur";
  const brideName = couple?.brideNickname || couple?.brideName || "Guinevere";

  return (
    <footer className="relative w-full py-20 px-6 overflow-hidden bg-[#021a13] text-[#fdfbf7] border-t border-[#d4af37]/25">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center relative z-10">
        <RoyalCrown className="w-10 h-10 text-[#ffd700] mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />

        <p className="font-serif italic text-sm sm:text-base text-[#f4eedb] leading-relaxed max-w-md font-light mb-6 px-4">
          &ldquo;Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.&rdquo;
        </p>

        <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold mb-2">
          Kami yang Berbahagia
        </p>

        <h3 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-normal tracking-wide">
          {groomName} &amp; {brideName}
        </h3>

        <RoyalDivider className="max-w-[200px] mx-auto my-6" />

        <div className="text-center space-y-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#8ca89c]">
            Created with elegance by{" "}
            <span className="text-[#d4af37] font-semibold">Hayvows</span>
          </p>
          <p className="text-[9px] text-[#8ca89c]/60">
            &copy; {new Date().getFullYear()} {context.wedding.slug}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

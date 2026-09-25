"use client";
import type { TemplateComponentProps } from "@/types/template";

export function FloralFooter({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;

  return (
    <footer className="py-16 sm:py-20 px-4 sm:px-6 bg-[#2d4a3e] text-[#fbf8f3] text-center select-none">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-center gap-2 text-[#c5a880]">
          <span className="text-sm">🌿</span>
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
            TERIMA KASIH
          </span>
          <span className="text-sm">🌿</span>
        </div>

        <p className="font-serif-floral text-sm sm:text-base italic text-[#e8ded1] leading-relaxed max-w-sm mx-auto">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
        </p>

        <div className="pt-2">
          <p className="text-xs uppercase tracking-widest text-[#c5a880] font-medium">
            Kami yang berbahagia,
          </p>
          <h2 className="font-serif-floral text-2xl sm:text-3xl font-bold mt-2 text-[#fbf8f3] tracking-wide">
            {couple?.groomNickname || couple?.groomName || "Alex"} &amp;{" "}
            {couple?.brideNickname || couple?.brideName || "Sara"}
          </h2>
          <p className="text-xs text-[#a3b8ac] mt-1">
            Beserta segenap keluarga besar
          </p>
        </div>

        <div className="w-12 h-[1px] bg-[#c5a880]/40 mx-auto" />

        <p className="text-[10px] text-[#8ea89a] tracking-wider uppercase">
          Digital Wedding Invitation · Nature &amp; Floral Edition
        </p>
      </div>
    </footer>
  );
}

"use client";
import { Heart } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";
import { MonogramSeal } from "./MonogramSeal";

export function MonogramFooter({ context }: TemplateComponentProps) {
  const { wedding } = context;
  const groom = wedding.couple?.groomNickname || wedding.couple?.groomName || "Alex";
  const bride = wedding.couple?.brideNickname || wedding.couple?.brideName || "Sara";

  const groomInitial = (wedding.couple?.groomName || groom).charAt(0).toUpperCase();
  const brideInitial = (wedding.couple?.brideName || bride).charAt(0).toUpperCase();

  return (
    <footer className="py-16 sm:py-24 px-4 text-center bg-[#f4f0ea] border-t border-[#c5a880]/30 text-slate-700">
      <div className="max-w-md mx-auto space-y-6">
        {/* Monogram Seal Small */}
        <MonogramSeal
          groomInitial={groomInitial}
          brideInitial={brideInitial}
          size="sm"
          variant="crest"
          className="mx-auto"
        />

        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-light">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan memberikan doa restu.
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8c7e72]">
            KAMI YANG BERBAHAGIA
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
            {groom} &amp; {bride}
          </h3>
          <p className="text-xs text-slate-500 font-light">
            Beserta Seluruh Keluarga Besar
          </p>
        </div>

        <div className="pt-8 border-t border-slate-200/80 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>oleh</span>
            <span className="font-bold text-slate-800">Hayvows</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Platform Undangan Pernikahan Digital Modern
          </p>
        </div>
      </div>
    </footer>
  );
}

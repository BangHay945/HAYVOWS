"use client";

import Link from "next/link";
import { Sparkles, ExternalLink } from "lucide-react";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";

interface TrialWatermarkProps {
  isTrial?: boolean;
}

export function TrialWatermark({ isTrial = true }: TrialWatermarkProps) {
  if (!isTrial) return null;

  return (
    <>
      {/* 1. Top Floating Pill */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none max-w-[92vw]">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-[#c9a84c]/40 text-white shadow-lg text-[10px] sm:text-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="font-semibold text-amber-200">Mode Uji Coba</span>
          <span className="text-slate-500">•</span>
          <span className="font-light text-slate-300">Hayvows Digital</span>
          <Link
            href="/register"
            target="_blank"
            className="ml-1 pl-2 border-l border-slate-700 font-bold text-[#fef08a] hover:underline whitespace-nowrap inline-flex items-center gap-1"
          >
            <span>Buat Milik Anda</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>

      {/* 2. Bottom Footer Banner */}
      <div className="w-full bg-[#0a0a0a] border-t border-[#c9a84c]/30 py-5 px-4 text-center select-none relative z-20">
        <div className="max-w-md mx-auto flex flex-col items-center gap-2">
          <HayvowsLogo size="sm" theme="gold" showTagline={false} />
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
            Undangan ini dibuat menggunakan <span className="text-amber-200 font-semibold">Mode Uji Coba</span> Hayvows. Buat undangan pernikahan digital impian Anda hari ini.
          </p>
          <Link
            href="/register"
            target="_blank"
            className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#c9a84c] hover:bg-[#b8953d] text-slate-950 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-slate-950" />
            <span>Buat Undangan Gratis</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default TrialWatermark;

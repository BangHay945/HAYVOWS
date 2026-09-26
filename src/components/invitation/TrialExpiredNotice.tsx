"use client";

import Link from "next/link";
import { Clock, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";

interface TrialExpiredNoticeProps {
  coupleTitle?: string;
}

export function TrialExpiredNotice({
  coupleTitle = "Pengantin",
}: TrialExpiredNoticeProps) {
  return (
    <div className="min-h-screen bg-[#f8f6f0] flex items-center justify-center p-4 selection:bg-[#2d4a3e] selection:text-white">
      <div className="w-full max-w-lg bg-white border border-[#e2ded5] rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center">
          <HayvowsLogo size="md" />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
            Masa Uji Coba Berakhir
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Masa Uji Coba 3 Hari Telah Selesai
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            Undangan digital untuk <strong className="text-slate-800">{coupleTitle}</strong> telah melewati masa aktif uji coba gratis (3 hari).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Bagi Tamu Undangan:</strong> Silakan hubungi langsung pihak mempelai untuk konfirmasi kehadiran atau informasi terbaru acara.
            </p>
          </div>
          <div className="flex items-start gap-2.5 border-t border-slate-200/60 pt-2">
            <Sparkles className="w-4 h-4 text-[#2d4a3e] shrink-0 mt-0.5" />
            <p>
              <strong>Bagi Calon Pengantin:</strong> Masuk ke Dashboard akun Anda untuk mengaktifkan paket (Basic, Populer, atau Exclusive) agar undangan aktif selamanya tanpa watermark.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>Masuk ke Dashboard Pemilik</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors py-2"
          >
            <span>Pelajari Paket Undangan di Hayvows</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TrialExpiredNotice;

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  Sparkles,
  Crown,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { UpgradeModal } from "./UpgradeModal";

interface FeatureLockedStateProps {
  featureName: string;
  description?: string;
  minimumPlanName?: string;
  currentPlan?: string;
}

export function FeatureLockedState({
  featureName,
  description,
  minimumPlanName = "Paket Populer (Rp 199.000)",
  currentPlan = "basic",
}: FeatureLockedStateProps) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  return (
    <div className="py-8 sm:py-12 px-4 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xl overflow-hidden text-center relative">
        {/* Top gradient ribbon */}
        <div className="h-2.5 bg-gradient-to-r from-amber-400 via-[#2d4a3e] to-amber-500" />

        <div className="p-6 sm:p-10 space-y-6">
          {/* Lock Icon Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-[#c9a84c]" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
              <span>Fitur Terkunci di Paket Basic</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Halaman {featureName} Belum Tersedia
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              {description ||
                `Akun Anda saat ini terdaftar pada Paket Basic. Fitur ${featureName} membutuhkan ${minimumPlanName} atau Paket Exclusive untuk dapat diakses dan digunakan.`}
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="bg-[#faf8f5] rounded-2xl p-5 border border-slate-200/80 text-left grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>RSVP Realtime:</strong> Rekap otomatis kuota tamu &amp; porsi katering.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Buku Tamu &amp; Doa:</strong> Moderasi pesan ucapan &amp; proteksi anti-spam.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Amplop Digital:</strong> Rekening bank aktif dengan fitur salin cepat.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Akses Tema Lengkap:</strong> Nature Floral, Batik Jawa Heritage, &amp; Game 2D RPG.
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setUpgradeModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-[#fef08a] font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 fill-[#fef08a]" />
              <span>Upgrade Paket Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all text-center"
            >
              Kembali ke Overview
            </Link>
          </div>

          {/* Guarantee Footer */}
          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Aktivasi Instan Otomatis
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Sekali Bayar Selamanya
            </span>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={currentPlan}
      />
    </div>
  );
}

"use client";

import { useActionState, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { resetPasswordAction, ResetPasswordState } from "./actions";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [state, formAction, isPending] = useActionState<
    ResetPasswordState | undefined,
    FormData
  >(resetPasswordAction, undefined);

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 text-center">
          <div className="flex justify-center">
            <HayvowsLogo size="md" />
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Tautan Tidak Valid
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tautan atur ulang kata sandi yang Anda buka tidak memiliki parameter keamanan yang lengkap.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
          >
            Minta Tautan Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <HayvowsLogo size="md" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Buat Kata Sandi Baru
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Untuk akun: <strong className="text-slate-700">{email}</strong>
            </p>
          </div>
        </div>

        {state?.error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl">
            {state.error}
          </div>
        )}

        {state?.success ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900 mb-1">
                  Kata Sandi Berhasil Diperbarui!
                </p>
                <p className="text-emerald-700 leading-relaxed">
                  Sekarang Anda dapat masuk ke akun Hayvows menggunakan kata sandi baru Anda.
                </p>
              </div>
            </div>

            <Link
              href="/login?reset=1"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="email" value={email} />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi Baru (min. 6 karakter)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  placeholder="Masukkan kata sandi baru"
                  className="w-full rounded-lg border border-slate-300 pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ulangi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  placeholder="Ketik ulang kata sandi baru"
                  className="w-full rounded-lg border border-slate-300 pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1a2c24] disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isPending ? "Menyimpan..." : "Simpan Kata Sandi Baru"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { forgotPasswordAction, ForgotPasswordState } from "./actions";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";

function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<
    ForgotPasswordState | undefined,
    FormData
  >(forgotPasswordAction, undefined);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <HayvowsLogo size="md" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Lupa Kata Sandi?
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Masukkan alamat email akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
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
                  Email Terkirim!
                </p>
                <p className="text-emerald-700 leading-relaxed">
                  {state.message}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Tidak menerima email? Pastikan memeriksa folder <strong>Spam</strong> atau coba kirim ulang setelah beberapa menit.
            </p>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Masuk</span>
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Email Terdaftar
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="nama@email.com"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1a2c24] disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isPending ? "Mengirim Tautan..." : "Kirim Tautan Atur Ulang"}</span>
            </button>

            <div className="pt-2 border-t border-slate-100 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#2d4a3e] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Masuk</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

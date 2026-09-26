"use client";
import { useActionState, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LogIn, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { loginAction } from "./actions";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";

function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    loginAction,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "1";
  const isReset = searchParams.get("reset") === "1";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <HayvowsLogo size="md" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Masuk ke Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">
              Kelola undangan pernikahan digital Anda dengan mudah dan aman.
            </p>
          </div>
        </div>

        {isRegistered && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pendaftaran akun berhasil! Silakan masuk menggunakan email dan kata sandi Anda.</span>
          </div>
        )}

        {isReset && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kata sandi Anda berhasil diperbarui! Silakan masuk menggunakan kata sandi baru Anda.</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl">
            {errorMessage}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Kata Sandi
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-[#2d4a3e] hover:underline font-medium"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                placeholder="Masukkan kata sandi"
                className="w-full rounded-lg border border-slate-300 pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? (
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
            <LogIn className="w-4 h-4" />
            <span>{isPending ? "Memproses..." : "Masuk ke Dashboard"}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#2d4a3e] hover:underline"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LoginForm />
    </Suspense>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Registrasi gagal");
    } else {
      router.push("/login?registered=1");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <HayvowsLogo size="md" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Mulai Uji Coba Gratis
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Daftar akun gratis untuk mulai mendesain undangan pernikahan digital Anda.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoComplete="name"
              placeholder="Alexander Pratama"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
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
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1a2c24] disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? "Memproses..." : "Daftar Akun"}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#2d4a3e] hover:underline"
          >
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </div>
  );
}

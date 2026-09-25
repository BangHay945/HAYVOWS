"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Mail,
  Calendar,
  IdCard,
  Copy,
  Check,
  Crown,
  Sparkles,
  ArrowUpRight,
  Palette,
  Users,
  Eye,
} from "lucide-react";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";

interface AccountUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan?: string | null;
  createdAt: string | Date;
}

export default function AccountSettings({ initialUser }: { initialUser: AccountUser }) {
  // Profile State
  const [name, setName] = useState(initialUser.name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Copy State
  const [copiedId, setCopiedId] = useState(false);

  // Upgrade Modal State
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(initialUser.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess("");
    setProfileError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui profil");
      }

      setProfileSuccess("Nama profil berhasil diperbarui!");
      setTimeout(() => setProfileSuccess(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setProfileError(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordSuccess("");
    setPasswordError("");

    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengubah kata sandi");
      }

      setPasswordSuccess("Kata sandi berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setPasswordError(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  const formattedDate = new Date(initialUser.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const userInitial = (name || initialUser.email || "U").slice(0, 2).toUpperCase();
  const currentPlan = initialUser.plan || "basic";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono tracking-wider font-semibold text-[#2d4a3e] uppercase mb-1">
          Pengaturan Akun &amp; Keamanan
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Pengaturan Akun
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi profil pribadi, kata sandi, status paket langganan, dan keamanan akun Hayvows Anda.
        </p>
      </div>

      {/* SECTION 1: STATUS PAKET LANGGANAN (BARU & SELARAS) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                currentPlan === "luxury"
                  ? "bg-slate-900 text-[#c9a84c] border border-[#c9a84c]/40"
                  : currentPlan === "premium"
                  ? "bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-[#fef08a]"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {currentPlan === "luxury" ? (
                <Crown className="w-5 h-5 text-[#c9a84c]" />
              ) : currentPlan === "premium" ? (
                <Sparkles className="w-5 h-5 text-[#fef08a]" />
              ) : (
                <Eye className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {currentPlan === "luxury"
                    ? "Paket Luxury VIP"
                    : currentPlan === "premium"
                    ? "Paket Premium"
                    : "Paket Basic (Uji Coba Gratis)"}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    currentPlan === "luxury"
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : currentPlan === "premium"
                      ? "bg-emerald-100 text-[#2d4a3e] border border-emerald-300"
                      : "bg-slate-100 text-slate-700 border border-slate-300"
                  }`}
                >
                  {currentPlan.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentPlan === "luxury"
                  ? "Akses tanpa batas ke seluruh tema eksklusif (Eternal Noir), custom domain, dan prioritas VIP."
                  : currentPlan === "premium"
                  ? "Akses penuh tanpa watermark dengan kuota tamu tak terbatas dan tema premium."
                  : "Mode evaluasi: Kuota maksimal 50 tamu undangan dengan label watermark Hayvows."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentPlan !== "luxury" && (
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2d4a3e] hover:bg-[#233a30] text-[#fef08a] shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade Paket</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Feature Grid Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-[#faf8f5] rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Users className="w-4 h-4 text-[#2d4a3e]" />
              <span>Kuota Tamu</span>
            </div>
            <p className="text-xs text-slate-900 font-bold mt-1">
              {currentPlan === "basic" ? "50 Tamu Undangan" : "Unlimited (Tanpa Batas)"}
            </p>
          </div>

          <div className="p-3 bg-[#faf8f5] rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Shield className="w-4 h-4 text-[#2d4a3e]" />
              <span>Status Watermark</span>
            </div>
            <p className="text-xs text-slate-900 font-bold mt-1">
              {currentPlan === "basic" ? "Label Mode Uji Coba Aktif" : "100% Bebas Watermark"}
            </p>
          </div>

          <div className="p-3 bg-[#faf8f5] rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Palette className="w-4 h-4 text-[#2d4a3e]" />
              <span>Katalog Tema</span>
            </div>
            <p className="text-xs text-slate-900 font-bold mt-1">
              {currentPlan === "luxury"
                ? "Semua Tema + Eternal Noir"
                : currentPlan === "premium"
                ? "Tema Basic & Premium"
                : "Tema Basic Terbuka"}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: PROFIL PENGGUNA */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-[#2d4a3e] text-[#fef08a] border border-[#c9a84c]/30 font-bold text-lg flex items-center justify-center shadow-xs">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {name || "Pengguna"}
              </h2>
              <span className="text-[10px] font-semibold bg-[#faf8f5] text-[#2d4a3e] border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {initialUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">{initialUser.email}</p>
          </div>
        </div>

        {profileSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#2d4a3e] shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Nama Lengkap</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Alamat Email (Akun Login)</span>
              </label>
              <input
                type="email"
                disabled
                value={initialUser.email}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-500 bg-slate-50 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Email digunakan untuk login dan tidak dapat diubah langsung.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#c9a84c]" />
              <span>{savingProfile ? "Menyimpan..." : "Simpan Nama"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: KEAMANAN & GANTI KATA SANDI */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2d4a3e]" />
              <span>Keamanan &amp; Kata Sandi</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbarui kata sandi secara berkala untuk menjaga keamanan akun Anda.
            </p>
          </div>
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono">
            Bcrypt Enkripsi
          </span>
        </div>

        {passwordSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#2d4a3e] shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Kata Sandi Saat Ini</span>
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full max-w-md rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Kata Sandi Baru</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Konfirmasi Kata Sandi Baru</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-start pt-1">
            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex items-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#c9a84c]" />
              <span>{savingPassword ? "Memperbarui..." : "Perbarui Kata Sandi"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: INFORMASI SISTEM AKUN */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <IdCard className="w-4 h-4 text-slate-500" />
          <span>Informasi Sistem Akun</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block">ID Pengguna</span>
              <span className="font-mono text-slate-700 text-[11px] truncate block">
                {initialUser.id}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Salin User ID"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-[#2d4a3e]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Terdaftar Sejak</span>
              <span className="font-medium text-slate-700 text-xs">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Upgrade */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={currentPlan}
      />
    </div>
  );
}

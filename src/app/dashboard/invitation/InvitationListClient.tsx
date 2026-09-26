"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartHandshake,
  Plus,
  ExternalLink,
  Users,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Heart,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

export interface WeddingListItem {
  id: string;
  slug: string;
  status: string;
  createdAt: string;
  coupleName: string;
  templateName: string;
  guestCount: number;
  rsvpCount: number;
  viewCount: number;
  isDemo: boolean;
  plan?: string;
}

export function InvitationListClient({
  initialWeddings,
}: {
  initialWeddings: WeddingListItem[];
}) {
  const router = useRouter();
  const [weddings, setWeddings] = useState<WeddingListItem[]>(initialWeddings);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedWeddingForDelete, setSelectedWeddingForDelete] =
    useState<WeddingListItem | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const totalWeddings = weddings.length;
  const publishedCount = weddings.filter((w) => w.status === "published").length;
  const totalGuests = weddings.reduce((acc, w) => acc + w.guestCount, 0);
  const totalRsvps = weddings.reduce((acc, w) => acc + w.rsvpCount, 0);

  const handleDeleteConfirm = async () => {
    if (!selectedWeddingForDelete) return;

    setDeletingId(selectedWeddingForDelete.id);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/wedding/${selectedWeddingForDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus undangan");
      }

      // Update local state
      const deletedSlug = selectedWeddingForDelete.slug;
      setWeddings((prev) => prev.filter((w) => w.id !== selectedWeddingForDelete.id));
      setSelectedWeddingForDelete(null);
      setSuccessMessage(`Undangan /${deletedSlug} berhasil dihapus.`);
      setTimeout(() => setSuccessMessage(""), 4000);

      // Refresh layout to update sidebar switcher
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMessage(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2d4a3e] mb-1">
            <HeartHandshake className="w-4 h-4 text-[#2d4a3e]" />
            <span>Manajemen Acara</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Kelola Undangan Pernikahan
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pantau, sunting, pratinjau, atau hapus acara pernikahan yang Anda kelola dalam satu dashboard terpadu.
          </p>
        </div>

        <Link
          href="/dashboard/invitation/new"
          className="inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#c9a84c]" />
          <span>Buat Undangan Baru</span>
        </Link>
      </div>

      {/* Success & Error Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#2d4a3e] text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2d4a3e] shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Acara</span>
            <div className="w-7 h-7 rounded-lg bg-[#faf8f5] text-[#2d4a3e] border border-slate-200 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalWeddings}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Dikelola di akun Anda</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Status Published</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#2d4a3e] border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{publishedCount}</p>
          <p className="text-[11px] text-[#2d4a3e] mt-0.5 font-mono">Siap disebarkan</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Tamu</span>
            <div className="w-7 h-7 rounded-lg bg-[#faf8f5] text-[#2d4a3e] border border-slate-200 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalGuests}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Semua tautan personal</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Konfirmasi RSVP</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalRsvps}</p>
          <p className="text-[11px] text-amber-700 mt-0.5 font-mono">Tanggapan diterima</p>
        </div>
      </div>

      {/* Main List Table / Cards */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daftar Acara Pernikahan</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih acara untuk mengedit konten, tema, tamu, atau hapus acara yang tidak diperlukan.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-mono">
            {totalWeddings} Acara
          </span>
        </div>

        {totalWeddings === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-white flex items-center justify-center mx-auto shadow-md">
              <Heart className="w-7 h-7 fill-white/20 text-white" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 font-serif">
              Belum ada undangan yang dibuat
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mulai buat undangan pernikahan impian Anda dalam hitungan menit dengan tema pilihan Hayvows.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/invitation/new"
                className="inline-flex items-center gap-1.5 bg-[#2d4a3e] hover:bg-[#233a30] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-4 h-4 text-[#c9a84c]" />
                <span>Buat Undangan Pertama</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {weddings.map((w) => {
              const isPublished = w.status === "published";

              return (
                <div
                  key={w.id}
                  className="p-5 sm:p-6 hover:bg-[#faf8f5]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left: Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] flex items-center justify-center text-white shadow-xs shrink-0">
                      <Heart className="w-6 h-6 fill-white/20 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {w.coupleName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isPublished
                              ? "bg-emerald-50 text-[#2d4a3e] border border-emerald-200/80"
                              : "bg-amber-50 text-amber-700 border border-amber-200/80"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? "bg-[#2d4a3e]" : "bg-amber-600"
                            }`}
                          />
                          <span>{isPublished ? "Live • Published" : "Draft"}</span>
                        </span>

                        {w.isDemo ? (
                          <span className="font-bold text-[9px] bg-purple-100 text-purple-900 border border-purple-200 px-1.5 py-0.5 rounded uppercase">
                            Demo Showcase
                          </span>
                        ) : (
                          <span
                            className={`font-bold text-[9px] px-2 py-0.5 rounded-full border ${
                              w.plan === "luxury"
                                ? "bg-slate-900 text-[#c9a84c] border-[#c9a84c]/40"
                                : w.plan === "premium"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : w.plan === "basic"
                                ? "bg-teal-50 text-teal-800 border-teal-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {w.plan === "luxury"
                              ? "Paket Exclusive"
                              : w.plan === "premium"
                              ? "Paket Populer"
                              : w.plan === "basic"
                              ? "Paket Basic"
                              : "Uji Coba 3 Hari"}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                        <span className="font-mono text-slate-400">/{w.slug}</span>
                        <span>&bull;</span>
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                          <Sparkles className="w-3.5 h-3.5 text-[#2d4a3e]" />
                          <span>{w.templateName}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="text-slate-400">Dibuat {w.createdAt}</span>
                      </div>

                      {/* Mini Stats */}
                      <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{w.guestCount} Tamu</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2d4a3e]" />
                          <span>{w.rsvpCount} RSVP</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>{w.viewCount} Views</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                    <Link
                      href={`/invitation/${w.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Live Demo</span>
                    </Link>

                    <Link
                      href={`/dashboard/invitation/${w.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2d4a3e] hover:bg-[#233a30] rounded-xl shadow-2xs hover:shadow-xs transition-all"
                    >
                      <span>Kelola Undangan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Tombol Hapus Undangan */}
                    <button
                      type="button"
                      onClick={() => setSelectedWeddingForDelete(w)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                      title="Hapus undangan ini"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal: Hapus Undangan */}
      {selectedWeddingForDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Undangan Pernikahan?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data undangan untuk:
                </p>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block truncate">
                    {selectedWeddingForDelete.coupleName}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px] block">
                    /{selectedWeddingForDelete.slug}
                  </span>
                </div>
                <p className="text-[11px] text-rose-700 bg-rose-50/80 p-2.5 rounded-lg border border-rose-200 leading-relaxed">
                  Perhatian: Tindakan ini permanen. Semua data tamu, buku ucapan, RSVP, dan foto galeri yang tersimpan di acara ini akan dihapus secara menyeluruh.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setSelectedWeddingForDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingId ? "Menghapus..." : "Ya, Hapus Undangan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

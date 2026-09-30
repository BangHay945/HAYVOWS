"use client";

import React, { useState, useMemo } from "react";
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
  Search,
  Calendar,
  Layers,
  SlidersHorizontal,
  Filter,
  ChevronDown,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedWeddingId, setExpandedWeddingId] = useState<string | null>(null);
  const [selectedWeddingForDelete, setSelectedWeddingForDelete] =
    useState<WeddingListItem | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const totalWeddings = weddings.length;
  const publishedCount = weddings.filter((w) => w.status === "published").length;
  const totalGuests = weddings.reduce((acc, w) => acc + w.guestCount, 0);
  const totalRsvps = weddings.reduce((acc, w) => acc + w.rsvpCount, 0);

  // Filtered weddings based on search & status
  const filteredWeddings = useMemo(() => {
    return weddings.filter((w) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        w.coupleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.templateName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" || w.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [weddings, searchQuery, statusFilter]);

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
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Page Header (Responsive Mobile & Tablet) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-slate-200/60 sm:border-0 shadow-2xs sm:shadow-none">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2d4a3e] px-2.5 py-1 rounded-lg bg-[#2d4a3e]/8 border border-[#2d4a3e]/15">
            <HeartHandshake className="w-3.5 h-3.5 text-[#2d4a3e]" />
            <span>Manajemen Acara</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Kelola Undangan Pernikahan
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            Pantau, sunting, pratinjau, atau kelola acara pernikahan Anda dalam satu dashboard terpadu.
          </p>
        </div>

        {/* CTA Button with optimal touch target */}
        <Link
          href="/dashboard/invitation/new"
          className="inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] text-white text-xs sm:text-sm font-semibold px-5 py-3 sm:py-2.5 rounded-xl sm:rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4 text-[#c9a84c]" />
          <span>Buat Undangan Baru</span>
        </Link>
      </div>

      {/* 2. Success & Error Notification Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#2d4a3e] text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center justify-between shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2d4a3e] shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-emerald-100/50"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center justify-between shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-rose-100/50"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Summary Metrics (Responsive Grid: 2 cols on mobile, 4 on tablet/desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Acara */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Total Acara</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#faf8f5] text-[#2d4a3e] border border-slate-200/80 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 sm:mt-2.5">{totalWeddings}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-mono truncate">Dikelola di akun</p>
        </div>

        {/* Status Published */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all hover:border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Published</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-[#2d4a3e] border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 sm:mt-2.5">{publishedCount}</p>
          <p className="text-[10px] sm:text-[11px] text-[#2d4a3e] mt-0.5 font-mono truncate">Siap disebarkan</p>
        </div>

        {/* Total Tamu */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Total Tamu</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#faf8f5] text-[#2d4a3e] border border-slate-200/80 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 sm:mt-2.5">{totalGuests}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-mono truncate">Semua undangan</p>
        </div>

        {/* Konfirmasi RSVP */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs transition-all hover:border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">RSVP Masuk</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 sm:mt-2.5">{totalRsvps}</p>
          <p className="text-[10px] sm:text-[11px] text-amber-700 mt-0.5 font-mono truncate">Tanggapan tamu</p>
        </div>
      </div>

      {/* 4. Filter & Search Controls (Mobile & Tablet friendly) */}
      {totalWeddings > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama mempelai, slug, atau tema..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Dropdown with Filter Icon */}
          <div className="relative shrink-0 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 min-h-[42px] text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">Semua Undangan ({totalWeddings})</option>
              <option value="published">Published ({publishedCount})</option>
              <option value="draft">Draft ({totalWeddings - publishedCount})</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 5. Main Wedding List (Mobile Card Stack & Tablet/Desktop Table View) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {/* Header List */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Daftar Acara Pernikahan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih acara untuk mengedit konten, tamu, template, atau melihat preview.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-mono shrink-0">
            {filteredWeddings.length} dari {totalWeddings}
          </span>
        </div>

        {totalWeddings === 0 ? (
          /* Empty State Saat Belum Ada Acara */
          <div className="p-8 sm:p-14 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-white flex items-center justify-center mx-auto shadow-md">
              <Heart className="w-8 h-8 fill-white/20 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 font-serif">
                Belum ada undangan yang dibuat
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Mulai buat undangan pernikahan impian Anda dalam hitungan menit dengan tema sinematik berkelas dari Hayvows.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/dashboard/invitation/new"
                className="inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-all w-full sm:w-auto min-h-[44px]"
              >
                <Plus className="w-4 h-4 text-[#c9a84c]" />
                <span>Buat Undangan Pertama</span>
              </Link>
            </div>
          </div>
        ) : filteredWeddings.length === 0 ? (
          /* Filter No Results */
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Tidak ada undangan yang cocok</p>
            <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau ganti filter status.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-xs font-semibold text-[#2d4a3e] hover:underline cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View: Compact List with Expandable Accordion Drawer (< md) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredWeddings.map((w, idx) => {
                const isPublished = w.status === "published";
                const isExpanded = expandedWeddingId === w.id;

                return (
                  <div
                    key={w.id}
                    className={`transition-colors ${
                      isExpanded ? "bg-slate-50/70" : "hover:bg-slate-50/40"
                    }`}
                  >
                    {/* 1. Main Compact Row (~54px height) */}
                    <div
                      onClick={() => setExpandedWeddingId(isExpanded ? null : w.id)}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer select-none"
                    >
                      {/* Left: No, Name & Badges */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                            {w.coupleName}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${
                              isPublished
                                ? "bg-emerald-50 text-[#2d4a3e] border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isPublished ? "bg-[#2d4a3e]" : "bg-amber-500"
                              }`}
                            />
                            <span>{isPublished ? "Live" : "Draft"}</span>
                          </span>
                          {w.isDemo && (
                            <span className="font-bold text-[9px] bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.2 rounded shrink-0">
                              Demo
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span className="truncate max-w-[130px]">/{w.slug}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-sans truncate">{w.templateName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700 font-sans font-medium">{w.guestCount} Tamu</span>
                        </div>
                      </div>

                      {/* Right: Primary Action (Kelola) + Chevron Toggle */}
                      <div
                        className="flex items-center gap-1.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/dashboard/invitation/${w.id}`}
                          className="inline-flex items-center justify-center gap-1 min-h-[36px] px-3 text-xs font-semibold bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] text-white rounded-xl shadow-2xs transition-colors cursor-pointer"
                          title="Kelola Acara Ini"
                        >
                          <span>Kelola</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setExpandedWeddingId(isExpanded ? null : w.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-transform duration-200 cursor-pointer"
                          title={isExpanded ? "Tutup detail" : "Buka detail"}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-[#2d4a3e]" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 2. Expandable Accordion Drawer (Secondary Details & Actions) */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-0 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150 text-xs">
                        {/* Detail Grid */}
                        <div className="grid grid-cols-2 gap-2 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Paket & Tema:</span>
                            <div className="mt-0.5 font-semibold text-slate-800 text-[11px] flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#2d4a3e] shrink-0" />
                              <span className="truncate">{w.templateName}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {w.isDemo
                                ? "Demo Showcase"
                                : w.plan === "luxury"
                                ? "Paket Exclusive"
                                : w.plan === "premium"
                                ? "Paket Populer"
                                : w.plan === "basic"
                                ? "Paket Basic"
                                : "Trial"}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Statistik Acara:</span>
                            <div className="mt-0.5 text-slate-700 text-[11px] font-medium space-y-0.5">
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-slate-400" />
                                <span>{w.guestCount} Tamu</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-emerald-700 font-semibold">{w.rsvpCount} RSVP</span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-amber-700">
                                <Eye className="w-3 h-3 text-amber-500" />
                                <span>{w.viewCount} Total Views</span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Slug: /{w.slug}</span>
                            <span>Dibuat: {w.createdAt}</span>
                          </div>
                        </div>

                        {/* Secondary Actions (Live Demo & Hapus Acara) */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <Link
                            href={`/invitation/${w.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[34px] px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                            title="Buka Web Undangan"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>Live Demo</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => setSelectedWeddingForDelete(w)}
                            className="inline-flex items-center justify-center gap-1.5 min-h-[34px] px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-rose-600 text-xs font-medium cursor-pointer shadow-2xs transition-colors shrink-0"
                            title="Hapus Acara"
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Full Card Row (visible on desktop md+ only) */}
            <div className="hidden md:block divide-y divide-slate-100">
              {filteredWeddings.map((w) => {
                const isPublished = w.status === "published";

                return (
                  <div
                    key={w.id}
                    className="p-4 sm:p-5 md:p-6 hover:bg-[#faf8f5]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-5"
                  >
                    {/* Left Column: Details */}
                    <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
                      {/* Wedding Icon Avatar */}
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] flex items-center justify-center text-white shadow-2xs shrink-0 mt-0.5">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white/20 text-white" />
                      </div>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        {/* Name & Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                            {w.coupleName}
                          </h3>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                              isPublished
                                ? "bg-emerald-50 text-[#2d4a3e] border border-emerald-200/80"
                                : "bg-amber-50 text-amber-700 border border-amber-200/80"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isPublished ? "bg-[#2d4a3e] animate-pulse" : "bg-amber-500"
                              }`}
                            />
                            <span>{isPublished ? "Live • Published" : "Draft"}</span>
                          </span>

                          {/* Plan Badge */}
                          {w.isDemo ? (
                            <span className="font-bold text-[9px] bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              Demo Showcase
                            </span>
                          ) : (
                            <span
                              className={`font-semibold text-[10px] px-2 py-0.5 rounded-md border ${
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

                        {/* Meta information row */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                          <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                            /{w.slug}
                          </span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            <Sparkles className="w-3.5 h-3.5 text-[#2d4a3e]" />
                            <span>{w.templateName}</span>
                          </span>
                          <span className="text-slate-300 hidden sm:inline">&bull;</span>
                          <span className="text-slate-400 text-[11px] hidden sm:inline">
                            Dibuat {w.createdAt}
                          </span>
                        </div>

                        {/* Mini Stats Chips (Touch-friendly & legible) */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg font-medium">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{w.guestCount} Tamu</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50/60 border border-emerald-200/60 px-2.5 py-1 rounded-lg font-medium text-[#2d4a3e]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2d4a3e]" />
                            <span>{w.rsvpCount} RSVP</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-amber-50/60 border border-amber-200/60 px-2.5 py-1 rounded-lg font-medium text-amber-900">
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            <span>{w.viewCount} Views</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="pt-2 md:pt-0 border-t border-slate-100 md:border-0 flex flex-col sm:flex-row md:flex-row items-stretch sm:items-center gap-2 shrink-0">
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                        {/* Live Demo Button */}
                        <Link
                          href={`/invitation/${w.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl shadow-2xs transition-colors min-h-[44px]"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          <span>Live Demo</span>
                        </Link>

                        {/* Kelola Undangan (Primary Action) */}
                        <Link
                          href={`/dashboard/invitation/${w.id}`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] rounded-xl shadow-2xs hover:shadow-xs transition-all min-h-[44px]"
                        >
                          <span>Kelola Acara</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Tombol Hapus */}
                      <button
                        type="button"
                        onClick={() => setSelectedWeddingForDelete(w)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-all cursor-pointer min-h-[38px] md:min-h-0 self-center sm:self-auto"
                        title="Hapus undangan ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sm:hidden">Hapus Acara</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 6. Responsive Confirmation Modal (Bottom Sheet on Mobile, Centered on Tablet/Desktop) */}
      {selectedWeddingForDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Sheet Handle for Mobile */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Undangan Pernikahan?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data undangan untuk:
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs mt-2">
                  <span className="font-bold text-slate-900 block truncate text-sm">
                    {selectedWeddingForDelete.coupleName}
                  </span>
                  <span className="font-mono text-slate-500 text-xs block mt-0.5">
                    /{selectedWeddingForDelete.slug}
                  </span>
                </div>
                <p className="text-[11px] text-rose-700 bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 leading-relaxed mt-2">
                  Perhatian: Tindakan ini permanen. Semua data tamu, buku ucapan, RSVP, dan foto galeri yang tersimpan di acara ini akan dihapus secara menyeluruh.
                </p>
              </div>
            </div>

            {/* Action buttons (Stacked full-width on mobile, right-aligned on tablet/desktop) */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setSelectedWeddingForDelete(null)}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={handleDeleteConfirm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deletingId ? "Menghapus..." : "Ya, Hapus Undangan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

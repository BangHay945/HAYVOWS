"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Camera,
  QrCode,
  Download,
  Plus,
  Search,
  Filter,
  MapPin,
  Sparkles,
  Gift,
  Tv,
  Check,
  Undo2,
  Trash2,
  ExternalLink,
  Crown,
  FileSpreadsheet,
  Heart,
  RefreshCw,
} from "lucide-react";
import { OnTheSpotGuestModal } from "@/components/dashboard/OnTheSpotGuestModal";
import { GuestTicketModal } from "@/components/invitation/GuestTicketModal";

export interface GuestbookItem {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string | null;
  category: string;
  guestCount: number;
  tableNumber: string | null;
  sessionName: string | null;
  qrCode: string | null;
  attendanceStatus: string;
  checkedIn: boolean;
  checkedInAt: Date | string | null;
  checkedInPax: number;
  souvenirTaken: boolean;
  giftType: string | null;
  checkInNotes: string | null;
  rsvp?: { attendanceStatus: string; guestCount?: number } | null;
}

export interface WeddingOptionItem {
  id: string;
  slug: string;
  coupleTitle: string;
}

export function GuestbookWorkbench({
  weddingId,
  weddingSlug,
  coupleTitle,
  initialGuests,
  weddingOptions = [],
}: {
  weddingId: string;
  weddingSlug: string;
  coupleTitle: string;
  initialGuests: GuestbookItem[];
  weddingOptions?: WeddingOptionItem[];
}) {
  const router = useRouter();
  const [guests, setGuests] = useState<GuestbookItem[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "checked_in" | "not_checked_in" | "vip">("all");
  const [isOnTheSpotModalOpen, setIsOnTheSpotModalOpen] = useState(false);
  const [selectedTicketGuest, setSelectedTicketGuest] = useState<GuestbookItem | null>(null);
  const [loadingGuestId, setLoadingGuestId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Stats Calculations
  const stats = useMemo(() => {
    const totalGuests = guests.length;
    const totalInvitedPax = guests.reduce((sum, g) => sum + g.guestCount, 0);
    const checkedInGuests = guests.filter((g) => g.checkedIn);
    const totalCheckedInCount = checkedInGuests.length;
    const totalCheckedInPax = checkedInGuests.reduce((sum, g) => sum + g.checkedInPax, 0);
    const vipCheckedIn = checkedInGuests.filter((g) =>
      g.category?.toLowerCase().includes("vip")
    ).length;
    const totalSouvenirs = guests.filter((g) => g.souvenirTaken).length;
    const totalPhysicalGifts = guests.filter((g) => g.giftType && g.giftType !== "none").length;
    const attendanceRate = totalGuests > 0 ? Math.round((totalCheckedInCount / totalGuests) * 100) : 0;

    return {
      totalGuests,
      totalInvitedPax,
      totalCheckedInCount,
      totalCheckedInPax,
      vipCheckedIn,
      totalSouvenirs,
      totalPhysicalGifts,
      attendanceRate,
    };
  }, [guests]);

  // Refresh guests list from API
  const reloadGuests = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsSyncing(true);
    try {
      const res = await fetch(`/api/wedding/${weddingId}/guests`);
      if (res.ok) {
        const data = await res.json();
        setGuests(data);
      }
    } catch {
      // ignore
    } finally {
      if (showIndicator) {
        setTimeout(() => setIsSyncing(false), 500);
      }
    }
  }, [weddingId]);

  // Real-time live auto-refresh polling (every 4 seconds) & focus sync
  useEffect(() => {
    const interval = setInterval(() => {
      reloadGuests(false);
    }, 4000);

    const handleFocus = () => {
      reloadGuests(true);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [reloadGuests]);

  // Toggle quick checkin / undo
  const handleToggleCheckIn = async (guest: GuestbookItem) => {
    setLoadingGuestId(guest.id);
    try {
      const res = await fetch(`/api/wedding/${weddingId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          guest.checkedIn
            ? { guestId: guest.id, action: "undo" }
            : {
                guestId: guest.id,
                checkedInPax: guest.guestCount || 1,
                souvenirTaken: true,
                giftType: "none",
              }
        ),
      });

      if (res.ok) {
        const data = await res.json();
        setGuests((prev) =>
          prev.map((g) => (g.id === guest.id ? { ...g, ...data.guest } : g))
        );
      }
    } finally {
      setLoadingGuestId(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "No",
      "Nama Tamu",
      "Alamat / Asal Kota",
      "Kategori",
      "Nomor Meja",
      "Sesi",
      "Kuota Pax",
      "Pax Hadir",
      "Status Hadir",
      "Waktu Check-in",
      "Souvenir",
      "Jenis Kado",
      "Catatan",
    ];

    const rows = guests.map((g, idx) => [
      idx + 1,
      `"${g.name.replace(/"/g, '""')}"`,
      `"${(g.address || "").replace(/"/g, '""')}"`,
      g.category,
      g.tableNumber || "-",
      g.sessionName || "-",
      g.guestCount,
      g.checkedIn ? g.checkedInPax : 0,
      g.checkedIn ? "Hadir" : "Belum Hadir",
      g.checkedInAt ? new Date(g.checkedInAt).toLocaleString("id-ID") : "-",
      g.souvenirTaken ? "Sudah Ambil" : "Belum",
      g.giftType || "-",
      `"${(g.checkInNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap-Buku-Tamu-${weddingSlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.address && g.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (g.category && g.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (g.tableNumber && g.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchStatus = true;
      if (statusFilter === "checked_in") matchStatus = g.checkedIn;
      if (statusFilter === "not_checked_in") matchStatus = !g.checkedIn;
      if (statusFilter === "vip") matchStatus = g.category.toLowerCase().includes("vip");

      return matchSearch && matchStatus;
    });
  }, [guests, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="min-w-0">
          <div className="text-[11px] font-mono tracking-wider font-semibold text-emerald-700 uppercase mb-1">
            Presensi Resepsi &amp; Check-In QR
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Buku Tamu Digital &amp; Presensi QR
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Kelola kehadiran tamu hari H secara real-time dengan pemindai QR Code, pencatatan souvenir, dan alamat domisili tamu.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-nowrap overflow-x-auto pb-1 lg:pb-0">
          <Link
            href={`/scan/${weddingSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 min-h-[40px] py-2 px-3 sm:px-3.5 rounded-xl font-semibold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Camera className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Pemindai QR ↗</span>
          </Link>

          <Link
            href={`/display/${weddingSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 min-h-[40px] py-2 px-3 sm:px-3.5 rounded-xl font-semibold text-xs bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Tv className="w-4 h-4 text-purple-700 shrink-0" />
            <span>Layar Sambutan TV ↗</span>
          </Link>

          <button
            type="button"
            onClick={() => reloadGuests(true)}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 min-h-[40px] py-2 px-3 sm:px-3.5 rounded-xl font-semibold text-xs border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Muat ulang data kehadiran terkini"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? "animate-spin text-[#2d4a3e]" : ""}`} />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOnTheSpotModalOpen(true)}
            className="inline-flex items-center gap-1.5 min-h-[40px] py-2 px-3 sm:px-3.5 rounded-xl font-bold text-xs bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#fef08a] shrink-0" />
            <span>Tambah Tamu On-the-Spot</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 min-h-[40px] py-2 px-3 sm:px-3.5 rounded-xl font-semibold text-xs border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Kehadiran */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tamu Hadir Riil
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {stats.totalCheckedInCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {stats.totalGuests} Undangan ({stats.attendanceRate}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Total {stats.totalCheckedInPax} orang tiba di lokasi
          </p>
        </div>

        {/* Card 2: Tamu VIP */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tamu VIP Hadir
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Crown className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {stats.vipCheckedIn}
            </span>
            <span className="text-xs text-slate-500 font-medium">VIP Tiba</span>
          </div>
          <p className="text-[11px] text-slate-500">Prioritas sambutan meja VIP</p>
        </div>

        {/* Card 3: Souvenir Diberikan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Souvenir Diserahkan
            </span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Gift className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {stats.totalSouvenirs}
            </span>
            <span className="text-xs text-slate-500 font-medium">Paket</span>
          </div>
          <p className="text-[11px] text-slate-500">Tercatat di meja penerima tamu</p>
        </div>

        {/* Card 4: Belum Hadir */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Belum Hadir
            </span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {Math.max(0, stats.totalGuests - stats.totalCheckedInCount)}
            </span>
            <span className="text-xs text-slate-500 font-medium">Undangan</span>
          </div>
          <p className="text-[11px] text-slate-500">Estimasi kedatangan bertahap</p>
        </div>
      </div>

      {/* Table Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 font-bold text-sm text-[#2d4a3e]">
          <Users className="w-4 h-4" />
          <span>Daftar Buku Tamu ({guests.length})</span>
        </div>
      </div>

      {/* TABLE VIEW */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-4 p-4 sm:p-5">
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama tamu, alamat / kota, nomor meja..."
                className="w-full pl-9 pr-3.5 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: "all", label: "Semua Tamu" },
                { id: "checked_in", label: "Sudah Hadir" },
                { id: "not_checked_in", label: "Belum Hadir" },
                { id: "vip", label: "Tamu VIP" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`min-h-[40px] py-2 px-3.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                    statusFilter === f.id
                      ? "bg-[#2d4a3e] text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Card View (< md: Meja Resepsionis Cepat) */}
          <div className="block md:hidden divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
            {filteredGuests.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Tidak ada data tamu yang cocok dengan pencarian atau filter.
              </div>
            ) : (
              filteredGuests.map((guest) => {
                const isVip = guest.category?.toLowerCase().includes("vip");
                const initial = guest.name.charAt(0).toUpperCase();

                return (
                  <div
                    key={guest.id}
                    className={`p-4 space-y-3 transition-colors ${
                      guest.checkedIn ? "bg-emerald-50/25" : "hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Top: Avatar, Name, VIP/Cat, and Check-in Badge */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm truncate">
                              {guest.name}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border shrink-0 ${
                                isVip
                                  ? "bg-amber-100 text-amber-900 border-amber-300"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {guest.category || "Reguler"}
                            </span>
                            {guest.rsvp?.attendanceStatus === "attending" && (
                              <span
                                title="RSVP Hadir"
                                className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0"
                              />
                            )}
                          </div>
                          {guest.phone && (
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {guest.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Pill */}
                      <div className="shrink-0">
                        {guest.checkedIn ? (
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[10px] bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                              <span>Hadir</span>
                            </span>
                            {guest.checkedInAt && (
                              <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">
                                {new Date(guest.checkedInAt).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })} WIB
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Belum Tiba</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Crucial Info Bar: Table Number, Pax, Souvenir, Address */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-mono">Nomor Meja</span>
                        <span className="font-bold text-[#2d4a3e] text-xs">
                          {guest.tableNumber ? `Meja ${guest.tableNumber}` : "Bebas / Tanpa Meja"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-mono">Jumlah Pax &amp; Souvenir</span>
                        <span className="font-bold text-slate-800 text-xs">
                          {guest.checkedIn ? `${guest.checkedInPax} Pax` : `${guest.guestCount} Pax`}
                          <span className="font-normal text-slate-400"> • </span>
                          {guest.souvenirTaken ? (
                            <span className="text-emerald-700 font-semibold">Souvenir ✓</span>
                          ) : (
                            <span className="text-slate-400">Belum souvenir</span>
                          )}
                        </span>
                      </div>

                      {guest.address && (
                        <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate text-[11px]">{guest.address}</span>
                        </div>
                      )}
                    </div>

                    {/* 1-Tap Check-In Action Dock (min-h-[46px]) */}
                    <div className="flex items-center gap-2 pt-1">
                      {!guest.checkedIn ? (
                        <button
                          type="button"
                          onClick={() => handleToggleCheckIn(guest)}
                          disabled={loadingGuestId === guest.id}
                          className="flex-1 min-h-[46px] bg-[#2d4a3e] hover:bg-[#233a30] active:scale-[0.98] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {loadingGuestId === guest.id ? (
                            <span>Memproses...</span>
                          ) : (
                            <>
                              <Check className="w-4 h-4 text-[#fef08a]" />
                              <span>Check-in Tamu (1-Klik)</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <>
                          <div className="flex-1 min-h-[44px] bg-emerald-50 border border-emerald-200/90 text-emerald-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Tamu Sudah Check-in</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleCheckIn(guest)}
                            disabled={loadingGuestId === guest.id}
                            className="min-h-[44px] px-3.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-500 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            title="Batalkan presensi kehadiran jika salah pencet"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                            <span>Batal</span>
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedTicketGuest(guest)}
                        title="Lihat Tiket QR Code Tamu"
                        className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shrink-0"
                      >
                        <QrCode className="w-4 h-4 text-[#2d4a3e]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-3.5">No</th>
                  <th className="py-3 px-3.5">Nama Tamu</th>
                  <th className="py-3 px-3.5">Alamat / Asal Kota</th>
                  <th className="py-3 px-3.5">Kategori</th>
                  <th className="py-3 px-3.5">Meja</th>
                  <th className="py-3 px-3.5">Pax</th>
                  <th className="py-3 px-3.5">Status Presensi</th>
                  <th className="py-3 px-3.5">Souvenir</th>
                  <th className="py-3 px-3.5 text-center">Aksi Resepsionis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-slate-400">
                      Tidak ada data tamu yang cocok dengan pencarian atau filter.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest, idx) => {
                    const isVip = guest.category?.toLowerCase().includes("vip");
                    return (
                      <tr
                        key={guest.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          guest.checkedIn ? "bg-emerald-50/20" : ""
                        }`}
                      >
                        <td className="py-3 px-3.5 text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>

                        {/* Nama Tamu */}
                        <td className="py-3 px-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{guest.name}</span>
                            {guest.rsvp?.attendanceStatus === "attending" && (
                              <span
                                title="RSVP Hadir"
                                className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0"
                              />
                            )}
                          </div>
                          {guest.phone && (
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {guest.phone}
                            </span>
                          )}
                        </td>

                        {/* Alamat / Asal Kota */}
                        <td className="py-3 px-3.5">
                          {guest.address ? (
                            <span className="inline-flex items-center gap-1 text-slate-700">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[180px]">{guest.address}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 italic">-</span>
                          )}
                        </td>

                        {/* Kategori */}
                        <td className="py-3 px-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isVip
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {guest.category || "Reguler"}
                          </span>
                        </td>

                        {/* Nomor Meja */}
                        <td className="py-3 px-3.5 font-semibold text-[#2d4a3e]">
                          {guest.tableNumber || "-"}
                        </td>

                        {/* Pax */}
                        <td className="py-3 px-3.5">
                          <span className="font-bold">
                            {guest.checkedIn ? guest.checkedInPax : guest.guestCount}
                          </span>{" "}
                          <span className="text-[10px] text-slate-400">Pax</span>
                        </td>

                        {/* Status Presensi */}
                        <td className="py-3 px-3.5">
                          {guest.checkedIn ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" />
                                <span>Hadir</span>
                              </span>
                              {guest.checkedInAt && (
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {new Date(guest.checkedInAt).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })} WIB
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                              <Clock className="w-3 h-3" />
                              <span>Belum Tiba</span>
                            </span>
                          )}
                        </td>

                        {/* Souvenir */}
                        <td className="py-3 px-3.5">
                          {guest.souvenirTaken ? (
                            <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Diterima</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>

                        {/* Aksi Resepsionis */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleCheckIn(guest)}
                              disabled={loadingGuestId === guest.id}
                              title={guest.checkedIn ? "Batalkan Hadir" : "Check-in 1-Klik"}
                              className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                guest.checkedIn
                                  ? "bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200"
                                  : "bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-2xs"
                              }`}
                            >
                              {loadingGuestId === guest.id ? (
                                "..."
                              ) : guest.checkedIn ? (
                                <span className="flex items-center gap-1">
                                  <Undo2 className="w-3 h-3" />
                                  <span>Batal</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  <span>Check-in</span>
                                </span>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedTicketGuest(guest)}
                              title="Lihat Tiket QR Code Tamu"
                              className="p-1 rounded-lg text-slate-500 hover:text-[#2d4a3e] hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Modal On-The-Spot Guest */}
      <OnTheSpotGuestModal
        isOpen={isOnTheSpotModalOpen}
        onClose={() => setIsOnTheSpotModalOpen(false)}
        weddingId={weddingId}
        onSuccess={reloadGuests}
      />

      {/* Modal Tiket E-Pass QR Code Tamu */}
      {selectedTicketGuest && (
        <GuestTicketModal
          isOpen={!!selectedTicketGuest}
          onClose={() => setSelectedTicketGuest(null)}
          guestName={selectedTicketGuest.name}
          guestSlug={selectedTicketGuest.slug}
          guestAddress={selectedTicketGuest.address}
          guestCategory={selectedTicketGuest.category}
          guestCount={selectedTicketGuest.guestCount}
          tableNumber={selectedTicketGuest.tableNumber}
          sessionName={selectedTicketGuest.sessionName}
          coupleTitle={coupleTitle}
          weddingSlug={weddingSlug}
          qrCode={selectedTicketGuest.qrCode}
        />
      )}
    </div>
  );
}

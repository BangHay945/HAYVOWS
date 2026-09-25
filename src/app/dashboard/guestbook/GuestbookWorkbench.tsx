"use client";

import { useState, useMemo } from "react";
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
  Printer,
} from "lucide-react";
import { QRScannerView } from "@/components/dashboard/QRScannerView";
import { OnTheSpotGuestModal } from "@/components/dashboard/OnTheSpotGuestModal";
import { GuestTicketModal } from "@/components/invitation/GuestTicketModal";
import { PrintableRSVPCardModal } from "@/components/dashboard/PrintableRSVPCardModal";

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
  const [activeTab, setActiveTab] = useState<"table" | "scanner" | "display">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "checked_in" | "not_checked_in" | "vip">("all");
  const [isOnTheSpotModalOpen, setIsOnTheSpotModalOpen] = useState(false);
  const [selectedTicketGuest, setSelectedTicketGuest] = useState<GuestbookItem | null>(null);
  const [loadingGuestId, setLoadingGuestId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

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
  const reloadGuests = async () => {
    try {
      const res = await fetch(`/api/wedding/${weddingId}/guests`);
      if (res.ok) {
        const data = await res.json();
        setGuests(data);
      }
    } catch {
      // ignore
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Buku Tamu Digital &amp; Presensi QR
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola kehadiran tamu hari H secara real-time dengan pemindai QR Code, pencatatan souvenir, dan alamat domisili tamu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#fef08a]" />
            <span>Cetak Kartu QR RSVP Fisik</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOnTheSpotModalOpen(true)}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#fef08a]" />
            <span>Tambah Tamu On-the-Spot</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Unduh CSV</span>
          </button>

          <Link
            href={`/display/${weddingSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-colors cursor-pointer"
          >
            <Tv className="w-4 h-4 text-purple-700" />
            <span>Layar Sambutan TV ↗</span>
          </Link>
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

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("table")}
          className={`py-2.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "table"
              ? "border-[#2d4a3e] text-[#2d4a3e]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Buku Tamu ({guests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("scanner")}
          className={`py-2.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "scanner"
              ? "border-[#2d4a3e] text-[#2d4a3e]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Kamera Pemindai QR Resepsionis</span>
        </button>
      </div>

      {/* TAB CONTENT: 1. TABLE VIEW */}
      {activeTab === "table" && (
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
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
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
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
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

          {/* Table Element */}
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
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
      )}

      {/* TAB CONTENT: 2. SCANNER QR */}
      {activeTab === "scanner" && (
        <QRScannerView weddingId={weddingId} onCheckInSuccess={reloadGuests} />
      )}

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

      {/* Modal Cetak Kartu & Stiker QR RSVP Fisik */}
      <PrintableRSVPCardModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        weddingSlug={weddingSlug}
        coupleTitle={coupleTitle}
      />
    </div>
  );
}

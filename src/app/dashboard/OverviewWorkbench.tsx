"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  MessageSquare,
  BarChart3,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Plus,
  Palette,
  Pin,
  MapPin,
  Play,
  Heart,
  Calendar,
  CreditCard,
  Sparkles,
  Search,
  ChevronRight,
  XCircle,
  Clock,
  ArrowUpRight,
  Gift,
  Wallet,
  TrendingUp,
  Lock,
} from "lucide-react";

interface WeddingSummary {
  id: string;
  slug: string;
  status: string;
  template?: { name: string; slug: string } | null;
  couple?: {
    groomName: string;
    brideName: string;
    groomNickname?: string;
    brideNickname?: string;
  } | null;
  events?: Array<{
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string | null;
    venue: string;
    address: string;
    mapsUrl: string;
  }>;
  giftAccounts?: Array<{
    id: string;
    bankName: string;
    accountNo?: string;
    accountName?: string;
    qrisUrl?: string | null;
  }>;
  _count: {
    guests: number;
    analyticsEvents: number;
  };
}

interface GuestItem {
  id: string;
  name: string;
  category: string;
  guestCount: number;
  slug: string;
  phone: string;
  session?: string;
  rsvp?: { attendanceStatus: string } | null;
  createdAt?: Date;
}

interface MessageItem {
  id: string;
  guestName: string;
  message: string;
  isPinned: boolean;
  attendanceStatus?: string;
  createdAt: Date;
}

export function OverviewWorkbench({
  weddings,
  selectedWedding,
  initialGuests,
  recentMessages,
  totalGuests,
  totalRsvp,
  totalDeclined,
  totalMessages,
  totalViews,
  totalGiftAmount = 0,
  totalGiftCount = 0,
  recentGiftConfirmations = [],
}: {
  weddings: WeddingSummary[];
  selectedWedding?: WeddingSummary;
  initialGuests: GuestItem[];
  recentMessages: MessageItem[];
  totalGuests: number;
  totalRsvp: number;
  totalDeclined: number;
  totalMessages: number;
  totalViews: number;
  totalGiftAmount?: number;
  totalGiftCount?: number;
  recentGiftConfirmations?: Array<{
    id: string;
    guestName: string;
    bankName: string;
    amount: number;
    notes: string | null;
    accountSender?: string | null;
    createdAt: Date | string;
  }>;
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [guestFilter, setGuestFilter] = useState("all");
  const [guestSearch, setGuestSearch] = useState("");

  const activeWedding = selectedWedding || weddings[0];

  const groom = activeWedding?.couple?.groomNickname || activeWedding?.couple?.groomName || "Liam";
  const bride = activeWedding?.couple?.brideNickname || activeWedding?.couple?.brideName || "Elara";
  const coupleTitle = `${groom} & ${bride}`;
  const templateName = activeWedding?.template?.name || "Cyberpunk Neo-District (2077)";
  const isCyberpunk = activeWedding?.template?.slug === "pixel-cyberpunk" || templateName.toLowerCase().includes("cyber");
  const demoUrl = isCyberpunk ? "/invitation/neo-2077" : "/invitation/alex-sara";
  const weddingParam = activeWedding?.id ? `?weddingId=${activeWedding.id}` : "";

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} berhasil disalin ke papan klip.`);
  };

  const averageGift = totalGiftCount > 0 ? Math.round(totalGiftAmount / totalGiftCount) : 0;

  const bankTotals = recentGiftConfirmations.reduce<Record<string, { total: number; count: number }>>((acc, item) => {
    const bank = item.bankName || "Lainnya";
    if (!acc[bank]) {
      acc[bank] = { total: 0, count: 0 };
    }
    acc[bank].total += item.amount;
    acc[bank].count += 1;
    return acc;
  }, {});

  const formatDateTime = (dateVal: Date | string) => {
    try {
      const d = typeof dateVal === "string" ? new Date(dateVal) : dateVal;
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Baru saja";
    }
  };

  const copyGiftSummary = () => {
    const lines = [
      `🎁 Rekap Tanda Kasih & Amplop Digital - ${coupleTitle}`,
      `Total Masuk: Rp ${totalGiftAmount.toLocaleString("id-ID")} (${totalGiftCount} transaksi)`,
      `Rata-rata: Rp ${averageGift.toLocaleString("id-ID")}`,
      "",
      "Rincian per Rekening Tujuan:",
      ...Object.entries(bankTotals).map(([bank, data]) => `• ${bank}: Rp ${data.total.toLocaleString("id-ID")} (${data.count} amplop)`),
      "",
      `Terakhir diperbarui: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`,
    ];
    copyToClipboard(lines.join("\n"), "Rekapitulasi tanda kasih");
  };

  const filteredGuests = initialGuests.filter((g) => {
    const matchesFilter =
      guestFilter === "all" ||
      (guestFilter === "attending" && g.rsvp?.attendanceStatus === "attending") ||
      (guestFilter === "declined" && g.rsvp?.attendanceStatus === "not_attending") ||
      (guestFilter === "pending" && (!g.rsvp || !g.rsvp.attendanceStatus));
    const matchesSearch = g.name.toLowerCase().includes(guestSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const attendanceRate = totalGuests > 0 ? Math.round((totalRsvp / totalGuests) * 100) : 0;
  const pendingCount = Math.max(0, totalGuests - totalRsvp - totalDeclined);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
      {/* 1. HERO COMMAND STRIP & CONTEXT */}
      <section className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {coupleTitle}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Published &bull; Live</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span>Sabtu, 24 Oktober 2026</span>
            <span className="text-slate-300">&bull;</span>
            <span>Grand Ballroom Neo-Jakarta</span>
            <span className="text-slate-300">&bull;</span>
            <span className="font-mono text-[#2d4a3e] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 text-[11px]">
              /{activeWedding?.slug}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                `${typeof window !== "undefined" ? window.location.origin : ""}/invitation/${activeWedding?.slug}`,
                "Tautan publik undangan"
              )
            }
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 text-[11px] sm:text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Salin Link</span>
          </button>

          <Link
            href={`/dashboard/template${weddingParam}`}
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 text-[11px] sm:text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors text-center"
          >
            <Palette className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Ganti Tema</span>
          </Link>

          <Link
            href={`/dashboard/invitation${weddingParam}`}
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-2 text-[11px] sm:text-xs font-semibold text-white bg-[#2d4a3e] hover:bg-[#233a30] rounded-xl shadow-xs hover:shadow-md transition-all text-center"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">+ Undangan</span>
          </Link>
        </div>
      </section>

      {/* 2. METRIC SUMMARY (2 COLS ON MOBILE, 4 COLS ON DESKTOP - CLICKABLE COMMAND TILES) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1: Total Tamu */}
        <Link
          href={`/dashboard/guests${weddingParam}`}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-xs transition-all group block"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 group-hover:text-emerald-700 transition-colors truncate">
              Total Tamu ↗
            </p>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {totalGuests || 150}
            </p>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 mt-1 truncate">
              <span>Terdaftar</span>
              <span>&bull;</span>
              <span>45 VIP</span>
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-2 sm:mt-2.5 pt-1.5 border-t border-slate-100 truncate">
            Kuota: 200 pax
          </p>
        </Link>

        {/* Card 2: Konfirmasi Hadir (RSVP) */}
        <Link
          href={`/dashboard/rsvp${weddingParam}`}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-xs transition-all group block"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 group-hover:text-emerald-700 transition-colors truncate">
              RSVP Hadir ↗
            </p>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {totalRsvp || 112}
            </p>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-700 font-medium mt-1 truncate">
              <ArrowUpRight className="w-3 h-3 shrink-0" />
              <span>{attendanceRate}% hadir</span>
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-2 sm:mt-2.5 pt-1.5 border-t border-slate-100 truncate">
            {totalDeclined || 14} Berhalangan
          </p>
        </Link>

        {/* Card 3: Ucapan Masuk */}
        <Link
          href={`/dashboard/messages${weddingParam}`}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-purple-400 hover:shadow-xs transition-all group block"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 group-hover:text-purple-700 transition-colors truncate">
              Doa &amp; Ucapan ↗
            </p>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {totalMessages || 48}
            </p>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-purple-700 font-medium mt-1 truncate">
              <Pin className="w-3 h-3 shrink-0" />
              <span>2 Pinned</span>
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-2 sm:mt-2.5 pt-1.5 border-t border-slate-100 truncate">
            +9 hari ini
          </p>
        </Link>

        {/* Card 4: Kunjungan & Interaksi */}
        <Link
          href={`/dashboard/analytics${weddingParam}`}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-amber-400 hover:shadow-xs transition-all group block"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 group-hover:text-amber-700 transition-colors truncate">
              Kunjungan ↗
            </p>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {totalViews || 1280}
            </p>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-700 font-medium mt-1 truncate">
              <Clock className="w-3 h-3 shrink-0" />
              <span>3m 42s rata-rata</span>
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-2 sm:mt-2.5 pt-1.5 border-t border-slate-100 truncate">
            86% via Smartphone
          </p>
        </Link>
      </section>

      {/* 4. MAIN 2-COLUMN WORKBENCH GRID (BALANCED 50/50 LAYOUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: GUEST & RSVP TRACKER + RINCIAN TANDA KASIH */}
        <div className="space-y-6">
          
          {/* PANEL 1: MINI GUEST & RSVP TRACKER */}
          <section className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Status Konfirmasi RSVP &amp; Tamu
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Respon kehadiran terbaru para tamu undangan Anda.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={guestFilter}
                  onChange={(e) => setGuestFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium cursor-pointer flex-1 sm:flex-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="attending">Hadir</option>
                  <option value="declined">Berhalangan</option>
                  <option value="pending">Menunggu</option>
                </select>

                <Link
                  href={`/dashboard/guests${weddingParam}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2d4a3e] hover:bg-[#233a30] text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Tamu</span>
                </Link>
              </div>
            </div>

            {/* Filter / Search input */}
            <div className="px-3.5 sm:px-4 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center gap-2 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                placeholder="Cari nama tamu atau nomor WhatsApp..."
                className="w-full bg-transparent text-xs text-slate-700 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            {/* A. Desktop View: Full Multi-Column Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Nama Tamu</th>
                    <th className="px-4 py-3">Pax</th>
                    <th className="px-4 py-3">Status RSVP</th>
                    <th className="px-4 py-3 text-right">Aksi Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGuests.slice(0, 5).map((guest) => {
                    const status = guest.rsvp?.attendanceStatus || "pending";
                    return (
                      <tr key={guest.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{guest.name}</span>
                            <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {guest.category || "Sahabat"}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {guest.phone || "Tanpa WhatsApp"}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-slate-700 font-medium">
                          {guest.guestCount || 2} Orang
                        </td>

                        <td className="px-4 py-3">
                          {status === "attending" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Hadir</span>
                            </span>
                          ) : status === "declined" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3 h-3" />
                              <span>Berhalangan</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3" />
                              <span>Menunggu</span>
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                `${typeof window !== "undefined" ? window.location.origin : ""}/invitation/${activeWedding?.slug}?to=${encodeURIComponent(guest.name)}`,
                                `Tautan undangan khusus untuk ${guest.name}`
                              )
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredGuests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-400">
                        Tidak ada tamu yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* B. Mobile View: Touch-Friendly Guest Cards (Zero Horizontal Scrolling) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredGuests.slice(0, 5).map((guest) => {
                const status = guest.rsvp?.attendanceStatus || "pending";
                return (
                  <div key={guest.id} className="p-3.5 bg-white space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-[#fef08a] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {guest.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {guest.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                              {guest.category || "Sahabat"}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {guest.phone || "Tanpa WhatsApp"} &bull; {guest.guestCount || 2} Pax
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {status === "attending" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Hadir</span>
                          </span>
                        ) : status === "declined" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>Berhalangan</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Menunggu</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 text-[11px]">
                      <span className="text-[10px] text-slate-400 font-mono">Tautan personal</span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `${typeof window !== "undefined" ? window.location.origin : ""}/invitation/${activeWedding?.slug}?to=${encodeURIComponent(guest.name)}`,
                            `Tautan undangan khusus untuk ${guest.name}`
                          )
                        }
                        className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Link</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredGuests.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Tidak ada tamu yang cocok dengan pencarian.
                </div>
              )}
            </div>

            <div className="p-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] sm:text-xs">Menampilkan {Math.min(5, filteredGuests.length)} dari {totalGuests || initialGuests.length} tamu</span>
              <Link
                href={`/dashboard/guests${weddingParam}`}
                className="font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 text-[11px] sm:text-xs"
              >
                <span>Kelola Tamu Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* PANEL 2: RINCIAN HASIL TANDA KASIH & AMPLOP DIGITAL */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
                  <Gift className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-bold text-slate-900">
                      Rincian Hasil Tanda Kasih &amp; Amplop Digital
                    </h2>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                      Live Data
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Data riil konfirmasi transfer amplop digital dan doa restu tamu.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={copyGiftSummary}
                  className="px-2.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Salin rekapitulasi data tanda kasih ke papan klip"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Rekap</span>
                </button>
                <Link
                  href={`/dashboard/settings${weddingParam}`}
                  className="px-2.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Atur Rekening</span>
                </Link>
              </div>
            </div>

            {/* Streamlined KPI & Distribution Summary Bar */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2 text-center divide-y sm:divide-y-0 sm:divide-x divide-emerald-200/50">
                <div className="pb-2 sm:pb-0">
                  <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider font-mono">
                    Total Dana Masuk
                  </span>
                  <p className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-mono mt-0.5">
                    Rp {totalGiftAmount.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">{totalGiftCount} amplop terkonfirmasi</p>
                </div>

                <div className="pt-2 sm:pt-0 sm:px-2">
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider font-mono">
                    Jumlah Donatur
                  </span>
                  <p className="text-base sm:text-xl font-extrabold text-slate-900 font-mono mt-0.5">
                    {totalGiftCount} <span className="text-xs font-normal text-slate-500">Tamu</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Tercatat di sistem</p>
                </div>

                <div className="pt-2 sm:pt-0 sm:px-2">
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider font-mono">
                    Rata-Rata Nominal
                  </span>
                  <p className="text-base sm:text-xl font-extrabold text-slate-900 font-mono mt-0.5">
                    Rp {averageGift.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Per amplop digital</p>
                </div>
              </div>

              {Object.keys(bankTotals).length > 0 && (
                <div className="pt-2 border-t border-emerald-200/50 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Rekening Tujuan:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {Object.entries(bankTotals).map(([bank, data]) => (
                      <span
                        key={bank}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-slate-200/80 text-[11px] shadow-2xs font-medium"
                      >
                        <span className="font-bold text-slate-800">{bank}</span>
                        <span className="font-mono font-semibold text-emerald-800">
                          Rp {data.total.toLocaleString("id-ID")}
                        </span>
                        <span className="text-slate-400 text-[10px]">({data.count}x)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* List / Feed Riwayat Konfirmasi Transfer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-800">
                  Daftar Tamu &amp; Bukti Tanda Kasih ({recentGiftConfirmations.length})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Terurut transfer terbaru
                </span>
              </div>

              {recentGiftConfirmations.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                  {recentGiftConfirmations.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                          {item.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              {item.guestName}
                            </span>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                              ?to=
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Tujuan: {item.bankName}
                            </span>
                          </div>

                          {item.accountSender && (
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Rek. Pengirim: {item.accountSender}
                            </p>
                          )}

                          {item.notes && (
                            <p className="text-[11px] text-slate-600 italic border-l-2 border-emerald-300 pl-2 mt-1 line-clamp-2">
                              &ldquo;{item.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end shrink-0 pl-9 sm:pl-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                        <p className="text-xs sm:text-sm font-bold font-mono text-emerald-800">
                          +Rp {item.amount.toLocaleString("id-ID")}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {formatDateTime(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Belum ada konfirmasi tanda kasih masuk
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                    Ketika tamu membuka amplop digital di undangan dan mengirim bukti tanda kasih, data nominal dan doa akan langsung tercatat otomatis di sini.
                  </p>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: TEMPLATE SHOWCASE + WISHES FEED */}
        <div className="space-y-6">
          
          {/* CARD 1: TEMPLATE AKTIF SHOWCASE */}
          <section className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Desain Template Aktif</h2>
                <p className="text-xs text-slate-500 mt-0.5">Tema visual yang sedang aktif digunakan.</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                Tema RPG Interaktif
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <div className="p-3.5 bg-gradient-to-tr from-[#2d4a3e] via-[#385b4d] to-[#1c3329] text-white rounded-2xl flex items-center gap-3.5 shadow-md">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-emerald-200 border border-white/20 flex items-center justify-center shrink-0">
                  <Palette className="w-6 h-6 text-[#fef08a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold truncate text-[#fef08a]">
                    {templateName}
                  </h3>
                  <p className="text-[11px] text-emerald-100/80 line-clamp-2 mt-0.5">
                    Peta 2D walkable interaktif dengan NPC mempelai, quest doa hologram &amp; background audio synthwave.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href={demoUrl}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#2d4a3e] hover:bg-[#233a30] text-white font-medium rounded-xl transition-all shadow-xs text-center"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Uji Coba Demo</span>
                </Link>
                <Link
                  href={`/dashboard/template${weddingParam}`}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 transition-colors text-center shadow-2xs"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-500" />
                  <span>Katalog Tema</span>
                </Link>
              </div>
            </div>

            <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate">Tersedia 3 tema RPG &amp; Klasik siap pakai</span>
              <Link
                href={`/dashboard/template${weddingParam}`}
                className="font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 shrink-0"
              >
                <span>Ganti Tema</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* CARD 2: FEED UCAPAN & DOA RESTU TERBARU */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Ucapan &amp; Doa Restu Terbaru</h2>
                <p className="text-xs text-slate-500 mt-0.5">Pesan hangat dari tamu yang masuk.</p>
              </div>
              <Link
                href={`/dashboard/messages${weddingParam}`}
                className="text-xs font-semibold text-emerald-800 hover:underline shrink-0"
              >
                Lihat Semua ({totalMessages || 48})
              </Link>
            </div>

            <div className="space-y-2.5 max-h-[385px] overflow-y-auto pr-1">
              {(recentMessages.length > 0
                ? recentMessages
                : [
                    {
                      id: "m-1",
                      guestName: "Dimas Setiawan",
                      message: "Selamat menempuh hidup baru Liam & Elara! Gak nyangka konsep undangannya cyberpunk keren banget!",
                      isPinned: true,
                      createdAt: new Date(),
                    },
                    {
                      id: "m-2",
                      guestName: "Dr. Hendra",
                      message: "Barakallahu lakuma wa baraka alaikuma. Semoga menjadi keluarga sakinah mawaddah warahmah.",
                      isPinned: true,
                      createdAt: new Date(),
                    },
                    {
                      id: "m-3",
                      guestName: "Satria Wijaya",
                      message: "Selamat berbahagia Liam & Elara! Mohon maaf belum bisa hadir langsung karena dinas luar kota.",
                      isPinned: false,
                      createdAt: new Date(),
                    },
                  ]
              ).map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-[#fef08a] font-bold text-[10px] flex items-center justify-center shadow-2xs">
                        {msg.guestName.charAt(0)}
                      </span>
                      <span className="font-semibold text-slate-800">{msg.guestName}</span>
                    </div>

                    {msg.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        <Pin className="w-2.5 h-2.5 fill-current" />
                        <span>Pinned</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 italic line-clamp-2">
                    &ldquo;{msg.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* FLOATING TOAST NOTIFICATION (raised above mobile bottom bar) */}
      {toastMsg && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-[#2d4a3e] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150 border border-emerald-800">
          <Check className="w-4 h-4 text-[#fef08a]" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

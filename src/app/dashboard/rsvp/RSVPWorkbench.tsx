"use client";
import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Search,
  Utensils,
  Percent,
  Calendar,
  Printer,
  QrCode,
  Send,
  ChevronDown,
  Copy,
  Check,
  Filter,
} from "lucide-react";
import { PrintableRSVPCardModal } from "@/components/dashboard/PrintableRSVPCardModal";

type RSVPItem = {
  id: string;
  attendanceStatus: string;
  guestCount: number;
  submittedAt: Date;
  guest: {
    name: string;
    phone: string;
    category: string;
  };
};

export default function RSVPWorkbench({
  rsvps,
  wedding,
}: {
  rsvps: RSVPItem[];
  wedding?: {
    id: string;
    slug: string;
    coupleTitle: string;
    eventDate?: string;
  };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "attending" | "not_attending">("all");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone) return;
    const text = `Halo Kak ${name}, terima kasih banyak sudah konfirmasi RSVP kehadiran di pernikahan kami! 🙏`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const totalResponses = rsvps.length;
  const attendingList = rsvps.filter((r) => r.attendanceStatus === "attending");
  const notAttendingList = rsvps.filter((r) => r.attendanceStatus === "not_attending");

  // Sum pax for attending
  const totalAttendingPax = attendingList.reduce(
    (acc, r) => acc + (r.guestCount || 1),
    0
  );
  const cateringBufferPax = Math.ceil(totalAttendingPax * 1.1); // 10% safety buffer

  const attendanceRate =
    totalResponses > 0
      ? Math.round((attendingList.length / totalResponses) * 100)
      : 0;

  // Filtered list
  const filteredRSVP = useMemo(() => {
    return rsvps.filter((r) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        r.guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.guest.phone.includes(searchQuery);

      let matchesTab = true;
      if (filterTab === "attending") matchesTab = r.attendanceStatus === "attending";
      if (filterTab === "not_attending") matchesTab = r.attendanceStatus === "not_attending";

      return matchesSearch && matchesTab;
    });
  }, [rsvps, searchQuery, filterTab]);

  return (
    <div className="space-y-6 w-full">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="text-[11px] font-mono tracking-wider font-semibold text-emerald-700 uppercase mb-1">
            Konfirmasi Kehadiran &amp; Estimasi Pax
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Konfirmasi Kehadiran (RSVP)
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pantau respon tamu undangan, estimasi porsi katering berdasarkan jumlah rombongan, dan statistik kehadiran secara real-time.
          </p>
        </div>

        {wedding && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs transition-transform active:scale-98 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#fef08a]" />
              <span>Cetak Kartu QR RSVP (Undangan Fisik)</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Respon</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalResponses}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Tamu mengisi form</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Akan Hadir</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            {totalAttendingPax} <span className="text-xs font-normal text-slate-500">Pax</span>
          </p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5 font-mono">
            {attendingList.length} konfirmasi hadir
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Tidak Hadir</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{notAttendingList.length}</p>
          <p className="text-[11px] text-rose-600/80 mt-0.5 font-mono">Berhalangan hadir</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Rasio Kehadiran</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{attendanceRate}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Tingkat konfirmasi</p>
        </div>
      </div>

      {/* Catering Planning Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              Kalkulasi Katering Acara
            </h3>
            <p className="text-xs text-emerald-800/80 mt-0.5">
              Estimasi riil konsumsi: <strong>{totalAttendingPax} porsi</strong>. Rekomendasi pesanan katering dengan cadangan aman 10%: <strong>{cateringBufferPax} porsi</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Tabs Filter */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tamu konfirmasi..."
            className="w-full pl-9 pr-4 py-2 min-h-[42px] text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Filter Dropdown with Filter Icon */}
        <div className="relative shrink-0 w-full sm:w-auto">
          <select
            value={filterTab}
            onChange={(e) => setFilterTab(e.target.value as "all" | "attending" | "not_attending")}
            className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2 min-h-[42px] text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
          >
            <option value="all">Semua Status ({totalResponses})</option>
            <option value="attending">Hadir ({attendingList.length})</option>
            <option value="not_attending">Absen ({notAttendingList.length})</option>
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* RSVP Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Daftar Respon Masuk
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {filteredRSVP.length} tanggapan tercatat
          </span>
        </div>

        {/* Mobile View: Compact List with Expandable Accordion Drawer (< md) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredRSVP.map((r, idx) => {
            const isAttending = r.attendanceStatus === "attending";
            const isExpanded = expandedId === r.id;
            const isPhoneCopied = copiedPhoneId === r.id;

            return (
              <div
                key={r.id}
                className={`transition-colors ${
                  isExpanded ? "bg-slate-50/70" : "hover:bg-slate-50/40"
                }`}
              >
                {/* 1. Main Compact Row (~54px height) */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  className="px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer select-none"
                >
                  {/* Left: No, Name & Contact Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {r.guest.name}
                      </span>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${
                          r.guest.category === "VIP"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : r.guest.category === "Keluarga"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {r.guest.category || "Reguler"}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>{r.guest.phone || "Tanpa No. HP"}</span>
                      {isAttending ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Hadir ({r.guestCount || 1} Pax)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-full border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Tidak Hadir
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons (Kirim WA via Send Icon) + Chevron */}
                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {r.guest.phone ? (
                      <button
                        type="button"
                        onClick={() => openWhatsApp(r.guest.phone, r.guest.name)}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[36px] px-2.5 sm:px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl shadow-2xs transition-colors cursor-pointer"
                        title="Kirim pesan WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">Kirim</span>
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
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
                        <span className="text-[10px] text-slate-400 block font-medium">Status Konfirmasi:</span>
                        <div className="mt-0.5 font-semibold text-slate-800 text-[11px]">
                          {isAttending
                            ? `Akan Hadir (${r.guestCount || 1} Orang)`
                            : "Berhalangan Hadir"}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Waktu Konfirmasi:</span>
                        <div className="mt-0.5 font-semibold text-slate-800 text-[11px] font-mono">
                          {new Date(r.submittedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })} WIB
                        </div>
                      </div>
                    </div>

                    {/* Secondary Actions (Single Row - Even Spacing) */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {r.guest.phone ? (
                        <>
                          <button
                            type="button"
                            onClick={() => copyPhone(r.id, r.guest.phone)}
                            className="flex-1 inline-flex items-center justify-center gap-1 min-h-[32px] px-1.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-[11px] cursor-pointer shadow-2xs"
                            title="Salin Nomor HP"
                          >
                            {isPhoneCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="truncate">{isPhoneCopied ? "Tersalin" : "Salin No"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openWhatsApp(r.guest.phone, r.guest.name)}
                            className="flex-1 inline-flex items-center justify-center gap-1 min-h-[32px] px-1.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 text-slate-700 text-[11px] font-medium cursor-pointer shadow-2xs"
                            title="Kirim WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">Chat WA</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex-1 text-center text-slate-400 text-[11px] py-1 bg-slate-50 rounded-lg border border-slate-100">
                          Tamu tidak mencantumkan nomor telepon
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredRSVP.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              {searchQuery || filterTab !== "all"
                ? "Tidak ada respon RSVP yang cocok dengan filter."
                : "Belum ada tamu yang mengirimkan konfirmasi kehadiran."}
            </div>
          )}
        </div>

        {/* Desktop View: Full Table (visible on desktop only) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="w-12 px-4 py-3.5 text-center">No</th>
                <th className="px-6 py-3.5">Nama Tamu &amp; Kontak</th>
                <th className="px-6 py-3.5">Kategori</th>
                <th className="px-6 py-3.5">Status Kehadiran</th>
                <th className="px-6 py-3.5">Jumlah Pax</th>
                <th className="px-6 py-3.5 text-right">Waktu Submit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRSVP.map((r, idx) => {
                const isAttending = r.attendanceStatus === "attending";

                return (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* No */}
                    <td className="w-12 px-4 py-3.5 text-center font-mono text-[11px] text-slate-400 font-semibold select-none">
                      {idx + 1}
                    </td>

                    {/* Guest Name & Phone */}
                    <td className="px-6 py-3.5 font-medium text-slate-900">
                      <div>
                        <div className="font-semibold text-slate-900">{r.guest.name}</div>
                        {r.guest.phone && (
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {r.guest.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-slate-50 text-slate-600 border-slate-200">
                        {r.guest.category || "Reguler"}
                      </span>
                    </td>

                    {/* Attendance Status */}
                    <td className="px-6 py-3.5">
                      {isAttending ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hadir</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Tidak Hadir</span>
                        </span>
                      )}
                    </td>

                    {/* Pax Count */}
                    <td className="px-6 py-3.5 text-slate-700">
                      {isAttending ? (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          <Users className="w-3 h-3 text-slate-500" />
                          <span>{r.guestCount || 1} Orang</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Submission Time */}
                    <td className="px-6 py-3.5 text-right text-slate-500 font-mono text-[11px]">
                      {new Date(r.submittedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}

              {filteredRSVP.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                    {searchQuery || filterTab !== "all"
                      ? "Tidak ada respon RSVP yang cocok dengan filter."
                      : "Belum ada tamu yang mengirimkan konfirmasi kehadiran."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable RSVP Card Studio Modal */}
      {wedding && (
        <PrintableRSVPCardModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          weddingSlug={wedding.slug}
          coupleTitle={wedding.coupleTitle}
          eventDate={wedding.eventDate}
        />
      )}
    </div>
  );
}

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs transition-transform active:scale-98 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#fef08a]" />
              <span>Cetak Kartu QR RSVP (Undangan Fisik)</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Primary Metric Cards (Matching DesainPakeAI target.page.html) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tamu konfirmasi..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Tab Buttons (Responsive Grid on Mobile) */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg text-center">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-colors cursor-pointer truncate ${
              filterTab === "all"
                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua ({totalResponses})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("attending")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-colors cursor-pointer truncate ${
              filterTab === "attending"
                ? "bg-white text-emerald-700 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hadir ({attendingList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("not_attending")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-colors cursor-pointer truncate ${
              filterTab === "not_attending"
                ? "bg-white text-rose-700 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Absen ({notAttendingList.length})
          </button>
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

        {/* Mobile View: Clean Touch Cards (visible on mobile only) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredRSVP.map((r) => {
            const isAttending = r.attendanceStatus === "attending";
            const initial = r.guest.name.charAt(0).toUpperCase();

            return (
              <div key={r.id} className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 text-xs truncate">{r.guest.name}</h3>
                      {r.guest.phone && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                          {r.guest.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isAttending ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Hadir</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        <span>Tidak Hadir</span>
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-semibold border bg-slate-50 text-slate-600 border-slate-200">
                      {r.guest.category || "Reguler"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-100">
                  <div className="flex items-center gap-1 font-medium text-slate-700">
                    {isAttending ? (
                      <span>Jumlah: <strong className="text-slate-900 font-mono">{r.guestCount || 1} Pax</strong></span>
                    ) : (
                      <span>Tidak hadir</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(r.submittedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
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
                <th className="px-6 py-3.5">Nama Tamu</th>
                <th className="px-6 py-3.5">Kategori</th>
                <th className="px-6 py-3.5">Status Kehadiran</th>
                <th className="px-6 py-3.5">Jumlah Pax</th>
                <th className="px-6 py-3.5 text-right">Waktu Submit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRSVP.map((r) => {
                const isAttending = r.attendanceStatus === "attending";
                const initial = r.guest.name.charAt(0).toUpperCase();

                return (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Guest Name & Avatar */}
                    <td className="px-6 py-3.5 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {initial}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{r.guest.name}</div>
                          {r.guest.phone && (
                            <div className="text-[11px] text-slate-400 font-mono">
                              {r.guest.phone}
                            </div>
                          )}
                        </div>
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
                  <td colSpan={5} className="text-center py-10 text-slate-400 text-xs">
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

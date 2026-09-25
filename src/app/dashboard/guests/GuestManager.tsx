"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Copy,
  Trash2,
  Check,
  ExternalLink,
  MessageCircle,
  Search,
  Users,
  Star,
  CheckCircle2,
  Send,
  X,
  Filter,
  MapPin,
  QrCode,
  BookOpenCheck,
} from "lucide-react";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { GuestTicketModal } from "@/components/invitation/GuestTicketModal";

export type GuestWithRsvp = {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address?: string | null;
  category: string;
  guestCount: number;
  tableNumber?: string | null;
  sessionName?: string | null;
  qrCode?: string | null;
  attendanceStatus: string;
  checkedIn?: boolean;
  checkedInAt?: Date | string | null;
  checkedInPax?: number;
  souvenirTaken?: boolean;
  giftType?: string | null;
  checkInNotes?: string | null;
  rsvp: { attendanceStatus: string; guestCount?: number } | null;
};

export default function GuestManager({
  weddingId,
  weddingSlug,
  whatsappTemplate,
  coupleTitle,
  initialGuests,
  userPlan = "basic",
  userRole = "client",
}: {
  weddingId: string;
  weddingSlug: string;
  whatsappTemplate?: string | null;
  coupleTitle?: string;
  initialGuests: GuestWithRsvp[];
  userPlan?: string;
  userRole?: string;
}) {
  const [guests, setGuests] = useState<GuestWithRsvp[]>(initialGuests);
  const [showAddForm, setShowAddForm] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedTicketGuest, setSelectedTicketGuest] = useState<GuestWithRsvp | null>(null);

  // Form State
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCategory, setNewCategory] = useState("Reguler");
  const [newGuestCount, setNewGuestCount] = useState(1);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [rsvpFilter, setRsvpFilter] = useState("all");

  const getGuestMessage = (name: string, slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const personalUrl = `${origin}/invitation/${weddingSlug}/${slug}`;
    const template =
      whatsappTemplate ||
      `Kepada Yth.
Bapak/Ibu/Saudara/i: *{nama}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir di acara pernikahan kami:

💍 *{mempelai}*

Untuk detail informasi acara dan konfirmasi kehadiran, silakan kunjungi tautan undangan resmi berikut:
🔗 {link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`;

    return template
      .replace(/\{nama\}/g, name)
      .replace(/\{mempelai\}/g, coupleTitle || "Kedua Mempelai")
      .replace(/\{link\}/g, personalUrl);
  };

  const copyPersonalLink = (id: string, slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/invitation/${weddingSlug}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyWhatsAppMessage = (id: string, name: string, slug: string) => {
    const msg = getGuestMessage(name, slug);
    navigator.clipboard.writeText(msg);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const openWhatsApp = (phone: string, name: string, slug: string) => {
    const msg = getGuestMessage(name, slug);
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/wedding/${weddingId}/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        phone: newPhone,
        address: newAddress,
        category: newCategory,
        guestCount: Number(newGuestCount) || 1,
        tableNumber: newTableNumber,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setGuests((prev) => [...prev, created]);
      setNewName("");
      setNewPhone("");
      setNewAddress("");
      setNewCategory("Reguler");
      setNewGuestCount(1);
      setNewTableNumber("");
      setShowAddForm(false);
    }
    setLoading(false);
  };

  const deleteGuest = async (id: string) => {
    if (!confirm("Hapus tamu ini dari daftar undangan?")) return;
    await fetch(`/api/wedding/${weddingId}/guests/${id}`, { method: "DELETE" });
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  // Filtered list
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.phone.includes(searchQuery) ||
        (g.address && g.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (g.tableNumber && g.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === "all" || g.category === categoryFilter;

      let matchesRsvp = true;
      if (rsvpFilter === "attending") {
        matchesRsvp = g.rsvp?.attendanceStatus === "attending";
      } else if (rsvpFilter === "not_attending") {
        matchesRsvp = g.rsvp?.attendanceStatus === "not_attending";
      } else if (rsvpFilter === "pending") {
        matchesRsvp = !g.rsvp?.attendanceStatus;
      }

      return matchesSearch && matchesCategory && matchesRsvp;
    });
  }, [guests, searchQuery, categoryFilter, rsvpFilter]);

  // Metrics
  const totalGuests = guests.length;
  const vipCount = guests.filter((g) => g.category?.toLowerCase().includes("vip")).length;
  const withPhoneCount = guests.filter((g) => g.phone && g.phone.trim().length > 0).length;
  const attendingCount = guests.filter((g) => g.rsvp?.attendanceStatus === "attending").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Manajemen Daftar Tamu Undangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Buat tautan personal per tamu, atur nomor meja, alamat asal domisili, dan kirim undangan otomatis via WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/guestbook?weddingId=${weddingId}`}
            className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs transition-colors cursor-pointer"
          >
            <BookOpenCheck className="w-4 h-4 text-purple-700" />
            <span>Buku Tamu &amp; Presensi QR ↗</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              if (
                !showAddForm &&
                guests.length >=
                  (userRole === "admin" || userPlan === "luxury"
                    ? 999999
                    : userPlan === "premium"
                    ? 500
                    : 50)
              ) {
                setUpgradeModalOpen(true);
                return;
              }
              setShowAddForm(!showAddForm);
            }}
            className={`inline-flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 ${
              showAddForm
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                : "bg-[#2d4a3e] hover:bg-[#233a30] text-white"
            }`}
          >
            {showAddForm ? (
              <>
                <X className="w-4 h-4" />
                <span>Tutup Form</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#fef08a]" />
                <span>Tambah Tamu Baru</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quota Banner for Basic */}
      {userPlan === "basic" && userRole !== "admin" && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                Kuota Tamu: {guests.length} / 50 Tamu (Paket Basic Uji Coba)
              </p>
              <div className="w-48 sm:w-64 bg-amber-200/70 h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min((guests.length / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUpgradeModalOpen(true)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Upgrade ke 500 / Unlimited Tamu</span>
          </button>
        </div>
      )}

      {/* 4 Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Tamu</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#2d4a3e] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalGuests}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Terdaftar di sistem</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Tamu VIP</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{vipCount}</p>
          <p className="text-[11px] text-amber-600/80 mt-0.5 font-mono">Prioritas khusus</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">WhatsApp Siap</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#2d4a3e] flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{withPhoneCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Memiliki nomor WA</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Konfirmasi Hadir</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#2d4a3e] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2d4a3e] mt-2">{attendingCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Tamu menyatakan hadir</p>
        </div>
      </div>

      {/* Add Guest Form (Collapsible/Interactive) */}
      {showAddForm && (
        <form
          onSubmit={addGuest}
          className="bg-white border border-emerald-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Formulir Tambah Tamu Undangan</span>
            </h3>
            <span className="text-xs text-slate-400">Link personal &amp; QR E-Pass dibuat otomatis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Tamu *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="cth: Budi Santoso &amp; Rekan"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat / Asal Kota / Instansi
              </label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="cth: Bandung / Alumni ITB"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="cth: 08123456789"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Tamu
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-white"
              >
                <option value="Reguler">Reguler</option>
                <option value="VIP">VIP</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Teman">Teman</option>
                <option value="Rekan Kerja">Rekan Kerja</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kuota Pax (Orang)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={newGuestCount}
                onChange={(e) => setNewGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Meja
              </label>
              <input
                type="text"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                placeholder="cth: Meja 02 / VIP A"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !newName.trim()}
              className="inline-flex items-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1f332b] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#fef08a]" />
              <span>{loading ? "Menyimpan..." : "Simpan Tamu"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, alamat, meja, atau no. WhatsApp..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-white"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
            >
              <option value="all">Semua Kategori</option>
              <option value="VIP">VIP</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Teman">Teman</option>
              <option value="Rekan Kerja">Rekan Kerja</option>
              <option value="Reguler">Reguler</option>
            </select>

            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
            >
              <option value="all">Semua Status</option>
              <option value="attending">Hadir</option>
              <option value="not_attending">Tidak Hadir</option>
              <option value="pending">Belum Respon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guest Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <span>Daftar Tamu</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              {filteredGuests.length} dari {totalGuests}
            </span>
          </h2>
        </div>

        {/* Desktop View Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nama Tamu &amp; Kontak</th>
                <th className="px-5 py-3.5">Alamat / Asal Kota</th>
                <th className="px-5 py-3.5">Kategori &amp; Meja</th>
                <th className="px-5 py-3.5">Status RSVP</th>
                <th className="px-5 py-3.5">Link &amp; Tiket QR</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.map((guest) => {
                const isAttending = guest.rsvp?.attendanceStatus === "attending";
                const isNotAttending = guest.rsvp?.attendanceStatus === "not_attending";
                const isCopied = copiedId === guest.id;
                const isMsgCopied = copiedMsgId === guest.id;
                const personalUrl = `/invitation/${weddingSlug}/${guest.slug}`;
                const initial = guest.name.charAt(0).toUpperCase();

                return (
                  <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Name & Avatar */}
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {initial}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{guest.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {guest.phone || "Tidak ada nomor WA"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Address / Origin */}
                    <td className="px-5 py-3.5 text-slate-700">
                      {guest.address ? (
                        <span className="inline-flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{guest.address}</span>
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">-</span>
                      )}
                    </td>

                    {/* Category & Table */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            guest.category === "VIP"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : guest.category === "Keluarga"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {guest.category || "Reguler"}
                        </span>
                        {guest.tableNumber && (
                          <span className="block text-[11px] font-semibold text-[#2d4a3e]">
                            Meja: {guest.tableNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* RSVP Status */}
                    <td className="px-5 py-3.5">
                      {isAttending ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Hadir</span>
                        </span>
                      ) : isNotAttending ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>Tidak Hadir</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>Belum Respon</span>
                        </span>
                      )}
                    </td>

                    {/* Link & Ticket QR */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedTicketGuest(guest)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:text-[#2d4a3e] text-slate-700 transition-colors cursor-pointer text-[11px] font-medium"
                          title="Lihat Tiket QR Code E-Pass"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#2d4a3e]" />
                          <span>Tiket QR</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyPersonalLink(guest.id, guest.slug)}
                          className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title="Salin Tautan Undangan"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <a
                          href={personalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title="Buka Undangan"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => copyWhatsAppMessage(guest.id, guest.name, guest.slug)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                          title="Salin Pesan WA"
                        >
                          {isMsgCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin WA</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => openWhatsApp(guest.phone, guest.name, guest.slug)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer shadow-2xs"
                          title="Buka Chat WA"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Kirim</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteGuest(guest.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Hapus Tamu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                    {searchQuery || categoryFilter !== "all" || rsvpFilter !== "all"
                      ? "Tidak ada tamu yang sesuai dengan filter pencarian."
                      : "Belum ada tamu terdaftar. Klik '+ Tambah Tamu Baru' di atas."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
          coupleTitle={coupleTitle || "Kedua Mempelai"}
          weddingSlug={weddingSlug}
          qrCode={selectedTicketGuest.qrCode}
        />
      )}

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={userPlan}
      />
    </div>
  );
}

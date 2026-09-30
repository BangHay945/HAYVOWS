"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  Download,
  Upload,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { GuestTicketModal } from "@/components/invitation/GuestTicketModal";
import { ImportGuestsModal } from "./ImportGuestsModal";
import { WhatsAppTemplateModal, DEFAULT_WA_TEMPLATE } from "./WhatsAppTemplateModal";
import {
  exportGuestsToExcel,
  exportGuestsToCSV,
} from "@/lib/utils/guestSpreadsheet";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedTicketGuest, setSelectedTicketGuest] = useState<GuestWithRsvp | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [currentWaTemplate, setCurrentWaTemplate] = useState<string>(
    whatsappTemplate || DEFAULT_WA_TEMPLATE
  );

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
  const [expandedGuestId, setExpandedGuestId] = useState<string | null>(null);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [rsvpFilter, setRsvpFilter] = useState("all");

  // In-app Delete Confirmation Modal State
  const [guestToDelete, setGuestToDelete] = useState<GuestWithRsvp | null>(null);
  const [deletingGuest, setDeletingGuest] = useState(false);

  // Lock body scroll when Add Guest Modal is open
  useEffect(() => {
    if (isAddModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "unset";
      };
    }
  }, [isAddModalOpen]);

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewName("");
    setNewPhone("");
    setNewAddress("");
    setNewCategory("Reguler");
    setNewGuestCount(1);
    setNewTableNumber("");
  };

  const getGuestMessage = (
    nameOrGuest:
      | string
      | {
          name: string;
          slug: string;
          tableNumber?: string | null;
          address?: string | null;
          sessionName?: string | null;
        },
    optionalSlug?: string
  ) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://hayvows.com";
    const name = typeof nameOrGuest === "string" ? nameOrGuest : nameOrGuest.name;
    const slug = typeof nameOrGuest === "string" ? optionalSlug || "" : nameOrGuest.slug;
    const tableNumber = typeof nameOrGuest === "object" ? nameOrGuest.tableNumber || "-" : "-";
    const address = typeof nameOrGuest === "object" ? nameOrGuest.address || "-" : "-";
    const sessionName =
      typeof nameOrGuest === "object" ? nameOrGuest.sessionName || "Sesi Acara" : "Sesi Acara";

    const personalUrl = `${origin}/invitation/${weddingSlug}/${slug}`;
    const template = currentWaTemplate || whatsappTemplate || DEFAULT_WA_TEMPLATE;

    return template
      .replace(/\{nama\}/g, name)
      .replace(/\{mempelai\}/g, coupleTitle || "Kedua Mempelai")
      .replace(/\{link\}/g, personalUrl)
      .replace(/\{meja\}/g, tableNumber)
      .replace(/\{alamat\}/g, address)
      .replace(/\{sesi\}/g, sessionName);
  };

  const copyPersonalLink = (id: string, slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://hayvows.com";
    const url = `${origin}/invitation/${weddingSlug}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyWhatsAppMessage = (
    id: string,
    guest: GuestWithRsvp | { name: string; slug: string }
  ) => {
    const msg = getGuestMessage(guest);
    navigator.clipboard.writeText(msg);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const openWhatsApp = (
    phone: string,
    guest: GuestWithRsvp | { name: string; slug: string }
  ) => {
    const msg = getGuestMessage(guest);
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  // Export handlers (Excel & CSV)
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportExcel = async () => {
    setIsExporting(true);
    setExportMenuOpen(false);
    try {
      const targetList = filteredGuests.length > 0 ? filteredGuests : guests;
      await exportGuestsToExcel(targetList, weddingSlug);
    } catch (err) {
      console.error("Export Excel error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    setExportMenuOpen(false);
    const targetList = filteredGuests.length > 0 ? filteredGuests : guests;
    exportGuestsToCSV(targetList, weddingSlug);
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
      setIsAddModalOpen(false);
    }
    setLoading(false);
  };

  const confirmDeleteGuest = async () => {
    if (!guestToDelete) return;
    setDeletingGuest(true);
    try {
      const res = await fetch(`/api/wedding/${weddingId}/guests/${guestToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== guestToDelete.id));
        setGuestToDelete(null);
      }
    } catch (err) {
      console.error("Gagal menghapus tamu:", err);
    } finally {
      setDeletingGuest(false);
    }
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
      {/* Top Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="text-[11px] font-mono tracking-wider font-semibold text-emerald-700 uppercase mb-1">
            Manajemen Kontak &amp; Buku Tamu
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Manajemen Daftar Tamu Undangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Buat tautan personal per tamu, atur nomor meja, alamat asal domisili, dan kirim undangan otomatis via WhatsApp.
          </p>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              if (
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
              setIsAddModalOpen(true);
            }}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer bg-[#2d4a3e] hover:bg-[#233a30] text-white"
          >
            <Plus className="w-4 h-4 text-[#fef08a]" />
            <span>Tambah Tamu Baru</span>
          </button>
        </div>
      </div>

      {/* Quota Banner for Basic & Premium */}
      {userRole !== "admin" && (userPlan === "basic" || (userPlan === "premium" && guests.length >= 400)) && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                Kuota Tamu: {guests.length} / {userPlan === "premium" ? "500" : "50"} Tamu ({userPlan === "premium" ? "Paket Populer" : "Paket Basic"})
              </p>
              <div className="w-48 sm:w-64 bg-amber-200/70 h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min((guests.length / (userPlan === "premium" ? 500 : 50)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUpgradeModalOpen(true)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>{userPlan === "premium" ? "Upgrade ke Unlimited Tamu" : "Upgrade ke 500 / Unlimited Tamu"}</span>
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

      {/* Filter, Search & Data Operations Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3 xl:space-y-0 xl:flex xl:items-center xl:justify-between gap-3 relative z-20">
        {/* Left: Search & Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, alamat, meja, atau no. WhatsApp..."
              className="w-full pl-9 pr-3.5 py-2 min-h-[42px] text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-slate-50/50 hover:bg-white focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 min-h-[42px] text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] transition-all cursor-pointer shadow-2xs"
              >
                <option value="all">Semua Kategori</option>
                <option value="VIP">VIP</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Teman">Teman</option>
                <option value="Rekan Kerja">Rekan Kerja</option>
                <option value="Reguler">Reguler</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 min-h-[42px] text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] transition-all cursor-pointer shadow-2xs"
              >
                <option value="all">Semua Status</option>
                <option value="attending">Hadir</option>
                <option value="not_attending">Tidak Hadir</option>
                <option value="pending">Belum Respon</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Data Actions (Format WA, Import CSV, Export CSV) */}
        <div className="flex items-center gap-2 shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setWaModalOpen(true)}
            className="inline-flex items-center gap-1.5 min-h-[40px] py-2 px-3 sm:px-3.5 rounded-xl font-semibold text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Kustomisasi Format Pesan Undangan WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Format WA</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (
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
              setImportModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 min-h-[40px] py-2 px-3 sm:px-3.5 rounded-xl font-semibold text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Import Banyak Tamu dari File Excel / CSV"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-700" />
            <span>Import Excel / CSV</span>
          </button>

          {/* Export Dropdown Menu (Excel .xlsx & CSV) */}
          <div className="relative shrink-0" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setExportMenuOpen((prev) => !prev)}
              disabled={guests.length === 0 || isExporting}
              className="inline-flex items-center gap-1.5 min-h-[40px] py-2 px-3 sm:px-3.5 rounded-xl font-semibold text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
              title="Unduh Rekap Daftar Tamu & RSVP ke File Excel atau CSV"
            >
              {isExporting ? (
                <FileSpreadsheet className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              ) : (
                <Download className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>Export Rekap</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Format Unduhan Rekap
                </div>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left text-slate-800 hover:bg-emerald-50 hover:text-emerald-950 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-200/80 group-hover:scale-105 transition-all">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">Microsoft Excel (.xlsx)</p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Rapi &amp; siap diedit di Excel</p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-1">
                    Disarankan
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-left text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-200 group-hover:scale-105 transition-all">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 leading-tight">File Teks CSV (.csv)</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Format teks polos standar</p>
                  </div>
                </button>
              </div>
            )}
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

        {/* Mobile View: Compact List with Expandable Detail Accordion (visible on mobile < md only) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredGuests.map((guest, idx) => {
            const isAttending = guest.rsvp?.attendanceStatus === "attending";
            const isNotAttending = guest.rsvp?.attendanceStatus === "not_attending";
            const isCopied = copiedId === guest.id;
            const isMsgCopied = copiedMsgId === guest.id;
            const personalUrl = `/invitation/${weddingSlug}/${guest.slug}`;
            const isExpanded = expandedGuestId === guest.id;

            return (
              <div
                key={guest.id}
                className={`transition-colors ${isExpanded ? "bg-slate-50/70" : "hover:bg-slate-50/40"}`}
              >
                {/* 1. Main Compact Row (~54px height) */}
                <div
                  onClick={() => setExpandedGuestId(isExpanded ? null : guest.id)}
                  className="px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer select-none"
                >
                  {/* Left: No, Name & Contact Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {guest.name}
                      </span>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${
                          guest.category === "VIP"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : guest.category === "Keluarga"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {guest.category || "Reguler"}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>{guest.phone || "Tanpa No. WA"}</span>
                      {isAttending ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Hadir
                        </span>
                      ) : isNotAttending ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-full border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Tidak
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">
                          • Belum Respon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons (Kirim WA via Send Icon) + Chevron */}
                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => openWhatsApp(guest.phone, guest)}
                      className="inline-flex items-center justify-center gap-1.5 min-h-[36px] px-2.5 sm:px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl shadow-2xs transition-colors cursor-pointer"
                      title="Kirim pesan undangan WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">Kirim</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedGuestId(isExpanded ? null : guest.id)}
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
                        <span className="text-[10px] text-slate-400 block font-medium">Status RSVP:</span>
                        <div className="mt-0.5 font-semibold text-slate-800 text-[11px]">
                          {isAttending
                            ? `Hadir (${guest.rsvp?.guestCount || guest.guestCount} Pax)`
                            : isNotAttending
                            ? "Tidak Hadir"
                            : "Belum Konfirmasi Kehadiran"}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Nomor Meja &amp; Kuota:</span>
                        <div className="mt-0.5 font-semibold text-slate-800 text-[11px]">
                          {guest.tableNumber ? `Meja ${guest.tableNumber}` : "Bebas"} • {guest.guestCount} Pax
                        </div>
                      </div>

                      {guest.address && (
                        <div className="col-span-2 pt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{guest.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Secondary Actions (Single Row - Even Spacing) */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTicketGuest(guest)}
                        className="flex-1 inline-flex items-center justify-center gap-1 min-h-[32px] px-1.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 text-slate-700 text-[11px] font-medium cursor-pointer shadow-2xs"
                        title="Lihat Tiket QR Tamu"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#2d4a3e] shrink-0" />
                        <span className="truncate">Tiket QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => copyWhatsAppMessage(guest.id, guest)}
                        className="flex-1 inline-flex items-center justify-center gap-1 min-h-[32px] px-1.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-[11px] cursor-pointer shadow-2xs"
                        title="Salin pesan undangan WhatsApp"
                      >
                        {isMsgCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className="truncate">{isMsgCopied ? "Tersalin" : "Pesan"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => copyPersonalLink(guest.id, guest.slug)}
                        className="flex-1 inline-flex items-center justify-center gap-1 min-h-[32px] px-1.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-[11px] cursor-pointer shadow-2xs"
                        title="Salin link undangan website"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className="truncate">{isCopied ? "Tersalin" : "Link"}</span>
                      </button>

                      <a
                        href={personalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer shadow-2xs shrink-0"
                        title="Buka Web Undangan"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setGuestToDelete(guest)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-rose-600 cursor-pointer shadow-2xs shrink-0 transition-colors"
                        title="Hapus Tamu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredGuests.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              {searchQuery || categoryFilter !== "all" || rsvpFilter !== "all" ? (
                "Tidak ada tamu yang sesuai dengan filter pencarian."
              ) : (
                <span>
                  Belum ada tamu terdaftar.{" "}
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-[#2d4a3e] font-bold underline underline-offset-2 hover:text-[#233a30] cursor-pointer inline-flex items-center gap-1"
                  >
                    + Tambah Tamu Baru
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Desktop View Table (visible on tablet/desktop >= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="w-12 px-4 py-3.5 text-center">No</th>
                <th className="px-5 py-3.5">Nama Tamu &amp; Kontak</th>
                <th className="px-5 py-3.5">Alamat / Asal Kota</th>
                <th className="px-5 py-3.5">Kategori &amp; Meja</th>
                <th className="px-5 py-3.5">Status RSVP</th>
                <th className="px-5 py-3.5">Link &amp; Tiket QR</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.map((guest, idx) => {
                const isAttending = guest.rsvp?.attendanceStatus === "attending";
                const isNotAttending = guest.rsvp?.attendanceStatus === "not_attending";
                const isCopied = copiedId === guest.id;
                const isMsgCopied = copiedMsgId === guest.id;
                const personalUrl = `/invitation/${weddingSlug}/${guest.slug}`;

                return (
                  <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* No */}
                    <td className="w-12 px-4 py-3.5 text-center font-mono text-[11px] text-slate-400 font-semibold select-none">
                      {idx + 1}
                    </td>

                    {/* Name & Contact (Avatar initial removed) */}
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <div>
                        <div className="font-semibold text-slate-900 text-xs sm:text-sm">{guest.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {guest.phone || "Tidak ada nomor WA"}
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
                          onClick={() => copyWhatsAppMessage(guest.id, guest)}
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
                          onClick={() => openWhatsApp(guest.phone, guest)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer shadow-2xs"
                          title="Buka Chat WA"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kirim</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setGuestToDelete(guest)}
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
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                    {searchQuery || categoryFilter !== "all" || rsvpFilter !== "all" ? (
                      "Tidak ada tamu yang sesuai dengan filter pencarian."
                    ) : (
                      <span>
                        Belum ada tamu terdaftar.{" "}
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(true)}
                          className="text-[#2d4a3e] font-bold underline underline-offset-2 hover:text-[#233a30] cursor-pointer inline-flex items-center gap-1"
                        >
                          + Tambah Tamu Baru
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Tamu (Bottom Sheet di Mobile, Centered di Desktop) */}
      {guestToDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Hapus Tamu Undangan?
                </h3>
                <p className="text-xs text-slate-500">
                  Data tamu dan tautan undangan personal akan dihapus.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <p className="font-semibold text-slate-800">
                {guestToDelete.name}
              </p>
              <p className="text-slate-500 font-mono text-[11px]">
                {guestToDelete.phone || "Tanpa nomor WhatsApp"} • Kategori: {guestToDelete.category || "Reguler"}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGuestToDelete(null)}
                disabled={deletingGuest}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteGuest}
                disabled={deletingGuest}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deletingGuest ? (
                  <span>Menghapus...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Tamu Baru (Popup) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-2 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#2d4a3e] to-[#1e332a] text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#fef08a]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Tambah Tamu Undangan Baru
                  </h3>
                  <p className="text-[11px] text-emerald-200/80">
                    Tautan personal dan tiket QR E-Pass dibuat otomatis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={addGuest} className="flex flex-col flex-1 overflow-y-auto">
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Lengkap Tamu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="cth: Budi Santoso &amp; Rekan"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="cth: 08123456789"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Alamat / Asal Domisili
                    </label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="cth: Bandung / Rekan Kerja"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Kategori Tamu
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-white cursor-pointer"
                    >
                      <option value="Reguler">Reguler</option>
                      <option value="VIP">VIP</option>
                      <option value="Keluarga">Keluarga</option>
                      <option value="Teman">Teman</option>
                      <option value="Rekan Kerja">Rekan Kerja</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Kuota Pax (Orang)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={newGuestCount}
                      onChange={(e) => setNewGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nomor Meja
                    </label>
                    <input
                      type="text"
                      value={newTableNumber}
                      onChange={(e) => setNewTableNumber(e.target.value)}
                      placeholder="cth: Meja 02 / VIP A"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e] bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="min-h-[44px] px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !newName.trim()}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {loading ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[#fef08a]" />
                      <span>Simpan Tamu</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* Modal Import Tamu Massal (Excel / CSV) */}
      <ImportGuestsModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        weddingId={weddingId}
        userPlan={userPlan}
        userRole={userRole}
        currentGuestCount={guests.length}
        onImportSuccess={(createdGuests) => {
          setGuests((prev) => [...prev, ...createdGuests]);
        }}
      />

      {/* Modal Kustomisasi Template Pesan WhatsApp */}
      <WhatsAppTemplateModal
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        weddingId={weddingId}
        currentTemplate={currentWaTemplate}
        coupleTitle={coupleTitle}
        weddingSlug={weddingSlug}
        onSaved={(newTpl) => {
          setCurrentWaTemplate(newTpl);
        }}
      />
    </div>
  );
}

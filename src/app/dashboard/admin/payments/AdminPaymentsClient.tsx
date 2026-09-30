"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  Receipt,
  Sparkles,
  Crown,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import { PLAN_PRICING, PlanType } from "@/lib/midtrans";

export interface TransactionItem {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  currentPlan: string;
  weddingId: string | null;
  weddingSlug: string | null;
  coupleTitle: string | null;
  plan: string;
  amount: number;
  status: string;
  paymentType: string | null;
  createdAt: string;
}

export interface UserOption {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  weddings: {
    id: string;
    slug: string;
    coupleTitle: string;
  }[];
}

interface StatsData {
  totalRevenue: number;
  settlementCount: number;
  pendingCount: number;
  failedCount: number;
  totalCount: number;
}

export default function AdminPaymentsClient({
  initialTransactions,
  users,
  stats: initialStats,
}: {
  initialTransactions: TransactionItem[];
  users: UserOption[];
  stats: StatsData;
}) {
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [stats, setStats] = useState<StatsData>(initialStats);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Loading & notification states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal states
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedTxDetail, setSelectedTxDetail] = useState<TransactionItem | null>(null);

  // Manual payment form state
  const [manualUserId, setManualUserId] = useState(users[0]?.id || "");
  const [manualWeddingId, setManualWeddingId] = useState("");
  const [manualPlan, setManualPlan] = useState<PlanType>("premium");
  const [manualAmount, setManualAmount] = useState<number>(PLAN_PRICING.premium.price);
  const [manualMethod, setManualMethod] = useState("manual_bank_transfer");
  const [manualNotes, setManualNotes] = useState("");
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  // Selected user for manual modal to populate their weddings
  const selectedManualUser = users.find((u) => u.id === manualUserId);

  // Copy Order ID
  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Format date
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  };

  // Action: Approve Manual
  const handleApproveManual = async (tx: TransactionItem) => {
    if (!confirm(`Konfirmasi pelunasan manual untuk pesanan ${tx.orderId} (${tx.userName})? Paket akan langsung aktif.`)) {
      return;
    }

    setActionLoadingId(tx.id);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve_manual",
          transactionId: tx.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTransactions((prev) =>
          prev.map((item) =>
            item.id === tx.id
              ? { ...item, status: "settlement", paymentType: item.paymentType || "manual_bank_transfer" }
              : item
          )
        );
        // Update stats
        setStats((prev) => ({
          ...prev,
          totalRevenue: prev.totalRevenue + tx.amount,
          settlementCount: prev.settlementCount + 1,
          pendingCount: Math.max(0, prev.pendingCount - 1),
        }));
        showNotification("success", data.message || "Transaksi berhasil disetujui!");
      } else {
        showNotification("error", data.error || "Gagal menyetujui transaksi.");
      }
    } catch {
      showNotification("error", "Terjadi kesalahan jaringan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Sync Midtrans
  const handleSyncMidtrans = async (tx: TransactionItem) => {
    setActionLoadingId(tx.id);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sync_midtrans",
          transactionId: tx.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const newStatus = data.transaction.status;
        setTransactions((prev) =>
          prev.map((item) =>
            item.id === tx.id
              ? { ...item, status: newStatus, paymentType: data.transaction.paymentType }
              : item
          )
        );
        showNotification("success", data.message || "Status Midtrans berhasil disinkronkan.");
      } else {
        showNotification("error", data.error || "Gagal sinkron status Midtrans.");
      }
    } catch {
      showNotification("error", "Terjadi kesalahan jaringan.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Submit Catat Pembayaran Manual
  const handleSubmitManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUserId || !manualPlan || !manualAmount) {
      alert("Mohon lengkapi data form.");
      return;
    }

    setIsSubmittingManual(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: manualUserId,
          weddingId: manualWeddingId || undefined,
          plan: manualPlan,
          amount: Number(manualAmount),
          paymentType: manualMethod,
          notes: manualNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.transaction) {
        const newTx: TransactionItem = {
          id: data.transaction.id,
          orderId: data.transaction.orderId,
          userId: data.transaction.userId,
          userName: selectedManualUser?.name || "Klien",
          userEmail: selectedManualUser?.email || "-",
          currentPlan: manualPlan,
          weddingId: data.transaction.weddingId,
          weddingSlug:
            selectedManualUser?.weddings.find((w) => w.id === manualWeddingId)?.slug || null,
          coupleTitle:
            selectedManualUser?.weddings.find((w) => w.id === manualWeddingId)?.coupleTitle || null,
          plan: data.transaction.plan,
          amount: data.transaction.amount,
          status: "settlement",
          paymentType: data.transaction.paymentType,
          createdAt: data.transaction.createdAt,
        };

        setTransactions((prev) => [newTx, ...prev]);
        setStats((prev) => ({
          ...prev,
          totalRevenue: prev.totalRevenue + newTx.amount,
          settlementCount: prev.settlementCount + 1,
          totalCount: prev.totalCount + 1,
        }));

        setIsManualModalOpen(false);
        setManualNotes("");
        showNotification("success", data.message || "Pembayaran manual berhasil dicatat!");
      } else {
        alert(data.error || "Gagal mencatat pembayaran.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("Tidak ada data transaksi untuk diekspor.");
      return;
    }

    const headers = [
      "Order ID",
      "Nama Klien",
      "Email",
      "Paket",
      "Nominal (Rp)",
      "Status",
      "Metode Bayar",
      "Slug Undangan",
      "Tanggal Transaksi",
    ];

    const rows = filteredTransactions.map((tx) => [
      `"${tx.orderId}"`,
      `"${tx.userName.replace(/"/g, '""')}"`,
      `"${tx.userEmail}"`,
      `"${tx.plan}"`,
      tx.amount,
      `"${tx.status}"`,
      `"${tx.paymentType || '-'}"`,
      `"${tx.weddingSlug || '-'}"`,
      `"${tx.createdAt}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `laporan-transaksi-hayvows-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.orderId.toLowerCase().includes(search.toLowerCase()) ||
      tx.userName.toLowerCase().includes(search.toLowerCase()) ||
      tx.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      (tx.weddingSlug && tx.weddingSlug.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "failed"
        ? ["cancel", "expire", "deny"].includes(tx.status)
        : tx.status === statusFilter;

    const matchesPlan = planFilter === "all" ? true : tx.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            notification.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-800"
              : "bg-rose-950 text-rose-100 border-rose-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header & Quick Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
              Kelola Pembayaran &amp; Transaksi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau omzet platform, riwayat pembayaran Midtrans &amp; transfer manual, dan kelola aktivasi paket pengguna.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-nowrap overflow-x-auto">
          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl font-bold text-xs bg-purple-900 hover:bg-purple-950 text-white shadow-xs transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-purple-200" />
            <span>+ Catat Pembayaran Manual</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl font-semibold text-xs border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Omzet */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Omzet Riil
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-700">
            {formatIDR(stats.totalRevenue)}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            {stats.settlementCount} transaksi lunas
          </p>
        </div>

        {/* Transaksi Sukses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Lunas (Settlement)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">
            {stats.settlementCount}
          </p>
          <p className="text-[11px] text-emerald-600 font-mono">
            {stats.totalCount > 0
              ? `${Math.round((stats.settlementCount / stats.totalCount) * 100)}% Rasio Berhasil`
              : "Belum ada transaksi"}
          </p>
        </div>

        {/* Menunggu Pembayaran */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menunggu Bayar
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-700">
            {stats.pendingCount}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Status pending Midtrans
          </p>
        </div>

        {/* Batal / Expired */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Batal / Expire
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">
            {stats.failedCount}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Kadaluarsa atau dibatalkan
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Order ID, Nama Klien, Email, atau Slug Undangan..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-hidden"
          />
        </div>

        {/* Filters (Status & Plan Dropdowns) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2 min-h-[42px] text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">Semua Status ({transactions.length})</option>
              <option value="settlement">Lunas ({stats.settlementCount})</option>
              <option value="pending">Pending ({stats.pendingCount})</option>
              <option value="failed">Batal ({stats.failedCount})</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Plan Filter Dropdown */}
          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2 min-h-[42px] text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">Semua Paket</option>
              <option value="basic">Paket Basic</option>
              <option value="premium">Paket Populer</option>
              <option value="luxury">Paket Exclusive</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Riwayat Transaksi Masuk
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredTransactions.length} dari {transactions.length} transaksi
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              Tidak ada data transaksi yang cocok dengan filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPlanFilter("all");
              }}
              className="text-xs text-purple-700 font-bold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order ID &amp; Waktu</th>
                  <th className="py-3 px-4">Klien &amp; Undangan</th>
                  <th className="py-3 px-4">Paket</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTransactions.map((tx) => {
                  const isSettlement = tx.status === "settlement";
                  const isPending = tx.status === "pending";
                  const isFailed = ["cancel", "expire", "deny"].includes(tx.status);

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Order ID & Time */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-900">
                          <span>{tx.orderId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyOrderId(tx.orderId)}
                            title="Salin Order ID"
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            {copiedOrderId === tx.orderId ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatDate(tx.createdAt)}
                        </p>
                      </td>

                      {/* User & Wedding */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-semibold text-slate-900">{tx.userName}</div>
                        <p className="text-[11px] text-slate-500 font-mono">{tx.userEmail}</p>
                        {tx.weddingSlug ? (
                          <Link
                            href={`/invitation/${tx.weddingSlug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] text-purple-700 hover:underline mt-0.5"
                          >
                            <span>{tx.coupleTitle || tx.weddingSlug}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Akun Pengguna</span>
                        )}
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4 align-top">
                        {tx.plan === "luxury" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Crown className="w-3 h-3 text-amber-700" />
                            Exclusive
                          </span>
                        ) : tx.plan === "premium" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <Sparkles className="w-3 h-3 text-emerald-700" />
                            Populer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                            Basic
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-slate-900 font-mono">
                          {formatIDR(tx.amount)}
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 uppercase font-mono font-medium">
                          {tx.paymentType || "Midtrans Snap"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top text-center">
                        {isSettlement ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Lunas
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            {tx.status}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button if pending */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleApproveManual(tx)}
                              disabled={actionLoadingId === tx.id}
                              title="Setujui manual & aktifkan paket"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {actionLoadingId === tx.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Sync Midtrans */}
                          <button
                            type="button"
                            onClick={() => handleSyncMidtrans(tx)}
                            disabled={actionLoadingId === tx.id}
                            title="Sinkron status dengan API Midtrans"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw
                              className={`w-3.5 h-3.5 ${
                                actionLoadingId === tx.id ? "animate-spin text-purple-600" : ""
                              }`}
                            />
                          </button>

                          {/* View Detail Receipt */}
                          <button
                            type="button"
                            onClick={() => setSelectedTxDetail(tx)}
                            title="Lihat Detail & Invoice"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-purple-50 text-purple-700 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Catat Pembayaran Manual */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Catat Pembayaran Manual
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aktivasi paket klien yang bayar via transfer bank langsung.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitManualPayment} className="space-y-4 mt-4">
              {/* Select User */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Pengguna / Klien
                </label>
                <select
                  value={manualUserId}
                  onChange={(e) => {
                    setManualUserId(e.target.value);
                    setManualWeddingId("");
                  }}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-hidden font-medium"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || "Tanpa Nama"} ({u.email}) — Saat ini: {u.plan.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Target Wedding if exists */}
              {selectedManualUser?.weddings && selectedManualUser.weddings.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hubungkan ke Undangan (Opsional)
                  </label>
                  <select
                    value={manualWeddingId}
                    onChange={(e) => setManualWeddingId(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-hidden font-medium"
                  >
                    <option value="">-- Pilih Undangan --</option>
                    {selectedManualUser.weddings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.coupleTitle} ({w.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Plan Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Paket yang Diaktifkan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["basic", "premium", "luxury"] as PlanType[]).map((p) => {
                    const price = PLAN_PRICING[p].price;
                    const isSelected = manualPlan === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setManualPlan(p);
                          setManualAmount(price);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600 text-purple-950 font-bold"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <p className="text-xs uppercase font-bold">{p}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {formatIDR(price)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nominal Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nominal Diterima (Rp)
                </label>
                <input
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(Number(e.target.value))}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-hidden font-mono font-bold"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={manualMethod}
                  onChange={(e) => setManualMethod(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-hidden font-medium"
                >
                  <option value="manual_bank_transfer">Transfer Bank Manual (BCA / Mandiri / BRI / BNI)</option>
                  <option value="manual_qris">QRIS Langsung (Owner Account)</option>
                  <option value="cash_offline">Tunai / Offline</option>
                  <option value="promo_gift">Hadiah / Promo Khusus (Rp 0)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan / Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Contoh: Bukti transfer BCA an. Budi Santoso"
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingManual}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-900 hover:bg-purple-950 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingManual ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Simpan &amp; Aktifkan Paket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Detail Transaksi & Invoice */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Rincian Transaksi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedTxDetail.orderId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Klien:</span>
                <span className="font-semibold text-slate-900">
                  {selectedTxDetail.userName}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-700">
                  {selectedTxDetail.userEmail}
                </span>
              </div>
              {selectedTxDetail.weddingSlug && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Undangan:</span>
                  <Link
                    href={`/invitation/${selectedTxDetail.weddingSlug}`}
                    target="_blank"
                    className="font-medium text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <span>{selectedTxDetail.coupleTitle || selectedTxDetail.weddingSlug}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Paket:</span>
                <span className="font-bold uppercase text-slate-900">
                  {selectedTxDetail.plan}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Nominal:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {formatIDR(selectedTxDetail.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-medium uppercase text-slate-800">
                  {selectedTxDetail.paymentType || "Midtrans"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold uppercase text-slate-900">
                  {selectedTxDetail.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Waktu:</span>
                <span className="text-slate-700">
                  {formatDate(selectedTxDetail.createdAt)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTxDetail(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

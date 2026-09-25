"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Crown,
  Sparkles,
  Users,
  ChevronRight,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
  _count: {
    weddings: number;
    transactions: number;
  };
}

export default function AdminUsersClient({
  initialUsers,
}: {
  initialUsers: UserItem[];
}) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    setLoadingId(userId);
    setNotification(null);
    try {
      const res = await fetch("/api/admin/users/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId, newPlan }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u))
        );
        setNotification(data.message || "Paket berhasil diperbarui!");
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(data.error || "Gagal memperbarui paket.");
      }
    } catch {
      alert("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = filterPlan === "all" || u.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const stats = {
    total: users.length,
    basic: users.filter((u) => u.plan === "basic").length,
    premium: users.filter((u) => u.plan === "premium").length,
    luxury: users.filter((u) => u.plan === "luxury").length,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2d4a3e] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Super Admin Control Center</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Pengguna &amp; Status Paket
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau akun terdaftar dan aktifkan paket langganan secara instan dengan satu klik.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Pengguna
          </p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Paket Basic (Trial)
          </p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1">{stats.basic}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Paket Premium</span>
          </p>
          <p className="text-2xl font-extrabold text-[#2d4a3e] mt-1">{stats.premium}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#c9a84c]/40 shadow-2xs bg-amber-50/20">
          <p className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider flex items-center gap-1">
            <Crown className="w-3 h-3 text-[#c9a84c]" />
            <span>Paket Luxury</span>
          </p>
          <p className="text-2xl font-extrabold text-[#c9a84c] mt-1">{stats.luxury}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email pengguna..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Filter Paket:
          </span>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-[#faf8f5] font-medium text-slate-700 focus:outline-none focus:border-[#2d4a3e] cursor-pointer"
          >
            <option value="all">Semua Paket ({stats.total})</option>
            <option value="basic">Basic / Uji Coba ({stats.basic})</option>
            <option value="premium">Premium ({stats.premium})</option>
            <option value="luxury">Luxury ({stats.luxury})</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Pengguna</th>
                <th className="px-4 py-3.5">Peran</th>
                <th className="px-4 py-3.5">Status Paket</th>
                <th className="px-4 py-3.5">Undangan</th>
                <th className="px-4 py-3.5">Terdaftar</th>
                <th className="px-5 py-3.5 text-right">Aksi Cepat (ACC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.map((u) => {
                const isLoading = loadingId === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-[#fef08a] font-bold text-xs flex items-center justify-center shrink-0">
                          {(u.name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name || "Tanpa Nama"}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {u.plan === "luxury" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0a0a0a] text-[#c9a84c] border border-[#c9a84c]/40">
                          <Crown className="w-3 h-3 text-[#c9a84c]" />
                          <span>LUXURY</span>
                        </span>
                      ) : u.plan === "premium" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>PREMIUM</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <span>BASIC (UJI COBA)</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-600">
                      {u._count.weddings} Undangan
                    </td>

                    <td className="px-4 py-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {u.plan !== "luxury" && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleUpdatePlan(u.id, "luxury")}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#0a0a0a] hover:bg-slate-800 text-[#c9a84c] border border-[#c9a84c]/50 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Set Luxury
                          </button>
                        )}

                        {u.plan !== "premium" && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleUpdatePlan(u.id, "premium")}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#2d4a3e] hover:bg-[#233a30] text-white transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Set Premium
                          </button>
                        )}

                        {u.plan !== "basic" && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleUpdatePlan(u.id, "basic")}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Reset Basic
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Tidak ada pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

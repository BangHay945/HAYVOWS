"use client";
import { useState, useMemo } from "react";
import {
  Pin,
  Check,
  EyeOff,
  Trash2,
  MessageSquare,
  Search,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";

type MsgWithGuest = {
  id: string;
  message: string;
  status: string;
  isPinned: boolean;
  createdAt: Date;
  guest: { name: string; category?: string };
};

export default function MessagesManager({
  weddingId,
  initialMessages,
}: {
  weddingId: string;
  initialMessages: MsgWithGuest[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "approved" | "pinned" | "hidden">("all");
  void weddingId;

  const update = async (id: string, body: object) => {
    const res = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
      );
    }
  };

  const del = async (id: string) => {
    if (!confirm("Hapus ucapan doa ini secara permanen?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Metrics
  const totalCount = messages.length;
  const approvedCount = messages.filter((m) => m.status === "approved").length;
  const pinnedCount = messages.filter((m) => m.isPinned).length;
  const hiddenCount = messages.filter((m) => m.status === "hidden").length;

  // Filtered
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.guest.name.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesTab = true;
      if (activeTab === "approved") matchesTab = msg.status === "approved";
      if (activeTab === "pinned") matchesTab = msg.isPinned;
      if (activeTab === "hidden") matchesTab = msg.status === "hidden";

      return matchesSearch && matchesTab;
    });
  }, [messages, searchQuery, activeTab]);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono tracking-wider font-semibold text-emerald-700 uppercase mb-1">
          Buku Tamu Digital &amp; Moderasi
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Ucapan &amp; Doa Restu
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Tinjau ucapan doa dari para tamu undangan. Anda dapat menyematkan (pin) ucapan terfavorit di bagian atas, menyetujui, atau menyembunyikan pesan.
        </p>
      </div>

      {/* 4 Summary Metrics (Matching DesainPakeAI masuk.page.html) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Ucapan</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Pesan terkirim</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Disetujui</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{approvedCount}</p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5 font-mono">Tampil di undangan</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Tersemat (Pinned)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Pin className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{pinnedCount}</p>
          <p className="text-[11px] text-amber-600/80 mt-0.5 font-mono">Tampil di urutan teratas</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Disembunyikan</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{hiddenCount}</p>
          <p className="text-[11px] text-rose-600/80 mt-0.5 font-mono">Tidak tampil di publik</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci ucapan atau nama pengirim..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("approved")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "approved"
                ? "bg-white text-emerald-700 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Disetujui ({approvedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pinned")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "pinned"
                ? "bg-white text-amber-700 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tersemat ({pinnedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hidden")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "hidden"
                ? "bg-white text-rose-700 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Disembunyikan ({hiddenCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.map((msg) => {
          const isApproved = msg.status === "approved";
          const isHidden = msg.status === "hidden";
          const initial = msg.guest.name.charAt(0).toUpperCase();

          return (
            <div
              key={msg.id}
              className={`bg-white border rounded-2xl p-5 shadow-2xs transition-all ${
                msg.isPinned
                  ? "border-amber-300 ring-2 ring-amber-300/20 bg-amber-50/15"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left: Avatar, Sender, Message */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                    {initial}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {msg.guest.name}
                      </h3>
                      {msg.guest.category && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {msg.guest.category}
                        </span>
                      )}

                      {/* Status Badges */}
                      {msg.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          <Pin className="w-3 h-3 fill-amber-600 text-amber-600" />
                          <span>Tersemat</span>
                        </span>
                      )}

                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Disetujui</span>
                        </span>
                      )}

                      {isHidden && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                          <EyeOff className="w-3 h-3 text-rose-600" />
                          <span>Disembunyikan</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 font-mono ml-auto sm:ml-0">
                        {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Message Quote */}
                    <p className="text-xs text-slate-700 leading-relaxed pt-1 whitespace-pre-wrap">
                      &ldquo;{msg.message}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start pt-2 sm:pt-0">
                  {/* Pin / Unpin */}
                  <button
                    type="button"
                    onClick={() => update(msg.id, { isPinned: !msg.isPinned })}
                    className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                      msg.isPinned
                        ? "bg-amber-100 border-amber-300 text-amber-800"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    title={msg.isPinned ? "Lepas sematan" : "Sematkan di atas"}
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span>{msg.isPinned ? "Lepas Pin" : "Pin"}</span>
                  </button>

                  {/* Approve / Disapprove */}
                  {!isApproved ? (
                    <button
                      type="button"
                      onClick={() => update(msg.id, { status: "approved" })}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs transition-colors cursor-pointer"
                      title="Setujui dan tampilkan"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => update(msg.id, { status: "pending" })}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                      title="Kembalikan ke antrean moderasi"
                    >
                      <span>Batal Setuju</span>
                    </button>
                  )}

                  {/* Hide / Unhide */}
                  <button
                    type="button"
                    onClick={() =>
                      update(msg.id, {
                        status: isHidden ? "approved" : "hidden",
                      })
                    }
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title={isHidden ? "Tampilkan pesan" : "Sembunyikan pesan"}
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => del(msg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus permanen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMessages.length === 0 && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-400 text-xs">
            {searchQuery || activeTab !== "all"
              ? "Tidak ada ucapan doa yang sesuai dengan filter."
              : "Belum ada ucapan doa yang dikirim oleh tamu undangan."}
          </div>
        )}
      </div>
    </div>
  );
}

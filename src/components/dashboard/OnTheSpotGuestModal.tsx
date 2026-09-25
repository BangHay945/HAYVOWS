"use client";

import { useState } from "react";
import { X, UserPlus, MapPin, Users, Gift, Sparkles, CheckCircle2 } from "lucide-react";

interface OnTheSpotGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingId: string;
  onSuccess: () => void;
}

export function OnTheSpotGuestModal({
  isOpen,
  onClose,
  weddingId,
  onSuccess,
}: OnTheSpotGuestModalProps) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    category: "Reguler",
    guestCount: 1,
    tableNumber: "",
    sessionName: "",
    souvenirTaken: true,
    giftType: "none",
    checkInNotes: "Tamu On-the-spot di Lokasi",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Nama tamu wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/wedding/${weddingId}/checkin/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal mendaftarkan tamu on-the-spot.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setLoading(false);
      setError("Terjadi kesalahan koneksi saat menyimpan data.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 text-slate-900 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2d4a3e] via-[#3a6151] to-[#2d4a3e] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-white/20 text-[#fef08a]">
              <UserPlus className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
              Registrasi Meja Resepsionis
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Tambah Tamu On-the-Spot (Langsung Hadir)
          </h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Untuk tamu hadir yang belum terdaftar di daftar undangan sebelumnya.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          {/* Nama Tamu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap Tamu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Ir. Hendra Gunawan & Istri"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
            />
          </div>

          {/* Alamat / Asal Kota / Instansi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alamat / Asal Kota / Instansi
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Contoh: Bandung / Alumni ITB '18 / PT Telkom"
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Kategori & Jumlah Pax */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori Tamu
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              >
                <option value="Reguler">Reguler</option>
                <option value="VIP">VIP</option>
                <option value="VVIP">VVIP</option>
                <option value="Keluarga Pria">Keluarga Pria</option>
                <option value="Keluarga Wanita">Keluarga Wanita</option>
                <option value="Teman Kerja">Teman Kerja</option>
                <option value="Sahabat">Sahabat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jumlah Pax (Orang)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.guestCount}
                onChange={(e) =>
                  setForm({ ...form, guestCount: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
            </div>
          </div>

          {/* Nomor Meja & Sesi */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Meja
              </label>
              <input
                type="text"
                value={form.tableNumber}
                onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                placeholder="Contoh: Meja 04 / VIP A"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sesi Acara
              </label>
              <input
                type="text"
                value={form.sessionName}
                onChange={(e) => setForm({ ...form, sessionName: e.target.value })}
                placeholder="Contoh: Sesi 1 / Resepsi"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
            </div>
          </div>

          {/* Souvenir Checklist */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
            <input
              type="checkbox"
              checked={form.souvenirTaken}
              onChange={(e) => setForm({ ...form, souvenirTaken: e.target.checked })}
              className="w-4 h-4 rounded text-[#2d4a3e] focus:ring-[#2d4a3e]"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-800 block">Souvenir Pernikahan Diberikan</span>
              <span className="text-[11px] text-slate-500 block">Tandai bahwa tamu sudah menerima souvenir</span>
            </div>
          </label>

          {/* Jenis Kado */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tanda Kasih / Kado Fisik
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "none", label: "Tanpa Kado" },
                { id: "amplop", label: "Amplop Fisik" },
                { id: "kado", label: "Kado Fisik" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setForm({ ...form, giftType: opt.id })}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    form.giftType === opt.id
                      ? "bg-[#2d4a3e] text-white border-[#2d4a3e] shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Petugas
            </label>
            <input
              type="text"
              value={form.checkInNotes}
              onChange={(e) => setForm({ ...form, checkInNotes: e.target.value })}
              placeholder="Catatan tambahan..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Menyimpan & Check-in..." : "Daftarkan & Langsung Hadir"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

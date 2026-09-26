"use client";

import { useState, useEffect } from "react";
import {
  X,
  Check,
  Crown,
  ShieldCheck,
  QrCode,
  MessageCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { HayvowsLogo } from "@/components/brand/HayvowsLogo";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  weddingId?: string;
  weddingTitle?: string;
  onUpgradeSuccess?: () => void;
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentPlan = "basic",
  weddingId,
  weddingTitle,
  onUpgradeSuccess,
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | "luxury">("premium");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Lock background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayMidtrans = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/payment/create-snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, weddingId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat sesi pembayaran.");
      }

      const { snapToken, orderId, isSimulated } = data;

      // Jika script Snap Midtrans tersedia di window
      if (typeof window !== "undefined" && (window as any).snap && !isSimulated) {
        (window as any).snap.pay(snapToken, {
          onSuccess: async function (result: any) {
            console.log("Midtrans payment success:", result);
            // Panggil webhook lokal untuk konfirmasi cepat
            await fetch("/api/payment/webhook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: orderId,
                transaction_status: "settlement",
                status_code: "200",
                gross_amount: data.amount.toString(),
                payment_type: result.payment_type || "qris",
              }),
            });
            onUpgradeSuccess?.();
            onClose();
            window.location.reload();
          },
          onPending: function (result: any) {
            alert("Pembayaran Anda sedang diproses. Mohon selesaikan instruksi pembayaran.");
            onClose();
          },
          onError: function (result: any) {
            alert("Pembayaran gagal. Silakan coba kembali.");
          },
          onClose: function () {
            console.log("Customer closed the popup without finishing the payment");
          },
        });
      } else {
        // Mode Simulasi Sandbox (untuk pengujian instan tanpa server key asli)
        const confirmSimulate = window.confirm(
          `[SIMULASI MIDTRANS SANDBOX]\n\nOrder ID: ${orderId}\nPaket: ${selectedPlan.toUpperCase()}\nNominal: Rp ${data.amount.toLocaleString(
            "id-ID"
          )}\n\nTekan OK untuk mensimulasikan pembayaran QRIS / Virtual Account berhasil secara instan!`
        );

        if (confirmSimulate) {
          const simRes = await fetch("/api/payment/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: orderId,
              transaction_status: "settlement",
              status_code: "200",
              gross_amount: data.amount.toString(),
              payment_type: "qris_simulated",
              is_simulated: true,
            }),
          });

          if (simRes.ok) {
            alert("Pembayaran simulasi berhasil! Paket akun Anda telah aktif.");
            onUpgradeSuccess?.();
            onClose();
            window.location.reload();
          } else {
            alert("Gagal memproses simulasi webhook.");
          }
        }
      }
    } catch (err: any) {
      console.error("[UPGRADE_MODAL_PAY_ERROR]", err);
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const getPlanAmountStr = () => {
    if (selectedPlan === "basic") return "149.000";
    if (selectedPlan === "premium") return "199.000";
    return "299.000";
  };

  const whatsappMessage = encodeURIComponent(
    `Halo Admin Hayvows, saya ingin konfirmasi upgrade ke Paket ${selectedPlan.toUpperCase()} (Rp ${getPlanAmountStr()}). Mohon bantuannya.`
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92dvh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 my-auto">
        {/* Header - Fixed & Always Visible */}
        <div className="shrink-0 p-5 sm:p-6 pb-4 bg-gradient-to-b from-[#faf8f5] to-white border-b border-slate-100 flex items-start justify-between">
          <div>
            <HayvowsLogo size="sm" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-2">
              Pilih Paket Undangan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {weddingTitle ? (
                <>
                  Untuk undangan <span className="font-bold text-[#2d4a3e]">{weddingTitle}</span>. Hapus batas masa aktif 3 hari &amp; hilangkan watermark.
                </>
              ) : (
                "Hapus batas masa aktif 3 hari, hilangkan watermark uji coba, dan buka tema impian Anda."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body with smooth scrolling */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 overscroll-contain">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Paket Basic */}
            <div
              onClick={() => setSelectedPlan("basic")}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedPlan === "basic"
                  ? "border-[#2d4a3e] bg-slate-50/80 shadow-md ring-2 ring-[#2d4a3e]/15"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                    Standar Hemat
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedPlan === "basic"
                        ? "border-[#2d4a3e] bg-[#2d4a3e] text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedPlan === "basic" && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base">Paket Basic</h3>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  Rp 149.000
                  <span className="text-[11px] font-normal text-slate-400 block sm:inline"> / selamanya</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Tema Modern Monogram</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-700">Aktif Selamanya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Hapus Watermark Uji Coba</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Musik Romantis &amp; Hitung Mundur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Google Maps &amp; Sebar WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Paket Populer */}
            <div
              onClick={() => setSelectedPlan("premium")}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedPlan === "premium"
                  ? "border-[#2d4a3e] bg-emerald-50/40 shadow-md ring-2 ring-[#2d4a3e]/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    <span>Paling Diminati</span>
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedPlan === "premium"
                        ? "border-[#2d4a3e] bg-[#2d4a3e] text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedPlan === "premium" && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base">Paket Populer</h3>
                <p className="text-xl font-extrabold text-[#2d4a3e] mt-1">
                  Rp 199.000
                  <span className="text-[11px] font-normal text-slate-400 block sm:inline"> / selamanya</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Semua Fitur Paket Basic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-800">Tema Nature Floral &amp; Batik Jawa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Buku Tamu &amp; RSVP Realtime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Amplop Digital &amp; Salin Rekening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Bebas Pasang Musik Sendiri (MP3)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Paket Luxury / Exclusive */}
            <div
              onClick={() => setSelectedPlan("luxury")}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedPlan === "luxury"
                  ? "border-[#c9a84c] bg-amber-50/30 shadow-md ring-2 ring-[#c9a84c]/25"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0a0a0a] text-[#c9a84c] uppercase tracking-wider border border-[#c9a84c]/40 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-[#c9a84c]" />
                    <span>Eksklusif VIP</span>
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedPlan === "luxury"
                        ? "border-[#c9a84c] bg-[#c9a84c] text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedPlan === "luxury" && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base">Paket Exclusive</h3>
                <p className="text-xl font-extrabold text-[#c9a84c] mt-1">
                  Rp 299.000
                  <span className="text-[11px] font-normal text-slate-400 block sm:inline"> / selamanya</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                    <span className="font-semibold text-slate-800">Semua Fitur Paket Populer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                    <span className="font-bold text-slate-900">Tema Eternal Noir Luxury</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                    <span className="font-semibold text-slate-800">Tema 2D RPG &amp; Cyberpunk Neo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                    <span>Tiket E-Pass QR Presensi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                    <span>Layar Sambutan TV Gedung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={handlePayMidtrans}
              className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyiapkan Pembayaran Midtrans...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 text-[#fef08a]" />
                  <span>
                    Bayar {selectedPlan === "basic" ? "Paket Basic" : selectedPlan === "premium" ? "Paket Populer" : "Paket Exclusive"} dengan Midtrans
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Pembayaran Aman &amp; Terverifikasi Otomatis</span>
              </span>
              <a
                href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-emerald-700 underline inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Bantuan / Transfer Manual via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;

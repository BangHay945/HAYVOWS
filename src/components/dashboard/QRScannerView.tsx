"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  CheckCircle2,
  X,
  AlertCircle,
  Sparkles,
  MapPin,
  Users,
  Gift,
  RefreshCw,
  Search,
  Check,
} from "lucide-react";

interface QRScannerViewProps {
  weddingId: string;
  onCheckInSuccess: () => void;
}

export function QRScannerView({ weddingId, onCheckInSuccess }: QRScannerViewProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannedGuest, setScannedGuest] = useState<any | null>(null);
  const [checkInState, setCheckInState] = useState<{
    checkedInPax: number;
    souvenirTaken: boolean;
    giftType: string;
    checkInNotes: string;
  }>({
    checkedInPax: 1,
    souvenirTaken: true,
    giftType: "none",
    checkInNotes: "",
  });
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "guestbook-qr-scanner-region";

  const playSuccessBeep = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.1); // E6
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio not supported or blocked, ignore
    }
  };

  const startScanner = async () => {
    setCameraError(null);
    setFeedbackMsg(null);

    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {
          // ignore
        }
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleCodeDetected(decodedText);
        },
        () => {
          // Scanner frame error (standard continuous scanning, no need to log)
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        err?.message || "Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browser Anda."
      );
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleCodeDetected = async (code: string) => {
    playSuccessBeep();
    await stopScanner();
    await processCheckInLookup(code);
  };

  const processCheckInLookup = async (codeOrSlug: string) => {
    if (!codeOrSlug.trim()) return;

    setLoading(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/wedding/${weddingId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrCode: codeOrSlug.trim(),
          checkedInPax: 1,
          souvenirTaken: true,
          giftType: "none",
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setFeedbackMsg({
          type: "error",
          text: data.error || "Kode QR / data tamu tidak ditemukan.",
        });
        return;
      }

      setScannedGuest(data.guest);
      setCheckInState({
        checkedInPax: data.guest.checkedInPax || data.guest.guestCount || 1,
        souvenirTaken: data.guest.souvenirTaken !== undefined ? data.guest.souvenirTaken : true,
        giftType: data.guest.giftType || "none",
        checkInNotes: data.guest.checkInNotes || "",
      });

      setFeedbackMsg({
        type: "success",
        text: `Check-in berhasil: ${data.guest.name}`,
      });

      setManualCode("");
      onCheckInSuccess();
    } catch (err) {
      setLoading(false);
      setFeedbackMsg({
        type: "error",
        text: "Terjadi kesalahan koneksi saat memproses check-in.",
      });
    }
  };

  const handleSaveAdditionalDetails = async () => {
    if (!scannedGuest) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/wedding/${weddingId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: scannedGuest.id,
          checkedInPax: checkInState.checkedInPax,
          souvenirTaken: checkInState.souvenirTaken,
          giftType: checkInState.giftType,
          checkInNotes: checkInState.checkInNotes,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setScannedGuest(null);
        setFeedbackMsg({
          type: "success",
          text: `Data kehadiran ${data.guest.name} tersimpan. Siap scan tamu berikutnya!`,
        });
        onCheckInSuccess();
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Scanner */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-[#2d4a3e] border border-emerald-200/80">
                <Camera className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Kamera Pemindai Resepsionis</h3>
                <p className="text-[11px] text-slate-500">
                  Arahkan kamera ke QR Code di ponsel tamu
                </p>
              </div>
            </div>

            {isScanning ? (
              <button
                type="button"
                onClick={stopScanner}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                Matikan Kamera
              </button>
            ) : (
              <button
                type="button"
                onClick={startScanner}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#fef08a]" />
                <span>Aktifkan Kamera</span>
              </button>
            )}
          </div>

          {/* Scanner Viewport */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[280px] flex items-center justify-center border border-slate-800">
            <div id={scannerContainerId} className="w-full max-w-[360px]" />

            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3 bg-slate-900/90">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <Camera className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Kamera Belum Aktif</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Klik tombol di bawah untuk menyalakan pemindai QR Code otomatis.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startScanner}
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-md transition-all cursor-pointer"
                >
                  Mulai Pindai Sekarang
                </button>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span>{cameraError}</span>
                <span className="block mt-1 font-semibold text-amber-950">
                  Tip: Anda tetap dapat melakukan pencarian atau memasukkan kode tiket secara manual di sebelah kanan.
                </span>
              </div>
            </div>
          )}

          {/* Feedback message banner */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedbackMsg.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border border-rose-200 text-rose-900"
              }`}
            >
              {feedbackMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium text-[11px]">{feedbackMsg.text}</span>
            </div>
          )}
        </div>

        {/* Right Column: Check-in Details & Manual Input */}
        <div className="lg:col-span-5 space-y-4">
          {/* Manual Search / Code Input Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Input Manual / Cari Tamu</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Ketik kode token tiket (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#2d4a3e]">HVW-ABCD-1234</code>) atau slug tamu.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                processCheckInLookup(manualCode);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Kode QR atau Nama Slug..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
              />
              <button
                type="submit"
                disabled={loading || !manualCode.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2d4a3e] hover:bg-[#233a30] text-white transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                {loading ? "Mengecek..." : "Check-in"}
              </button>
            </form>
          </div>

          {/* Verified Guest Reception Card */}
          {scannedGuest ? (
            <div className="bg-gradient-to-b from-white to-emerald-50/50 p-5 rounded-2xl border-2 border-[#2d4a3e]/30 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1">
                    Tamu Terverifikasi Hadir
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {scannedGuest.name}
                  </h3>
                  {scannedGuest.address && (
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{scannedGuest.address}</span>
                    </p>
                  )}
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                  {scannedGuest.category || "Reguler"}
                </span>
              </div>

              {/* Table & Pax Information */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Nomor Meja</span>
                  <span className="text-sm font-bold text-[#2d4a3e]">
                    {scannedGuest.tableNumber || "Bebas"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Jumlah Pax Riil</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={checkInState.checkedInPax}
                      onChange={(e) =>
                        setCheckInState({
                          ...checkInState,
                          checkedInPax: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="w-14 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 text-center"
                    />
                    <span className="text-[11px] text-slate-500">Orang</span>
                  </div>
                </div>
              </div>

              {/* Checklists for Souvenir & Gift */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={checkInState.souvenirTaken}
                    onChange={(e) =>
                      setCheckInState({ ...checkInState, souvenirTaken: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#2d4a3e] focus:ring-[#2d4a3e]"
                  />
                  <div className="text-xs min-w-0">
                    <span className="font-semibold text-slate-800 block">Souvenir Pernikahan</span>
                    <span className="text-[10px] text-slate-400 block">Centang jika souvenir telah diserahkan</span>
                  </div>
                </label>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Tanda Kasih / Kado
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { id: "none", label: "Tanpa Kado" },
                      { id: "amplop", label: "Amplop Fisik" },
                      { id: "kado", label: "Kado Fisik" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCheckInState({ ...checkInState, giftType: opt.id })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          checkInState.giftType === opt.id
                            ? "bg-[#2d4a3e] text-white border-[#2d4a3e]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">
                    Catatan Khusus Meja Resepsionis
                  </span>
                  <input
                    type="text"
                    value={checkInState.checkInNotes}
                    onChange={(e) =>
                      setCheckInState({ ...checkInState, checkInNotes: e.target.value })
                    }
                    placeholder="Contoh: Menitipkan kado dari kerabat..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2d4a3e]/20 focus:border-[#2d4a3e]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAdditionalDetails}
                  disabled={loading}
                  className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-xs transition-colors cursor-pointer"
                >
                  {loading ? "Menyimpan..." : "Simpan & Lanjut Tamu Berikutnya"}
                </button>
                <button
                  type="button"
                  onClick={() => setScannedGuest(null)}
                  className="py-2 px-3 rounded-xl font-semibold text-xs border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 text-center text-slate-400 space-y-2">
              <Sparkles className="w-6 h-6 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Menunggu Tamu Undangan</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Scan kode QR tamu atau masukkan kode manual untuk memverifikasi kehadiran.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

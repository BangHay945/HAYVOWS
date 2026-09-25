"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Gift, Send, Loader2, Copy, Check, Lock } from "lucide-react";

export interface GiftAccountOption {
  id: string;
  bankName: string;
  accountNo?: string;
  accountName?: string;
  type?: string;
  qrisUrl?: string | null;
}

interface GiftConfirmationFormProps {
  weddingId: string;
  giftAccounts: GiftAccountOption[];
  defaultSenderName?: string;
  theme?: "cyberpunk" | "adventure" | "standard" | "noir" | "jawa" | "monogram" | "floral";
  onSuccess?: () => void;
  onClose?: () => void;
  isDemo?: boolean;
}

const QUICK_AMOUNTS = [50000, 100000, 200000, 300000, 500000, 1000000];

export function GiftConfirmationForm({
  weddingId,
  giftAccounts,
  defaultSenderName = "",
  theme = "standard",
  onSuccess,
  onClose,
  isDemo = false,
}: GiftConfirmationFormProps) {
  const searchParams = useSearchParams();

  // Resolusi nama pengirim: ?to=Nama Tamu atau ?u=... atau defaultSenderName atau fallback
  const resolvedSenderName = useMemo(() => {
    const fromParam = searchParams?.get("to") || searchParams?.get("u");
    if (fromParam && fromParam.trim()) {
      try {
        return decodeURIComponent(fromParam).trim();
      } catch {
        return fromParam.trim();
      }
    }
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const winTo = urlParams.get("to") || urlParams.get("u");
      if (winTo && winTo.trim()) {
        try {
          return decodeURIComponent(winTo).trim();
        } catch {
          return winTo.trim();
        }
      }
    }
    if (defaultSenderName && defaultSenderName.trim()) {
      return defaultSenderName.trim();
    }
    return "Tamu Undangan";
  }, [searchParams, defaultSenderName]);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    giftAccounts.length > 0 ? giftAccounts[0].id : ""
  );
  const [guestName, setGuestName] = useState(resolvedSenderName);

  useEffect(() => {
    if (resolvedSenderName) {
      setGuestName(resolvedSenderName);
    }
  }, [resolvedSenderName]);

  const [bankName, setBankName] = useState(
    giftAccounts.length > 0 ? giftAccounts[0].bankName : "BCA"
  );
  const [amount, setAmount] = useState<number | string>(100000);
  const [accountSender, setAccountSender] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Selected account object based on dropdown
  const selectedAccount =
    giftAccounts.find((acc) => acc.id === selectedAccountId) ||
    giftAccounts.find((acc) => acc.bankName === bankName) ||
    (giftAccounts.length > 0 ? giftAccounts[0] : null);

  const handleCopy = (text?: string) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    const finalSenderName = (guestName || resolvedSenderName || "Tamu Undangan").trim();
    if (!finalSenderName) {
      setError("Nama pengirim tidak boleh kosong.");
      return;
    }
    const targetBank = selectedAccount ? selectedAccount.bankName : bankName;
    if (!targetBank) {
      setError("Mohon pilih rekening bank tujuan.");
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Mohon masukkan nominal transfer yang valid.");
      return;
    }

    if (isDemo) {
      setError("Pengisian konfirmasi kirim kado dinonaktifkan pada mode demo.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/wedding/${weddingId}/gift/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestName.trim(),
          bankName: targetBank.trim(),
          amount: numAmount,
          notes: notes.trim() || undefined,
          accountSender: accountSender.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengirim konfirmasi transfer");
        setLoading(false);
        return;
      }

      setIsSubmitted(true);
      onSuccess?.();
    } catch {
      setError("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const isCyber = theme === "cyberpunk";
  const isAdv = theme === "adventure";
  const isNoir = theme === "noir";
  const isJawa = theme === "jawa";
  const isMonogram = theme === "monogram";
  const isFloral = theme === "floral" || theme === "standard";

  if (isSubmitted) {
    return (
      <div
        className={`p-5 text-center rounded-xl animate-in zoom-in-95 duration-200 ${
          isJawa
            ? "border border-[#B8860B]/40 bg-[#2D1B0E] text-[#EDE0C4] shadow-2xl font-jawa-body"
            : isNoir
            ? "border border-[#c9a84c]/40 bg-[#0d0d0d] text-[#fafafa] shadow-2xl"
            : isCyber
            ? "border-2 border-[#00f0ff] bg-[#0b0f19] text-white"
            : isAdv
            ? "border-2 border-[#eab308]/80 bg-[#2d0812] text-white shadow-[4px_4px_0px_#111]"
            : isMonogram
            ? "border border-[#e2d9cc] bg-[#faf8f5] text-slate-800 shadow-md font-sans"
            : "border border-emerald-200 bg-emerald-50/80 text-emerald-950"
        }`}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
            isJawa
              ? "bg-[#B8860B]/20 text-[#D4A853] border border-[#B8860B]/40"
              : isNoir
              ? "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40"
              : isAdv
              ? "bg-[#eab308]/20 text-[#fde047] border border-[#eab308]"
              : isCyber
              ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]"
              : isMonogram
              ? "bg-[#2d4a3e]/10 text-[#2d4a3e] border border-[#2d4a3e]/30"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3
          className={`font-bold text-base sm:text-lg mb-1 ${
            isJawa
              ? "text-[#EDE0C4] font-jawa-serif font-light text-xl tracking-wide"
              : isNoir
              ? "text-[#fafafa] font-noir-serif font-light text-xl tracking-wide"
              : isCyber
              ? "text-[#ffe600] font-mono uppercase"
              : isAdv
              ? "text-[#fde047] font-mono uppercase drop-shadow"
              : isMonogram
              ? "text-[#2d4a3e] font-serif font-bold text-xl tracking-wide"
              : "text-slate-900"
          }`}
        >
          Konfirmasi Berhasil Terkirim!
        </h3>
        <p
          className={`text-xs mb-3 max-w-sm mx-auto ${
            isJawa
              ? "text-[#A89078] font-jawa-body leading-relaxed"
              : isNoir
              ? "text-[#888888] font-noir-sans leading-relaxed"
              : isAdv
              ? "text-[#fce7f3]"
              : isCyber
              ? "text-gray-300 font-mono"
              : isMonogram
              ? "text-slate-600 font-sans leading-relaxed"
              : "text-slate-500"
          }`}
        >
          Terima kasih banyak atas tanda kasih dan doa restu yang Anda kirimkan untuk kedua mempelai.
        </p>
        <div
          className={`inline-block py-1.5 px-3 rounded-lg text-xs font-mono font-bold shadow-2xs mb-4 ${
            isJawa
              ? "bg-[#3D2B1F] border border-[#B8860B]/30 text-[#D4A853]"
              : isNoir
              ? "bg-[#141414] border border-[#2a2a2a] text-[#c9a84c]"
              : isAdv
              ? "bg-[#1e050c] border border-[#eab308] text-[#fde047]"
              : isCyber
              ? "bg-[#121829] border border-[#00f0ff] text-[#00f0ff]"
              : isMonogram
              ? "bg-white border border-[#e2d9cc] text-[#2d4a3e]"
              : "bg-white border text-emerald-700"
          }`}
        >
          Nominal: Rp {Number(amount).toLocaleString("id-ID")} &bull; Bank:{" "}
          {selectedAccount?.bankName || bankName}
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              onClose?.();
            }}
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isJawa
                ? "bg-gradient-to-r from-[#E6C687] via-[#D4A853] to-[#B8860B] hover:brightness-105 text-[#1A0F07] font-jawa-body tracking-wider uppercase font-bold shadow-md"
                : isNoir
                ? "bg-[#c9a84c] hover:bg-[#dfbe65] text-[#0a0a0a] font-noir-sans tracking-wider uppercase font-semibold"
                : isCyber
                ? "bg-[#00f0ff] text-[#0b0f19] hover:bg-white font-mono uppercase font-black"
                : isAdv
                ? "bg-[#eab308] text-[#24060e] hover:bg-[#fde047] font-mono uppercase font-black border border-[#111]"
                : isMonogram
                ? "bg-[#2d4a3e] hover:bg-[#233a30] text-white font-serif uppercase tracking-wider text-xs shadow-sm"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
            }`}
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-3.5 p-4 sm:p-5 rounded-xl text-left ${
        isJawa
          ? "border border-[rgba(184,134,11,0.35)] bg-[#3D2B1F] text-[#EDE0C4] shadow-2xl font-jawa-body"
          : isNoir
          ? "border border-[#262626] bg-[#0d0d0d] text-[#fafafa] shadow-2xl"
          : isCyber
          ? "border-2 border-[#00f0ff]/50 bg-[#0d1322] text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          : isAdv
          ? "border-2 border-[#eab308]/70 bg-[#2d0812] text-white shadow-[4px_4px_0px_#111]"
          : "border border-slate-200 bg-white shadow-sm"
      }`}
    >
      <div
        className={`flex items-center justify-between pb-2.5 border-b ${
          isJawa
            ? "border-[#B8860B]/25"
            : isNoir
            ? "border-[#222222]"
            : isAdv
            ? "border-[#eab308]/40"
            : isCyber
            ? "border-[#00f0ff]/30"
            : "border-slate-200/60"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
              isJawa
                ? "bg-[rgba(184,134,11,0.15)] text-[#D4A853] border border-[#B8860B]/35"
                : isNoir
                ? "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30"
                : isCyber
                ? "bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40"
                : isAdv
                ? "bg-[#eab308]/20 text-[#fde047] border border-[#eab308]/50"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            <Gift className="w-4 h-4" />
          </span>
          <div>
            <h4
              className={`text-xs sm:text-sm font-bold leading-tight ${
                isJawa
                  ? "text-[#EDE0C4] font-jawa-serif font-semibold text-base tracking-wide"
                  : isNoir
                  ? "text-[#fafafa] font-noir-serif font-light text-base tracking-wide"
                  : isCyber
                  ? "text-[#ffe600] font-mono uppercase"
                  : isAdv
                  ? "text-[#fde047] font-mono font-black uppercase drop-shadow"
                  : "text-slate-900"
              }`}
            >
              Konfirmasi Tanda Kasih Digital
            </h4>
            <p
              className={`text-[10px] ${
                isJawa
                  ? "text-[#A89078] font-jawa-body"
                  : isNoir
                  ? "text-[#888888] font-noir-sans"
                  : isAdv
                  ? "text-[#fce7f3]"
                  : isCyber
                  ? "text-gray-400 font-mono"
                  : "text-slate-400"
              }`}
            >
              Pilih rekening, salin nomor, dan kirim konfirmasi transfer
            </p>
          </div>
        </div>
      </div>

      {/* Banner Mode Demo */}
      {isDemo && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-medium border ${
            isJawa
              ? "bg-[#2D1B0E]/90 border-[rgba(184,134,11,0.4)] text-[#D4A853] font-jawa-body"
              : isNoir
              ? "bg-[#181818] border-[#2f2f2f] text-[#c9a84c] font-noir-sans"
              : isAdv
              ? "bg-[#2d0812] border-2 border-[#eab308]/70 text-[#fde047] font-mono text-[11px]"
              : isCyber
              ? "bg-[#0b0f19] border-2 border-[#00f0ff]/50 text-[#00f0ff] font-mono text-[11px]"
              : isMonogram
              ? "bg-[#faf8f5] border border-[#e2d9cc] text-[#2d4a3e] font-sans"
              : "bg-emerald-50/90 border border-emerald-200 text-emerald-800"
          }`}
        >
          <Lock className="w-4 h-4 shrink-0" />
          <span>Halaman pratinjau demo. Pengisian konfirmasi kirim kado dinonaktifkan.</span>
        </div>
      )}

      {error && (
        <div
          className={`text-xs px-3 py-2 rounded-lg ${
            isNoir
              ? "bg-red-950/40 border border-red-800/60 text-red-300 font-noir-sans"
              : "bg-rose-50 border border-rose-200 text-rose-700"
          }`}
        >
          {error}
        </div>
      )}

      {/* 1. Nama Pengirim (Terkunci otomatis dari URL /?to=Nama Tamu) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            className={`block text-[11px] font-semibold ${
              isJawa
                ? "text-[#D4A853] font-jawa-body uppercase tracking-wider text-[10px]"
                : isNoir
                ? "text-[#aaaaaa] font-noir-sans uppercase tracking-wider text-[10px]"
                : isAdv
                ? "text-[#fde047] font-mono font-bold"
                : isCyber
                ? "text-[#00f0ff] font-mono"
                : "text-slate-700"
            }`}
          >
            Nama Anda (Pengirim)
          </label>
          <span
            className={`text-[9px] font-mono flex items-center gap-1 ${
              isJawa
                ? "text-[#D4A853] font-jawa-body tracking-wider uppercase text-[8px]"
                : isNoir
                ? "text-[#c9a84c] font-noir-sans tracking-wider uppercase text-[8px]"
                : isAdv
                ? "text-[#fde047]/80"
                : isCyber
                ? "text-[#00f0ff]/80"
                : "text-slate-500"
            }`}
          >
            <Lock className="w-2.5 h-2.5" />
            <span>Terkunci otomatis</span>
          </span>
        </div>
        <input
          type="text"
          readOnly
          value={guestName || resolvedSenderName}
          className={`w-full text-xs px-3 py-2 rounded-lg border font-mono font-bold cursor-not-allowed select-none transition-colors ${
            isJawa
              ? "bg-[#2D1B0E] border border-[rgba(184,134,11,0.35)] text-[#D4A853] font-jawa-body italic shadow-inner"
              : isNoir
              ? "bg-[#141414] border border-[#262626] text-[#c9a84c] font-noir-serif italic opacity-95 shadow-inner"
              : isAdv
              ? "bg-[#180309] border-2 border-[#eab308]/60 text-[#fde047] opacity-95 shadow-inner"
              : isCyber
              ? "bg-[#080c14] border-2 border-[#00f0ff]/50 text-[#00f0ff] opacity-95 shadow-inner"
              : "border-slate-300 bg-slate-100 text-slate-800"
          }`}
        />
      </div>

      {/* 2. Pilihan Rekening Tujuan & Card Rekening Terpilih */}
      <div>
        <label
          className={`block text-[11px] font-semibold mb-1 ${
            isJawa
              ? "text-[#D4A853] font-jawa-body uppercase tracking-wider text-[10px]"
              : isNoir
              ? "text-[#aaaaaa] font-noir-sans uppercase tracking-wider text-[10px]"
              : isAdv
              ? "text-[#fde047] font-mono font-bold"
              : isCyber
              ? "text-[#00f0ff] font-mono"
              : "text-slate-700"
          }`}
        >
          Pilih Rekening / Bank Tujuan
        </label>
        {giftAccounts && giftAccounts.length > 0 ? (
          <div className="space-y-2">
            <select
              value={selectedAccount ? selectedAccount.id : selectedAccountId}
              onChange={(e) => {
                const accId = e.target.value;
                setSelectedAccountId(accId);
                const found = giftAccounts.find((a) => a.id === accId);
                if (found) {
                  setBankName(found.bankName);
                }
              }}
              className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none cursor-pointer transition-colors ${
                isJawa
                  ? "bg-[#2D1B0E] border border-[rgba(184,134,11,0.4)] text-[#EDE0C4] font-jawa-body focus:border-[#D4A853]"
                  : isNoir
                  ? "bg-[#141414] border border-[#2a2a2a] text-[#fafafa] font-noir-sans focus:border-[#c9a84c]"
                  : isAdv
                  ? "bg-[#1e050c] border-2 border-[#eab308] text-[#fde047] font-mono font-bold focus:border-[#fde047]"
                  : isCyber
                  ? "bg-[#0b0f19] border-2 border-[#00f0ff] text-white font-mono focus:border-[#ffe600]"
                  : "border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              }`}
            >
              {giftAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.bankName} — {acc.accountNo} (a.n {acc.accountName})
                </option>
              ))}
            </select>

            {/* Dynamic Card Rekening Terpilih */}
            {selectedAccount && (
              <div className="mt-2.5 animate-in fade-in-50 duration-200">
                {isJawa ? (
                  /* Jawa Kraton Theme Card */
                  <div className="bg-[#2D1B0E] border border-[rgba(184,134,11,0.35)] p-3.5 rounded-xl text-left shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-jawa-body text-[#D4A853] font-bold tracking-wider uppercase">
                        {selectedAccount.bankName}
                      </span>
                      {selectedAccount.accountName && (
                        <span className="font-jawa-body text-[11px] text-[#A89078]">
                          a.n {selectedAccount.accountName}
                        </span>
                      )}
                    </div>
                    {selectedAccount.accountNo && (
                      <div className="mt-2 flex items-center justify-between gap-2 p-2.5 bg-[#3D2B1F] rounded-lg border border-[rgba(184,134,11,0.25)]">
                        <span className="font-mono text-sm sm:text-base font-bold text-[#FDF6E3] tracking-wider select-all">
                          {selectedAccount.accountNo}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedAccount.accountNo)}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#E6C687] via-[#D4A853] to-[#B8860B] hover:brightness-105 text-[#1A0F07] font-jawa-body text-[10px] tracking-wider uppercase font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-98"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#1A0F07] stroke-[2.5]" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin No. Rekening</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    {selectedAccount.qrisUrl && (
                      <div className="my-2.5 p-2.5 bg-white rounded-lg border border-[rgba(184,134,11,0.3)] flex justify-center">
                        <img
                          src={selectedAccount.qrisUrl}
                          alt="QRIS"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : isNoir ? (
                  /* Noir Luxury Theme Card */
                  <div className="bg-[#141414] border border-[#2a2a2a] p-3.5 rounded-lg text-left shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-noir-sans text-[#c9a84c] font-semibold tracking-wider uppercase">
                        {selectedAccount.bankName}
                      </span>
                      {selectedAccount.accountName && (
                        <span className="font-noir-sans text-[11px] text-[#888888]">
                          a.n {selectedAccount.accountName}
                        </span>
                      )}
                    </div>
                    {selectedAccount.accountNo && (
                      <div className="mt-2 flex items-center justify-between gap-2 p-2.5 bg-[#0a0a0a] rounded border border-[#222222]">
                        <span className="font-mono text-sm sm:text-base font-bold text-[#fafafa] tracking-wider select-all">
                          {selectedAccount.accountNo}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedAccount.accountNo)}
                          className="px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#c9a84c] text-[#c9a84c] hover:text-[#0a0a0a] border border-[#c9a84c]/40 font-noir-sans text-[10px] tracking-wider uppercase font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#c9a84c]" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin No. Rekening</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    {selectedAccount.qrisUrl && (
                      <div className="my-2.5 p-2.5 bg-white rounded border border-[#222222] flex justify-center">
                        <img
                          src={selectedAccount.qrisUrl}
                          alt="QRIS"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : isAdv ? (
                  /* Adventure Theme Card */
                  <div className="bg-[#3b0d19] border-2 border-[#eab308]/70 p-3.5 shadow-[3px_3px_0px_#111] text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#fde047] uppercase font-mono tracking-wider">
                        {selectedAccount.bankName}
                      </span>
                      {selectedAccount.accountName && (
                        <span className="text-[10px] text-[#cbd5e1] font-mono">
                          a.n {selectedAccount.accountName}
                        </span>
                      )}
                    </div>
                    {selectedAccount.accountNo && (
                      <p className="font-mono text-base sm:text-lg font-black text-white mt-1.5 tracking-wider select-all">
                        {selectedAccount.accountNo}
                      </p>
                    )}
                    {selectedAccount.qrisUrl && (
                      <div className="my-2.5 p-2 bg-white rounded border-2 border-[#111] flex justify-center">
                        <img
                          src={selectedAccount.qrisUrl}
                          alt="QRIS"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                    )}
                    {selectedAccount.accountNo && (
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedAccount.accountNo)}
                        className="mt-2.5 w-full py-2 bg-[#24060e] hover:bg-[#eab308] hover:text-[#24060e] border border-[#eab308] text-[#fde047] text-[10px] font-mono font-black uppercase tracking-wider shadow cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>✓ BERHASIL DISALIN!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>SALIN NOMOR REKENING</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : isCyber ? (
                  /* Cyberpunk Theme Card */
                  <div className="border-2 border-[#00f0ff] bg-[#121829] p-3.5 shadow-[0_0_12px_rgba(0,240,255,0.2)] text-left">
                    <div className="flex justify-between items-center text-xs font-black text-[#00f0ff] font-mono uppercase">
                      <span>{selectedAccount.bankName}</span>
                      {selectedAccount.type && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#0b0f19] border border-[#00f0ff]/40 uppercase">
                          {selectedAccount.type}
                        </span>
                      )}
                    </div>
                    {selectedAccount.accountNo && (
                      <div className="my-2 p-2 bg-[#0b0f19] border border-gray-700 flex justify-between items-center">
                        <span className="font-mono text-xs sm:text-sm text-white font-bold tracking-wider select-all">
                          {selectedAccount.accountNo}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedAccount.accountNo)}
                          className="px-2.5 py-1 bg-[#00f0ff] text-[#0b0f19] text-[9px] font-black uppercase font-mono hover:bg-white transition-colors cursor-pointer"
                        >
                          {copied ? "TERNYALIN!" : "SALIN"}
                        </button>
                      </div>
                    )}
                    {selectedAccount.accountName && (
                      <p className="text-[10px] text-gray-300 font-mono">
                        Atas Nama: <strong className="text-white">{selectedAccount.accountName}</strong>
                      </p>
                    )}
                    {selectedAccount.qrisUrl && (
                      <div className="my-2 p-2 bg-black border border-[#00f0ff] flex justify-center">
                        <img
                          src={selectedAccount.qrisUrl}
                          alt="QRIS"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : isMonogram ? (
                  /* Modern Monogram Theme Card */
                  <div className="p-3.5 bg-[#faf8f5] border border-[#e2d9cc] rounded-xl text-left shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="text-[#2d4a3e] font-serif text-sm font-semibold">{selectedAccount.bankName}</span>
                      {selectedAccount.accountName && (
                        <span className="text-[11px] text-[#8c7e72]">
                          a.n {selectedAccount.accountName}
                        </span>
                      )}
                    </div>
                    {selectedAccount.accountNo && (
                      <div className="mt-2 flex items-center justify-between gap-2 p-2.5 bg-white rounded-lg border border-[#e2d9cc]">
                        <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 select-all">
                          {selectedAccount.accountNo}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedAccount.accountNo)}
                          className="px-3 py-1.5 bg-[#2d4a3e] hover:bg-[#233a30] text-white text-[11px] font-semibold rounded-md shadow-2xs transition-colors cursor-pointer"
                        >
                          {copied ? "✓ Tersalin" : "Salin No. Rekening"}
                        </button>
                      </div>
                    )}
                    {selectedAccount.qrisUrl && (
                      <div className="my-2.5 p-2 bg-white rounded border border-[#e2d9cc] flex justify-center">
                        <img
                          src={selectedAccount.qrisUrl}
                          alt="QRIS"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Emerald Card */
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-left shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="text-emerald-800 font-semibold">{selectedAccount.bankName}</span>
                      {selectedAccount.accountName && (
                        <span className="text-[11px] text-slate-500">
                          a.n {selectedAccount.accountName}
                        </span>
                      )}
                    </div>
                    {selectedAccount.accountNo && (
                      <div className="mt-1.5 flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-emerald-100">
                        <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 select-all">
                          {selectedAccount.accountNo}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedAccount.accountNo)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
                        >
                          {copied ? "✓ Tersalin" : "Salin No. Rekening"}
                        </button>
                      </div>
                    )}
                    {selectedAccount.qrisUrl && (
                      <div className="my-2 p-2 bg-white rounded border flex justify-center">
                        <img
                          src={selectedAccount.qrisUrl}
                          alt="QRIS"
                          className="w-36 h-36 object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="BCA / Mandiri / QRIS"
            className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none ${
              isNoir
                ? "bg-[#141414] border-[#262626] text-[#fafafa] focus:border-[#c9a84c]"
                : "border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500"
            }`}
          />
        )}
      </div>

      {/* 3. Nominal Transfer */}
      <div>
        <label
          className={`block text-[11px] font-semibold mb-1 ${
            isJawa
              ? "text-[#D4A853] font-jawa-body uppercase tracking-wider text-[10px]"
              : isNoir
              ? "text-[#aaaaaa] font-noir-sans uppercase tracking-wider text-[10px]"
              : isAdv
              ? "text-[#fde047] font-mono font-bold"
              : isCyber
              ? "text-[#00f0ff] font-mono"
              : "text-slate-700"
          }`}
        >
          Nominal Transfer (Rp)
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              disabled={isDemo}
              onClick={() => setAmount(amt)}
              className={`px-2 py-1 text-[10px] font-mono font-semibold rounded-md border transition-all ${
                isDemo ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              } ${
                Number(amount) === amt
                  ? isJawa
                    ? "bg-gradient-to-r from-[#E6C687] via-[#D4A853] to-[#B8860B] text-[#1A0F07] font-bold border-transparent shadow-[0_0_10px_rgba(212,168,83,0.35)]"
                    : isNoir
                    ? "bg-[#c9a84c] text-[#0a0a0a] font-bold border-[#c9a84c] shadow-[0_0_10px_rgba(201,168,76,0.3)]"
                    : isAdv
                    ? "bg-[#eab308] text-[#24060e] font-black border-[#eab308] shadow-xs"
                    : isCyber
                    ? "bg-[#00f0ff] text-[#0b0f19] font-black border-[#00f0ff] shadow-[0_0_8px_#00f0ff]"
                    : "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : isJawa
                  ? "bg-[#2D1B0E] text-[#EDE0C4] border border-[rgba(184,134,11,0.3)] hover:border-[#D4A853]"
                  : isNoir
                  ? "bg-[#141414] text-[#888888] border-[#262626] hover:border-[#c9a84c]/50 hover:text-[#cccccc]"
                  : isAdv
                  ? "bg-[#1e050c] text-[#fce7f3] border-[#eab308]/40 hover:bg-[#3b0d19]"
                  : isCyber
                  ? "bg-[#0b0f19] text-gray-300 border-gray-700 hover:border-[#00f0ff]"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200"
              }`}
            >
              {amt >= 1000000 ? `${amt / 1000000} Juta` : `${amt / 1000}rb`}
            </button>
          ))}
        </div>
        <div className="relative">
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold ${
              isJawa
                ? "text-[#D4A853]"
                : isNoir
                ? "text-[#c9a84c]"
                : isAdv
                ? "text-[#eab308]"
                : isCyber
                ? "text-[#00f0ff]"
                : "text-slate-400"
            }`}
          >
            Rp
          </span>
          <input
            type="number"
            min="10000"
            step="5000"
            required
            disabled={isDemo}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg border font-mono font-bold focus:outline-none transition-colors ${
              isDemo ? "cursor-not-allowed opacity-60" : ""
            } ${
              isJawa
                ? "bg-[#2D1B0E] border border-[rgba(184,134,11,0.35)] text-[#EDE0C4] focus:border-[#D4A853]"
                : isNoir
                ? "bg-[#141414] border border-[#262626] text-[#fafafa] focus:border-[#c9a84c]"
                : isAdv
                ? "bg-[#1e050c] border border-[#eab308]/60 text-[#fde047] focus:border-[#fde047]"
                : isCyber
                ? "bg-[#0b0f19] border border-[#00f0ff]/50 text-white focus:border-[#ffe600]"
                : "border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            }`}
          />
        </div>
      </div>

      {/* 4. Rekening Pengirim (Opsional) */}
      <div>
        <label
          className={`block text-[11px] font-semibold mb-1 ${
            isJawa
              ? "text-[#D4A853] font-jawa-body uppercase tracking-wider text-[10px]"
              : isNoir
              ? "text-[#aaaaaa] font-noir-sans uppercase tracking-wider text-[10px]"
              : isAdv
              ? "text-[#fde047] font-mono font-bold"
              : isCyber
              ? "text-[#00f0ff] font-mono"
              : "text-slate-700"
          }`}
        >
          Dari Rekening / E-Wallet Anda (Opsional)
        </label>
        <input
          type="text"
          disabled={isDemo}
          placeholder="Misal: BCA a.n Budi / GoPay"
          value={accountSender}
          onChange={(e) => setAccountSender(e.target.value)}
          className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none transition-colors ${
            isDemo ? "cursor-not-allowed opacity-60" : ""
          } ${
            isJawa
              ? "bg-[#2D1B0E] border border-[rgba(184,134,11,0.35)] text-[#EDE0C4] font-jawa-body placeholder:text-[#A89078] focus:border-[#D4A853]"
              : isNoir
              ? "bg-[#141414] border border-[#262626] text-[#fafafa] font-noir-sans placeholder:text-[#555555] focus:border-[#c9a84c]"
              : isAdv
              ? "bg-[#1e050c] border border-[#eab308]/60 text-white font-mono placeholder:text-gray-500 focus:border-[#fde047]"
              : isCyber
              ? "bg-[#0b0f19] border border-[#00f0ff]/50 text-white font-mono placeholder:text-gray-500 focus:border-[#ffe600]"
              : "border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          }`}
        />
      </div>

      {/* 5. Catatan / Doa Restu */}
      <div>
        <label
          className={`block text-[11px] font-semibold mb-1 ${
            isJawa
              ? "text-[#D4A853] font-jawa-body uppercase tracking-wider text-[10px]"
              : isNoir
              ? "text-[#aaaaaa] font-noir-sans uppercase tracking-wider text-[10px]"
              : isAdv
              ? "text-[#fde047] font-mono font-bold"
              : isCyber
              ? "text-[#00f0ff] font-mono"
              : "text-slate-700"
          }`}
        >
          Pesan / Doa Restu (Opsional)
        </label>
        <textarea
          rows={2}
          disabled={isDemo}
          placeholder={
            isDemo
              ? "Pengisian konfirmasi transfer dinonaktifkan pada mode demo."
              : "Selamat berbahagia untuk kedua mempelai..."
          }
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`w-full text-xs px-3 py-2 rounded-lg border focus:outline-none transition-colors resize-none ${
            isDemo ? "cursor-not-allowed opacity-60" : ""
          } ${
            isJawa
              ? "bg-[#2D1B0E] border border-[rgba(184,134,11,0.35)] text-[#EDE0C4] font-jawa-body placeholder:text-[#A89078] focus:border-[#D4A853]"
              : isNoir
              ? "bg-[#141414] border border-[#262626] text-[#fafafa] font-noir-sans placeholder:text-[#555555] focus:border-[#c9a84c]"
              : isAdv
              ? "bg-[#1e050c] border border-[#eab308]/60 text-white font-mono placeholder:text-gray-500 focus:border-[#fde047]"
              : isCyber
              ? "bg-[#0b0f19] border border-[#00f0ff]/50 text-white font-mono placeholder:text-gray-500 focus:border-[#ffe600]"
              : "border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          }`}
        />
      </div>

      {/* Tombol Aksi */}
      <div className="pt-2 flex items-center justify-end gap-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isJawa
                ? "text-[#A89078] hover:text-[#EDE0C4] font-jawa-body"
                : isNoir
                ? "text-[#888888] hover:text-[#fafafa] font-noir-sans"
                : isAdv
                ? "text-[#fce7f3] hover:bg-[#3b0d19] font-mono"
                : isCyber
                ? "text-gray-400 hover:text-white font-mono"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={loading || isDemo}
          className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-lg shadow-sm transition-all ${
            isDemo || loading ? "cursor-not-allowed" : "cursor-pointer"
          } ${
            isDemo
              ? isJawa
                ? "bg-[#2D1B0E] border border-[rgba(184,134,11,0.3)] text-[#A89078] font-jawa-body uppercase tracking-wider opacity-75"
                : isNoir
                ? "bg-[#141414] border border-[#262626] text-[#888888] font-noir-sans uppercase opacity-75"
                : isAdv
                ? "bg-[#1e050c] border-2 border-[#eab308]/40 text-[#fde047]/60 font-mono font-bold uppercase opacity-75"
                : isCyber
                ? "bg-[#0b0f19] border-2 border-[#00f0ff]/30 text-gray-500 font-mono font-bold uppercase opacity-75"
                : isMonogram
                ? "bg-slate-100 border border-[#e2d9cc] text-slate-500 font-sans opacity-75"
                : "bg-slate-100 border border-emerald-200/60 text-slate-500 opacity-75"
              : isJawa
              ? "bg-gradient-to-r from-[#E6C687] via-[#D4A853] to-[#B8860B] hover:brightness-105 text-[#1A0F07] font-jawa-body font-bold tracking-wider uppercase shadow-md active:scale-98"
              : isNoir
              ? "bg-[#c9a84c] hover:bg-[#dfbe65] text-[#0a0a0a] font-noir-sans font-semibold tracking-wider uppercase shadow-md"
              : isCyber
              ? "bg-[#00f0ff] hover:bg-white text-[#0b0f19] font-mono font-black uppercase"
              : isAdv
              ? "bg-[#eab308] hover:bg-[#fde047] text-[#24060e] font-mono font-black uppercase border-2 border-[#111] shadow-[2px_2px_0px_#111]"
              : isMonogram
              ? "bg-[#2d4a3e] hover:bg-[#233a30] text-white font-serif tracking-wider text-xs shadow-md active:scale-98"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {isDemo ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Konfirmasi Kirim Kado Dinonaktifkan (Mode Demo)</span>
            </>
          ) : loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Konfirmasi Tanda Kasih</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

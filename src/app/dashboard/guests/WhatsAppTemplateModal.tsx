"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  MessageCircle,
  Sparkles,
  RotateCcw,
  Check,
  Info,
  Loader2,
  Copy,
} from "lucide-react";

export const DEFAULT_WA_TEMPLATE = `Kepada Yth.
Bapak/Ibu/Saudara/i: *{nama}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir di acara pernikahan kami:

💍 *{mempelai}*

Untuk detail informasi acara dan konfirmasi kehadiran, silakan kunjungi tautan undangan resmi berikut:
🔗 {link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`;

interface WhatsAppTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingId: string;
  currentTemplate?: string | null;
  coupleTitle?: string;
  weddingSlug: string;
  onSaved: (newTemplate: string) => void;
}

export function WhatsAppTemplateModal({
  isOpen,
  onClose,
  weddingId,
  currentTemplate,
  coupleTitle = "Arthur & Guinevere",
  weddingSlug,
  onSaved,
}: WhatsAppTemplateModalProps) {
  const [template, setTemplate] = useState(currentTemplate || DEFAULT_WA_TEMPLATE);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTemplate(currentTemplate || DEFAULT_WA_TEMPLATE);
      setSavedSuccess(false);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "unset";
      };
    }
  }, [isOpen, currentTemplate]);

  if (!isOpen) return null;

  const insertVariable = (variable: string) => {
    if (!textareaRef.current) {
      setTemplate((prev) => prev + " " + variable);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const nextText = text.substring(0, start) + variable + text.substring(end);
    setTemplate(nextText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + variable.length,
          start + variable.length
        );
      }
    }, 0);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wedding/${weddingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappMessage: template }),
      });
      if (res.ok) {
        onSaved(template);
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error("Gagal menyimpan template WhatsApp:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    setTemplate(DEFAULT_WA_TEMPLATE);
    setConfirmReset(false);
  };

  // Preview formatting
  const origin = typeof window !== "undefined" ? window.location.origin : "https://hayvows.com";
  const dummyUrl = `${origin}/invitation/${weddingSlug}/budi-santoso`;
  const previewText = template
    .replace(/\{nama\}/g, "Budi Santoso")
    .replace(/\{mempelai\}/g, coupleTitle || "Kedua Mempelai")
    .replace(/\{link\}/g, dummyUrl)
    .replace(/\{meja\}/g, "Meja VIP 01")
    .replace(/\{alamat\}/g, "Jakarta Selatan")
    .replace(/\{sesi\}/g, "Sesi 1 (09:00 - 11:30)");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-900 to-[#1e332a] text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Kustomisasi Template Pesan WhatsApp</h2>
              <p className="text-[11px] text-emerald-200/80">
                Pesan ini otomatis disesuaikan dengan data nama &amp; link tiap tamu saat dikirim.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (2 Columns on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto flex-1">
          {/* Left Column: Editor & Variable Pills */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1.5">
                <span>Variabel Dinamis (Klik untuk menyisipkan)</span>
                <span className="text-[10px] text-slate-400 font-normal">Otomatis diganti per tamu</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { tag: "{nama}", desc: "Nama Tamu" },
                  { tag: "{mempelai}", desc: "Nama Mempelai" },
                  { tag: "{link}", desc: "Link Undangan Tamu" },
                  { tag: "{meja}", desc: "Nomor Meja" },
                  { tag: "{alamat}", desc: "Domisili Tamu" },
                  { tag: "{sesi}", desc: "Sesi Acara" },
                ].map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => insertVariable(item.tag)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-50 hover:bg-emerald-100 text-[#2d4a3e] border border-emerald-200 transition-colors cursor-pointer"
                    title={`Sisipkan ${item.desc}`}
                  >
                    <span className="font-bold">{item.tag}</span>
                    <span className="text-[10px] text-slate-500 font-sans">({item.desc})</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1.5">
                <span>Teks Format Pesan</span>
                <span className="text-[10px] text-slate-400">Gunakan *teks* untuk tebal, _teks_ untuk miring</span>
              </label>
              <textarea
                ref={textareaRef}
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={11}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d4a3e] focus:border-transparent transition-all leading-relaxed resize-none"
                placeholder="Tuliskan format pesan undangan..."
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleReset}
                className={`inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                  confirmReset
                    ? "text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{confirmReset ? "Klik lagi untuk reset ke template awal" : "Reset ke Bawaan"}</span>
              </button>

              <span className="text-[11px] text-slate-400">
                {template.length} karakter
              </span>
            </div>
          </div>

          {/* Right Column: Live WhatsApp Bubble Simulator */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-100/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Simulasi Tampilan WhatsApp</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Pratinjau Nyata
                </span>
              </div>

              {/* Chat Container Mockup */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-[#e5ddd5]">
                {/* WA Top Bar */}
                <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                      💍
                    </div>
                    <div>
                      <p className="text-[11px] font-bold leading-none">{coupleTitle}</p>
                      <p className="text-[8px] text-white/70 leading-tight">Undangan Pernikahan</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-white/80 font-mono">10:45</span>
                </div>

                {/* WA Bubble Area */}
                <div className="p-3.5 space-y-2">
                  <div className="max-w-[90%] bg-white rounded-lg rounded-tl-none p-3 shadow-xs text-[11px] text-slate-800 leading-relaxed whitespace-pre-wrap font-sans relative">
                    {previewText}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                      <span>10:45</span>
                      <span className="text-sky-500 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200/80">
                <Info className="w-4 h-4 text-[#2d4a3e] shrink-0 mt-0.5" />
                <p>
                  Setiap kali Anda menekan tombol <strong>&ldquo;Kirim&rdquo;</strong> atau <strong>&ldquo;Salin WA&rdquo;</strong> di daftar tamu, sistem otomatis mengisi <code>{`{nama}`}</code> dan <code>{`{link}`}</code> sesuai tamu terpilih.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={loading || savedSuccess}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#2d4a3e] hover:bg-[#233a30] active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simpan Template</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

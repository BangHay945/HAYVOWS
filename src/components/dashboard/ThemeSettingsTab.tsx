"use client";

import React from "react";
import {
  Sparkles,
  Check,
  Eye,
  Sliders,
  Layers,
  Clock,
  CheckCircle2,
  MessageSquare,
  Gift,
  Save,
  Palette,
  ShieldCheck,
} from "lucide-react";
import {
  getColorwaysForTemplate,
  getThemeFamilyLabel,
  COLORWAY_PRESETS,
  type ColorwayPreset,
} from "@/lib/wedding/themeConfig";
import type { ThemeConfig } from "@/types/wedding";

export { COLORWAY_PRESETS };

interface ThemeSettingsTabProps {
  themeConfig: ThemeConfig;
  onChange: (config: ThemeConfig) => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
  templateName?: string;
  templateSlug?: string;
}

export default function ThemeSettingsTab({
  themeConfig,
  onChange,
  onSave,
  saving,
  templateName = "Cinematic Editorial",
  templateSlug = "cinematic-editorial",
}: ThemeSettingsTabProps) {
  const colorways = React.useMemo(() => {
    const list = getColorwaysForTemplate(templateSlug);
    return list && list.length > 0 ? list : COLORWAY_PRESETS;
  }, [templateSlug]);

  const themeFamily = React.useMemo(
    () => getThemeFamilyLabel(templateSlug),
    [templateSlug]
  );

  const activeColorway = (themeConfig.colorway || colorways[0]?.id || "champagne");

  const sections = {
    countdown: themeConfig.sections?.countdown !== false,
    story: themeConfig.sections?.story !== false,
    gallery: themeConfig.sections?.gallery !== false,
    rsvp: themeConfig.sections?.rsvp !== false,
    messages: themeConfig.sections?.messages !== false,
    gift: themeConfig.sections?.gift !== false,
  };

  const handleSelectColorway = (id: string) => {
    onChange({
      ...themeConfig,
      colorway: id,
    });
  };

  const handleToggleSection = (key: keyof typeof sections) => {
    onChange({
      ...themeConfig,
      sections: {
        ...sections,
        [key]: !sections[key],
      },
    });
  };

  return (
    <form onSubmit={onSave} className="space-y-8">
      {/* ── HEADER CARD ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#1e2025] rounded-2xl p-5 sm:p-6 text-white border border-slate-700/60 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-[#e8d5b5]/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8d5b5]/15 border border-[#e8d5b5]/30 text-[#e8d5b5] text-[11px] font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hayvows Curated Styling</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight">
              Kustomisasi Tampilan &amp; Tema
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sesuaikan palet aksen dan sembunyikan atau tampilkan bagian undangan. Setiap opsi telah dikurasi oleh desainer untuk menjamin keindahan sinematik 60 FPS di layar ponsel tamu.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs text-slate-300">
            <Palette className="w-4 h-4 text-[#e8d5b5]" />
            <span>Tema: <strong className="text-white font-medium">{templateName}</strong></span>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: CURATED COLORWAY PRESETS ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#2d4a3e]/10 text-[#2d4a3e] flex items-center justify-center text-xs font-semibold">
                  1
                </span>
                <span>Pilihan Nuansa Warna (*Curated Colorways*)</span>
              </h3>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {themeFamily}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pilih satu dari 4 palet khusus untuk tema <strong>{templateName}</strong>. Seluruh tombol, border halus, dan sorotan teks otomatis berganti serasi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {colorways.map((color) => {
            const isSelected = activeColorway === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => handleSelectColorway(color.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between gap-3 group ${
                  isSelected
                    ? `border-slate-900 bg-slate-900/5 ring-2 ${color.ringColor} shadow-xs`
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-2.5">
                    {/* Gradient color disc */}
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${color.gradient} shadow-inner shrink-0 border border-white/40`}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{color.name}</span>
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {color.accent}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {color.tagline}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "border border-slate-300 text-transparent group-hover:border-slate-400"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {color.description}
                </p>

                {/* Accent preview bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    className="h-full w-2/3"
                    style={{ backgroundColor: color.accent }}
                  />
                  <div
                    className="h-full w-1/3"
                    style={{ backgroundColor: color.accentDark }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: SECTION TOGGLES (VISIBILITAS) ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#2d4a3e]/10 text-[#2d4a3e] flex items-center justify-center text-xs">
                2
              </span>
              <span>Visibilitas Bagian Undangan (*Section Toggles*)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Matikan atau hidupkan bagian undangan yang diinginkan. Bagian Cerita Cinta &amp; Galeri Foto diatur langsung pada tab form masing-masing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* 1. Countdown */}
          <div className="p-4 rounded-xl border border-slate-200/90 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Hitung Mundur (Countdown)</h4>
                <p className="text-[11px] text-slate-500">Hitung mundur hari H pernikahan</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection("countdown")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                sections.countdown ? "bg-[#2d4a3e]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  sections.countdown ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 4. RSVP */}
          <div className="p-4 rounded-xl border border-slate-200/90 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Konfirmasi Kehadiran (RSVP)</h4>
                <p className="text-[11px] text-slate-500">Formulir kehadiran tamu &amp; pax</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection("rsvp")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                sections.rsvp ? "bg-[#2d4a3e]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  sections.rsvp ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 5. Messages / Guestbook */}
          <div className="p-4 rounded-xl border border-slate-200/90 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Buku Tamu &amp; Untaian Doa</h4>
                <p className="text-[11px] text-slate-500">Kolom ucapan doa restu dari para tamu</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection("messages")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                sections.messages ? "bg-[#2d4a3e]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  sections.messages ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 6. Gift / Amplop */}
          <div className="p-4 rounded-xl border border-slate-200/90 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Amplop Digital &amp; Hadiah</h4>
                <p className="text-[11px] text-slate-500">Nomor rekening bank &amp; dompet digital</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSection("gift")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                sections.gift ? "bg-[#2d4a3e]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  sections.gift ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── SAVE ACTION BAR ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60 min-h-[44px]"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menyimpan Pengaturan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Tema</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

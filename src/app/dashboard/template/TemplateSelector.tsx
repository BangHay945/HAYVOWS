"use client";
import { useState } from "react";
import Link from "next/link";
import type { Template } from "@prisma/client";
import {
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Gamepad2,
  Check,
  Play,
  Flower2,
  Palette,
  Globe,
  Lock,
  Layers,
  Crown,
  Landmark,
} from "lucide-react";
import { MonogramSeal } from "@/templates/modern-monogram/components/MonogramSeal";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import {
  getRequiredPlan,
  isPlanAllowed,
  ARCHETYPES,
  ARCHETYPE_LIST,
  getTemplateArchetype,
  type TemplateArchetype,
} from "@/lib/templates";

interface RichTemplateDetail {
  slug: string;
  iconBg: string;
  categoryTag: string;
  categoryStyle: string;
  versionTag: string;
  bannerImage?: string;
  highlights: string[];
  demoPath: string;
}


const THEME_EXTRAS: Record<string, RichTemplateDetail> = {
  "modern-monogram": {
    slug: "modern-monogram",
    iconBg: "bg-[#2d4a3e] text-[#c5a880]",
    categoryTag: "Paket Basic",
    categoryStyle: "bg-amber-50 text-[#2d4a3e] border-[#c5a880]/50",
    versionTag: "v1.0.0 • Basic Edition",
    bannerImage: "/assets/templates/modern-monogram/banner.jpg",
    highlights: [
      "Tipografi: Monogram Elegan & Desain Clean Editorial",
      "Fitur Paket Basic: Musik Romantis & Countdown Acara",
      "Navigasi: Petunjuk Arah Google Maps Langsung",
    ],
    demoPath: "/invitation/adrian-nadia/budi-santoso",
  },
  "pixel-cyberpunk": {
    slug: "pixel-cyberpunk",
    iconBg: "bg-slate-950 text-cyan-400",
    categoryTag: "Paket Exclusive",
    categoryStyle: "bg-slate-900 text-cyan-300 border-cyan-500/30",
    versionTag: "v2.4.0 • RPG 2D",
    bannerImage: "/assets/templates/pixel-cyberpunk/banner.jpg",
    highlights: [
      "Gerakan Mulus: WASD, Virtual Joystick, & Auto-walk",
      "7 NPC Interaktif: Mempelai, RSVP, Galeri, Kado, Jam",
      "Audio: Cyberpunk Synthwave Loop Edition",
    ],
    demoPath: "/invitation/neo-2077/budi-santoso",
  },
  "nature-floral": {
    slug: "nature-floral",
    iconBg: "bg-[#2d4a3e] text-[#fbf8f3]",
    categoryTag: "Paket Populer",
    categoryStyle: "bg-emerald-50 text-emerald-800 border-emerald-200",
    versionTag: "v1.0.0 • Floral Edition",
    bannerImage: "/assets/templates/nature-floral/banner.jpg",
    highlights: [
      "Tipografi: Playfair Display Serif & Desain Botani Mewah",
      "11 Komponen: Cover, Kisah, RSVP, Kado, Galeri, dsb.",
      "Audio: Gentle Chime & Harp Arpeggio Synthesizer",
    ],
    demoPath: "/invitation/dimas-anindya/budi-santoso",
  },
  "pixel-adventure": {
    slug: "pixel-adventure",
    iconBg: "bg-amber-950 text-amber-300",
    categoryTag: "Paket Exclusive",
    categoryStyle: "bg-slate-900 text-[#c9a84c] border-[#c9a84c]/30",
    versionTag: "v1.0.0 • Pulau Langit",
    bannerImage: "/assets/templates/pixel-adventure/banner.jpg",
    highlights: [
      "Eksplorasi: Peta Pulau Langit 2.5D Isometrik",
      "Interaktif: 5 NPC Bicara & Buka Fitur Undangan",
      "Audio: Chiptune 8-Bit Retro BGM",
    ],
    demoPath: "/invitation/alex-sara/budi-santoso",
  },
  "pixel-rpg": {
    slug: "pixel-rpg",
    iconBg: "bg-indigo-950 text-amber-300",
    categoryTag: "Retro Classic",
    categoryStyle: "bg-indigo-50 text-indigo-800 border-indigo-200",
    versionTag: "v1.8.2 • 16-Bit JRPG",
    highlights: [
      "Gerakan: 8-Direction Sprite Top-Down RPG",
      "Lokasi: Fantasy Royal Ballroom & Courtyard",
      "Audio: Chiptune Romantic Melody",
    ],
    demoPath: "/invitation/alex-sara?tpl=pixel-rpg",
  },
  "vintage-royal": {
    slug: "vintage-royal",
    iconBg: "bg-[#2d4a3e] text-[#dfc49e]",
    categoryTag: "Paket Populer",
    categoryStyle: "bg-emerald-50 text-emerald-800 border-emerald-200",
    versionTag: "v1.0.0 • Editorial",
    highlights: [
      "Audio: Classical Strings & Piano Romance",
      "Fitur: Digital Envelope Wax Seal & Gold Lettering",
      "Estetika: Floral Architecture & Glasshouse Garden",
    ],
    demoPath: "/invitation/alex-sara?tpl=vintage-royal",
  },
  "eternal-noir": {
    slug: "eternal-noir",
    iconBg: "bg-[#0a0a0a] text-[#c9a84c]",
    categoryTag: "Paket Exclusive",
    categoryStyle: "bg-slate-950 text-[#c9a84c] border-[#c9a84c]/30",
    versionTag: "v1.0.0 • Eternal Noir",
    bannerImage: "/assets/templates/eternal-noir/banner.jpg",
    highlights: [
      "Tipografi: Cormorant Garamond Ultra-Elegan & Montserrat",
      "Efek: Grayscale Auto-Convert + Hover De-Grayscale Galeri",
      "Navigasi: Dot Nav Sidebar & Full-Page Smooth Scroll",
    ],
    demoPath: "/invitation/eleanor-xavier/budi-santoso",
  },
  "royal-emerald": {
    slug: "royal-emerald",
    iconBg: "bg-[#02241b] text-[#ffd700]",
    categoryTag: "Paket Exclusive",
    categoryStyle: "bg-emerald-950 text-[#ffd700] border-[#d4af37]/40",
    versionTag: "v1.0.0 • Royal Emerald",
    bannerImage: "/assets/templates/eternal-noir/banner.jpg",
    highlights: [
      "Estetika: Emerald Velvet Aristokrat & Emas Bangsawan",
      "Ornamen: Mahkota Kerajaan, Sudut Baroque, & Monogram Emas",
      "Tata Letak: Sinematik Split Desktop & 12 Komponen Lengkap",
    ],
    demoPath: "/invitation/arthur-guinevere/budi-santoso",
  },
  "batik-jawa": {
    slug: "batik-jawa",
    iconBg: "bg-[#3D2B1F] text-[#D4A853]",
    categoryTag: "Paket Populer",
    categoryStyle: "bg-amber-100 text-amber-900 border-amber-300",
    versionTag: "v1.0.0 • Adat Jawa",
    bannerImage: "/assets/templates/batik-jawa/banner.jpg",
    highlights: [
      "Ornamen: Gunungan Wayang & Motif Kawung SVG Inline",
      "Tipografi: Prasasti IM Fell English & Lora Editorial",
      "Audio: Gamelan Jawa Klasik & Ladrang Wilujeng",
    ],
    demoPath: "/invitation/prasetyo-kinanti/budi-santoso",
  },
};

export default function TemplateSelector({
  weddingId,
  currentTemplateId,
  templates,
  userPlan = "basic",
  userRole = "client",
  weddingTitle,
}: {
  weddingId?: string | null;
  currentTemplateId?: string;
  templates: Template[];
  userPlan?: string;
  userRole?: string;
  weddingTitle?: string;
}) {
  const [templateList, setTemplateList] = useState<Template[]>(templates);
  const [selectedArchetype, setSelectedArchetype] = useState<string>("all");
  const [selectedId, setSelectedId] = useState(currentTemplateId || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [togglingStatusId, setTogglingStatusId] = useState<string | null>(null);
  const [adminFeedback, setAdminFeedback] = useState<string | null>(null);

  const displayedTemplates = templateList.filter((t) => {
    if (selectedArchetype === "all") return true;
    return getTemplateArchetype(t.slug) === selectedArchetype;
  });

  const handleToggleAdminOnly = async (tplId: string, currentAdminOnly: boolean) => {
    const nextAdminOnly = !currentAdminOnly;
    setTogglingStatusId(tplId);
    setAdminFeedback(null);
    try {
      const res = await fetch("/api/admin/templates/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: tplId, adminOnly: nextAdminOnly }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTemplateList((prev) =>
          prev.map((t) => (t.id === tplId ? { ...t, adminOnly: nextAdminOnly } : t))
        );
        setAdminFeedback(data.message);
        setTimeout(() => setAdminFeedback(null), 4000);
      } else {
        alert(data.error || "Gagal memperbarui status tema.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setTogglingStatusId(null);
    }
  };

  const handleSelect = async (id: string) => {
    if (!weddingId) return;
    setSelectedId(id);
    setSaving(true);
    setSuccess(false);
    const res = await fetch(`/api/wedding/${weddingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: id }),
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-wider font-semibold text-emerald-700 uppercase mb-1">
            Katalog Tema &amp; Gameplay RPG
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pilihan Template Undangan
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pilih tema desain visual dan mode interaktif untuk undangan Anda. Uji coba langsung gameplay sebelum menerbitkan.
          </p>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{templateList.length} Tema Siap Pakai</span>
          </span>
        </div>
      </div>

      {/* Admin Feedback Banner */}
      {adminFeedback && (
        <div className="bg-slate-900 border border-slate-700 text-amber-300 text-xs px-4 py-3 rounded-xl flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-white">{adminFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setAdminFeedback(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            Template undangan berhasil diperbarui dan diterapkan ke halaman live!
          </span>
        </div>
      )}

      {/* 5 Archetype Pillar Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedArchetype("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedArchetype === "all"
                ? "bg-[#2d4a3e] text-white shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Tipe</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedArchetype === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {templateList.length}
            </span>
          </button>
          {ARCHETYPE_LIST.map((arch) => {
            const isSelected = selectedArchetype === arch.id;
            const count = templateList.filter((t) => getTemplateArchetype(t.slug) === arch.id).length;
            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => setSelectedArchetype(arch.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#2d4a3e] text-white shadow-xs"
                    : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                <span>{arch.badge.split(" ")[0]}</span>
                <span>{arch.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Archetype Insight Banner */}
        {selectedArchetype !== "all" && ARCHETYPES[selectedArchetype as TemplateArchetype] && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs animate-in fade-in duration-200 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ARCHETYPES[selectedArchetype as TemplateArchetype].tagColor}`}>
                  {ARCHETYPES[selectedArchetype as TemplateArchetype].badge}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Pilar: {ARCHETYPES[selectedArchetype as TemplateArchetype].name}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {displayedTemplates.length} tema aktif dalam kategori ini
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {ARCHETYPES[selectedArchetype as TemplateArchetype].description}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
              {ARCHETYPES[selectedArchetype as TemplateArchetype].traits.map((trait, i) => (
                <span key={i} className="text-[10px] font-medium bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/70 flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{trait}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {displayedTemplates.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <p className="text-sm font-bold text-slate-800">Belum Ada Tema di Pilar Ini</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Varian tema turunan baru untuk pilar ini sedang dalam tahap kurasi desain. Silakan pilih pilar lainnya.
          </p>
        </div>
      ) : (
        /* 3-Card Template Grid (Matching DesainPakeAI prototype) */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedTemplates.map((tpl) => {
          const extra = THEME_EXTRAS[tpl.slug] || {
            slug: tpl.slug,
            iconBg: "bg-slate-900 text-slate-100",
            categoryTag: "Interactive",
            categoryStyle: "bg-slate-50 text-slate-700 border-slate-200",
            versionTag: `v${tpl.version}`,
            highlights: [
              "Fitur Interaktif & Responsif",
              "Background Music Player",
              "Buku Doa Tamu Terintegrasi",
            ],
            demoPath: `/invitation/alex-sara?tpl=${tpl.slug}`,
          };

          const isCurrent = Boolean(weddingId && selectedId === tpl.id);
          const reqPlan = getRequiredPlan(tpl.slug);
          const isAllowed = isPlanAllowed(reqPlan, userPlan, userRole);
          const isAdminOnly = Boolean((tpl as any).adminOnly);
          const archKey = getTemplateArchetype(tpl.slug);
          const archMeta = ARCHETYPES[archKey] || ARCHETYPES.minimalist;

          return (
            <div
              key={tpl.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs ${
                isAdminOnly
                  ? "border-amber-400/80 ring-1 ring-amber-400/30"
                  : isCurrent
                  ? "border-[#2d4a3e] ring-2 ring-[#2d4a3e]/15 shadow-md"
                  : "border-slate-200/90 hover:border-[#2d4a3e]/40 hover:shadow-xs"
              }`}
            >
              <div>
                {/* Super Admin Staging Strip */}
                {userRole === "admin" && (
                  <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      {isAdminOnly ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                          <span>Draft / Uji Coba Admin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                          <Globe className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Publik (Live)</span>
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleAdminOnly(tpl.id, isAdminOnly)}
                      disabled={togglingStatusId === tpl.id}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        isAdminOnly
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white"
                      }`}
                    >
                      {togglingStatusId === tpl.id
                        ? "..."
                        : isAdminOnly
                        ? "🚀 Terbitkan ke Publik"
                        : "🔒 Tarik ke Draft"}
                    </button>
                  </div>
                )}
                {/* Hero Banner Visual */}
                <div
                  className={`h-40 flex items-center justify-center border-b border-slate-100 select-none relative overflow-hidden ${extra.iconBg}`}
                >
                  {extra.bannerImage ? (
                    <>
                      <img
                        src={extra.bannerImage}
                        alt={tpl.name}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                      <div
                        className={`absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs border text-[10px] font-mono font-bold ${
                          tpl.slug === "eternal-noir"
                            ? "border-[#c9a84c]/40 text-[#c9a84c]"
                            : tpl.slug === "nature-floral"
                            ? "border-emerald-400/50 text-emerald-300"
                            : tpl.slug === "batik-jawa"
                            ? "border-amber-600/50 text-amber-300"
                            : tpl.slug === "modern-monogram"
                            ? "border-[#c5a880]/50 text-[#fef08a]"
                            : tpl.slug.includes("cyber")
                            ? "border-cyan-400/40 text-cyan-300"
                            : "border-amber-400/40 text-amber-300"
                        }`}
                      >
                        <Sparkles
                          className={`w-3 h-3 ${
                            tpl.slug === "eternal-noir"
                              ? "text-[#c9a84c]"
                              : tpl.slug === "nature-floral"
                              ? "text-emerald-400"
                              : tpl.slug === "batik-jawa"
                              ? "text-amber-400"
                              : tpl.slug === "modern-monogram"
                              ? "text-[#fef08a]"
                              : tpl.slug.includes("cyber")
                              ? "text-cyan-400"
                              : "text-amber-300"
                          }`}
                        />
                        <span>
                          {tpl.slug === "eternal-noir"
                            ? "Live Editorial Split View"
                            : tpl.slug === "nature-floral"
                            ? "Live Botanical Split View"
                            : tpl.slug === "batik-jawa"
                            ? "Live Kraton Heritage Split View"
                            : tpl.slug === "modern-monogram"
                            ? "Live Monogram Crest View"
                            : tpl.slug.includes("cyber")
                            ? "Live Skyline Map"
                            : "Live Pulau Langit Map"}
                        </span>
                      </div>
                    </>
                  ) : tpl.slug === "modern-monogram" ? (
                    <MonogramSeal
                      groomInitial="A"
                      brideInitial="N"
                      year={2026}
                      size="md"
                      variant="crest"
                    />
                  ) : tpl.slug === "eternal-noir" ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-[#c9a84c] font-serif text-2xl font-light tracking-[0.3em]">
                        ETERNAL
                      </div>
                      <div className="w-10 h-px bg-[#c9a84c]/60" />
                      <div className="text-[#c9a84c] font-serif text-2xl font-light tracking-[0.3em]">
                        NOIR
                      </div>
                    </div>
                  ) : tpl.slug === "nature-floral" || tpl.slug === "vintage-royal" ? (
                    <Flower2 className="w-12 h-12 text-[#fef08a]" />
                  ) : tpl.slug.includes("cyber") ? (
                    <Sparkles className="w-12 h-12 text-cyan-300" />
                  ) : (
                    <Gamepad2 className="w-12 h-12 text-amber-300" />
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${archMeta.tagColor}`}>
                        {archMeta.badge}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${extra.categoryStyle}`}
                      >
                        {extra.categoryTag}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {extra.versionTag}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                      <span>{tpl.name}</span>
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-3">
                      {tpl.description ||
                        "Tema interaktif dengan visual responsif dan gameplay yang menghibur tamu undangan."}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                    {extra.highlights.map((hl, idx) => (
                      <div key={idx} className="truncate">
                        {hl}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 grid grid-cols-2 gap-2">
                {isCurrent ? (
                  <button
                    disabled
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-[#2d4a3e] border border-emerald-200/80 cursor-default"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tema Dipilih</span>
                  </button>
                ) : !isAllowed ? (
                  <button
                    type="button"
                    onClick={() => setUpgradeModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-2 text-[11px] font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-[#fef08a] shadow-2xs transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                    <span>
                      {reqPlan === "luxury"
                        ? "Perlu Paket Exclusive"
                        : reqPlan === "premium"
                        ? "Perlu Paket Populer"
                        : "Perlu Paket Basic"}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelect(tpl.id)}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-white shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pilih Tema Ini</span>
                  </button>
                )}

                <Link
                  href={extra.demoPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <Play className="w-3 h-3 text-slate-500 fill-slate-400" />
                  <span>Uji Coba Demo</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      )}

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={userPlan}
        weddingId={weddingId || undefined}
        weddingTitle={weddingTitle}
      />
    </div>
  );
}

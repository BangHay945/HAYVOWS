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
} from "lucide-react";
import { MonogramSeal } from "@/templates/modern-monogram/components/MonogramSeal";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { Lock } from "lucide-react";

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
    categoryTag: "Elegance & Luxury",
    categoryStyle: "bg-amber-50 text-amber-900 border-amber-200",
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


const getRequiredPlan = (slug: string): "basic" | "premium" | "luxury" => {
  if (slug === "eternal-noir" || slug === "pixel-adventure" || slug === "pixel-cyberpunk" || slug === "pixel-rpg") return "luxury";
  if (slug === "nature-floral" || slug === "vintage-royal" || slug === "batik-jawa") return "premium";
  return "basic";
};

const isPlanAllowed = (reqPlan: string, curPlan: string, role: string) => {
  if (role === "admin") return true;
  if (reqPlan === "basic") return true;
  if (reqPlan === "premium") return curPlan === "premium" || curPlan === "luxury";
  if (reqPlan === "luxury") return curPlan === "luxury";
  return false;
};

export default function TemplateSelector({
  weddingId,
  currentTemplateId,
  templates,
  userPlan = "basic",
  userRole = "client",
}: {
  weddingId?: string | null;
  currentTemplateId?: string;
  templates: Template[];
  userPlan?: string;
  userRole?: string;
}) {
  const [selectedId, setSelectedId] = useState(currentTemplateId || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

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
            <span>{templates.length} Tema Siap Pakai</span>
          </span>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            Template undangan berhasil diperbarui dan diterapkan ke halaman live!
          </span>
        </div>
      )}

      {/* 3-Card Template Grid (Matching DesainPakeAI prototype) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => {
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

          return (
            <div
              key={tpl.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs ${
                isCurrent
                  ? "border-[#2d4a3e] ring-2 ring-[#2d4a3e]/15 shadow-md"
                  : "border-slate-200/90 hover:border-[#2d4a3e]/40 hover:shadow-xs"
              }`}
            >
              <div>
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
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${extra.categoryStyle}`}
                    >
                      {extra.categoryTag}
                    </span>
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

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={userPlan}
      />
    </div>
  );
}

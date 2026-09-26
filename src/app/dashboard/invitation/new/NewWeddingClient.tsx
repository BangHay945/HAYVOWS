"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Crown,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import {
  getRequiredPlan,
  isPlanAllowed,
  ARCHETYPES,
  ARCHETYPE_LIST,
  getTemplateArchetype,
  type SubscriptionTier,
  type TemplateArchetype,
} from "@/lib/templates";

interface Template {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

interface NewWeddingClientProps {
  initialTemplates: Template[];
  userPlan: string;
  userRole: string;
}

export function NewWeddingClient({
  initialTemplates,
  userPlan = "basic",
  userRole = "client",
}: NewWeddingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTemplate = searchParams.get("template");

  const [selectedArchetype, setSelectedArchetype] = useState<string>("all");
  const [slug, setSlug] = useState("");
  const [templateId, setTemplateId] = useState<string>(() => {
    if (initialTemplates.length === 0) return "";
    const match = initialTemplates.find(
      (t) => t.id === preselectedTemplate || t.slug === preselectedTemplate
    );
    if (match) {
      const req = getRequiredPlan(match.slug);
      if (isPlanAllowed(req, userPlan, userRole)) return match.id;
    }
    // Default to first allowed template
    const firstAllowed = initialTemplates.find((t) =>
      isPlanAllowed(getRequiredPlan(t.slug), userPlan, userRole)
    );
    return firstAllowed ? firstAllowed.id : initialTemplates[0].id;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [targetUpgradePlan, setTargetUpgradePlan] = useState<string>("premium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate selected template permission
    const selectedTpl = initialTemplates.find((t) => t.id === templateId);
    if (selectedTpl && userRole !== "admin") {
      const reqPlan = getRequiredPlan(selectedTpl.slug);
      if (!isPlanAllowed(reqPlan, userPlan, userRole)) {
        setError(
          `Template "${selectedTpl.name}" memerlukan Paket ${reqPlan.toUpperCase()}. Silakan upgrade paket akun Anda terlebih dahulu.`
        );
        setLoading(false);
        setTargetUpgradePlan(reqPlan);
        setUpgradeModalOpen(true);
        return;
      }
    }

    try {
      const res = await fetch("/api/wedding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, templateId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal membuat undangan");
        setLoading(false);
        return;
      }
      router.push(`/dashboard/invitation/${data.id}`);
    } catch {
      setError("Terjadi kesalahan koneksi");
      setLoading(false);
    }
  };

  const getDemoUrl = (tpl: Template) => {
    if (tpl.slug === "pixel-cyberpunk") {
      return "/invitation/neo-2077/budi-santoso";
    }
    if (tpl.slug === "eternal-noir") {
      return "/invitation/eleanor-xavier/budi-santoso";
    }
    if (tpl.slug === "royal-emerald") {
      return "/invitation/arthur-guinevere/budi-santoso";
    }
    if (tpl.slug === "nature-floral") {
      return "/invitation/dimas-anindya/budi-santoso";
    }
    if (tpl.slug === "batik-jawa") {
      return "/invitation/prasetyo-kinanti/budi-santoso";
    }
    if (tpl.slug === "modern-monogram") {
      return "/invitation/adrian-nadia/budi-santoso";
    }
    return `/invitation/alex-sara/budi-santoso?tpl=${tpl.slug}`;
  };

  const handleSelectTemplate = (tpl: Template) => {
    const req = getRequiredPlan(tpl.slug);
    const allowed = isPlanAllowed(req, userPlan, userRole);
    if (!allowed) {
      setTargetUpgradePlan(req);
      setUpgradeModalOpen(true);
      return;
    }
    setTemplateId(tpl.id);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Top Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#2d4a3e] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Overview</span>
        </Link>
        <div className="text-[11px] font-mono tracking-wider font-semibold text-[#2d4a3e] uppercase mb-1">
          Undangan Digital Baru
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Buat Undangan Baru
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tentukan URL unik dan template awal untuk undangan Anda. Anda dapat menyesuaikan konten dan tema kapan saja nanti.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6"
      >
        {/* Input Slug */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            URL Slug Undangan
          </label>
          <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-[#2d4a3e] focus-within:ring-2 focus-within:ring-[#2d4a3e]/20 overflow-hidden bg-white">
            <span className="bg-[#faf8f5] px-3.5 py-2.5 text-xs font-mono text-slate-500 border-r border-slate-200 select-none">
              hayvows.com/invitation/
            </span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                )
              }
              placeholder="alex-sara"
              className="flex-1 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Gunakan huruf kecil, angka, dan tanda strip (-). Contoh: <code className="text-slate-600 bg-slate-100 px-1 py-0.5 rounded">alex-sara</code>
          </p>
        </div>

        {/* Template Selector Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800">
                Pilih Template Desain
              </label>
              <p className="text-[11px] text-slate-400">
                Pilih tema sesuai tingkatan paket langganan Anda ({userPlan.toUpperCase()}).
              </p>
            </div>
            <Link
              href="/dashboard/template"
              className="text-xs font-semibold text-[#2d4a3e] hover:underline inline-flex items-center gap-1"
            >
              <span>Katalog Tema Lengkap</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 5 Archetype Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedArchetype("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedArchetype === "all"
                  ? "bg-[#2d4a3e] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              Semua ({initialTemplates.length})
            </button>
            {ARCHETYPE_LIST.map((arch) => {
              const count = initialTemplates.filter(
                (t) => getTemplateArchetype(t.slug) === arch.id
              ).length;
              const isSelected = selectedArchetype === arch.id;
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setSelectedArchetype(arch.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? "bg-[#2d4a3e] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  <span>{arch.badge.split(" ")[0]}</span>
                  <span>{arch.shortLabel}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {initialTemplates
              .filter((t) => {
                if (selectedArchetype === "all") return true;
                return getTemplateArchetype(t.slug) === selectedArchetype;
              })
              .map((tpl) => {
                const isSelected = templateId === tpl.id;
                const demoUrl = getDemoUrl(tpl);
                const reqPlan: SubscriptionTier = getRequiredPlan(tpl.slug);
                const allowed = isPlanAllowed(reqPlan, userPlan, userRole);
                const arch = getTemplateArchetype(tpl.slug);
                const archMeta = ARCHETYPES[arch];

                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#2d4a3e] bg-[#faf8f5] shadow-xs ring-1 ring-[#2d4a3e]"
                        : allowed
                        ? "border-slate-200 hover:border-slate-300 bg-white"
                        : "border-slate-200/70 bg-slate-50/60 opacity-85 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1">
                      <input
                        type="radio"
                        name="template"
                        value={tpl.id}
                        checked={isSelected}
                        disabled={!allowed}
                        onChange={() => handleSelectTemplate(tpl)}
                        className="mt-1 text-[#2d4a3e] focus:ring-[#2d4a3e] cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {tpl.name}
                          </span>

                          {/* Archetype Badge */}
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${archMeta.tagColor}`}>
                            {archMeta.badge}
                          </span>

                          {/* Tier Badge */}
                          {reqPlan === "luxury" ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-[#c9a84c] border border-[#c9a84c]/40 uppercase tracking-wider">
                              <Crown className="w-2.5 h-2.5 text-[#c9a84c]" />
                              <span>Paket Exclusive</span>
                            </span>
                          ) : reqPlan === "premium" ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#2d4a3e] border border-emerald-300 uppercase tracking-wider">
                              <Sparkles className="w-2.5 h-2.5 text-[#2d4a3e]" />
                              <span>Paket Populer</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                              <span>Paket Basic</span>
                            </span>
                          )}

                          {/* Selected Indicator */}
                          {isSelected && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#2d4a3e] text-[#fef08a] px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Terpilih</span>
                          </span>
                        )}

                        {/* Locked Indicator */}
                        {!allowed && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Perlu {reqPlan.toUpperCase()}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {tpl.description || "Template undangan digital yang responsif dan interaktif."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {!allowed && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetUpgradePlan(reqPlan);
                          setUpgradeModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2d4a3e] bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#c9a84c]" />
                        <span>Buka Kunci</span>
                      </button>
                    )}

                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#2d4a3e] bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Lihat Demo</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading || !templateId}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] active:bg-[#1b2d26] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#c9a84c]" />
                <span>Simpan &amp; Lanjut Isi Data</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={userPlan}
      />
    </div>
  );
}

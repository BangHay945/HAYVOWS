import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAnalyticsSummary } from "@/lib/analytics";
import {
  Eye,
  MailOpen,
  Music,
  CheckCircle2,
  MessageSquare,
  Image as ImageIcon,
  Gift,
  MapPin,
  TrendingUp,
  Clock,
  Sparkles,
  BarChart3,
} from "lucide-react";

const EVENT_CONFIG: Record<
  string,
  { label: string; description: string; icon: React.ComponentType<{ className?: string }> }
> = {
  invitation_view: {
    label: "Kunjungan Halaman",
    description: "Total pembukaan URL undangan oleh tamu",
    icon: Eye,
  },
  invitation_open: {
    label: "Buka Undangan",
    description: "Tamu yang menekan tombol Buka Undangan",
    icon: MailOpen,
  },
  music_play: {
    label: "Pemutaran Musik",
    description: "Frekuensi musik latar belakang diputar",
    icon: Music,
  },
  rsvp_submit: {
    label: "Pengiriman RSVP",
    description: "Formulir konfirmasi kehadiran yang terisi",
    icon: CheckCircle2,
  },
  message_submit: {
    label: "Ucapan Terkirim",
    description: "Pesan & doa yang dikirim oleh tamu",
    icon: MessageSquare,
  },
  gallery_view: {
    label: "Galeri Dilihat",
    description: "Interaksi tamu membuka foto-foto album",
    icon: ImageIcon,
  },
  gift_view: {
    label: "Informasi Amplop",
    description: "Tamu yang melihat info nomor rekening / gift",
    icon: Gift,
  },
  map_click: {
    label: "Klik Lokasi Maps",
    description: "Tamu yang membuka rute Google Maps",
    icon: MapPin,
  },
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ weddingId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sParams = await searchParams;

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    include: { couple: true },
    orderBy: { createdAt: "desc" },
  });

  if (weddings.length === 0) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Buat wedding terlebih dahulu di tab Overview.</p>
      </div>
    );
  }

  const selectedWedding =
    weddings.find((w) => w.id === sParams?.weddingId) || weddings[0];

  const summary = await getAnalyticsSummary(selectedWedding.id);

  const totalViews = summary["invitation_view"] || 0;
  const totalOpened = summary["invitation_open"] || 0;
  const totalRsvp = summary["rsvp_submit"] || 0;
  const totalMessages = summary["message_submit"] || 0;

  const openRate = totalViews > 0 ? Math.round((totalOpened / totalViews) * 100) : 0;
  const rsvpRate = totalViews > 0 ? Math.round((totalRsvp / totalViews) * 100) : 0;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-wider font-semibold text-emerald-700 uppercase mb-1">
            Monitoring Trafik &amp; Interaksi Tamu
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Statistik Kunjungan Undangan
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Analisis aktivitas real-time para tamu undangan: halaman dilihat, pembukaan musik latar, interaksi galeri, dan rasio konversi RSVP.
          </p>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Pelacakan Otomatis Aktif</span>
          </span>
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Kunjungan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalViews}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Total sesi dilihat</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Undangan Dibuka</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MailOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalOpened}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
            {openRate}% conversion rate
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Form RSVP Terisi</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{totalRsvp}</p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5 font-mono">
            {rsvpRate}% dari kunjungan
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Ucapan Terkirim</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{totalMessages}</p>
          <p className="text-[11px] text-amber-600/80 mt-0.5 font-mono">Pesan doa restu</p>
        </div>
      </div>

      {/* Breakdown Grid of 8 Event Types with Progress Bars */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <span>Rincian Aktivitas Interaksi Tamu</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">8 Kategori Metrik</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {Object.entries(EVENT_CONFIG).map(([key, item]) => {
            const Icon = item.icon;
            const count = summary[key] ?? 0;
            const pct = totalViews > 0 ? Math.min(Math.round((count / totalViews) * 100), 100) : 0;

            return (
              <div
                key={key}
                className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4 space-y-3 hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">{count}</span>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-800">{item.label}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Aktivitas</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

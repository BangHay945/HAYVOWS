import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Heart, Palette } from "lucide-react";
import { OverviewWorkbench } from "./OverviewWorkbench";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ weddingId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sParams = await searchParams;

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    include: {
      template: true,
      couple: true,
      events: { orderBy: { sortOrder: "asc" } },
      giftAccounts: { orderBy: { sortOrder: "asc" } },
      _count: { select: { guests: true, analyticsEvents: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (weddings.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-8 sm:p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2d4a3e] to-[#4c7361] text-white mx-auto flex items-center justify-center mb-4 shadow-md">
            <Heart className="w-7 h-7 fill-white/20 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Belum Ada Undangan Dibuat</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Selamat datang di Hayvows. Anda dapat menjelajahi seluruh katalog tema interaktif dan mencoba live demonya terlebih dahulu sebelum mulai mengatur data acara.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              href="/dashboard/template"
              className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-[#2d4a3e] font-semibold text-xs px-4 py-2.5 rounded-xl border border-emerald-200 transition-colors shadow-2xs"
            >
              <Palette className="w-4 h-4 text-[#2d4a3e]" />
              <span>Jelajahi &amp; Uji Coba Tema</span>
            </Link>
            <Link
              href="/dashboard/invitation/new"
              className="inline-flex items-center gap-2 bg-[#2d4a3e] hover:bg-[#233a30] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Undangan Langsung</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Selected wedding from sidebar switcher or first
  const activeWedding =
    weddings.find((w) => w.id === sParams?.weddingId) || weddings[0];

  const targetWeddingId = activeWedding.id;

  const [
    totalGuests,
    totalRsvp,
    totalDeclined,
    totalMessages,
    totalViews,
    recentGuests,
    rawMessages,
    giftConfirmations,
    giftStats,
  ] = await Promise.all([
    prisma.guest.count({
      where: { weddingId: targetWeddingId },
    }),
    prisma.rsvp.count({
      where: {
        weddingId: targetWeddingId,
        attendanceStatus: "attending",
      },
    }),
    prisma.rsvp.count({
      where: {
        weddingId: targetWeddingId,
        attendanceStatus: "declined",
      },
    }),
    prisma.guestMessage.count({
      where: { weddingId: targetWeddingId },
    }),
    prisma.analyticsEvent.count({
      where: { weddingId: targetWeddingId },
    }),
    prisma.guest.findMany({
      where: { weddingId: targetWeddingId },
      include: { rsvp: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.guestMessage.findMany({
      where: { weddingId: targetWeddingId },
      include: { guest: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.giftConfirmation.findMany({
      where: { weddingId: targetWeddingId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.giftConfirmation.aggregate({
      where: { weddingId: targetWeddingId },
      _sum: { amount: true },
      _count: { id: true },
    }),
  ]);

  const totalGiftAmount = giftStats._sum.amount || 0;
  const totalGiftCount = giftStats._count.id || 0;

  const formattedMessages = rawMessages.map((m) => ({
    id: m.id,
    guestName: m.guest?.name || "Tamu Undangan",
    message: m.message,
    isPinned: m.isPinned,
    createdAt: m.createdAt,
  }));

  return (
    <OverviewWorkbench
      weddings={weddings}
      selectedWedding={activeWedding}
      initialGuests={recentGuests}
      recentMessages={formattedMessages}
      totalGuests={totalGuests}
      totalRsvp={totalRsvp}
      totalDeclined={totalDeclined}
      totalMessages={totalMessages}
      totalViews={totalViews}
      totalGiftAmount={totalGiftAmount}
      totalGiftCount={totalGiftCount}
      recentGiftConfirmations={giftConfirmations.map((g) => ({
        id: g.id,
        guestName: g.guestName,
        bankName: g.bankName,
        amount: g.amount,
        notes: g.notes,
        accountSender: g.accountSender,
        createdAt: g.createdAt,
      }))}
    />
  );
}

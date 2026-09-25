import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GuestbookWorkbench } from "./GuestbookWorkbench";
import { FeatureLockedState } from "@/components/dashboard/FeatureLockedState";

export default async function GuestbookPage({
  searchParams,
}: {
  searchParams?: Promise<{ weddingId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Check user plan
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, plan: true },
  });

  if (user?.role !== "admin" && user?.plan === "basic") {
    return (
      <FeatureLockedState
        featureName="Buku Tamu & Layar Sapa Digital"
        description="Fitur Buku Tamu Digital & QR Check-in tidak tersedia di Paket Basic. Upgrade ke Paket Populer atau Exclusive untuk mengelola kehadiran tamu resepsi secara instan."
        currentPlan={user?.plan || "basic"}
      />
    );
  }

  const sParams = await searchParams;

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    include: { couple: true },
    orderBy: { createdAt: "desc" },
  });

  if (weddings.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Buat undangan pernikahan terlebih dahulu di tab Overview.</p>
      </div>
    );
  }

  const selectedWedding =
    weddings.find((w) => w.id === sParams?.weddingId) || weddings[0];

  const guests = await prisma.guest.findMany({
    where: { weddingId: selectedWedding.id },
    include: { rsvp: true },
    orderBy: { createdAt: "asc" },
  });

  const coupleTitle = `${
    selectedWedding.couple?.groomNickname ||
    selectedWedding.couple?.groomName ||
    "Pengantin Pria"
  } & ${
    selectedWedding.couple?.brideNickname ||
    selectedWedding.couple?.brideName ||
    "Pengantin Wanita"
  }`;

  const weddingOptions = weddings.map((w) => ({
    id: w.id,
    slug: w.slug,
    coupleTitle: `${
      w.couple?.groomNickname || w.couple?.groomName || "Pengantin Pria"
    } & ${
      w.couple?.brideNickname || w.couple?.brideName || "Pengantin Wanita"
    }`,
  }));

  return (
    <GuestbookWorkbench
      key={selectedWedding.id}
      weddingId={selectedWedding.id}
      weddingSlug={selectedWedding.slug}
      coupleTitle={coupleTitle}
      initialGuests={guests as any}
      weddingOptions={weddingOptions}
    />
  );
}

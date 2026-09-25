import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RSVPWorkbench from "./RSVPWorkbench";
import { FeatureLockedState } from "@/components/dashboard/FeatureLockedState";

export default async function RSVPPage({
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
        featureName="Konfirmasi Kehadiran (RSVP)"
        description="Fitur Konfirmasi Kehadiran (RSVP) & Rekap Porsi Katering tidak tersedia di Paket Basic. Upgrade ke Paket Populer atau Exclusive untuk memantau konfirmasi kehadiran tamu secara realtime."
        currentPlan={user?.plan || "basic"}
      />
    );
  }

  const sParams = await searchParams;

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    include: {
      couple: true,
      events: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
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

  const rsvps = await prisma.rsvp.findMany({
    where: { weddingId: selectedWedding.id },
    include: {
      guest: {
        select: {
          name: true,
          phone: true,
          category: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  const groom = selectedWedding.couple?.groomNickname || selectedWedding.couple?.groomName || "Pengantin Pria";
  const bride = selectedWedding.couple?.brideNickname || selectedWedding.couple?.brideName || "Pengantin Wanita";
  const coupleTitle = `${groom} & ${bride}`;
  const firstEvent = selectedWedding.events?.[0];

  return (
    <div className="space-y-6">
      <RSVPWorkbench
        key={selectedWedding.id}
        rsvps={rsvps}
        wedding={{
          id: selectedWedding.id,
          slug: selectedWedding.slug,
          coupleTitle,
          eventDate: firstEvent?.date || "",
        }}
      />
    </div>
  );
}

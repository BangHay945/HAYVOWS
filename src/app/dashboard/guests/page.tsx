import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import GuestManager from "./GuestManager";

export default async function GuestsPage({
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

  const guests = await prisma.guest.findMany({
    where: { weddingId: selectedWedding.id },
    include: { rsvp: true },
    orderBy: { createdAt: "desc" },
  });

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true },
  });
  const userPlan = currentUser?.plan || "basic";
  const userRole = currentUser?.role || "client";

  return (
    <div className="space-y-6">
      <GuestManager
        key={selectedWedding.id}
        weddingId={selectedWedding.id}
        weddingSlug={selectedWedding.slug}
        whatsappTemplate={selectedWedding.whatsappMessage}
        coupleTitle={`${
          selectedWedding.couple?.groomNickname ||
          selectedWedding.couple?.groomName ||
          "Pengantin"
        } & ${
          selectedWedding.couple?.brideNickname ||
          selectedWedding.couple?.brideName ||
          "Pengantin"
        }`}
        initialGuests={guests}
        userPlan={userPlan}
        userRole={userRole}
      />
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MessagesManager from "./MessagesManager";
import { FeatureLockedState } from "@/components/dashboard/FeatureLockedState";

export default async function MessagesPage({
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
        featureName="Ucapan & Doa Restu Tamu"
        description="Fitur Buku Ucapan, Doa Restu Tamu & Moderasi Pesan tidak tersedia di Paket Basic. Upgrade ke Paket Populer atau Exclusive untuk menerima dan memoderasi doa dari para tamu undangan."
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
      <div className="p-8">
        <p className="text-slate-500">Buat wedding terlebih dahulu di tab Overview.</p>
      </div>
    );
  }

  const selectedWedding =
    weddings.find((w) => w.id === sParams?.weddingId) || weddings[0];

  const messages = await prisma.guestMessage.findMany({
    where: { weddingId: selectedWedding.id },
    include: {
      guest: {
        select: {
          name: true,
          category: true,
        },
      },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <MessagesManager
        key={selectedWedding.id}
        weddingId={selectedWedding.id}
        initialMessages={messages}
      />
    </div>
  );
}

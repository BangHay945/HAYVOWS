import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DEMO_WEDDING_SLUGS, isDemoWedding } from "@/lib/demo";
import { InvitationListClient, type WeddingListItem } from "./InvitationListClient";

export default async function InvitationIndexPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const userRole = currentUser?.role || "client";

  const weddings = await prisma.wedding.findMany({
    where:
      userRole === "admin"
        ? {
            OR: [
              { userId: session.user.id },
              { slug: { in: [...DEMO_WEDDING_SLUGS] } },
            ],
          }
        : { userId: session.user.id },
    include: {
      couple: true,
      template: true,
      guests: {
        include: {
          rsvp: true,
        },
      },
      analyticsEvents: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const weddingList: WeddingListItem[] = weddings.map((w) => {
    const groom = w.couple?.groomName?.trim();
    const bride = w.couple?.brideName?.trim();
    let coupleName = "Mempelai Pria & Mempelai Wanita";
    if (groom && bride) {
      coupleName = `${groom} & ${bride}`;
    } else if (groom) {
      coupleName = groom;
    } else if (bride) {
      coupleName = bride;
    } else {
      coupleName = `Acara /${w.slug}`;
    }

    return {
      id: w.id,
      slug: w.slug,
      status: w.status,
      createdAt: new Date(w.createdAt).toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      }),
      coupleName,
      templateName: w.template?.name || "Katalog Tema",
      guestCount: w.guests.length,
      rsvpCount: w.guests.filter((g) => g.rsvp !== null).length,
      viewCount: w.analyticsEvents.length,
      isDemo: isDemoWedding(w.slug),
      plan: (w as any).plan || "trial",
    };
  });

  return <InvitationListClient initialWeddings={weddingList} />;
}

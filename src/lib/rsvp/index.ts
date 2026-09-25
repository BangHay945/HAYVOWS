import { prisma } from "@/lib/prisma";

export async function submitRSVP(data: {
  weddingId: string;
  guestId: string;
  attendanceStatus: "attending" | "not_attending";
  guestCount: number;
}) {
  const rsvp = await prisma.rsvp.upsert({
    where: { guestId: data.guestId },
    update: {
      attendanceStatus: data.attendanceStatus,
      guestCount: data.guestCount,
      updatedAt: new Date(),
    },
    create: {
      weddingId: data.weddingId,
      guestId: data.guestId,
      attendanceStatus: data.attendanceStatus,
      guestCount: data.guestCount,
    },
  });

  await prisma.guest.update({
    where: { id: data.guestId },
    data: { attendanceStatus: data.attendanceStatus },
  });

  return rsvp;
}

export async function getRSVPs(weddingId: string) {
  return prisma.rsvp.findMany({
    where: { weddingId },
    include: { guest: true },
    orderBy: { submittedAt: "desc" },
  });
}

export async function getRSVPStats(weddingId: string) {
  const [attending, notAttending, total] = await Promise.all([
    prisma.rsvp.count({ where: { weddingId, attendanceStatus: "attending" } }),
    prisma.rsvp.count({ where: { weddingId, attendanceStatus: "not_attending" } }),
    prisma.guest.count({ where: { weddingId } }),
  ]);
  return { attending, notAttending, pending: total - attending - notAttending, total };
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: weddingIdOrSlug } = await params;

  // Support querying by wedding ID or slug
  const wedding = await prisma.wedding.findFirst({
    where: {
      OR: [{ id: weddingIdOrSlug }, { slug: weddingIdOrSlug }],
    },
    include: {
      template: true,
      couple: true,
      events: { orderBy: { sortOrder: "asc" } },
      galleries: { select: { imageUrl: true, caption: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Wedding tidak ditemukan" }, { status: 404 });
  }

  // Get recent checked-in guests (latest 20)
  const recentCheckedIn = await prisma.guest.findMany({
    where: {
      weddingId: wedding.id,
      checkedIn: true,
    },
    orderBy: { checkedInAt: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      address: true,
      category: true,
      tableNumber: true,
      checkedInPax: true,
      checkedInAt: true,
      messages: {
        where: { status: "approved" },
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { message: true },
      },
    },
  });

  // Get recent messages for live greeting display
  const rawMessages = await prisma.guestMessage.findMany({
    where: { weddingId: wedding.id, status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 15,
    select: {
      id: true,
      message: true,
      createdAt: true,
      guest: {
        select: {
          name: true,
        },
      },
    },
  });

  const recentMessages = rawMessages.map((m) => ({
    id: m.id,
    guestName: m.guest?.name || "Tamu Undangan",
    message: m.message,
    createdAt: m.createdAt,
  }));

  // Get real-time stats
  const totalGuests = await prisma.guest.count({ where: { weddingId: wedding.id } });
  const totalCheckedIn = await prisma.guest.count({
    where: { weddingId: wedding.id, checkedIn: true },
  });

  const firstEvent = wedding.events && wedding.events.length > 0 ? wedding.events[0] : null;

  return NextResponse.json({
    wedding: {
      id: wedding.id,
      slug: wedding.slug,
      coupleTitle: `${wedding.couple?.groomNickname || wedding.couple?.groomName || "Pengantin"} & ${wedding.couple?.brideNickname || wedding.couple?.brideName || "Pengantin"}`,
      groomName: wedding.couple?.groomNickname || wedding.couple?.groomName || "Pengantin Pria",
      brideName: wedding.couple?.brideNickname || wedding.couple?.brideName || "Pengantin Wanita",
      couplePhoto: wedding.couple?.couplePhoto || wedding.couple?.groomPhoto || null,
      eventName: firstEvent?.title || "Resepsi Pernikahan",
      eventDate: firstEvent?.date || "",
      eventStartTime: firstEvent?.startTime || "09:00",
      eventVenue: firstEvent?.venue || "Grand Ballroom",
      eventAddress: firstEvent?.address || "",
      events: wedding.events.map((e) => ({
        id: e.id,
        title: e.title,
        startTime: e.startTime,
        endTime: e.endTime,
        venue: e.venue,
      })),
      templateSlug: wedding.template?.slug || wedding.templateId || "nature-floral",
      galleries: wedding.galleries?.map((g) => g.imageUrl) || [],
    },
    stats: {
      totalGuests,
      totalCheckedIn,
      attendanceRate: totalGuests > 0 ? Math.round((totalCheckedIn / totalGuests) * 100) : 0,
    },
    recentCheckedIn,
    recentMessages,
  });
}

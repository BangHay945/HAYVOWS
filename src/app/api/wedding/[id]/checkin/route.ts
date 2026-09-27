import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkInGuest, undoCheckInGuest } from "@/lib/guest";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: weddingIdOrSlug } = await params;
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  const wedding = await prisma.wedding.findFirst({
    where: {
      OR: [{ id: weddingIdOrSlug }, { slug: weddingIdOrSlug }],
    },
    select: { id: true },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Wedding tidak ditemukan" }, { status: 404 });
  }

  if (!q) {
    return NextResponse.json({ guests: [] });
  }

  // Find guests matching search query (name, slug, qrCode, phone, address, or table)
  const guests = await prisma.guest.findMany({
    where: {
      weddingId: wedding.id,
      OR: [
        { name: { contains: q } },
        { slug: { contains: q } },
        { qrCode: { contains: q } },
        { phone: { contains: q } },
        { address: { contains: q } },
        { tableNumber: { contains: q } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      category: true,
      tableNumber: true,
      guestCount: true,
      checkedIn: true,
      checkedInAt: true,
      checkedInPax: true,
      souvenirTaken: true,
      qrCode: true,
    },
    take: 10,
    orderBy: [{ checkedIn: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ guests });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: weddingIdOrSlug } = await params;

  // Support querying by wedding ID or slug
  const wedding = await prisma.wedding.findFirst({
    where: {
      OR: [{ id: weddingIdOrSlug }, { slug: weddingIdOrSlug }],
    },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Wedding tidak ditemukan" }, { status: 404 });
  }

  const body = await req.json();
  const {
    qrCode,
    guestId,
    slug,
    checkedInPax,
    souvenirTaken,
    giftType,
    checkInNotes,
    action,
  } = body;

  if (action === "undo" && guestId) {
    const result = await undoCheckInGuest(wedding.id, guestId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  }

  const result = await checkInGuest(
    wedding.id,
    { qrCode, guestId, slug },
    { checkedInPax, souvenirTaken, giftType, checkInNotes }
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result);
}

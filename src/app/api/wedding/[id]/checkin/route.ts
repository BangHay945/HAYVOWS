import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkInGuest, undoCheckInGuest } from "@/lib/guest";
import { searchSmartGuests } from "@/lib/guest/search";
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

  // Fetch all guests for this wedding to allow intelligent fuzzy, multi-token, and phonetic ranking
  const allGuests = await prisma.guest.findMany({
    where: {
      weddingId: wedding.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      phone: true,
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
  });

  const searchResults = searchSmartGuests(allGuests, q, {
    limit: 20,
    showRecentIfEmpty: true,
  });

  const formattedGuests = searchResults.map((item) => ({
    ...item.guest,
    matchReason: item.matchReason,
    matchScore: item.score,
    matchedTokens: item.matchedTokens,
  }));

  return NextResponse.json({ guests: formattedGuests });
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

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkInGuest, undoCheckInGuest } from "@/lib/guest";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: weddingId } = await params;

  // Verify ownership or admin
  const userRole = (session.user as any)?.role;
  const wedding = await prisma.wedding.findFirst({
    where: {
      id: weddingId,
      ...(userRole !== "admin" ? { userId: session.user.id } : {}),
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
    const result = await undoCheckInGuest(weddingId, guestId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  }

  const result = await checkInGuest(
    weddingId,
    { qrCode, guestId, slug },
    { checkedInPax, souvenirTaken, giftType, checkInNotes }
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result);
}

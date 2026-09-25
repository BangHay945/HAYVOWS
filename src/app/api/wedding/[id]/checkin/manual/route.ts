import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { quickRegisterCheckIn } from "@/lib/guest";
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
    name,
    address,
    category,
    guestCount,
    tableNumber,
    sessionName,
    souvenirTaken,
    giftType,
    checkInNotes,
  } = body;

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Nama tamu wajib diisi" },
      { status: 400 }
    );
  }

  const result = await quickRegisterCheckIn(weddingId, {
    name,
    address,
    category: category || "Reguler",
    guestCount: Number(guestCount) || 1,
    tableNumber,
    sessionName,
    souvenirTaken: souvenirTaken !== undefined ? souvenirTaken : true,
    giftType,
    checkInNotes,
  });

  return NextResponse.json(result, { status: 201 });
}

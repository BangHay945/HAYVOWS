import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGuestsBulk } from "@/lib/guest";

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
  const wedding = await prisma.wedding.findFirst({
    where: { id: weddingId, userId: session.user.id },
  });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true },
  });

  if (!wedding && user?.role !== "admin") {
    return NextResponse.json(
      { error: "Undangan tidak ditemukan atau akses ditolak" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const rawGuests = Array.isArray(body?.guests) ? body.guests : [];

  if (rawGuests.length === 0) {
    return NextResponse.json({ error: "Daftar tamu kosong" }, { status: 400 });
  }

  // Check quota limit
  const currentCount = await prisma.guest.count({ where: { weddingId } });
  const userPlan = user?.plan || "basic";
  const userRole = user?.role || "client";
  const maxQuota =
    userRole === "admin" || userPlan === "luxury"
      ? 999999
      : userPlan === "premium"
      ? 500
      : 50;

  const availableSlots = Math.max(0, maxQuota - currentCount);

  if (availableSlots <= 0) {
    return NextResponse.json(
      {
        error: `Batas kuota tamu untuk paket ${userPlan.toUpperCase()} telah tercapai (${currentCount}/${maxQuota}). Silakan upgrade paket untuk menambah lebih banyak tamu.`,
      },
      { status: 403 }
    );
  }

  // Slice up to availableSlots if requested more than available
  const guestsToCreate = rawGuests.slice(0, availableSlots);

  const created = await createGuestsBulk(weddingId, guestsToCreate);

  return NextResponse.json(
    {
      success: true,
      createdCount: created.length,
      totalRequested: rawGuests.length,
      truncated: rawGuests.length > availableSlots,
      guests: created,
    },
    { status: 201 }
  );
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createGuest, getGuests } from "@/lib/guest";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: weddingIdOrSlug } = await params;
  const wedding = await prisma.wedding.findFirst({
    where: {
      OR: [{ id: weddingIdOrSlug }, { slug: weddingIdOrSlug }],
    },
    select: { id: true },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Wedding tidak ditemukan" }, { status: 404 });
  }

  const guests = await getGuests(wedding.id);
  return NextResponse.json(guests);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: weddingId } = await params;
  const body = await req.json();
  const guest = await createGuest(weddingId, body);
  return NextResponse.json(guest, { status: 201 });
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createGuest, getGuests } from "@/lib/guest";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const guests = await getGuests(id);
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

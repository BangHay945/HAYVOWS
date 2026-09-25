import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteGuest, updateGuest } from "@/lib/guest";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; guestId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guestId } = await params;
  const body = await req.json();
  const guest = await updateGuest(guestId, body);
  return NextResponse.json(guest);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; guestId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guestId } = await params;
  await deleteGuest(guestId);
  return NextResponse.json({ ok: true });
}

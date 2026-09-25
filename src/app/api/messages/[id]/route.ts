import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateMessageStatus, pinMessage, deleteMessage } from "@/lib/messages";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.status) {
    const msg = await updateMessageStatus(id, body.status);
    return NextResponse.json(msg);
  }

  if (typeof body.isPinned === "boolean") {
    const msg = await pinMessage(id, body.isPinned);
    return NextResponse.json(msg);
  }

  return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}

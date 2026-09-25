import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const musics = await prisma.music.findMany({
    where: { weddingId: id },
  });
  return NextResponse.json(musics);
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

  const wedding = await prisma.wedding.findFirst({
    where: { id: weddingId, userId: session.user.id },
  });
  if (!wedding) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const music = await prisma.music.create({
    data: { weddingId, ...body },
  });
  return NextResponse.json(music, { status: 201 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: weddingId } = await params;
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) {
    return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
  }

  const wedding = await prisma.wedding.findFirst({
    where: { id: weddingId, userId: session.user.id },
  });
  if (!wedding) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.music.delete({
    where: { id: itemId, weddingId },
  });
  return NextResponse.json({ success: true });
}

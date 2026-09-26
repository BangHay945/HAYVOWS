import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const wedding = await prisma.wedding.findFirst({
    where: { id, userId: session.user.id },
    include: {
      couple: true,
      events: { orderBy: { sortOrder: "asc" } },
      stories: { orderBy: { sortOrder: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
      musics: true,
      giftAccounts: { orderBy: { sortOrder: "asc" } },
      template: true,
    },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(wedding);
}

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

  if (body.templateId) {
    const template = await prisma.template.findUnique({
      where: { id: body.templateId },
    });
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (template && (template as any).adminOnly && user?.role !== "admin") {
      return NextResponse.json(
        { error: "Tema ini masih dalam mode pengujian admin dan belum dirilis untuk publik." },
        { status: 403 }
      );
    }
  }

  const wedding = await prisma.wedding.updateMany({
    where: { id, userId: session.user.id },
    data: body,
  });

  return NextResponse.json(wedding);
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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const wedding = await prisma.wedding.findUnique({
    where: { id },
    select: { id: true, userId: true, slug: true },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
  }

  if (wedding.userId !== session.user.id && user?.role !== "admin") {
    return NextResponse.json(
      { error: "Anda tidak memiliki izin menghapus undangan ini" },
      { status: 403 }
    );
  }

  await prisma.wedding.delete({
    where: { id },
  });

  return NextResponse.json({
    ok: true,
    message: `Undangan /${wedding.slug} berhasil dihapus`,
  });
}

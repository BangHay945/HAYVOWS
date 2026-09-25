import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
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

  const couple = await prisma.couple.upsert({
    where: { weddingId },
    update: body,
    create: { weddingId, ...body },
  });

  return NextResponse.json(couple);
}

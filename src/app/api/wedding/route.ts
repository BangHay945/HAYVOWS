import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";
import { getRequiredPlan, isPlanAllowed } from "@/lib/templates";

const createSchema = z.object({
  slug: z.string().min(3),
  templateId: z.string(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    include: { template: true, couple: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(weddings);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, templateId } = createSchema.parse(body);
    const finalSlug = slugify(slug);

    const existing = await prisma.wedding.findUnique({
      where: { slug: finalSlug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Slug undangan ini sudah digunakan" },
        { status: 400 }
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });
    if (!template) {
      return NextResponse.json(
        { error: "Template yang dipilih tidak ditemukan" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, plan: true },
    });

    const userRole = user?.role || "client";
    const userPlan = user?.plan || "basic";

    if (userRole !== "admin") {
      const requiredPlan = getRequiredPlan(template.slug);
      if (!isPlanAllowed(requiredPlan, userPlan, userRole)) {
        return NextResponse.json(
          {
            error: `Template "${template.name}" memerlukan Paket ${requiredPlan.toUpperCase()}. Silakan upgrade paket akun Anda terlebih dahulu.`,
          },
          { status: 403 }
        );
      }
    }

    const wedding = await prisma.wedding.create({
      data: {
        userId: session.user.id,
        slug: finalSlug,
        templateId,
        couple: { create: {} },
      },
      include: { template: true, couple: true },
    });
    return NextResponse.json(wedding, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

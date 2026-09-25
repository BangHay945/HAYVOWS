import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function getWeddingsByUser(userId: string) {
  return prisma.wedding.findMany({
    where: { userId },
    include: { template: true, couple: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWeddingBySlug(slug: string) {
  return prisma.wedding.findUnique({
    where: { slug },
    include: {
      couple: true,
      events: { orderBy: { sortOrder: "asc" } },
      stories: { orderBy: { sortOrder: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
      musics: { where: { isActive: true } },
      giftAccounts: { orderBy: { sortOrder: "asc" } },
      template: true,
    },
  });
}

export async function createWedding(userId: string, data: {
  slug: string;
  templateId: string;
}) {
  return prisma.wedding.create({
    data: {
      userId,
      slug: slugify(data.slug),
      templateId: data.templateId,
      couple: { create: {} },
    },
    include: { template: true, couple: true },
  });
}

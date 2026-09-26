import { prisma } from "@/lib/prisma";

export type SubscriptionTier = "basic" | "premium" | "luxury";

export const getRequiredPlan = (slug: string): SubscriptionTier => {
  // Paket Exclusive (Rp 299.000)
  if (
    slug === "pixel-adventure" ||
    slug === "pixel-cyberpunk" ||
    slug === "pixel-rpg" ||
    slug === "eternal-noir"
  ) {
    return "luxury";
  }

  // Paket Populer (Rp 199.000)
  if (
    slug === "nature-floral" ||
    slug === "batik-jawa" ||
    slug === "vintage-royal"
  ) {
    return "premium";
  }

  // Paket Basic (Rp 149.000)
  return "basic";
};

export const isPlanAllowed = (reqPlan: string, curPlan: string, role?: string) => {
  if (role === "admin") return true;
  if (reqPlan === "basic") {
    return curPlan === "basic" || curPlan === "premium" || curPlan === "luxury";
  }
  if (reqPlan === "premium") {
    return curPlan === "premium" || curPlan === "luxury";
  }
  if (reqPlan === "luxury") {
    return curPlan === "luxury";
  }
  return false;
};

export async function getTemplates() {
  return prisma.template.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getTemplateBySlug(slug: string) {
  return prisma.template.findUnique({ where: { slug } });
}

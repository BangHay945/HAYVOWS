import { prisma } from "@/lib/prisma";

export type SubscriptionTier = "basic" | "premium" | "luxury";

export const getRequiredPlan = (slug: string): SubscriptionTier => {
  if (slug === "eternal-noir") return "luxury";
  if (slug === "nature-floral" || slug === "pixel-cyberpunk" || slug === "vintage-royal" || slug === "batik-jawa") return "premium";
  return "basic";
};

export const isPlanAllowed = (reqPlan: string, curPlan: string, role: string) => {
  if (role === "admin") return true;
  if (reqPlan === "basic") return true;
  if (reqPlan === "premium") return curPlan === "premium" || curPlan === "luxury";
  if (reqPlan === "luxury") return curPlan === "luxury";
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

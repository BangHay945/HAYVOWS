import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// /invitation/via-domain/[...domain]
//
// Route ini dipanggil oleh middleware saat ada request dari custom domain:
//   romeo-juliet.com → lookup wedding by customDomain → redirect ke /invitation/[slug]
//
// Middleware melakukan NextResponse.rewrite() ke sini.
// ─────────────────────────────────────────────────────────────────────────────

export default async function ViaDomainPage({
  params,
}: {
  params: Promise<{ domain: string[] }>;
}) {
  const { domain } = await params;
  // domain adalah array karena catch-all route [...domain]
  // Ambil segmen pertama saja (hostname)
  const domainHost = domain[0];

  if (!domainHost) {
    notFound();
  }

  // Lookup wedding berdasarkan customDomain
  const wedding = await prisma.wedding.findFirst({
    where: {
      customDomain: domainHost.toLowerCase(),
      status: "published",
    },
    select: { slug: true },
  });

  if (!wedding) {
    notFound();
  }

  redirect(`/invitation/${wedding.slug}`);
}

import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// /invitation/via-subdomain/[subdomain]
//
// Route ini dipanggil oleh middleware saat ada request dari:
//   alex-sara.hayvows.com → lookup wedding by customSubdomain → redirect ke /invitation/[slug]
//
// Middleware melakukan NextResponse.rewrite() ke sini, sehingga user tidak
// melihat URL ini di browser (URL bar tetap menampilkan alex-sara.hayvows.com).
// ─────────────────────────────────────────────────────────────────────────────

export default async function ViaSubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  // Lookup wedding berdasarkan customSubdomain
  const wedding = await prisma.wedding.findFirst({
    where: {
      customSubdomain: subdomain.toLowerCase(),
      status: "published",
    },
    select: { slug: true },
  });

  if (!wedding) {
    notFound();
  }

  // Redirect ke URL undangan utama (dengan subdomain tetap terbaca di bar browser
  // karena ini adalah rewrite, bukan redirect — tetapi jika gagal, fallback redirect)
  redirect(`/invitation/${wedding.slug}`);
}

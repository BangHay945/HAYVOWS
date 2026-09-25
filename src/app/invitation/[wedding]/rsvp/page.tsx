import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PublicRSVPClient from "./PublicRSVPClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ wedding: string }>;
}): Promise<Metadata> {
  const { wedding: rawWeddingSlug } = await params;
  const decoded = decodeURIComponent(rawWeddingSlug).trim();
  const normalized = decoded.replace(/\s+/g, "-").toLowerCase();

  const wedding = await prisma.wedding.findFirst({
    where: {
      OR: [{ slug: rawWeddingSlug }, { slug: normalized }, { slug: decoded }],
    },
    include: { couple: true },
  });

  if (!wedding) return { title: "Konfirmasi Kehadiran (RSVP)" };

  const groom = wedding.couple?.groomNickname || wedding.couple?.groomName || "Pengantin";
  const bride = wedding.couple?.brideNickname || wedding.couple?.brideName || "Pengantin";

  return {
    title: `Konfirmasi Kehadiran (RSVP) - ${groom} & ${bride}`,
    description: `Formulir konfirmasi kehadiran (RSVP) & ucapan doa restu pernikahan ${groom} & ${bride}.`,
  };
}

export default async function PublicRSVPPage({
  params,
}: {
  params: Promise<{ wedding: string }>;
}) {
  const { wedding: rawWeddingSlug } = await params;
  const decoded = decodeURIComponent(rawWeddingSlug).trim();
  const normalized = decoded.replace(/\s+/g, "-").toLowerCase();

  const wedding = await prisma.wedding.findFirst({
    where: {
      OR: [{ slug: rawWeddingSlug }, { slug: normalized }, { slug: decoded }],
    },
    include: {
      couple: true,
      events: { orderBy: { sortOrder: "asc" }, take: 1 },
      template: true,
    },
  });

  if (!wedding) notFound();

  const firstEvent = wedding.events?.[0];
  const groomName = wedding.couple?.groomNickname || wedding.couple?.groomName || "Pengantin Pria";
  const brideName = wedding.couple?.brideNickname || wedding.couple?.brideName || "Pengantin Wanita";
  const coupleTitle = `${groomName} & ${brideName}`;

  return (
    <PublicRSVPClient
      weddingId={wedding.id}
      weddingSlug={wedding.slug}
      coupleTitle={coupleTitle}
      groomName={groomName}
      brideName={brideName}
      couplePhoto={wedding.couple?.couplePhoto || wedding.couple?.groomPhoto || null}
      eventDate={firstEvent?.date || ""}
      eventVenue={firstEvent?.venue || ""}
      eventAddress={firstEvent?.address || ""}
      templateSlug={wedding.template?.slug || "nature-floral"}
    />
  );
}

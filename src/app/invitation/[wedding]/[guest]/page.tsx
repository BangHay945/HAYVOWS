import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/templates/registry";
import { getApprovedMessages } from "@/lib/messages";
import { trackEvent } from "@/lib/analytics";
import { isDemoWedding } from "@/lib/demo";
import InvitationClient from "./InvitationClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ wedding: string; guest: string }>;
  searchParams?: Promise<{ tpl?: string; to?: string; u?: string; c?: string }>;
}): Promise<Metadata> {
  const { wedding: rawWeddingSlug, guest: rawGuestSlug } = await params;
  const sParams = await searchParams;

  const decodedWedding = decodeURIComponent(rawWeddingSlug).trim();
  const normalizedWedding = decodedWedding.replace(/\s+/g, "-").toLowerCase();

  const decodedGuest = decodeURIComponent(rawGuestSlug).trim();
  const normalizedGuest = decodedGuest.replace(/\s+/g, "-").toLowerCase();

  const wedding = await prisma.wedding.findFirst({
    where: {
      OR: [
        { slug: rawWeddingSlug },
        { slug: normalizedWedding },
        { slug: decodedWedding },
      ],
    },
    include: { couple: true },
  });

  if (!wedding) return { title: "Undangan Pernikahan" };

  const groom = wedding.couple?.groomNickname || wedding.couple?.groomName || "Alex";
  const bride = wedding.couple?.brideNickname || wedding.couple?.brideName || "Sara";

  // Guest name resolution (verified DB guests only)
  let guestDisplayName: string | null = null;
  const guestQueryParam = (sParams?.c || sParams?.to || sParams?.u)
    ? decodeURIComponent(sParams.c || sParams.to || sParams.u || "").trim()
    : null;

  if (guestQueryParam) {
    const guestObj = await prisma.guest.findFirst({
      where: {
        weddingId: wedding.id,
        OR: [
          { slug: guestQueryParam },
          { slug: guestQueryParam.replace(/\s+/g, "-").toLowerCase() },
          { name: guestQueryParam },
        ],
      },
    });
    if (guestObj) guestDisplayName = guestObj.name;
  }

  if (!guestDisplayName && rawGuestSlug && rawGuestSlug !== "preview") {
    const guestObj = await prisma.guest.findFirst({
      where: {
        weddingId: wedding.id,
        OR: [
          { slug: rawGuestSlug },
          { slug: normalizedGuest },
          { slug: decodedGuest },
          { name: decodedGuest },
        ],
      },
    });
    if (guestObj) guestDisplayName = guestObj.name;
  }

  const title = wedding.ogTitle || `The Wedding of ${groom} & ${bride}`;
  const description =
    wedding.ogDescription ||
    (guestDisplayName
      ? `Undangan Pernikahan Spesial untuk ${guestDisplayName}. Buka dan lihat rangkaian acara kami.`
      : `Undangan Pernikahan ${groom} & ${bride}. Buka dan lihat rangkaian acara kami.`);

  const image =
    wedding.ogImage ||
    wedding.couple?.couplePhoto ||
    wedding.couple?.groomPhoto ||
    wedding.couple?.bridePhoto ||
    "/assets/templates/pixel-adventure/maps/floating-island-v1/map.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ wedding: string; guest: string }>;
  searchParams?: Promise<{ tpl?: string; to?: string; u?: string; c?: string }>;
}) {
  const { wedding: rawWeddingSlug, guest: rawGuestSlug } = await params;
  const sParams = await searchParams;

  // Resilient slug normalization (handles spaces, %20, case mismatches)
  const decodedWedding = decodeURIComponent(rawWeddingSlug).trim();
  const normalizedWedding = decodedWedding.replace(/\s+/g, "-").toLowerCase();

  const decodedGuest = decodeURIComponent(rawGuestSlug).trim();
  const normalizedGuest = decodedGuest.replace(/\s+/g, "-").toLowerCase();

  const wedding = await prisma.wedding.findFirst({
    where: {
      OR: [
        { slug: rawWeddingSlug },
        { slug: normalizedWedding },
        { slug: decodedWedding },
      ],
    },
    include: {
      couple: true,
      events: { orderBy: { sortOrder: "asc" } },
      stories: { orderBy: { sortOrder: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
      musics: { where: { isActive: true } },
      giftAccounts: { orderBy: { sortOrder: "asc" } },
      template: true,
      user: { select: { id: true, plan: true } },
    },
  });

  if (!wedding || (wedding.status !== "published" && rawGuestSlug !== "preview")) notFound();

  // Support ?c=KodeTamu or ?to=Nama+Tamu or ?u=Nama+Tamu
  const guestQueryParam = (sParams?.c || sParams?.to || sParams?.u)
    ? decodeURIComponent(sParams.c || sParams.to || sParams.u || "").trim()
    : null;

  let guest = null;
  if (guestQueryParam) {
    const normalizedQuery = guestQueryParam.replace(/\s+/g, "-").toLowerCase();
    guest = await prisma.guest.findFirst({
      where: {
        weddingId: wedding.id,
        OR: [
          { slug: guestQueryParam },
          { slug: normalizedQuery },
          { name: guestQueryParam },
        ],
      },
      include: { rsvp: true },
    });

    if (guest) {
      await Promise.all([
        prisma.guest.update({ where: { id: guest.id }, data: { openedAt: guest.openedAt ?? new Date() } }),
        trackEvent({ weddingId: wedding.id, guestId: guest.id, event: "invitation_view" }),
      ]);
    }
  } else if (rawGuestSlug !== "preview") {
    guest = await prisma.guest.findFirst({
      where: {
        weddingId: wedding.id,
        OR: [
          { slug: rawGuestSlug },
          { slug: normalizedGuest },
          { slug: decodedGuest },
          { name: decodedGuest },
        ],
      },
      include: { rsvp: true },
    });
    if (!guest) notFound();
    await Promise.all([
      prisma.guest.update({ where: { id: guest.id }, data: { openedAt: guest.openedAt ?? new Date() } }),
      trackEvent({ weddingId: wedding.id, guestId: guest.id, event: "invitation_view" }),
    ]);
  }

  const messages = await getApprovedMessages(wedding.id, 50);

  const requestedTpl = sParams?.tpl;
  const templateSlug =
    requestedTpl && getTemplate(requestedTpl)
      ? requestedTpl
      : wedding.template?.slug ?? "pixel-adventure";
  const template = getTemplate(templateSlug);
  if (!template) notFound();

  const weddingWithDemo = {
    ...wedding,
    isDemo: isDemoWedding(wedding.slug),
  };

  return (
    <InvitationClient
      wedding={weddingWithDemo as Parameters<typeof InvitationClient>[0]["wedding"]}
      guest={guest as Parameters<typeof InvitationClient>[0]["guest"]}
      messages={messages as Parameters<typeof InvitationClient>[0]["messages"]}
      templateSlug={templateSlug}
    />
  );
}
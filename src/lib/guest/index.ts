import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export function generateGuestCode(length = 7): string {
  // Characters excluding visually ambiguous ones (0, O, 1, l, I)
  const chars = "23456789abcdefghjkmnpqrstuvwxyz";
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

export async function getGuests(weddingId: string) {
  return prisma.guest.findMany({
    where: { weddingId },
    include: { rsvp: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getGuestBySlug(weddingId: string, guestSlug: string) {
  return prisma.guest.findFirst({
    where: { weddingId, slug: guestSlug },
    include: { rsvp: true },
  });
}

export async function createGuest(
  weddingId: string,
  data: {
    name: string;
    phone?: string;
    address?: string;
    category?: string;
    guestCount?: number;
    tableNumber?: string;
    sessionName?: string;
    slug?: string;
  }
) {
  let slug = data.slug?.trim();

  // If no custom slug is specified, generate a random unique safe code
  if (!slug) {
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      const candidate = generateGuestCode(7);
      const existing = await prisma.guest.findUnique({
        where: { weddingId_slug: { weddingId, slug: candidate } },
      });
      if (!existing) {
        slug = candidate;
        isUnique = true;
      }
      attempts++;
    }
    if (!slug) {
      slug = generateGuestCode(9);
    }
  }

  const qrCodeToken = `HVW-${weddingId.slice(-4).toUpperCase()}-${slug.toUpperCase()}`;

  return prisma.guest.create({
    data: {
      weddingId,
      name: data.name,
      slug,
      phone: data.phone ?? "",
      address: data.address ?? "",
      category: data.category ?? "general",
      guestCount: data.guestCount ?? 1,
      tableNumber: data.tableNumber ?? "",
      sessionName: data.sessionName ?? "",
      qrCode: qrCodeToken,
    },
  });
}

export async function updateGuest(
  id: string,
  data: Partial<{
    name: string;
    phone: string;
    address: string;
    category: string;
    guestCount: number;
    tableNumber: string;
    sessionName: string;
    attendanceStatus: string;
    checkedIn: boolean;
    checkedInAt: Date | null;
    checkedInPax: number;
    souvenirTaken: boolean;
    giftType: string;
    checkInNotes: string;
  }>
) {
  return prisma.guest.update({ where: { id }, data });
}

export async function deleteGuest(id: string) {
  return prisma.guest.delete({ where: { id } });
}

export async function markGuestOpened(id: string) {
  return prisma.guest.update({
    where: { id },
    data: { openedAt: new Date() },
  });
}

export async function checkInGuest(
  weddingId: string,
  criteria: { guestId?: string; slug?: string; qrCode?: string },
  checkInData: {
    checkedInPax?: number;
    souvenirTaken?: boolean;
    giftType?: string;
    checkInNotes?: string;
  }
) {
  // Find guest by ID, QR Code token, slug, URL, or guest name
  let guest = null;

  if (criteria.guestId) {
    guest = await prisma.guest.findFirst({
      where: { id: criteria.guestId, weddingId },
      include: { rsvp: true },
    });
  } else {
    const rawInput = (criteria.qrCode || criteria.slug || "").trim();
    if (!rawInput) {
      return { success: false, error: "Kode atau identitas tamu belum diisi." };
    }

    // 1. Ekstrak kemungkinan slug jika user memasukkan URL (misal: .../invitation/alex-sara/fw9x5sq)
    let extractedSlug = "";
    if (rawInput.includes("/invitation/") || rawInput.includes("/")) {
      const cleanPath = rawInput.split("?")[0].replace(/\/+$/, "");
      const segments = cleanPath.split("/");
      extractedSlug = segments[segments.length - 1] || "";
    }

    // 2. Ekstrak kemungkinan slug jika user memasukkan token QR (misal: HVW-ALEX-S-FW9X5SQ atau HVW-FZW3-FW9X5SQ)
    let tokenLastSegment = "";
    if (rawInput.toUpperCase().startsWith("HVW-")) {
      const parts = rawInput.split("-");
      tokenLastSegment = parts[parts.length - 1] || "";
    }

    // Kumpulan string pencocokan
    const candidateStrings = Array.from(
      new Set(
        [
          rawInput,
          rawInput.toLowerCase(),
          rawInput.toUpperCase(),
          extractedSlug,
          extractedSlug.toLowerCase(),
          extractedSlug.toUpperCase(),
          tokenLastSegment,
          tokenLastSegment.toLowerCase(),
          tokenLastSegment.toUpperCase(),
        ].filter(Boolean)
      )
    );

    // Pencarian Tahap 1: Exact matches pada QR Code token, Slug, ID, atau Nama
    guest = await prisma.guest.findFirst({
      where: {
        weddingId,
        OR: [
          ...candidateStrings.map((val) => ({ qrCode: val })),
          ...candidateStrings.map((val) => ({ slug: val })),
          ...candidateStrings.map((val) => ({ id: val })),
          ...candidateStrings.map((val) => ({ name: val })),
          ...candidateStrings.map((val) => ({ phone: val })),
        ],
      },
      include: { rsvp: true },
    });

    // Pencarian Tahap 2: In-memory tolerant search (kompatibel SQLite & PostgreSQL)
    if (!guest) {
      const allWeddingGuests = await prisma.guest.findMany({
        where: { weddingId },
        include: { rsvp: true },
      });

      const queryClean = rawInput.toLowerCase().replace(/[^a-z0-9]/g, "");
      const tokenClean = tokenLastSegment.toLowerCase().replace(/[^a-z0-9]/g, "");

      guest = allWeddingGuests.find((g) => {
        const gNameClean = g.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const gSlugClean = g.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
        const gQrClean = (g.qrCode || "").toLowerCase().replace(/[^a-z0-9]/g, "");

        return (
          gSlugClean === queryClean ||
          gNameClean === queryClean ||
          gQrClean === queryClean ||
          (tokenClean && (gSlugClean === tokenClean || gQrClean.includes(tokenClean))) ||
          (queryClean.length >= 3 && (gNameClean.includes(queryClean) || queryClean.includes(gSlugClean)))
        );
      }) || null;
    }
  }

  if (!guest) {
    return { success: false, error: "Data tamu tidak ditemukan untuk acara ini" };
  }

  const pax = checkInData.checkedInPax ?? guest.guestCount ?? 1;
  const isSouvenir = checkInData.souvenirTaken ?? (guest.souvenirTaken || true);
  const gift = checkInData.giftType ?? guest.giftType ?? "";
  const notes = checkInData.checkInNotes ?? guest.checkInNotes ?? "";

  const updatedGuest = await prisma.guest.update({
    where: { id: guest.id },
    data: {
      checkedIn: true,
      checkedInAt: new Date(),
      checkedInPax: pax,
      souvenirTaken: isSouvenir,
      giftType: gift,
      checkInNotes: notes,
      attendanceStatus: "attending",
    },
    include: { rsvp: true },
  });

  return { success: true, guest: updatedGuest };
}

export async function undoCheckInGuest(weddingId: string, guestId: string) {
  const guest = await prisma.guest.findFirst({
    where: { id: guestId, weddingId },
  });

  if (!guest) {
    return { success: false, error: "Tamu tidak ditemukan" };
  }

  const updated = await prisma.guest.update({
    where: { id: guest.id },
    data: {
      checkedIn: false,
      checkedInAt: null,
      checkedInPax: 1,
      souvenirTaken: false,
      checkInNotes: "",
    },
  });

  return { success: true, guest: updated };
}

export async function quickRegisterCheckIn(
  weddingId: string,
  data: {
    name: string;
    address?: string;
    category?: string;
    guestCount?: number;
    tableNumber?: string;
    sessionName?: string;
    souvenirTaken?: boolean;
    giftType?: string;
    checkInNotes?: string;
  }
) {
  const slug = generateGuestCode(8);
  const qrCodeToken = `HVW-${weddingId.slice(-4).toUpperCase()}-${slug.toUpperCase()}`;

  const guest = await prisma.guest.create({
    data: {
      weddingId,
      name: data.name.trim(),
      slug,
      address: data.address?.trim() ?? "",
      category: data.category?.trim() ?? "Reguler",
      guestCount: data.guestCount ?? 1,
      tableNumber: data.tableNumber?.trim() ?? "",
      sessionName: data.sessionName?.trim() ?? "",
      qrCode: qrCodeToken,
      attendanceStatus: "attending",
      checkedIn: true,
      checkedInAt: new Date(),
      checkedInPax: data.guestCount ?? 1,
      souvenirTaken: data.souvenirTaken ?? true,
      giftType: data.giftType ?? "",
      checkInNotes: data.checkInNotes ?? "Tamu On-the-spot di Meja Resepsionis",
    },
  });

  return { success: true, guest };
}

export async function getGuestbookStats(weddingId: string) {
  const guests = await prisma.guest.findMany({
    where: { weddingId },
    select: {
      id: true,
      name: true,
      address: true,
      category: true,
      guestCount: true,
      tableNumber: true,
      checkedIn: true,
      checkedInAt: true,
      checkedInPax: true,
      souvenirTaken: true,
      giftType: true,
    },
  });

  const totalGuests = guests.length;
  const totalInvitedPax = guests.reduce((sum, g) => sum + g.guestCount, 0);
  const checkedInGuests = guests.filter((g) => g.checkedIn);
  const totalCheckedInCount = checkedInGuests.length;
  const totalCheckedInPax = checkedInGuests.reduce((sum, g) => sum + g.checkedInPax, 0);
  const vipCheckedIn = checkedInGuests.filter((g) =>
    g.category.toLowerCase().includes("vip")
  ).length;
  const totalSouvenirsGiven = guests.filter((g) => g.souvenirTaken).length;

  return {
    totalGuests,
    totalInvitedPax,
    totalCheckedInCount,
    totalCheckedInPax,
    vipCheckedIn,
    totalSouvenirsGiven,
    attendanceRate: totalGuests > 0 ? Math.round((totalCheckedInCount / totalGuests) * 100) : 0,
  };
}

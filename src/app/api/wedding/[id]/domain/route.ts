import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────
// GET /api/wedding/[id]/domain
// Ambil info domain saat ini (subdomain + custom domain)
// ─────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const wedding = await prisma.wedding.findFirst({
    where: { id, userId: session.user.id },
    select: {
      id: true,
      slug: true,
      plan: true,
      customSubdomain: true,
      customDomain: true,
      domainVerified: true,
    },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
  }

  return NextResponse.json(wedding);
}

// ─────────────────────────────────────────────
// PUT /api/wedding/[id]/domain
// Update customSubdomain dan/atau customDomain
// ─────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Pastikan wedding milik user
  const wedding = await prisma.wedding.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, plan: true, slug: true },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
  }

  // Fitur custom domain hanya untuk Paket Exclusive (luxury)
  if (wedding.plan !== "luxury") {
    return NextResponse.json(
      {
        error: "Fitur Custom Domain hanya tersedia untuk Paket Exclusive (Luxury).",
        requireUpgrade: true,
      },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { customSubdomain, customDomain } = body as {
    customSubdomain?: string | null;
    customDomain?: string | null;
  };

  // Validasi dan normalisasi subdomain
  let cleanSubdomain: string | null = null;
  if (customSubdomain !== undefined) {
    if (customSubdomain === null || customSubdomain === "") {
      cleanSubdomain = null;
    } else {
      // Hanya huruf kecil, angka, dan tanda hubung
      cleanSubdomain = customSubdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
      // Tidak boleh dimulai atau diakhiri tanda hubung
      cleanSubdomain = cleanSubdomain.replace(/^-+|-+$/g, "");

      if (cleanSubdomain.length < 3) {
        return NextResponse.json(
          { error: "Subdomain minimal 3 karakter." },
          { status: 400 }
        );
      }
      if (cleanSubdomain.length > 63) {
        return NextResponse.json(
          { error: "Subdomain maksimal 63 karakter." },
          { status: 400 }
        );
      }

      // Cek duplikat subdomain (kecuali wedding ini sendiri)
      const existing = await prisma.wedding.findFirst({
        where: { customSubdomain: cleanSubdomain, id: { not: id } },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: `Subdomain "${cleanSubdomain}.hayvows.com" sudah digunakan. Pilih nama lain.` },
          { status: 409 }
        );
      }
    }
  }

  // Validasi dan normalisasi custom domain
  let cleanDomain: string | null = null;
  let domainVerified = false;
  if (customDomain !== undefined) {
    if (customDomain === null || customDomain === "") {
      cleanDomain = null;
    } else {
      // Basic domain format validation
      const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      cleanDomain = customDomain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

      if (!domainRegex.test(cleanDomain)) {
        return NextResponse.json(
          { error: "Format domain tidak valid. Contoh: romeo-juliet.com" },
          { status: 400 }
        );
      }

      // Tidak boleh pakai domain hayvows.com — gunakan customSubdomain
      if (cleanDomain.endsWith("hayvows.com")) {
        return NextResponse.json(
          { error: "Untuk subdomain Hayvows, gunakan field Subdomain Hayvows di atas." },
          { status: 400 }
        );
      }

      // Cek duplikat domain
      const existingDomain = await prisma.wedding.findFirst({
        where: { customDomain: cleanDomain, id: { not: id } },
        select: { id: true },
      });
      if (existingDomain) {
        return NextResponse.json(
          { error: `Domain "${cleanDomain}" sudah terdaftar di sistem Hayvows.` },
          { status: 409 }
        );
      }

      // Reset verified status karena domain baru
      domainVerified = false;
    }
  }

  // Siapkan data update
  const updateData: {
    customSubdomain?: string | null;
    customDomain?: string | null;
    domainVerified?: boolean;
  } = {};

  if (customSubdomain !== undefined) updateData.customSubdomain = cleanSubdomain;
  if (customDomain !== undefined) {
    updateData.customDomain = cleanDomain;
    updateData.domainVerified = domainVerified;
  }

  const updated = await prisma.wedding.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      slug: true,
      plan: true,
      customSubdomain: true,
      customDomain: true,
      domainVerified: true,
    },
  });

  return NextResponse.json(updated);
}

// ─────────────────────────────────────────────
// DELETE /api/wedding/[id]/domain
// Hapus custom domain saja (reset ke default slug)
// ─────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const url = new URL(req.url);
  const target = url.searchParams.get("target"); // "subdomain" | "domain"

  const wedding = await prisma.wedding.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!wedding) {
    return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
  }

  const updateData: { customSubdomain?: null; customDomain?: null; domainVerified?: boolean } = {};
  if (target === "subdomain") {
    updateData.customSubdomain = null;
  } else if (target === "domain") {
    updateData.customDomain = null;
    updateData.domainVerified = false;
  } else {
    // Hapus keduanya
    updateData.customSubdomain = null;
    updateData.customDomain = null;
    updateData.domainVerified = false;
  }

  const updated = await prisma.wedding.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      slug: true,
      customSubdomain: true,
      customDomain: true,
      domainVerified: true,
    },
  });

  return NextResponse.json(updated);
}

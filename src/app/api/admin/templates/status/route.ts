import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pastikan pemanggil adalah Super Admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Super Admin yang berhak mengubah status publikasi tema." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { templateId, adminOnly } = body;

    if (!templateId || typeof adminOnly !== "boolean") {
      return NextResponse.json(
        { error: "Parameter templateId dan adminOnly wajib disertakan." },
        { status: 400 }
      );
    }

    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: { adminOnly },
    });

    const statusLabel = adminOnly
      ? "Mode Uji Coba Admin (Draft / Beta)"
      : "Publik (Bisa Dipilih Seluruh Pengguna)";

    return NextResponse.json({
      success: true,
      message: `Tema "${updatedTemplate.name}" berhasil diubah ke: ${statusLabel}`,
      template: updatedTemplate,
    });
  } catch (error: any) {
    console.error("[ADMIN_TEMPLATE_STATUS_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status tema: " + (error?.message || "Internal error") },
      { status: 500 }
    );
  }
}

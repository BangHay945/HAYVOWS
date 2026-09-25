import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pastikan pemanggil adalah admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (currentUser?.role !== "admin") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Super Admin yang berhak mengubah paket." },
        { status: 403 }
      );
    }

    const { targetUserId, newPlan } = await req.json();

    if (!targetUserId || !["basic", "premium", "luxury"].includes(newPlan)) {
      return NextResponse.json({ error: "Parameter tidak valid" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { plan: newPlan },
    });

    return NextResponse.json({
      success: true,
      message: `Paket pengguna ${updatedUser.name || updatedUser.email} berhasil diubah menjadi ${newPlan.toUpperCase()}`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        plan: updatedUser.plan,
      },
    });
  } catch (error: any) {
    console.error("[ADMIN_UPDATE_PLAN_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui paket pengguna: " + (error?.message || "Internal error") },
      { status: 500 }
    );
  }
}

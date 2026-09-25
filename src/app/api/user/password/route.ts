import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Semua kolom kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Konfirmasi kata sandi baru tidak cocok" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal harus 6 karakter" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    // Jika user punya password lama, verifikasi
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Kata sandi saat ini salah" },
          { status: 400 }
        );
      }
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kata sandi Anda berhasil diperbarui!",
    });
  } catch (error) {
    console.error("[PASSWORD_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kata sandi" },
      { status: 500 }
    );
  }
}

"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type ResetPasswordState = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function resetPasswordAction(
  prevState: ResetPasswordState | undefined,
  formData: FormData
): Promise<ResetPasswordState> {
  const token = ((formData.get("token") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";

  if (!token || !email) {
    return { error: "Parameter tautan tidak valid atau telah rusak." };
  }

  if (!password || password.length < 6) {
    return { error: "Kata sandi baru minimal harus terdiri dari 6 karakter." };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi kata sandi baru tidak cocok." };
  }

  try {
    const identifier = `password-reset:${email}`;

    // Cari token valid di database
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier,
        token,
      },
    });

    if (!verificationToken) {
      return {
        error:
          "Tautan pengaturan ulang kata sandi ini tidak valid atau sudah pernah digunakan.",
      };
    }

    // Periksa apakah token sudah kedaluwarsa (1 jam)
    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.deleteMany({
        where: { identifier },
      });
      return {
        error:
          "Tautan pengaturan ulang kata sandi telah kedaluwarsa. Silakan minta tautan baru.",
      };
    }

    // Pastikan user ada
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Pengguna dengan email ini tidak ditemukan." };
    }

    // Hash kata sandi baru
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update kata sandi pengguna
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Hapus token agar tidak bisa digunakan berulang kali
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    return {
      success: true,
      message: "Kata sandi Anda berhasil diperbarui!",
    };
  } catch (err: any) {
    console.error("[RESET_PASSWORD_ERROR]", err);
    return {
      error:
        "Terjadi kesalahan saat memperbarui kata sandi. Silakan coba lagi.",
    };
  }
}

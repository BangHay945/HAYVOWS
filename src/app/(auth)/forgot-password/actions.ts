"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export type ForgotPasswordState = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function forgotPasswordAction(
  prevState: ForgotPasswordState | undefined,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "Silakan masukkan alamat email yang valid." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Keamanan: selalu tampilkan pesan berhasil agar penyerang tidak bisa mengecek keberadaan email
    if (!user) {
      return {
        success: true,
        message:
          "Jika email tersebut terdaftar, tautan atur ulang kata sandi telah dikirim. Silakan periksa kotak masuk atau folder spam Anda.",
      };
    }

    // Buat token acak yang aman (crypto)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // Berlaku 1 jam

    // Simpan ke tabel verification_tokens
    const identifier = `password-reset:${email}`;
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    await prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires,
      },
    });

    const appUrl = process.env.NEXTAUTH_URL || "https://hayvows.com";
    const resetUrl = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(
      email
    )}`;

    // Kirim email reset kata sandi
    await sendPasswordResetEmail({
      to: email,
      name: user.name,
      resetUrl,
    });

    return {
      success: true,
      message:
        "Tautan atur ulang kata sandi telah dikirim ke email Anda! Silakan periksa kotak masuk (atau folder spam).",
    };
  } catch (err: any) {
    console.error("[FORGOT_PASSWORD_ERROR]", err);
    return {
      error:
        "Terjadi kesalahan saat memproses permintaan. Silakan coba beberapa saat lagi.",
    };
  }
}

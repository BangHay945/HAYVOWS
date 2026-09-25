"use server";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
} from "@/lib/security/loginRateLimiter";

export async function loginAction(
  prevState: string | undefined,
  formData: FormData
) {
  const email = ((formData.get("email") as string) || "").trim();
  const password = (formData.get("password") as string) || "";

  if (!email || !password) {
    return "Silakan masukkan email dan kata sandi Anda.";
  }

  // 1. Cek proteksi brute-force rate limit
  const rateLimitStatus = checkLoginRateLimit(email);
  if (!rateLimitStatus.allowed) {
    return rateLimitStatus.message;
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    // Reset pencatatan kegagalan setelah login berhasil
    resetLoginRateLimit(email);
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      // Catat kegagalan login dan berikan pesan informatif sisa percobaan
      const failureResult = recordFailedLogin(email);

      switch (error.type) {
        case "CredentialsSignin":
          return (
            failureResult.message ||
            "Email atau kata sandi yang Anda masukkan tidak sesuai."
          );
        default:
          return "Terjadi kesalahan saat masuk. Silakan coba lagi.";
      }
    }
    // In Next.js, redirect() throws an error which must be re-thrown!
    throw error;
  }
}

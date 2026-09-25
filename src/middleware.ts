import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Mendekripsi token sesi menggunakan secret key resmi
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  let token = null;

  try {
    token = await getToken({
      req,
      secret,
    });
  } catch {
    // Fallback jika token rusak / invalid
    token = null;
  }

  // Fallback cek cookie jika token belum terurai
  const hasSessionCookie =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = !!token || !!hasSessionCookie;
  const userRole = (token?.role as string) || "client";

  // Public routes
  const publicRoutes = ["/login", "/register", "/invitation"];
  const isPublic =
    publicRoutes.some((r) => pathname.startsWith(r)) || pathname === "/";

  // 1. Jika belum login dan mengakses rute tertutup
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. Jika sudah login dan membuka halaman auth (login/register)
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. Proteksi Khusus Rute Super Admin (Defense-in-depth)
  if (pathname.startsWith("/dashboard/admin")) {
    if (token && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ─────────────────────────────────────────────────────────────────────────────
// HAYVOWS MIDDLEWARE
// Handles:
//   1. Custom Subdomain routing: alex-sara.hayvows.com → /invitation/alex-sara
//   2. Custom Domain routing:    romeo-juliet.com → /invitation/alex-sara
//   3. Auth protection for dashboard routes
// ─────────────────────────────────────────────────────────────────────────────

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "hayvows.com";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  // Bersihkan port jika ada (contoh: 103.13.207.35:3000 → 103.13.207.35)
  const [hostWithoutPort, port] = hostname.split(":");

  // ── 0. Anti-Direct IP & Canonical Domain Enforcement ───────────────────────
  // Deteksi apakah host berupa IP address (IPv4 atau IPv6)
  const isIpAddress =
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostWithoutPort) ||
    hostWithoutPort.startsWith("[");

  const isLocalDev =
    hostWithoutPort === "localhost" ||
    hostWithoutPort === "127.0.0.1" ||
    hostWithoutPort === "0.0.0.0";

  // Jika bukan local dev dan diakses menggunakan IP address (contoh: 103.13.207.35 atau :3000)
  if (!isLocalDev && (isIpAddress || (port && port !== "80" && port !== "443"))) {
    // Return 301 Permanent Redirect ke domain resmi https://hayvows.com
    // Ditambah header X-Robots-Tag: noindex, nofollow agar Google langsung menghapus URL IP dari hasil pencarian
    const redirectUrl = new URL(`https://${BASE_DOMAIN}${pathname}${search}`);
    const response = NextResponse.redirect(redirectUrl, { status: 301 });
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }

  // Redirect www.hayvows.com ke hayvows.com (canonical domain non-www)
  if (!isLocalDev && hostWithoutPort === `www.${BASE_DOMAIN}`) {
    const redirectUrl = new URL(`https://${BASE_DOMAIN}${pathname}${search}`);
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // ── 1. Custom Subdomain / Custom Domain Routing ──────────────────────────
  // Deteksi apakah request datang dari subdomain hayvows atau custom domain

  const isSubdomain =
    hostWithoutPort.endsWith(`.${BASE_DOMAIN}`) &&
    hostWithoutPort !== `www.${BASE_DOMAIN}` &&
    hostWithoutPort !== BASE_DOMAIN;

  // Jika request dari subdomain hayvows (contoh: alex-sara.hayvows.com)
  if (isSubdomain) {
    const subdomain = hostWithoutPort.replace(`.${BASE_DOMAIN}`, "");
    const url = req.nextUrl.clone();

    if (pathname === "/" || pathname === "") {
      url.pathname = `/invitation/via-subdomain/${subdomain}`;
    } else {
      url.pathname = `/invitation/via-subdomain/${subdomain}${pathname}`;
    }

    return NextResponse.rewrite(url);
  }

  // Jika request dari custom domain (domain pribadi pengguna — bukan hayvows.com, bukan localhost, bukan IP)
  const isCustomDomain =
    !isLocalDev &&
    !isIpAddress &&
    !hostWithoutPort.endsWith(`.${BASE_DOMAIN}`) &&
    hostWithoutPort !== BASE_DOMAIN &&
    hostWithoutPort !== `www.${BASE_DOMAIN}` &&
    !hostname.endsWith(".vercel.app") &&
    !hostname.endsWith(".railway.app") &&
    hostWithoutPort.includes(".");

  if (isCustomDomain) {
    const url = req.nextUrl.clone();
    if (pathname === "/" || pathname === "") {
      url.pathname = `/invitation/via-domain/${hostWithoutPort}`;
    } else {
      url.pathname = `/invitation/via-domain/${hostWithoutPort}${pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  // ── 2. Auth Middleware untuk Route Normal hayvows.com ────────────────────

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
  const publicRoutes = ["/login", "/register", "/invitation", "/panduan", "/display"];
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)" ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidAdminSession } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/auth/login";
  const isLogout = pathname === "/api/admin/auth/logout";
  const isProtectedPath = (pathname.startsWith("/admin") && !isLogin)
    || (pathname.startsWith("/api/admin/") && !isLogin && !isLogout);
  const isAuthenticated = isValidAdminSession(request.cookies.get("kv_admin_session")?.value);
  const response = isProtectedPath && !isAuthenticated
    ? pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL(`/admin/login?from=${encodeURIComponent(pathname)}`, request.url))
    : NextResponse.next();

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin/")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

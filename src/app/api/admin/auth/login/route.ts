import { NextResponse } from "next/server";
import { createAdminSessionToken, getAdminSessionSecret, safeStringEqual } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { password } = body as { password?: string };

  const adminPw = process.env.ADMIN_PASSWORD;
  const secret = getAdminSessionSecret();

  if (!adminPw || !secret || (process.env.NODE_ENV === "production" && secret.length < 32)) {
    return NextResponse.json({ error: "Admin authentication is not configured securely." }, { status: 503 });
  }

  if (!password || !safeStringEqual(password, adminPw)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createAdminSessionToken(adminPw, secret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("kv_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

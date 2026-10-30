import { NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { password } = body as { password?: string };

  const adminPw = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET || "kv-secret";

  if (!adminPw || !password || password !== adminPw) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createHash("sha256").update(password + secret).digest("hex");

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

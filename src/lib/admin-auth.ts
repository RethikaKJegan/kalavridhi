import { createHash, timingSafeEqual } from "node:crypto";

const developmentSecret = "kv-secret";

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : developmentSecret);
}

export function createAdminSessionToken(password: string, secret = getAdminSessionSecret()) {
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is required in production.");
  return createHash("sha256").update(password).update(secret).digest("hex");
}

export function safeStringEqual(actual: string, expected: string) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export function isValidAdminSession(token: string | undefined) {
  const password = process.env.ADMIN_PASSWORD;
  const secret = getAdminSessionSecret();
  if (!token || !password || !secret) return false;
  return safeStringEqual(token, createAdminSessionToken(password, secret));
}

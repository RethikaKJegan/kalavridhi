import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const developmentSecret = "kv-secret";

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : developmentSecret);
}

export function createAdminSessionToken(password: string, secret = getAdminSessionSecret()) {
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is required in production.");
  const payload = `${Math.floor(Date.now()/1000)+7*24*60*60}.${randomBytes(16).toString('hex')}`;
  const signature = createHmac('sha256',secret).update(password+'\0'+payload).digest('hex');
  return payload+'.'+signature;
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
  const [expires,nonce,signature,...extra] = token.split('.');
  if(extra.length || !/^\d+$/.test(expires||'') || !/^[a-f0-9]{32}$/.test(nonce||'') || !/^[a-f0-9]{64}$/.test(signature||''))return false;
  const now=Math.floor(Date.now()/1000);
  if(Number(expires)<=now || Number(expires)>now+7*24*60*60)return false;
  return safeStringEqual(signature,createHmac('sha256',secret).update(password+'\0'+expires+'.'+nonce).digest('hex'));
}

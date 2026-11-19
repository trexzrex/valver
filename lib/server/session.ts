import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "valver_session";
export const SESSION_MAX_AGE = 86400;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function createSessionToken(id: string, secret: string, now = Math.floor(Date.now() / 1000)): string {
  if (!secret || secret.length < 32) throw new Error("VALVER_SESSION_SECRET must contain at least 32 characters");
  if (!uuid.test(id)) throw new Error("Invalid analysis identity ID");
  const payload = Buffer.from(JSON.stringify({ id, iat: now, exp: now + SESSION_MAX_AGE })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined, secret: string, now = Math.floor(Date.now() / 1000)): boolean {
  if (!token || token.length > 1024 || !secret || secret.length < 32) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payload, signature] = parts;
    const expected = Buffer.from(sign(payload, secret));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof data.id === "string" && uuid.test(data.id)
      && Number.isInteger(data.iat) && Number.isInteger(data.exp)
      && data.iat <= now && data.exp > now && data.exp - data.iat === SESSION_MAX_AGE;
  } catch {
    return false;
  }
}

export function getSessionIdentityId(token: string | undefined, secret: string): string | null {
  if (!verifySessionToken(token, secret)) return null;
  return JSON.parse(Buffer.from(token!.split(".")[0], "base64url").toString("utf8")).id;
}

export function sessionCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: SESSION_MAX_AGE };
}

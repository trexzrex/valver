/**
 * Same-origin check for state-changing requests.
 *
 * `request.nextUrl.origin` cannot be used here: Next.js builds the internal
 * request URL with the server hostname (usually localhost), so a browser that
 * opens the app through 127.0.0.1, a LAN address, or a proxy domain would be
 * rejected even though the request is same-origin. Compare the browser-provided
 * Origin against the Host the request actually arrived on instead.
 */

interface HeaderSource {
  headers: { get(name: string): string | null };
}

function firstHeaderValue(value: string | null): string | null {
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  return first || null;
}

export function requestHost(request: HeaderSource): string | null {
  return firstHeaderValue(request.headers.get("x-forwarded-host"))
    ?? firstHeaderValue(request.headers.get("host"));
}

export function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/:(80|443)$/, "");
}

export function isSameOrigin(request: HeaderSource): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }
  if (originUrl.protocol !== "http:" && originUrl.protocol !== "https:") return false;
  if (originUrl.username || originUrl.password) return false;

  const host = requestHost(request);
  if (!host) return false;

  return normalizeHost(originUrl.host) === normalizeHost(host);
}

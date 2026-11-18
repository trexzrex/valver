import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/server/session";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
  const valid = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, process.env.VALVER_SESSION_SECRET ?? "");
  if (!valid) {
    const response = NextResponse.redirect(new URL("/input", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/calculate/:path*"],
  runtime: "nodejs",
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/calculate"];
const publicRoutes = ["/", "/input"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("valver_session");

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/input", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/calculate/:path*", "/input"],
};
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions, getSessionIdentityId } from "@/lib/server/session";
import { createServerDatabase } from "@/lib/server/supabase";

export async function GET(request: NextRequest) {
  const headers = { "Cache-Control": "no-store", "Vary": "Cookie" };
  const id = getSessionIdentityId(request.cookies.get(SESSION_COOKIE)?.value, process.env.VALVER_SESSION_SECRET ?? "");
  if (!id) return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401, headers });
  try {
    const { data, error } = await createServerDatabase().from("users_analysis").select("nama,nis,kelas").eq("id", id).single();
    if (error || !data) return NextResponse.json({ error: "Identitas tidak tersedia" }, { status: 503, headers });
    return NextResponse.json({ identity: { nama: data.nama, nis: data.nis, kelas: data.kelas } }, { headers });
  } catch {
    return NextResponse.json({ error: "Identitas tidak tersedia" }, { status: 503, headers });
  }
}

export function DELETE(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Origin tidak valid" }, { status: 403 });
  }
  const response = NextResponse.json({ success: true });
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}

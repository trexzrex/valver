import { NextRequest, NextResponse } from "next/server";
import { validateIdentity } from "@/lib/server/identity";
import { isSameOrigin } from "@/lib/server/origin";
import { createServerDatabase } from "@/lib/server/supabase";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/server/session";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Permintaan harus berasal dari aplikasi Valver" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ error: "Gunakan format JSON" }, { status: 415 });
  }
  // Limit actual bytes, not only the caller-controlled Content-Length header.
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Data identitas wajib diisi" }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        return NextResponse.json({ error: "Data terlalu besar" }, { status: 413 });
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json({ error: "JSON tidak valid" }, { status: 400 });
  }
  const validation = validateIdentity(body);
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

  try {
    const secret = process.env.VALVER_SESSION_SECRET ?? "";
    if (secret.length < 32) throw new Error("Session configuration missing");
    const database = createServerDatabase();
    const { data, error } = await database.from("users_analysis").insert(validation.data).select("id").single();
    if (error || !data) throw new Error("Identity insert failed");
    const response = NextResponse.json({ success: true, message: "Data berhasil disimpan" });
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(SESSION_COOKIE, createSessionToken(data.id, secret), sessionCookieOptions());
    return response;
  } catch {
    // Never log request bodies or return database details containing personal information.
    console.error("Valver identity submission failed; check server configuration and database access.");
    return NextResponse.json({ error: "Gagal menyimpan data. Silakan coba kembali atau hubungi pengelola." }, { status: 503 });
  }
}

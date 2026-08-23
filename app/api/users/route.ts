import { NextRequest, NextResponse } from "next/server";
import { supabase, UserAnalysisInsert } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, nis, kelas } = body;

    if (!nama || !nis || !kelas) {
      return NextResponse.json(
        { error: "Semua field wajib diisi: nama, nis, kelas" },
        { status: 400 }
      );
    }

    const userData: UserAnalysisInsert = {
      nama: nama.trim(),
      nis: nis.trim(),
      kelas: kelas.trim(),
    };

    const { data, error } = await supabase
      .from("users_analysis")
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Gagal menyimpan data ke database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Data berhasil disimpan",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
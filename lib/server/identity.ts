export type Identity = { nama: string; nis: string; kelas: string };
export function validateIdentity(body: unknown): { success: true; data: Identity } | { success: false; error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { success: false, error: "Data identitas tidak valid" };
  const { nama, nis, kelas } = body as Record<string, unknown>;
  if (typeof nama !== "string" || typeof nis !== "string" || typeof kelas !== "string") return { success: false, error: "Nama, NIS, dan kelas wajib berupa teks" };
  const data = { nama: nama.trim(), nis: nis.trim(), kelas: kelas.trim() };
  if (!data.nama || data.nama.length > 100 || !/^[A-Za-z\u00C0-\u017F ]+$/.test(data.nama)) return { success: false, error: "Nama wajib berisi huruf dan spasi, maksimal 100 karakter" };
  if (!/^\d{6}$/.test(data.nis)) return { success: false, error: "NIS wajib terdiri dari tepat 6 digit angka" };
  if (!data.kelas || data.kelas.length > 50 || !/^[A-Za-z0-9 ]+$/.test(data.kelas)) return { success: false, error: "Kelas wajib berisi huruf, angka, dan spasi, maksimal 50 karakter" };
  return { success: true, data };
}

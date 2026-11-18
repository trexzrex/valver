"use client";

import type { useCalculationDraft } from "@/hooks/useCalculationDraft";
type Props = { draft: ReturnType<typeof useCalculationDraft> };
export function DraftNotice({ draft }: Props) {
  const { status, candidate, savedAt, saving, message } = draft;
  const pending = status === "loading" || status === "choice" || status === "blocked";
  return <>
    <aside className="border-b px-4 py-3 text-sm" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
      <p role="status" aria-live="polite">{status === "unavailable" ? message : status === "blocked" ? "Draft sedang dibuka di tab lain." : saving ? "Menyimpan…" : savedAt ? `Tersimpan di perangkat ini · ${new Date(savedAt).toLocaleString("id-ID")}` : "Autosave lokal · draft disimpan setelah input berubah"}</p>
      {message && status !== "unavailable" && <p>{message}</p>}
      <p className="mt-1 text-xs">Hanya pada browser dan alamat ini. Draft kedaluwarsa 7 hari setelah perubahan terakhir. Pengguna lain di profil browser yang sama dapat membukanya. Identitas dan token tidak disimpan dalam draft.</p>
      {!pending && <button type="button" className="mt-2 underline" onClick={draft.clear}>Hapus draft dari perangkat</button>}
    </aside>
    {pending && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4">
      <section role="dialog" aria-modal="true" aria-labelledby="draft-title" className="w-full max-w-lg rounded-2xl border p-6 shadow-xl" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
        <h2 id="draft-title" className="text-xl font-bold">{status === "choice" ? "Ada draft perhitungan tersimpan" : status === "blocked" ? "Draft sedang digunakan di tab lain" : "Memeriksa draft…"}</h2>
        {status === "choice" && <>
          <p className="mt-3">Terakhir disimpan: {candidate && new Date(candidate.savedAt).toLocaleString("id-ID")}</p>
          <p className="mt-2 text-sm">Lanjutkan hanya jika ini pekerjaan Anda. Identitas laporan perlu diperiksa kembali.</p>
          <div className="mt-5 flex flex-wrap gap-4"><button autoFocus type="button" className="rounded-lg px-4 py-3 font-semibold" style={{ background: "var(--accent)", color: "var(--surface)" }} onClick={draft.resume}>Lanjutkan draft</button><button type="button" className="rounded-lg border px-4 py-3" onClick={draft.clear}>Mulai baru</button></div>
        </>}
        {status === "blocked" && <><p className="mt-3">Tutup tab kalkulator lain, lalu muat ulang halaman ini. Input diblokir agar draft tidak tertimpa.</p><button type="button" className="mt-5 underline" onClick={() => window.location.reload()}>Muat ulang</button></>}
      </section>
    </div>}
  </>;
}

"use client";

import { useState } from "react";
import { Check, FloppyDisk, Info, Warning, Trash, CircleNotch } from "@phosphor-icons/react";
import { DRAFT_TTL } from "@/lib/draft";
import type { useCalculationDraft } from "@/hooks/useCalculationDraft";

type Props = { draft: ReturnType<typeof useCalculationDraft>; mode?: "status" | "recovery" };
const fullDate = (value: number) => new Date(value).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });

export function DraftNotice({ draft, mode = "status" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { status, candidate, savedAt, saving, message } = draft;
  const pending = status === "loading" || status === "choice" || status === "blocked";
  const unavailable = status === "unavailable";
  const restored = message.startsWith("Data perhitungan dipulihkan");

  if (mode === "recovery") return pending ? <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4">
    <section role="dialog" aria-modal="true" aria-labelledby="draft-title" className="w-full max-w-lg rounded-2xl border p-6 shadow-xl" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
      <h2 id="draft-title" className="text-xl font-bold">{status === "choice" ? "Ada draft perhitungan tersimpan" : status === "blocked" ? "Draft sedang digunakan di tab lain" : "Memeriksa draft…"}</h2>
      {status === "choice" && <>
        <p className="mt-3">Terakhir disimpan: {candidate && fullDate(candidate.savedAt)}</p>
        <p className="mt-2 text-sm">Lanjutkan hanya jika ini pekerjaan Anda. Identitas laporan perlu diperiksa kembali.</p>
        <div className="mt-5 flex flex-wrap gap-4"><button autoFocus type="button" className="rounded-lg px-4 py-3 font-semibold" style={{ background: "var(--accent)", color: "var(--surface)" }} onClick={draft.resume}>Lanjutkan draft</button><button type="button" className="rounded-lg border px-4 py-3" onClick={draft.clear}>Mulai baru</button></div>
      </>}
      {status === "blocked" && <><p className="mt-3">Tutup tab kalkulator lain, lalu muat ulang halaman ini. Input diblokir agar draft tidak tertimpa.</p><button type="button" className="mt-5 underline" onClick={() => window.location.reload()}>Muat ulang</button></>}
    </section>
  </div> : null;

  const Icon = unavailable ? Warning : saving ? CircleNotch : savedAt ? Check : FloppyDisk;
  const title = unavailable ? "Autosave tidak aktif" : saving ? "Menyimpan…" : savedAt ? "Draft tersimpan" : "Autosave aktif";
  const subtitle = unavailable ? "Perubahan belum tersimpan di perangkat" : savedAt ? `Di perangkat ini · ${new Date(savedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}` : "Input disimpan otomatis · masa simpan 3 hari";
  const accent = unavailable ? "#fbbf24" : "var(--accent)";

  return <aside aria-label="Penyimpanan draft" className="mb-5 overflow-hidden rounded-2xl border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
    <div className="flex items-center gap-3 py-3 pl-3 pr-2 sm:pl-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: unavailable ? "rgba(251,191,36,.1)" : "var(--accent-muted)", color: accent }}><Icon size={20} weight="bold" className={saving ? "motion-safe:animate-spin" : ""} aria-hidden="true" /></span>
      <div className="min-w-0 flex-1" role="status" aria-live="polite">
        <p className="text-sm font-semibold leading-5" style={{ color: "var(--text-primary)" }}>{title}</p>
        <p className="mt-0.5 text-xs leading-5" style={{ color: unavailable ? accent : "var(--text-muted)" }}>{subtitle}</p>
      </div>
      <button type="button" aria-label="Informasi penyimpanan draft" aria-expanded={expanded} aria-controls="draft-storage-details" onClick={() => setExpanded(!expanded)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: expanded ? "var(--accent)" : "var(--text-secondary)" }}><Info size={21} aria-hidden="true" /></button>
    </div>
    {unavailable && <p role="alert" className="px-4 pb-3 text-xs leading-5" style={{ color: "#fbbf24" }}>{message}</p>}
    {message && !unavailable && !restored && <p className="px-4 pb-3 text-xs leading-5" style={{ color: "var(--text-secondary)" }}>{message}</p>}
    {expanded && <div id="draft-storage-details" className="border-t p-4 text-sm leading-6" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
      <h3 className="mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>Tentang penyimpanan draft</h3>
      <p>Disimpan hanya di browser dan perangkat ini. Draft kedaluwarsa 3 hari setelah perubahan terakhir.</p>
      {savedAt && <dl className="my-4 grid gap-3 rounded-xl p-3 text-xs" style={{ background: "var(--surface-muted)" }}><div><dt style={{ color: "var(--text-muted)" }}>Terakhir disimpan</dt><dd className="font-medium" style={{ color: "var(--text-primary)" }}>{fullDate(savedAt)}</dd></div><div><dt style={{ color: "var(--text-muted)" }}>Berlaku sampai</dt><dd className="font-medium" style={{ color: "var(--text-primary)" }}>{fullDate(savedAt + DRAFT_TTL)}</dd></div></dl>}
      <p className="mt-3 text-xs leading-5">Identitas dan token tidak ikut disimpan. Pengguna lain di profil browser ini dapat membuka draft. Menghapus data situs juga menghapus draft.</p>
      {!pending && <button type="button" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-medium hover:bg-red-500/10 focus-visible:outline-2" style={{ color: "#f87171" }} onClick={draft.clear}><Trash size={16} aria-hidden="true" />Hapus draft dari perangkat</button>}
    </div>}
  </aside>;
}

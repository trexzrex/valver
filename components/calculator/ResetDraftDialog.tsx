"use client";

import { useEffect, useId, useRef } from "react";
import { Trash } from "@phosphor-icons/react";
import type { useCalculationDraft } from "@/hooks/useCalculationDraft";

export function ResetDraftDialog({ draft }: { draft: ReturnType<typeof useCalculationDraft> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!draft.clearRequested) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    dialog.showModal();
    cancelRef.current?.focus();
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [draft.clearRequested]);

  return (
    <dialog ref={dialogRef} aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}
      onCancel={(event) => { event.preventDefault(); draft.cancelClear(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
      <div className="p-6 sm:p-7">
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><Trash size={25} weight="duotone" aria-hidden="true" /></span>
        <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight">Mulai perhitungan baru?</h2>
        <p id={`${id}-description`} className="mt-3 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
          Seluruh input perhitungan dan draft tersimpan di browser ini akan dihapus. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" onClick={draft.cancelClear}
            className="min-h-11 rounded-xl border px-5 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>Batal</button>
          <button type="button" onClick={draft.confirmClear}
            className="min-h-11 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">Hapus &amp; mulai baru</button>
        </div>
      </div>
    </dialog>
  );
}

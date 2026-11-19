"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createDraft, defaultInputs, DRAFT_KEY, parseDraft, type DraftInputs } from "@/lib/draft";

type Status = "loading" | "choice" | "ready" | "blocked" | "unavailable";
export function useCalculationDraft(inputs: DraftInputs, restore: (data: DraftInputs) => void) {
  const [status, setStatus] = useState<Status>("loading");
  const [candidate, setCandidate] = useState<ReturnType<typeof createDraft> | null>(null);
  const [message, setMessage] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [clearRequested, setClearRequested] = useState(false);
  const current = useRef(inputs);
  const baseline = useRef(JSON.stringify(inputs));
  const active = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreRef = useRef(restore);
  useEffect(() => { restoreRef.current = restore; }, [restore]);

  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!active.current) return;
    const serialized = JSON.stringify(current.current);
    if (serialized === baseline.current) return;
    try {
      const draft = createDraft(current.current);
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      baseline.current = serialized;
      setSavedAt(draft.savedAt);
      setSaving(false);
    } catch {
      active.current = false;
      setStatus("unavailable");
      setSaving(false);
      setMessage("Autosave tidak tersedia. Input masih dapat digunakan selama halaman terbuka.");
    }
  }, []);

  useEffect(() => {
    let disposed = false;
    let release: (() => void) | undefined;
    const initialize = () => {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        // Verify storage is writable even when no draft exists.
        localStorage.setItem(DRAFT_KEY + "-probe", "1");
        localStorage.removeItem(DRAFT_KEY + "-probe");
        const parsed = raw ? parseDraft(raw) : null;
        if (parsed && "data" in parsed) {
          setCandidate(createDraft(parsed.data, parsed.savedAt));
          setStatus("choice");
        } else {
          if (raw) {
            localStorage.removeItem(DRAFT_KEY);
            setMessage(parsed && "reason" in parsed && parsed.reason === "expired" ? "Draft berumur 3 hari atau lebih telah dihapus." : "Draft tidak dapat dibaca dan telah dihapus.");
          }
          active.current = true;
          setStatus("ready");
        }
      } catch {
        setStatus("unavailable");
        setMessage("Autosave tidak tersedia. Input masih dapat digunakan selama halaman terbuka.");
      }
    };
    // Defer initialization so Strict Mode's discarded setup cannot update state or hold a lock.
    queueMicrotask(() => {
      if (disposed) return;
      if (!navigator.locks) {
        setStatus("unavailable");
        setMessage("Browser/alamat ini tidak mendukung penguncian draft. Gunakan HTTPS atau localhost untuk autosave yang aman.");
        return;
      }
      void navigator.locks.request("valver-draft-editor", { ifAvailable: true }, async lock => {
        if (disposed) return;
        if (!lock) { setStatus("blocked"); return; }
        await new Promise<void>(resolve => { release = resolve; initialize(); });
      }).catch(() => { if (!disposed) { setStatus("unavailable"); setMessage("Autosave tidak dapat diaktifkan pada browser ini."); } });
    });
    const onHide = () => { if (document.visibilityState === "hidden") flush(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => {
      disposed = true;
      flush();
      active.current = false;
      release?.();
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
    };
  }, [flush]);

  useEffect(() => {
    current.current = inputs;
    if (!active.current || JSON.stringify(inputs) === baseline.current) return;
    setSaving(true);
    timer.current = setTimeout(flush, 500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [inputs, flush]);

  const resume = () => {
    if (!candidate) return;
    baseline.current = JSON.stringify(candidate.data);
    current.current = candidate.data;
    restoreRef.current(candidate.data);
    setSavedAt(candidate.savedAt);
    setCandidate(null);
    setMessage("Data perhitungan dipulihkan. Identitas laporan tidak dipulihkan dari draft.");
    active.current = true;
    setStatus("ready");
  };
  const clear = () => {
    if (status === "loading" || status === "blocked") return;
    setClearRequested(true);
  };
  const cancelClear = () => setClearRequested(false);
  const confirmClear = () => {
    if (!clearRequested || status === "loading" || status === "blocked") return;
    setClearRequested(false);
    if (timer.current) clearTimeout(timer.current);
    active.current = false;
    try { localStorage.removeItem(DRAFT_KEY); }
    catch { setMessage("Draft tidak dapat dihapus dari penyimpanan browser."); return; }
    const empty = defaultInputs();
    current.current = empty;
    baseline.current = JSON.stringify(empty);
    restoreRef.current(empty);
    setCandidate(null);
    setSavedAt(null);
    setSaving(false);
    setMessage("Input dan draft perhitungan telah dihapus.");
    if (status !== "unavailable") { active.current = true; setStatus("ready"); }
  };
  return { status, candidate, message, savedAt, saving, resume, clear, clearRequested, cancelClear, confirmClear };
}

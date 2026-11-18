import type { KalibrasiRow, ReplicateRow, SpikeRow } from "./types";

export const DRAFT_KEY = "valver-draft-v1";
export const DRAFT_TTL = 7 * 24 * 60 * 60 * 1000;
export interface DraftInputs {
  kalibrasi: KalibrasiRow[];
  wrLow: ReplicateRow[];
  wrHigh: ReplicateRow[];
  blanko: ReplicateRow[];
  spike: SpikeRow[];
  stdRendah: string;
  stdTinggi: string;
  mdlRequirement: string;
}
export interface Draft { version: 1; savedAt: number; data: DraftInputs }
export function defaultInputs(): DraftInputs {
  const rows = () => Array.from({ length: 10 }, () => ({ abs: "", ppm: "" }));
  return { kalibrasi: Array.from({ length: 12 }, () => ({ x: "", y: "" })), wrLow: rows(), wrHigh: rows(), blanko: rows(), spike: rows(), stdRendah: "0.2", stdTinggi: "10", mdlRequirement: "0.05" };
}
export function createDraft(inputs: DraftInputs, now = Date.now()): Draft {
  // Explicit allowlist: never persist identity, authentication or computed results.
  const { kalibrasi, wrLow, wrHigh, blanko, spike, stdRendah, stdTinggi, mdlRequirement } = inputs;
  return { version: 1, savedAt: now, data: { kalibrasi: kalibrasi.map(({x,y})=>({x,y})), wrLow: wrLow.map(({abs,ppm})=>({abs,ppm})), wrHigh: wrHigh.map(({abs,ppm})=>({abs,ppm})), blanko: blanko.map(({abs,ppm})=>({abs,ppm})), spike: spike.map(({abs,ppm})=>({abs,ppm})), stdRendah, stdTinggi, mdlRequirement } };
}
export function parseDraft(raw: string, now = Date.now()): { data: DraftInputs; savedAt: number } | { reason: "expired" | "invalid" } {
  try {
    if (raw.length > 2_000_000) return { reason: "invalid" };
    const value = JSON.parse(raw);
    if (value?.version !== 1 || !Number.isFinite(value.savedAt) || value.savedAt > now) return { reason: "invalid" };
    if (now - value.savedAt >= DRAFT_TTL) return { reason: "expired" };
    const data = value.data;
    const text = (s: unknown) => typeof s === "string" && s.length <= 100;
    if (!data || ![data.stdRendah, data.stdTinggi, data.mdlRequirement].every(text)) return { reason: "invalid" };
    for (const key of ["kalibrasi", "wrLow", "wrHigh", "blanko", "spike"]) {
      const rows = data[key];
      const fields = key === "kalibrasi" ? ["x", "y"] : ["abs", "ppm"];
      if (!Array.isArray(rows) || rows.length < (key === "kalibrasi" ? 2 : 1) || rows.length > 1000 || !rows.every(row => row && fields.every(field => text(row[field])))) return { reason: "invalid" };
    }
    return { data: createDraft(data, value.savedAt).data, savedAt: value.savedAt };
  } catch { return { reason: "invalid" }; }
}

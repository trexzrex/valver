"use client";

import { useId, useState } from "react";
import type { CalibrationResult } from "@/lib/types";
import { buildCalibrationSteps } from "@/lib/calibrationSteps";
import { MathFormula } from "@/components/calculator/MathFormula";

export function CalibrationSteps({ calibration }: { calibration: CalibrationResult | null }) {
  const steps = buildCalibrationSteps(calibration);
  const [expanded, setExpanded] = useState<string[]>([]);
  const prefix = useId();
  const allOpen = steps.length > 0 && steps.every((step) => expanded.includes(step.id));

  return (
    <section className="mt-5 min-w-0" aria-labelledby={`${prefix}-heading`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h4 id={`${prefix}-heading`} className="font-semibold" style={{ color: "var(--text-primary)" }}>Langkah Perhitungan Kalibrasi</h4>
        {steps.length > 0 && (
          <button type="button" className="rounded-lg border px-3 py-2 text-xs font-semibold" style={{ borderColor: "var(--border-default)", color: "var(--accent)" }}
            aria-expanded={allOpen} aria-controls={steps.map((step) => `${prefix}-${step.id}`).join(" ")}
            onClick={() => setExpanded(allOpen ? [] : steps.map((step) => step.id))}>
            {allOpen ? "Tutup semua langkah" : "Buka semua langkah"}
          </button>
        )}
      </div>
      {!steps.length ? (
        <p className="rounded-xl border p-4 text-sm" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>
          Perhitungan belum dapat ditampilkan. Lengkapi minimal dua pasangan konsentrasi dan absorbansi yang valid. Nilai x dan y harus bervariasi, penyebut tidak boleh nol, dan hasil harus berhingga dengan slope bukan nol.
        </p>
      ) : (
        <>
          <p className="mb-3 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            x = konsentrasi (ppm); y = absorbansi; n = {calibration?.n} pasangan lengkap yang digunakan. Σ = jumlah; x̄ dan ȳ = rata-rata. a = intercept; b = slope.
            Angka ditampilkan hingga 8 digit signifikan; perhitungan menggunakan presisi penuh sehingga pembulatan tampilan dapat menimbulkan selisih kecil.
          </p>
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-default)" }}>
            {steps.map((step) => {
              const open = expanded.includes(step.id);
              const panelId = `${prefix}-${step.id}`;
              return (
                <div key={step.id} className="border-b last:border-b-0" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ background: "var(--surface-elevated)" }}>
                    <div className="min-w-0">
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{step.label}</p>
                      <p className="mt-1 break-words font-mono text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{step.result}</p>
                    </div>
                    <button type="button" aria-expanded={open} aria-controls={panelId} aria-label={`${open ? "Tutup" : "Lihat"} perhitungan ${step.label}`}
                      className="shrink-0 rounded-lg px-2 py-2 text-xs font-semibold" style={{ color: "var(--accent)" }}
                      onClick={() => setExpanded((previous) => previous.includes(step.id) ? previous.filter((id) => id !== step.id) : [...previous, step.id])}>
                      {open ? "Tutup perhitungan −" : "Lihat perhitungan +"}
                    </button>
                  </div>
                  <div id={panelId} hidden={!open} className="space-y-3 px-4 py-4 text-sm" style={{ background: "var(--surface-muted)", color: "var(--text-primary)" }}>
                    <div><p className="mb-1 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>1. Rumus umum</p><MathFormula latex={step.formulaLatex} label={`Rumus umum ${step.label}`} /></div>
                    <div><p className="mb-1 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>2. Substitusi angka</p><MathFormula latex={step.substitutionLatex} label={`Substitusi angka ${step.label}`} />{step.id === "rsquared" && <p className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>Menggunakan r dari Rumus 1.</p>}</div>
                    <div><p className="mb-1 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>3. Hasil akhir</p><div style={{ color: "var(--accent)" }}><MathFormula latex={step.resultLatex} label={`Hasil akhir ${step.label}`} /></div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

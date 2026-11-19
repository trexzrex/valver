"use client";

import { motion } from "motion/react";
import { EditableTable, Column } from "./EditableTable";
import { LinearRow } from "@/lib/types";
import { formatNumber, formatNumberFixed } from "@/lib/utils/numberFormat";
import { MathFormula } from "@/components/calculator/MathFormula";
import { formatMathNumber } from "@/lib/calibrationSteps";

interface LinearTableProps {
  linearTable: ReturnType<typeof import("@/lib/calculations").computeLinearTable> | null;
  calibration: ReturnType<typeof import("@/lib/calculations").computeCalibration> | null;
}

export function LinearTable({ linearTable, calibration }: LinearTableProps) {
  if (!calibration || !linearTable) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-xl border text-center"
        style={{ background: "var(--accent-muted)", borderColor: "var(--accent)" }}
      >
        <p style={{ color: "var(--accent)" }}>Masukkan minimal 2 titik data valid pada tabel kurva kalibrasi untuk menampilkan tabel linearitas.</p>
      </motion.div>
    );
  }

  const columns: Column<LinearRow>[] = [
    {
      key: "no",
      header: "No",
      className: "w-12",
      render: (_: LinearRow, i: number) => (
        <span className="font-mono" style={{ color: "var(--text-secondary)" }}>{i + 1}</span>
      ),
    },
    {
      key: "x",
      header: "ppm (x)",
      className: "w-36 font-mono",
      render: (row) => <span style={{ color: "var(--text-primary)" }}>{formatNumberFixed(row.x, 2)}</span>,
    },
    {
      key: "y",
      header: "Absorban (y) - Sebelum Linear",
      className: "w-48 font-mono",
      render: (row) => <span style={{ color: "var(--text-primary)" }}>{formatNumber(row.y)}</span>,
    },
    {
      key: "yPred",
      header: "Ŷ (Prediksi) - Setelah Linear",
      className: "w-48 font-mono",
      render: (row) => <span style={{ color: "var(--accent)" }}>{formatNumber(row.yPred)}</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          Tabel Linearitas (Sebelum & Sesudah Linear)
        </h3>
      </div>

      <EditableTable
        data={linearTable.rows}
        columns={columns}
        onRemoveRow={() => {}}
        minRows={linearTable.rows.length}
        scrollable
      />
      <details className="min-w-0 rounded-xl border" style={{ borderColor: "var(--border-default)", background: "var(--surface-muted)" }}>
        <summary className="cursor-pointer rounded-xl px-4 py-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: "var(--text-primary)" }}>
          Perhitungan absorbansi prediksi
        </summary>
        <div className="min-w-0 space-y-4 border-t p-4" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
          <p className="text-xs leading-6" style={{ color: "var(--text-secondary)" }}>
            ŷ adalah absorbansi prediksi dari garis regresi, bukan hasil pengukuran baru. x adalah konsentrasi (ppm), b adalah slope, dan a adalah intercept. Nomor baris mengikuti tabel linearitas di atas.
            Angka ditampilkan hingga 8 digit signifikan; perhitungan tetap menggunakan presisi penuh.
          </p>
          <div><p className="mb-2 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>1. Rumus umum</p><MathFormula latex={String.raw`\hat{y}_i = bx_i + a`} label="Rumus absorbansi prediksi" /></div>
          <div><p className="mb-2 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>2. Koefisien regresi</p><MathFormula latex={`b = ${formatMathNumber(calibration.B)}, \\quad a = ${formatMathNumber(calibration.A)}`} label="Koefisien regresi" /></div>
          <div className="space-y-4">
            <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>3. Substitusi dan hasil per baris</p>
            {linearTable.rows.map((row, index) => (
              <div key={index} className="min-w-0">
                <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Baris {index + 1} · x = {formatNumber(row.x)} ppm</p>
                <MathFormula
                  latex={`\\hat{y}_{${index + 1}} = \\left(${formatMathNumber(calibration.B)}\\right) \\times \\left(${formatMathNumber(row.x)}\\right) + \\left(${formatMathNumber(calibration.A)}\\right) = ${formatMathNumber(row.yPred)}`}
                  label={`Substitusi absorbansi baris ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </details>
    </motion.div>
  );
}
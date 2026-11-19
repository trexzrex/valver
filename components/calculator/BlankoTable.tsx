"use client";

import { summarizeNumbers } from "@/lib/reportSummary";

import { motion } from "motion/react";
import { EditableTable, Column } from "./EditableTable";
import { ReplicateRow, ReplicateResult } from "@/lib/types";
import { formatNumber, formatBlankoDeviation } from "@/lib/utils/numberFormat";

interface BlankoTableProps {
  data: ReplicateRow[];
  result: ReplicateResult;
  onUpdate: (index: number, field: "abs" | "ppm", value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  mdlBlanko?: number;
  dataRef: React.MutableRefObject<ReplicateRow[]>;
  onDataChange: () => void;
  calibration: ReturnType<typeof import("@/lib/calculations").computeCalibration> | null;
}

export function BlankoTable({ data, result, onUpdate, onAddRow, onRemoveRow, mdlBlanko, dataRef, onDataChange, calibration }: BlankoTableProps) {
  const columns: Column<ReplicateRow>[] = [
    {
      key: "no",
      header: "No",
      className: "w-12",
      render: (_: ReplicateRow, i: number) => (
        <span style={{ color: "var(--text-secondary)" }} className="font-mono">Blanko {i + 1}</span>
      ),
    },
    {
      key: "abs",
      header: "Absorban",
      editable: true,
      value: (row) => row.abs,
      onChange: (i, v) => onUpdate(i, "abs", v),
      className: "w-36",
      fieldOrder: ["abs", "ppm"],
      startField: "abs",
    },
    {
      key: "ppm",
      header: "ppm (x)",
      editable: true,
      value: (row) => typeof row.ppm === 'string' ? row.ppm : (row.ppm?.toString() || ""),
      onChange: (i, v) => onUpdate(i, "ppm", v),
      className: "w-36",
      fieldOrder: ["abs", "ppm"],
      startField: "ppm",
    },
    {
      key: "deviation",
      header: "x−x̄",
      className: "w-36 font-mono",
      render: (_: ReplicateRow, i: number) => {
        const dev = result.devs[i];
        return <span style={{ color: "#f59e0b" }}>{dev == null ? "-" : formatNumber(dev)}</span>;
      },
    },
    {
      key: "deviation_sq",
      header: "(x−x̄)²",
      className: "w-36 font-mono",
      render: (_: ReplicateRow, i: number) => {
        const devsq = result.devsq[i];
        return <span style={{ color: "#ef4444" }}>{devsq == null ? "-" : formatNumber(devsq)}</span>;
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-16",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Tabel Limit Deteksi (Blanko)</h3>

      <EditableTable
         className="w-fit max-w-full"
         data={data}
         columns={columns}
        onAddRow={onAddRow}
        onRemoveRow={onRemoveRow}
        minRows={2}
        scrollable
        dataRef={dataRef}
        onDataChange={onDataChange}
        footerRows={
          <>
            <tr className="border-t-2 border-b font-semibold" style={{ borderColor: "var(--accent)", background: "var(--surface-muted)", color: "var(--accent)" }}>
              <td className="px-4 py-3">Σ</td>
              <td className="px-4 py-3 font-mono">{formatNumber(summarizeNumbers(data.map(row => row.abs)).sum)}</td>
              <td className="px-4 py-3 font-mono">{formatNumber(summarizeNumbers(result.vals).sum)}</td>
              <td className="px-4 py-3 font-mono">{formatBlankoDeviation(summarizeNumbers(result.devs).sum)}</td>
              <td className="px-4 py-3 font-mono">{formatNumber(result.sumsq)}</td>
              <td className="px-4 py-3"></td>
            </tr>
            <tr className="border-b font-semibold" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-muted)", color: "var(--accent)" }}>
              <td className="px-4 py-3">Rata Rata</td>
              <td className="px-4 py-3 font-mono">{formatNumber(summarizeNumbers(data.map(row => row.abs)).average)}</td>
              <td className="px-4 py-3 font-mono">{formatNumber(result.avg)}</td>
              <td className="px-4 py-3 font-mono">{formatBlankoDeviation(summarizeNumbers(result.devs).average)}</td>
              <td className="px-4 py-3 font-mono">{result.n > 0 ? formatNumber(result.devsq.filter((value): value is number => value !== null).reduce((sum, value) => sum + value, 0) / result.n) : "-"}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </>
        }
      />

      {result.n > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 overflow-x-auto"
        >
          <table className="w-full min-w-0 text-sm border rounded-xl overflow-hidden" style={{ borderColor: "var(--border-default)" }}>
            <thead>
              <tr className="border-b" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs" style={{ color: "var(--text-secondary)" }}>Parameter</th>
                <th className="px-4 py-3 text-right font-semibold uppercase tracking-wider text-xs" style={{ color: "var(--text-secondary)" }}>Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>n</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{result.n}</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>Mean (x̄)</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{formatNumber(result.avg)} ppm</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>Σ(x−x̄)²</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{formatNumber(result.sumsq)}</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>S² (Varian)</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{isNaN(result.s2) ? "-" : formatNumber(result.s2)}</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>SD</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{isNaN(result.s2) ? "-" : formatNumber(Math.sqrt(result.s2))}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}

      {result.n > 1 && Number.isFinite(result.s2) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border p-4"
          style={{ borderColor: "var(--border-default)", background: "var(--surface-muted)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>SD Blanko</p>
          <p className="font-mono text-2xl" style={{ color: "var(--text-primary)" }}>
            {formatNumber(Math.sqrt(result.s2))} ppm
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>SD = √S²</p>
        </motion.div>
      )}

      {mdlBlanko !== undefined && !isNaN(mdlBlanko) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl border"
          style={{ background: "var(--accent-muted)", borderColor: "var(--accent)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Estimasi MDL (Blanko)</p>
              <p className="font-mono text-2xl" style={{ color: "var(--accent)" }}>{formatNumber(mdlBlanko)} ppm</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
              MDL = 5 × SD
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function StatCard({ label, value, unit = "" }: { label: string; value: string; unit?: string }) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}>
      <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-mono text-lg flex items-baseline gap-1" style={{ color: "var(--text-primary)" }}>
        {value} <span className="text-xs" style={{ color: "var(--text-muted)" }}>{unit}</span>
      </p>
    </div>
  );
}
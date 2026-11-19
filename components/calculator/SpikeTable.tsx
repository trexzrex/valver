"use client";

import { summarizeNumbers } from "@/lib/reportSummary";

import { motion } from "motion/react";
import { EditableTable, Column } from "./EditableTable";
import { SpikeRow, ReplicateResult } from "@/lib/types";
import { formatNumber, formatNumberFixed, formatPercent } from "@/lib/utils/numberFormat";

interface SpikeTableProps {
  data: SpikeRow[];
  result: ReplicateResult;
  spikeNominal: string;
  onUpdate: (index: number, field: "abs" | "ppm", value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  mdlSpike?: number;
  loqSpike?: number;
  recovery?: number;
  snRatio?: number;
  dataRef: React.MutableRefObject<SpikeRow[]>;
  onDataChange: () => void;
  calibration: ReturnType<typeof import("@/lib/calculations").computeCalibration> | null;
  avgRecovery?: number;
}

export function SpikeTable({
  data,
  result,
  spikeNominal,
  onUpdate,
  onAddRow,
  onRemoveRow,
  mdlSpike,
  loqSpike,
  recovery,
  snRatio,
  dataRef,
  onDataChange,
  calibration,
  avgRecovery,
}: SpikeTableProps) {
  const nominal = parseFloat(spikeNominal);
  const hasNominal = !isNaN(nominal) && nominal > 0;

  const columns: Column<SpikeRow>[] = [
    {
      key: "no",
      header: "No",
      className: "w-12",
      render: (_: SpikeRow, i: number) => (
        <span style={{ color: "var(--text-secondary)" }} className="font-mono">Spike {i + 1}</span>
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
      render: (_: SpikeRow, i: number) => {
        const dev = result.devs[i];
        return <span style={{ color: "#f59e0b" }}>{dev == null ? "-" : formatNumber(dev)}</span>;
      },
    },
    {
      key: "deviation_sq",
      header: "(x−x̄)²",
      className: "w-36 font-mono",
      render: (_: SpikeRow, i: number) => {
        const devsq = result.devsq[i];
        return <span style={{ color: "#ef4444" }}>{devsq == null ? "-" : formatNumber(devsq)}</span>;
      },
    },
    {
      key: "recovery",
      header: "% Recovery",
      className: "w-36 font-mono",
      render: (_: SpikeRow, i: number) => {
        if (!result.computedRows[i] || result.computedRows[i].recovery == null) return "-";
        return <span style={{ color: "#22c55e" }}>{formatPercent(result.computedRows[i].recovery!)}</span>;
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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Tabel Uji Spike</h3>
        {hasNominal && (
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#f59e0b" }}>
            Spike Nominal: {nominal.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ppm
          </span>
        )}
      </div>

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
              <td className="px-4 py-3 font-mono">
                {formatNumber(summarizeNumbers(data.map(row => row.abs)).sum)}
              </td>
              <td className="px-4 py-3 font-mono">{formatNumber(summarizeNumbers(result.vals).sum)}</td>
              <td className="px-4 py-3 font-mono">{formatNumber(result.devs.filter((value): value is number => value !== null).reduce((sum, value) => sum + value, 0))}</td>
              <td className="px-4 py-3 font-mono">{formatNumber(result.sumsq)}</td>
              <td className="px-4 py-3 font-mono">
                {formatNumber(result.computedRows.reduce((sum, r) => sum + (r.recovery || 0), 0))}
              </td>
              <td className="px-4 py-3"></td>
            </tr>
            <tr className="border-b font-semibold" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-muted)", color: "var(--accent)" }}>
              <td className="px-4 py-3">Rata Rata</td>
              <td className="px-4 py-3 font-mono">
                {formatNumber(summarizeNumbers(data.map(row => row.abs)).average)}
              </td>
              <td className="px-4 py-3 font-mono">{formatNumber(result.avg)}</td>
              <td className="px-4 py-3 font-mono">
                {result.n > 0 ? formatNumber(result.devs.filter((value): value is number => value !== null).reduce((sum, value) => sum + value, 0) / result.n) : "-"}
              </td>
              <td className="px-4 py-3 font-mono">
                {result.n > 0 ? formatNumber(result.devsq.filter((value): value is number => value !== null).reduce((sum, value) => sum + value, 0) / result.n) : "-"}
              </td>
              <td className="px-4 py-3 font-mono">{avgRecovery !== undefined && !isNaN(avgRecovery) ? formatNumber(avgRecovery) : "-"}</td>
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
          <table className="w-full min-w-max text-sm border rounded-xl overflow-hidden" style={{ borderColor: "var(--border-default)" }}>
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
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>Rata-rata %Recovery</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{avgRecovery !== undefined && !isNaN(avgRecovery) ? avgRecovery.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' : '-'}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}

      {(!calibration || calibration.validRows.filter((row) => row.x > 0).length === 0) && (
        <div className="mt-4 rounded-lg border p-4 text-sm" style={{ borderColor: "rgba(245, 158, 11, 0.3)", background: "rgba(245, 158, 11, 0.1)", color: "#fcd34d" }}>
          Nilai recovery belum bisa dihitung karena kurva kalibrasi belum memiliki data ppm valid.
        </div>
      )}

      {(result.s2 !== undefined || mdlSpike !== undefined || loqSpike !== undefined || recovery !== undefined || snRatio !== undefined) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {result.s2 !== undefined && !isNaN(result.s2) && (
            <StatCardHighlight
              label="SD Spike"
              value={formatNumber(Math.sqrt(result.s2))}
              unit="ppm"
              color="purple"
              formula="√S²"
            />
          )}
          {mdlSpike !== undefined && !isNaN(mdlSpike) && (
            <StatCardHighlight
              label="MDL (Spike)"
              value={formatNumber(mdlSpike)}
              unit="ppm"
              color="cyan"
              formula="2.821 × SD"
            />
          )}
          {loqSpike !== undefined && !isNaN(loqSpike) && (
            <StatCardHighlight
              label="LOQ (Spike)"
              value={formatNumber(loqSpike)}
              unit="ppm"
              color="blue"
              formula="10 × MDL"
            />
          )}
          {recovery !== undefined && !isNaN(recovery) && (
            <StatCardHighlight
              label="Recovery"
              value={recovery.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              unit="%"
              color={recovery >= 85 && recovery <= 115 ? "green" : "red"}
              formula="(x̄ / Spike) × 100"
            />
          )}
          {snRatio !== undefined && !isNaN(snRatio) && (
            <StatCardHighlight
              label="S/N Ratio"
              value={snRatio.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              color={snRatio > 2.5 && snRatio < 10 ? "green" : "red"}
              formula="x̄ / SD"
            />
          )}
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

function StatCardHighlight({
  label,
  value,
  unit = "",
  color = "cyan",
  formula,
}: { label: string; value: string; unit?: string; color?: string; formula?: string }) {
  const colorMap: Record<string, { background: string; borderColor: string; color: string }> = {
    cyan: { background: "var(--accent-muted)", borderColor: "var(--accent)", color: "var(--accent)" },
    blue: { background: "rgba(59, 130, 246, 0.2)", borderColor: "rgba(59, 130, 246, 0.5)", color: "#60a5fa" },
    green: { background: "rgba(34, 197, 94, 0.2)", borderColor: "rgba(34, 197, 94, 0.5)", color: "#22c55e" },
    red: { background: "rgba(239, 68, 68, 0.2)", borderColor: "rgba(239, 68, 68, 0.5)", color: "#ef4444" },
    amber: { background: "rgba(245, 158, 11, 0.2)", borderColor: "rgba(245, 158, 11, 0.5)", color: "#f59e0b" },
    purple: { background: "rgba(168, 85, 247, 0.2)", borderColor: "rgba(168, 85, 247, 0.5)", color: "#a855f7" },
  };

  const style = colorMap[color] || colorMap.cyan;

  return (
    <div className="p-4 rounded-xl border" style={style}>
      <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-mono text-2xl flex items-baseline gap-1" style={{ color: style.color }}>
        {value} <span className="text-sm">{unit}</span>
      </p>
      {formula && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{formula}</p>}
    </div>
  );
}
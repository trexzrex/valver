"use client";

import { motion } from "motion/react";
import { EditableTable, Column } from "./EditableTable";
import { ReplicateRow, ReplicateResult } from "@/lib/types";
import { summarizeNumbers } from "@/lib/reportSummary";
import { formatNumber, formatNumberFixed, formatPercent } from "@/lib/utils/numberFormat";

interface WorkingRangeTableProps {
  title: string;
  data: ReplicateRow[];
  result: ReplicateResult;
  stdConc: string;
  onStdConcChange: (value: string) => void;
  onUpdate: (index: number, field: "abs" | "ppm", value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  isLow?: boolean;
  accuracy?: ReturnType<typeof import("@/lib/calculations").computeAccuracy>;
  precision?: ReturnType<typeof import("@/lib/calculations").computePrecision>;
  dataRef: React.MutableRefObject<ReplicateRow[]>;
  onDataChange: () => void;
  calibration: ReturnType<typeof import("@/lib/calculations").computeCalibration> | null;
}

export function WorkingRangeTable({
  title,
  data,
  result,
  stdConc,
  onStdConcChange,
  onUpdate,
  onAddRow,
  onRemoveRow,
  isLow = true,
  accuracy,
  precision,
  dataRef,
  onDataChange,
  calibration,
}: WorkingRangeTableProps) {
  const stdValue = parseFloat(stdConc);
  const hasStd = !isNaN(stdValue) && stdValue > 0;

  const columns: Column<ReplicateRow>[] = [
    {
      key: "no",
      header: "No",
      className: "w-12",
      render: (_: ReplicateRow, i: number) => (
        <span style={{ color: "var(--text-secondary)" }} className="font-mono">{i + 1}</span>
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
      <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="0.001"
            value={stdConc}
            onChange={(e) => onStdConcChange(e.target.value)}
            className="w-32 px-3 py-2 border rounded-lg text-sm focus:outline-none"
            style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}
            placeholder="Std Conc"
          />
        </div>
      </div>

      <EditableTable
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
              <td className="px-4 py-3 font-mono">{formatNumber(summarizeNumbers(result.devs).sum)}</td>
              <td className="px-4 py-3 font-mono">{formatNumber(result.sumsq)}</td>
              <td className="px-4 py-3"></td>
            </tr>
            <tr className="border-b font-semibold" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-muted)", color: "var(--accent)" }}>
              <td className="px-4 py-3">Rata Rata</td>
              <td className="px-4 py-3 font-mono">{formatNumber(summarizeNumbers(data.map(row => row.abs)).average)}</td>
              <td className="px-4 py-3 font-mono">{formatNumber(result.avg)}</td>
              <td className="px-4 py-3 font-mono">{formatNumber(summarizeNumbers(result.devs).average)}</td>
              <td className="px-4 py-3 font-mono">{formatNumber(summarizeNumbers(result.devsq).average)}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </>
        }
      />


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


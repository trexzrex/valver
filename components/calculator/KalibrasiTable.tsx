"use client";

import { motion } from "motion/react";
import { EditableTable, Column } from "./EditableTable";
import { KalibrasiRow } from "@/lib/types";
import { formatNumber, formatNumberFixed } from "@/lib/utils/numberFormat";
import { useRef } from "react";

interface KalibrasiTableProps {
  data: KalibrasiRow[];
  calibration: ReturnType<typeof import("@/lib/calculations").computeCalibration> | null;
  onUpdate: (index: number, field: "x" | "y", value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  dataRef: React.MutableRefObject<KalibrasiRow[]>;
  onDataChange: () => void;
}

export function KalibrasiTable({ data, calibration, onUpdate, onAddRow, onRemoveRow, dataRef, onDataChange }: KalibrasiTableProps) {
  const columns: Column<KalibrasiRow>[] = [
    {
      key: "no",
      header: "No",
      className: "w-12",
      render: (_: KalibrasiRow, i: number) => (
        <span className="font-mono" style={{ color: "var(--text-secondary)" }}>{i + 1}</span>
      ),
    },
    {
      key: "x",
      header: "ppm (x)",
      editable: true,
      value: (row) => row.x,
      onChange: (i, v) => onUpdate(i, "x", v),
      className: "w-36",
      fieldOrder: ["x", "y"],
      startField: "x",
    },
    {
      key: "y",
      header: "Absorban (y)",
      editable: true,
      value: (row) => row.y,
      onChange: (i, v) => onUpdate(i, "y", v),
      className: "w-36",
      fieldOrder: ["x", "y"],
      startField: "y",
    },
    {
      key: "x2",
      header: "x²",
      className: "w-36 font-mono",
      render: (_: KalibrasiRow, i: number) => {
        if (!calibration || i >= calibration.computedRows.length) return "-";
        const val = calibration.computedRows[i].x2;
        return <span style={{ color: "var(--accent)" }}>{isNaN(val) ? "-" : formatNumber(val)}</span>;
      },
    },
    {
      key: "y2",
      header: "y²",
      className: "w-36 font-mono",
      render: (_: KalibrasiRow, i: number) => {
        if (!calibration || i >= calibration.computedRows.length) return "-";
        const val = calibration.computedRows[i].y2;
        return <span style={{ color: "var(--accent)" }}>{isNaN(val) ? "-" : formatNumber(val)}</span>;
      },
    },
    {
      key: "xy",
      header: "x·y",
      className: "w-36 font-mono",
      render: (_: KalibrasiRow, i: number) => {
        if (!calibration || i >= calibration.computedRows.length) return "-";
        const val = calibration.computedRows[i].xy;
        return <span style={{ color: "var(--accent)" }}>{isNaN(val) ? "-" : formatNumber(val)}</span>;
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
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          Tabel Kurva Kalibrasi
        </h3>
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
          calibration && (
            <>
              <tr className="border-t-2 border-b font-semibold" style={{ borderColor: "var(--accent)", background: "var(--surface-muted)", color: "var(--accent)" }}>
                <td className="px-4 py-3">Σ</td>
                <td className="px-4 py-3 font-mono">{formatNumber(calibration.sumRow.sumx)}</td>
                <td className="px-4 py-3 font-mono">{formatNumber(calibration.sumRow.sumy)}</td>
                <td className="px-4 py-3 font-mono">{formatNumber(calibration.sumRow.sumx2)}</td>
                <td className="px-4 py-3 font-mono">{formatNumber(calibration.sumRow.sumy2)}</td>
                <td className="px-4 py-3 font-mono">{formatNumber(calibration.sumRow.sumxy)}</td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr className="border-b font-semibold" style={{ borderColor: "var(--border-default)", background: "var(--surface-muted)", color: "var(--accent)" }}>
                <td className="px-4 py-3">Rata Rata</td>
                <td className="px-4 py-3 font-mono">{formatNumber(calibration.avgRow.avgx)}</td>
                <td className="px-4 py-3 font-mono">{formatNumber(calibration.avgRow.avgy)}</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
              </tr>
            </>
          )
        }
      />

      {calibration && (
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
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>Slope (B)</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{calibration.B.toFixed(6)}</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>Intercept (A)</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{calibration.A.toFixed(6)}</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>Persamaan Garis</td>
                <td className="px-4 py-3 text-right font-mono text-sm" style={{ color: "var(--text-primary)" }}>
                  y = {calibration.B.toFixed(6)}x {calibration.A >= 0 ? '+' : '−'} {Math.abs(calibration.A).toFixed(6)}
                </td>
              </tr>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>R (Rumus 1)</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{calibration.R1.toFixed(6)}</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>R (Rumus 2)</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{calibration.R2.toFixed(6)}</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>R²</td>
                <td className="px-4 py-3 text-right font-mono" style={{ color: "var(--text-primary)" }}>{(calibration.R1 * calibration.R1).toFixed(6)}</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
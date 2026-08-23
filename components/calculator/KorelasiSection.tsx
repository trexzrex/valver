"use client";

import { motion } from "motion/react";
import { EditableTable, Column } from "./EditableTable";
import { Korelasi1Row, Korelasi2Row } from "@/lib/types";
import { formatNumber, formatNumberFixed } from "@/lib/utils/numberFormat";
import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";

interface KorelasiSectionProps {
  korelasiCara1: ReturnType<typeof import("@/lib/calculations").computeKorelasiCara1> | null;
  korelasiCara2: ReturnType<typeof import("@/lib/calculations").computeKorelasiCara2> | null;
  calibration: ReturnType<typeof import("@/lib/calculations").computeCalibration> | null;
}

export function KorelasiSection({ korelasiCara1, korelasiCara2, calibration }: KorelasiSectionProps) {
  const [isCara1Open, setIsCara1Open] = useState(true);
  const [isCara2Open, setIsCara2Open] = useState(true);

  if (!calibration || !korelasiCara1 || !korelasiCara2) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div
          className="p-4 rounded-xl border text-center"
          style={{ background: "var(--accent-muted)", borderColor: "var(--accent)" }}
        >
          <p style={{ color: "var(--accent)" }}>Masukkan minimal 2 titik data valid pada tabel kurva kalibrasi untuk menampilkan perhitungan korelasi.</p>
        </div>
      </motion.div>
    );
  }

  const columnsCara1: Column<Korelasi1Row>[] = [
    {
      key: "no",
      header: "No",
      className: "w-12",
      render: (_: Korelasi1Row, i: number) => (
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
      header: "Absorban (y)",
      className: "w-36 font-mono",
      render: (row) => <span style={{ color: "var(--text-primary)" }}>{formatNumber(row.y)}</span>,
    },
    {
      key: "x2",
      header: "x²",
      className: "w-36 font-mono",
      render: (row) => <span style={{ color: "var(--accent)" }}>{formatNumber(row.x2)}</span>,
    },
    {
      key: "y2",
      header: "y²",
      className: "w-36 font-mono",
      render: (row) => <span style={{ color: "var(--accent)" }}>{formatNumber(row.y2)}</span>,
    },
    {
      key: "xy",
      header: "x·y",
      className: "w-36 font-mono",
      render: (row) => <span style={{ color: "var(--accent)" }}>{formatNumber(row.xy)}</span>,
    },
  ];

  const columnsCara2: Column<Korelasi2Row>[] = [
    {
      key: "no",
      header: "No",
      className: "w-12",
      render: (_: Korelasi2Row, i: number) => (
        <span className="font-mono" style={{ color: "var(--text-secondary)" }}>{i + 1}</span>
      ),
    },
    {
      key: "x",
      header: "ppm (x)",
      className: "w-32 font-mono",
      render: (row) => <span style={{ color: "var(--text-primary)" }}>{formatNumberFixed(row.x, 2)}</span>,
    },
    {
      key: "y",
      header: "Absorban (y)",
      className: "w-32 font-mono",
      render: (row) => <span style={{ color: "var(--text-primary)" }}>{formatNumber(row.y)}</span>,
    },
    {
      key: "dx",
      header: "x−x̄",
      className: "w-36 font-mono",
      render: (row) => <span style={{ color: "#f59e0b" }}>{formatNumber(row.dx)}</span>,
    },
    {
      key: "dx2",
      header: "(x−x̄)²",
      className: "w-36 font-mono",
      render: (row) => <span style={{ color: "#ef4444" }}>{formatNumber(row.dx2)}</span>,
    },
    {
      key: "dy",
      header: "y−ȳ",
      className: "w-36 font-mono",
      render: (row) => <span style={{ color: "#f59e0b" }}>{formatNumber(row.dy)}</span>,
    },
    {
      key: "dy2",
      header: "(y−ȳ)²",
      className: "w-36 font-mono",
      render: (row) => <span style={{ color: "#ef4444" }}>{formatNumber(row.dy2)}</span>,
    },
    {
      key: "dxdy",
      header: "(x−x̄)(y−ȳ)",
      className: "w-40 font-mono",
      render: (row) => <span style={{ color: "#a855f7" }}>{formatNumber(row.dxdy)}</span>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Cara 1 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border overflow-hidden"
        style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}
      >
        <div
          onClick={() => setIsCara1Open(!isCara1Open)}
          className="flex items-center justify-between p-4 border-b cursor-pointer"
          style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center gap-3">
            <CaretDown size={18} weight="bold" className={`transition-transform ${isCara1Open ? 'rotate-180' : ''}`} style={{ color: "var(--text-secondary)" }} />
            <h4 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Cara 1: Rumus Σxy</h4>
            <span
              className="px-2 py-1 rounded-full border text-xs font-mono"
              style={{ background: "var(--accent-muted)", borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              R = {korelasiCara1.R1.toFixed(6)}
            </span>
          </div>
        </div>
        {isCara1Open && (
          <div className="p-4">
            <EditableTable
              data={korelasiCara1.rows}
              columns={columnsCara1}
              onRemoveRow={() => {}}
              minRows={korelasiCara1.rows.length}
              scrollable
              footerRows={
                <>
                  <tr className="border-t-2 border-b font-semibold" style={{ borderColor: "var(--accent)", background: "var(--surface-muted)", color: "var(--accent)" }}>
                    <td className="px-4 py-3">Σ</td>
                    <td className="px-4 py-3 font-mono">{formatNumber(korelasiCara1.sumRow.sumx)}</td>
                    <td className="px-4 py-3 font-mono">{formatNumber(korelasiCara1.sumRow.sumy)}</td>
                    <td className="px-4 py-3 font-mono">{formatNumber(korelasiCara1.sumRow.sumx2)}</td>
                    <td className="px-4 py-3 font-mono">{formatNumber(korelasiCara1.sumRow.sumy2)}</td>
                    <td className="px-4 py-3 font-mono">{formatNumber(korelasiCara1.sumRow.sumxy)}</td>
                  </tr>
                  <tr className="border-b font-semibold" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-muted)", color: "var(--accent)" }}>
                    <td className="px-4 py-3">Rata Rata</td>
                    <td className="px-4 py-3 font-mono">{formatNumber(calibration.avgRow.avgx)}</td>
                    <td className="px-4 py-3 font-mono">{formatNumber(calibration.avgRow.avgy)}</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </>
              }
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 rounded-xl border p-4"
              style={{ background: "var(--accent-muted)", borderColor: "var(--accent)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider md:text-sm" style={{ color: "var(--text-secondary)" }}>R (Rumus 1)</span>
                <span className="font-mono text-xl font-bold md:text-2xl" style={{ color: "var(--accent)" }}>{korelasiCara1.R1.toFixed(6)}</span>
              </div>
            </motion.div>
          </div>
        )}
        </motion.div>

        {/* Cara 2 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border overflow-hidden"
          style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}
        >
          <div
            onClick={() => setIsCara2Open(!isCara2Open)}
            className="flex items-center justify-between p-4 border-b cursor-pointer"
            style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center gap-3">
              <CaretDown size={18} weight="bold" className={`transition-transform ${isCara2Open ? 'rotate-180' : ''}`} style={{ color: "var(--text-secondary)" }} />
              <h4 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Cara 2: Rumus Σ(x−x̄)(y−ȳ)</h4>
              <span
                className="px-2 py-1 rounded-full border text-xs font-mono"
                style={{ background: "var(--accent-muted)", borderColor: "var(--accent)", color: "var(--accent)" }}
              >
                R = {korelasiCara2.R2.toFixed(6)}
              </span>
            </div>
          </div>
          {isCara2Open && (
            <div className="p-4">
              <EditableTable
                data={korelasiCara2.rows}
                columns={columnsCara2}
                onRemoveRow={() => {}}
                minRows={korelasiCara2.rows.length}
                scrollable
                footerRows={
                  <>
                    <tr className="border-t-2 border-b font-semibold" style={{ borderColor: "var(--accent)", background: "var(--surface-muted)", color: "var(--accent)" }}>
                      <td className="px-4 py-3">Σ</td>
                      <td className="px-4 py-3 font-mono">{formatNumber(calibration.sumRow.sumx)}</td>
                      <td className="px-4 py-3 font-mono">{formatNumber(calibration.sumRow.sumy)}</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 font-mono">{formatNumber(korelasiCara2.sumRow.sumdx2)}</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 font-mono">{formatNumber(korelasiCara2.sumRow.sumdy2)}</td>
                      <td className="px-4 py-3 font-mono">{formatNumber(korelasiCara2.sumRow.sumdxdy)}</td>
                    </tr>
                    <tr className="border-b font-semibold" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-muted)", color: "var(--accent)" }}>
                      <td className="px-4 py-3">Rata Rata</td>
                      <td className="px-4 py-3 font-mono">{formatNumber(calibration.avgRow.avgx)}</td>
                      <td className="px-4 py-3 font-mono">{formatNumber(calibration.avgRow.avgy)}</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </>
                }
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 rounded-xl border p-4"
                style={{ background: "var(--accent-muted)", borderColor: "var(--accent)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider md:text-sm" style={{ color: "var(--text-secondary)" }}>R (Rumus 2)</span>
                  <span className="font-mono text-xl font-bold md:text-2xl" style={{ color: "var(--accent)" }}>{korelasiCara2.R2.toFixed(6)}</span>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}>
      <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-mono text-lg" style={{ color: "var(--text-primary)" }}>{value}</p>
    </div>
  );
}
"use client";

import { motion } from "motion/react";
import { EditableTable, Column } from "./EditableTable";
import { LinearRow } from "@/lib/types";
import { formatNumber, formatNumberFixed } from "@/lib/utils/numberFormat";

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
    </motion.div>
  );
}
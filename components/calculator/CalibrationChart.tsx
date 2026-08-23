"use client";

import {
  LineChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { CalibrationResult } from "@/lib/types";
import { formatNumber, formatNumberFixed } from "@/lib/utils/numberFormat";

interface CalibrationChartProps {
  calibration: ReturnType<typeof import("@/lib/calculations").computeCalibration> | null;
  className?: string;
}

export function CalibrationChart({ calibration, className = "" }: CalibrationChartProps) {
  if (!calibration || calibration.validRows.length < 2) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-xl border flex items-center justify-center ${className}`}
        style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}
      >
        <div className="text-center" style={{ color: "var(--text-muted)" }}>
          <p className="text-lg font-medium mb-2">Kurva Kalibrasi</p>
          <p className="text-sm">Masukkan minimal 2 titik data valid pada tabel kurva kalibrasi</p>
        </div>
      </motion.div>
    );
  }

  const dataPoints = calibration.validRows.map((r, i) => ({
    x: r.x,
    y: r.y,
    name: `Titik ${i + 1}`,
  }));

  // Regression line only spans the actual data range (minX to maxX)
  const allX = calibration.validRows.map((r) => r.x);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);

  const lineData = [
    { x: minX, y: calibration.A + calibration.B * minX },
    { x: maxX, y: calibration.A + calibration.B * maxX },
  ];

  const padding = (maxX - minX) * 0.1 || 1;

  const formatID = (val: number) => val.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl border p-4 ${className}`}
      style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}
    >
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Kurva Kalibrasi</h3>
        <div className="flex items-center gap-4 text-sm flex-wrap" style={{ color: "var(--text-secondary)" }}>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full" style={{ background: "var(--accent)" }} />
            Data Pengukuran
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-0.5" style={{ background: "var(--accent)" }} />
            Regresi: y = {formatNumberFixed(calibration.B, 4)}x {calibration.A >= 0 ? '+' : '−'} {formatNumberFixed(Math.abs(calibration.A), 4)}
          </span>
          <span
            className="px-2 py-0.5 rounded font-mono text-xs"
            style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
          >
            R = {calibration.R1.toFixed(6)}
          </span>
        </div>
      </div>

      {/* Mobile: horizontal scroll for chart */}
      <div className="overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:px-0">
        <ResponsiveContainer width="100%" height={320} minWidth={600}>
          <LineChart
            data={dataPoints}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[minX - padding, maxX + padding]}
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={{ stroke: "#27272a" }}
              tickFormatter={(value) => formatID(value)}
              label={{ value: "Konsentrasi (ppm)", position: "insideBottom", offset: -20, fill: "#a1a1aa", fontSize: 11 }}
            />
            <YAxis
              type="number"
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={{ stroke: "#27272a" }}
              tickFormatter={(value) => formatNumberFixed(value, 4)}
              label={{ value: "Absorban", angle: -90, position: "insideLeft", offset: 20, fill: "#a1a1aa", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "#fafafa" }}
              itemStyle={{ color: "#22d3ee" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => {
                const formattedValue = typeof value === "number" ? formatNumber(value, 6) : (value ?? "-");
                const formattedName = name ?? "";
                return [formattedValue, formattedName] as [string, string];
              }}
              labelFormatter={(value) => typeof value === "number" ? formatNumberFixed(value, 4) : String(value)}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
              iconSize={10}
              formatter={(value: string) => value}
            />
            <Scatter
              name="Data Pengukuran"
              data={dataPoints}
              fill="#22d3ee"
              shape="circle"
              r={4}
            />
            <Line
              type="linear"
              data={lineData}
              dataKey="y"
              stroke="#22d3ee"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              legendType="line"
              name={`Regresi: y = ${formatNumberFixed(calibration.B, 4)}x ${calibration.A >= 0 ? '+' : '−'} ${formatNumberFixed(Math.abs(calibration.A), 4)}`}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
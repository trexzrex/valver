"use client";

import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";
import type { CalibrationResult } from "@/lib/types";
import { buildCalibrationPlot, formatChartTick } from "@/lib/calibrationPlot";
import { formatStepNumber } from "@/lib/calibrationSteps";

interface CalibrationChartProps {
  calibration: CalibrationResult | null;
  className?: string;
}

export function CalibrationChart({ calibration, className = "" }: CalibrationChartProps) {
  const plot = buildCalibrationPlot(calibration);
  const f = formatStepNumber;
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      aria-label="Grafik kurva kalibrasi" className={`min-w-0 overflow-hidden rounded-2xl border ${className}`}
      style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
      <div className="border-b px-4 py-5 sm:px-6" style={{ borderColor: "var(--border-default)" }}>
        <h3 className="text-lg font-semibold tracking-tight">Kurva Kalibrasi</h3>
        <p className="mt-1 text-xs leading-5" style={{ color: "var(--text-secondary)" }}>Konsentrasi terhadap absorbansi</p>
      </div>
      {!plot || !calibration ? (
        <div className="flex min-h-64 items-center justify-center px-6 text-center">
          <div><p className="font-medium">Grafik menunggu data kalibrasi</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6" style={{ color: "var(--text-secondary)" }}>Lengkapi minimal dua pasangan konsentrasi dan absorbansi yang menghasilkan regresi valid pada tabel di atas.</p></div>
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-px border-b" style={{ background: "var(--border-subtle)", borderColor: "var(--border-default)" }}>
            <div className="col-span-3 px-4 py-4 sm:px-6" style={{ background: "var(--surface-muted)" }}>
              <dt className="text-xs" style={{ color: "var(--text-secondary)" }}>Persamaan regresi · y = bx + a</dt>
              <dd className="mt-1 break-words font-mono text-sm font-semibold" style={{ color: "var(--accent)" }}>y = {f(calibration.B)}x {calibration.A < 0 ? "−" : "+"} {f(Math.abs(calibration.A))}</dd>
            </div>
            {[{ label: "r", value: f(calibration.R1) }, { label: "R²", value: f(calibration.R1 ** 2) }, { label: "Jumlah titik", value: String(calibration.n) }].map(item => (
              <div key={item.label} className="min-w-0 px-4 py-3 sm:px-6" style={{ background: "var(--surface-elevated)" }}><dt className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.label}</dt><dd className="mt-1 break-words font-mono text-sm font-semibold">{item.value}</dd></div>
            ))}
          </dl>
          <div className="px-3 pb-4 pt-5 sm:px-5">
            <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-sky-600" /><span className="w-5 border-t-2 border-sky-600" />S · Sebelum linear (pengukuran)</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rotate-45 border-2 border-orange-600" /><span className="w-5 border-t-2 border-dashed border-orange-600" />P · Sesudah linear (prediksi)</span>
            </div>
            <p className="mb-1 px-1 text-xs" style={{ color: "var(--text-secondary)" }}>Absorbansi</p>
            <div className="h-[280px] min-w-0 w-full sm:h-[330px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart margin={{ top: 14, right: 16, left: 0, bottom: 4 }} accessibilityLayer>
                  <CartesianGrid vertical={false} stroke="var(--border-default)" strokeDasharray="3 5" />
                  <XAxis dataKey="x" type="number" domain={plot.xDomain} tickCount={4} minTickGap={24} tickFormatter={formatChartTick}
                    tick={{ fill: "var(--text-secondary)", fontSize: 11 }} tickMargin={10} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} height={36} />
                  <YAxis dataKey="y" type="number" domain={plot.yDomain} tickCount={5} tickFormatter={formatChartTick} width={58}
                    tick={{ fill: "var(--text-secondary)", fontSize: 11 }} tickMargin={8} axisLine={false} tickLine={false} />
                  <Tooltip shared={false} cursor={{ stroke: "var(--border-default)", strokeDasharray: "3 3" }} content={<MeasurementTooltip />} />
                  <Line data={plot.measuredLine} dataKey="y" type="linear" stroke="#0284c7" strokeWidth={2} dot={false} activeDot={false} tooltipType="none" isAnimationActive={false} name="Penghubung pengukuran" />
                  <Line data={plot.predictedLine} dataKey="y" type="linear" stroke="#ea580c" strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={false} tooltipType="none" isAnimationActive={false} name="Garis regresi" />
                  <Scatter data={[...plot.points, ...plot.predicted]} dataKey="y" name="Pengukuran dan prediksi" shape={<ComparisonMarker />} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-center text-xs" style={{ color: "var(--text-secondary)" }}>Konsentrasi (ppm)</p>
          </div>
          <p className="border-t px-4 py-3 text-xs leading-5 sm:px-6" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>Setiap baris lengkap memiliki titik S (pengukuran) dan P (prediksi). Nomor mengikuti tabel linearitas. Garis biru hanya menghubungkan pengukuran menurut konsentrasi; garis oranye adalah regresi dalam rentang yang diukur. Titik berimpit tetap dipertahankan; sentuh titik untuk melihat baris terkait.</p>
        </>
      )}
    </motion.section>
  );
}

type PlotPoint = NonNullable<ReturnType<typeof buildCalibrationPlot>>["points"][number] & { measured?: number };

function ComparisonMarker({ cx, cy, payload }: { cx?: number; cy?: number; payload?: PlotPoint }) {
  if (cx === undefined || cy === undefined || !payload) return <g />;
  const predicted = payload.label.startsWith("P");
  const color = predicted ? "#ea580c" : "#0284c7";
  const labels = payload.overlappingRows.map(row => `${predicted ? "P" : "S"}${row}`).join("/");
  return <g className={predicted ? "prediction-marker" : "measurement-marker"}>
    <title>{labels}: x = {payload.x}, y = {payload.y}</title>
    {predicted ? <path d={`M ${cx} ${cy - 8} L ${cx + 8} ${cy} L ${cx} ${cy + 8} L ${cx - 8} ${cy} Z`} fill="none" stroke={color} strokeWidth={2} /> : <circle cx={cx} cy={cy} r={4} fill={color} stroke="var(--surface-elevated)" strokeWidth={1.5} />}
    <text x={cx} y={cy + (predicted ? 22 : -13)} textAnchor="middle" fill={color} fontSize={10} fontWeight={600} stroke="var(--surface-elevated)" strokeWidth={3} paintOrder="stroke" pointerEvents="none">{labels}</text>
  </g>;
}

function MeasurementTooltip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload?: PlotPoint }> }) {
  const point = payload?.find(item => item.payload?.label)?.payload;
  if (!active || !point) return null;
  return <div className="max-w-64 rounded-xl border px-4 py-3 text-xs shadow-lg" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
    <p className="mb-2 font-semibold">{point.label} · {point.name} · Baris {point.row}</p>
    <p>Konsentrasi: <span className="font-mono">{formatStepNumber(point.x)} ppm</span></p>
    <p className="mt-1">Sebelum: <span className="font-mono" style={{ color: "#0284c7" }}>{formatStepNumber(point.measured ?? point.y)}</span></p>
    <p className="mt-1">Sesudah: <span className="font-mono" style={{ color: "#ea580c" }}>{formatStepNumber(point.predicted)}</span></p>
    {point.overlappingRows.length > 1 && <p className="mt-2 leading-5" style={{ color: "var(--text-secondary)" }}>Titik berimpit pada seri ini: baris {point.overlappingRows.join(", ")}.</p>}
  </div>;
}

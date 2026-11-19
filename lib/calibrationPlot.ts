import type { CalibrationResult } from "@/lib/types";

export function formatChartTick(value: number): string {
  if (value === 0) return "0";
  if (Math.abs(value) < 0.001 || Math.abs(value) >= 10000) return value.toExponential(1);
  return Number(value.toPrecision(4)).toLocaleString("id-ID", { maximumFractionDigits: 6 });
}

export function buildCalibrationPlot(calibration: CalibrationResult | null) {
  if (!calibration || calibration.validRows.length < 2) return null;
  const rows = calibration.validRows.map((row, index) => ({ ...row, row: index + 1, predicted: calibration.A + calibration.B * row.x }));
  const points = rows.map(row => ({ ...row, label: `S${row.row}`, name: "Sebelum linear", overlappingRows: rows.filter(other => other.x === row.x && other.y === row.y).map(other => other.row) }));
  const predicted = rows.map(row => ({ ...row, measured: row.y, y: row.predicted, label: `P${row.row}`, name: "Sesudah linear", overlappingRows: rows.filter(other => other.x === row.x && other.predicted === row.predicted).map(other => other.row) }));
  const measuredLine = [...points].sort((a, b) => a.x - b.x);
  const predictedLine = [...predicted].sort((a, b) => a.x - b.x);
  const minX = Math.min(...points.map(row => row.x));
  const maxX = Math.max(...points.map(row => row.x));
  const line = [minX, maxX].map(x => ({ x, y: calibration.A + calibration.B * x }));
  const allY = [...points.map(row => row.y), ...line.map(row => row.y)];
  const minY = Math.min(...allY), maxY = Math.max(...allY);
  const padX = (maxX - minX) * 0.08 || Math.max(Math.abs(minX) * 0.08, 1e-6);
  const padY = (maxY - minY) * 0.12 || Math.max(Math.abs(minY) * 0.12, 1e-6);
  return { points, predicted, measuredLine, predictedLine, line, xDomain: [minX - padX, maxX + padX] as [number, number], yDomain: [minY - padY, maxY + padY] as [number, number] };
}

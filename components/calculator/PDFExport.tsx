"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { CircleNotch, FileArrowDown } from "@phosphor-icons/react";
import { statusLabels, safeRatio } from "@/lib/calculationStatus";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatNumber, formatNumberFixed, formatPercent } from "@/lib/utils/numberFormat";

interface PDFExportButtonProps {
  calibration: ReturnType<typeof import("@/lib/calculations").computeCalibration> | null;
  lowResult: ReturnType<typeof import("@/lib/calculations").computeReplicateSet>;
  highResult: ReturnType<typeof import("@/lib/calculations").computeReplicateSet>;
  blankoResult: ReturnType<typeof import("@/lib/calculations").computeReplicateSet>;
  spikeResult: ReturnType<typeof import("@/lib/calculations").computeReplicateSet>;
  precision: ReturnType<typeof import("@/lib/calculations").computePrecision>;
  accuracyLow: ReturnType<typeof import("@/lib/calculations").computeAccuracy>;
  accuracyHigh: ReturnType<typeof import("@/lib/calculations").computeAccuracy>;
  mdl: ReturnType<typeof import("@/lib/calculations").computeMDL>;
  acceptance: ReturnType<typeof import("@/lib/calculations").computeAcceptanceCriteria>;
  acceptanceItems?: ReturnType<typeof import("@/lib/calculations").computeAcceptanceCriteriaItems>;
  stdRendah: string;
  stdTinggi: string;
  spikeNominal: string;
  mdlRequirement: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  kalibrasiRows?: Array<{ x: string; y: string }>;
  wrLowRows?: Array<{ abs: string; ppm?: string | number }>;
  wrHighRows?: Array<{ abs: string; ppm?: string | number }>;
  blankoRows?: Array<{ abs: string; ppm?: string | number }>;
  spikeRows?: Array<{ abs: string; ppm?: string | number }>;
  korelasiCara1?: { rows: Array<{ [key: string]: number }> } | null;
  korelasiCara2?: { rows: Array<{ [key: string]: number }>; sumRow: { sumdx2: number; sumdy2: number; sumdxdy: number } } | null;
  linearRows?: Array<{ [key: string]: number }>;
}

export function PDFExportButton({
  calibration,
  lowResult,
  highResult,
  blankoResult,
  spikeResult,
  precision,
  accuracyLow,
  accuracyHigh,
  mdl,
  acceptance,
  acceptanceItems,
  stdRendah,
  stdTinggi,
  spikeNominal,
  mdlRequirement,
  contentRef,
  kalibrasiRows = [],
  wrLowRows = [],
  wrHighRows = [],
  blankoRows = [],
  spikeRows = [],
  korelasiCara1,
  korelasiCara2,
  linearRows = [],
}: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<"success" | "error" | null>(null);

  const generatePDF = async () => {
    // Use contentRef if provided, otherwise fallback to main content selector
    const targetElement = document.querySelector('main') || contentRef?.current;
    
    if (!targetElement) {
      alert("Konten tidak ditemukan untuk di-export");
      return;
    }
    
    setIsGenerating(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("VALVER - Verifikasi Metode Analisis", 14, 16);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Dibuat oleh Athar | Instagram: @athaar.mp", 14, 22);
      pdf.text(`Dibuat: ${new Date().toLocaleDateString("id-ID")}`, 14, 27);

      let y = 35;
      const section = (title: string) => {
        if (y > 270) { pdf.addPage(); y = 18; }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text(title, 14, y);
        y += 6;
      };
      const table = (headers: string[], rows: string[][]) => {
        autoTable(pdf, { startY: y, head: [headers], body: rows, theme: "grid", styles: { fontSize: 7 }, headStyles: { fillColor: [20, 70, 80] }, margin: { left: 14, right: 14 } });
        y = (pdf as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
      };

      const text = (value: unknown, decimals = 6) => {
        if (value === null || value === undefined || value === "") return "-";
        const numeric = typeof value === "number" ? value : Number(value);
        return Number.isFinite(numeric) ? formatNumber(numeric, decimals) : typeof value === "number" ? "-" : String(value);
      };
      const rowValues = (rows: Array<Record<string, number>>, keys: string[]) => rows.map((row, index) => [String(index + 1), ...keys.map((key) => text(row[key]))]);
      const sum = (values: Array<number | null | undefined>) => values.filter((value): value is number => Number.isFinite(value)).reduce((total, value) => total + value, 0);
      const average = (values: Array<number | null | undefined>) => {
        const valid = values.filter((value): value is number => Number.isFinite(value));
        return valid.length ? sum(valid) / valid.length : NaN;
      };

      section("1. Kurva Kalibrasi");
      if (calibration) {
        table(["Parameter", "Nilai"], [["Slope (B)", text(calibration.B)], ["Intercept (A)", text(calibration.A)], ["Persamaan", `y = ${calibration.B}x + ${calibration.A}`], ["R (Cara 1)", text(calibration.R1)], ["R (Cara 2)", text(calibration.R2)], ["R²", text(calibration.R1 * calibration.R1)], ["n", text(calibration.n)]]);
        table(["No", "ppm (x)", "Absorban (y)", "x^2", "y^2", "x*y"], [
          ...calibration.computedRows.map((row, i) => [String(i + 1), text(row.x), text(row.y), text(row.x2), text(row.y2), text(row.xy)]),
          ["Σ", text(calibration.sumRow.sumx), text(calibration.sumRow.sumy), text(calibration.sumRow.sumx2), text(calibration.sumRow.sumy2), text(calibration.sumRow.sumxy)],
          ["Rata Rata", text(calibration.avgRow.avgx), text(calibration.avgRow.avgy), "-", "-", "-"],
        ]);
        table(["No", "Sebelum Linear", "Setelah Linear"], linearRows.map((row, i) => [String(i + 1), text(row.y), text(row.yPred)]));
      } else table(["Status"], [["Belum ada data kalibrasi valid"]]);

      section("2. Korelasi (R)");
      section("Korelasi Cara 1: Rumus Sigma xy");
      if (korelasiCara1) table(["No", "ppm (x)", "Absorban (y)", "x^2", "y^2", "x*y"], [
        ...rowValues(korelasiCara1.rows, ["x", "y", "x2", "y2", "xy"]),
        ["Sigma", text(calibration?.sumRow.sumx), text(calibration?.sumRow.sumy), text(calibration?.sumRow.sumx2), text(calibration?.sumRow.sumy2), text(calibration?.sumRow.sumxy)],
        ["Rata Rata", text(calibration?.avgRow.avgx), text(calibration?.avgRow.avgy), "-", "-", "-"],
      ]);
      section("Korelasi Cara 2: Rumus Sigma (x - x rata-rata)(y - y rata-rata)");
      if (korelasiCara2) table(["No", "ppm (x)", "Absorban (y)", "x - x rata-rata", "(x - x rata-rata)^2", "y - y rata-rata", "(y - y rata-rata)^2", "(x - x rata-rata)(y - y rata-rata)"], [
        ...rowValues(korelasiCara2.rows, ["x", "y", "dx", "dx2", "dy", "dy2", "dxdy"]),
        ["Sigma", text(calibration?.sumRow.sumx), text(calibration?.sumRow.sumy), "-", text(korelasiCara2.sumRow.sumdx2), "-", text(korelasiCara2.sumRow.sumdy2), text(korelasiCara2.sumRow.sumdxdy)],
        ["Rata Rata", text(calibration?.avgRow.avgx), text(calibration?.avgRow.avgy), "-", "-", "-", "-", "-"],
      ]);
      section("Hasil Korelasi");
      table(["Metode", "Nilai R"], [["R Cara 1", text(calibration?.R1)], ["R Cara 2", text(calibration?.R2)]]);

      section("3. Working Range & Validasi");
      const replicateRows = (rows: Array<{ abs: string; ppm?: string | number }>, result: typeof lowResult) => [
        ...rows.map((row, i) => [String(i + 1), text(row.abs), text(row.ppm), text(result.devs[i]), text(result.devsq[i])]),
        ["Σ", text(sum(rows.map((row) => Number(row.abs))),), text(sum(result.vals)), text(sum(result.devs)), text(result.sumsq)],
        ["Rata Rata", text(average(rows.map((row) => Number(row.abs)))), text(result.avg), text(average(result.devs)), text(average(result.devsq))],
      ];
      section("Standar Rendah");
      table(["No", "Absorban", "ppm (x)", "x - x rata-rata", "(x - x rata-rata)^2"], replicateRows(wrLowRows, lowResult));
      section("Standar Tinggi");
      table(["No", "Absorban", "ppm (x)", "x - x rata-rata", "(x - x rata-rata)^2"], replicateRows(wrHighRows, highResult));
      section("Perhitungan S²");
      table(["Parameter", "Nilai"], [["S² Standar Rendah", text(lowResult.s2, 8)], ["S² Standar Tinggi", text(highResult.s2, 8)]]);
      section("Uji Kesetaraan Working Range");
      table(["Parameter", "Nilai"], [["PG", text(acceptance.workingRange.pg)], ["F tabel", "5.18"], ["Status", statusLabels[acceptance.workingRange.status]]]);
      section("Perhitungan Presisi");
      table(["Parameter", "Standar Rendah", "Standar Tinggi"], [["SD", text(precision.sdLow, 8), text(precision.sdHigh, 8)], ["SDR", text(precision.sdrLow, 3), text(precision.sdrHigh, 3)], ["CV Horwitz", text(precision.cvLow, 3), text(precision.cvHigh, 3)], ["0.67 x CV Horwitz", text(precision.cv67Low, 3), text(precision.cv67High, 3)], ["Status", statusLabels[precision.statusLow], statusLabels[precision.statusHigh]]]);
      section("Perhitungan Akurasi");
      table(["Parameter", "Standar Rendah", "Standar Tinggi"], [["% Akurasi", text(accuracyLow.accuracy, 2), text(accuracyHigh.accuracy, 2)], ["Status", statusLabels[accuracyLow.status], statusLabels[accuracyHigh.status]]]);

      section("4. Limit Deteksi (Blanko)");
      table(["No", "Absorban", "ppm (x)", "x - x rata-rata", "(x - x rata-rata)^2"], replicateRows(blankoRows, blankoResult));
      table(["Hasil", "Nilai"], [["SD Blanko", text(blankoResult.s2 ** 0.5)], ["Estimasi MDL = 5 × SD", text(mdl.mdlBlanko)]]);

      section("5. Uji Spike");
      table(["No", "Absorban", "ppm (x)", "x - x rata-rata", "(x - x rata-rata)^2", "% Recovery"], [
        ...spikeRows.map((row, i) => [String(i + 1), text(row.abs), text(row.ppm), text(spikeResult.devs[i]), text(spikeResult.devsq[i]), text(spikeResult.computedRows[i]?.recovery)]),
        ["Σ", text(sum(spikeRows.map((row) => Number(row.abs)))), text(sum(spikeResult.vals)), text(sum(spikeResult.devs)), text(spikeResult.sumsq), text(sum(spikeResult.computedRows.map((row) => row.recovery)))],
        ["Rata Rata", text(average(spikeRows.map((row) => Number(row.abs)))), text(spikeResult.avg), text(average(spikeResult.devs)), text(average(spikeResult.devsq)), text(average(spikeResult.computedRows.map((row) => row.recovery)))],
      ]);
      table(["Hasil", "Nilai"], [["Spike Nominal", text(spikeNominal)], ["SD Spike", text(spikeResult.s2 ** 0.5)], ["Recovery", text(mdl.recovery)], ["MDL = 2,821 × SD", text(mdl.mdlSpike)], ["LOQ = 10 × MDL", text(mdl.loqSpike)], ["S/N Ratio", text(safeRatio(spikeResult.avg, Math.sqrt(spikeResult.s2)))]]);

      section("6. Uji Keberterimaan");
      table(["Kriteria", "Hasil", "Requirement", "Status"], (acceptanceItems ?? []).map((item) => [item.label, item.hasil, item.requirement, statusLabels[item.status]]));
      pdf.save(`Valver_Report_${new Date().toISOString().split("T")[0]}.pdf`);
      setNotification("success");
      window.setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("PDF generation error:", error);
      const message = error instanceof Error ? error.message : "Kesalahan tidak diketahui";
      setNotification("error");
      window.setTimeout(() => setNotification(null), 8000);
    } finally {
      document.body.classList.remove("pdf-exporting");
      setIsGenerating(false);
    }
  };

  const toast = notification ? (
    <div
      className="pointer-events-auto fixed bottom-4 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-sm rounded-xl border p-4 text-sm shadow-2xl"
      style={{
        borderColor: notification === "success" ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)",
        background: "var(--surface-elevated)",
        color: notification === "success" ? "#22c55e" : "#ef4444",
      }}
      role="status"
    >
      {notification === "success" ? (
        "PDF berhasil diunduh."
      ) : (
        <span>Terjadi kesalahan saat mengunduh PDF. Hubungi developer melalui <a className="font-semibold underline" href="https://www.instagram.com/athaar.mp?igsi=MTl2NG5saHlkd21wYw==" target="_blank" rel="noreferrer">@athaar.mp</a>.</span>
      )}
    </div>
  ) : null;

  return (
    <>
      {typeof document !== "undefined" && toast ? createPortal(toast, document.body) : null}
      <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2 px-6 py-3 rounded-full border font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: "rgba(245, 158, 11, 0.15)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        color: "#f59e0b",
      }}
    >
      {isGenerating ? (
        <>
          <CircleNotch size={18} weight="bold" className="animate-spin" />
          Membuat PDF...
        </>
      ) : (
        <>
          <FileArrowDown size={20} weight="bold" />
          Ekspor PDF
        </>
      )}
      </motion.button>
    </>
  );
}
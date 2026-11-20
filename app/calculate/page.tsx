"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Flask, Calculator, FileText, ChartLineUp } from "@phosphor-icons/react";
import Link from "next/link";
import { useValverCalculations } from "@/hooks/useValverCalculations";
import { KalibrasiTable } from "@/components/calculator/KalibrasiTable";
import { WorkingRangeTable } from "@/components/calculator/WorkingRangeTable";
import { BlankoTable } from "@/components/calculator/BlankoTable";
import { SpikeTable } from "@/components/calculator/SpikeTable";
import { SpikeNominalDisplay } from "@/components/calculator/SpikeNominalDisplay";
import { CalculationStatusBadge } from "@/components/calculator/CalculationStatusBadge";
import { safeRatio } from "@/lib/calculationStatus";
import { AcceptanceCriteriaPanel } from "@/components/calculator/AcceptanceCriteria";
import { CalibrationChart } from "@/components/calculator/CalibrationChart";
import { KorelasiSection } from "@/components/calculator/KorelasiSection";
import { LinearTable } from "@/components/calculator/LinearTable";
import { DisableZoom } from "@/components/DisableZoom";
import { FooterActions } from "@/components/FooterActions";
import { DraftNotice } from "@/components/calculator/DraftNotice";
import { ResetDraftDialog } from "@/components/calculator/ResetDraftDialog";
import { ResultStatCard } from "@/components/calculator/ResultStatCard";
import { SurfaceThemeToggle } from "@/components/calculator/SurfaceThemeToggle";
import { KalibrasiRow, ReplicateRow, SpikeRow } from "@/lib/types";
import { PDFExportButton } from "@/components/calculator/PDFExport";
import { formatNumber, formatNumberFixed, formatPercent } from "@/lib/utils/numberFormat";

const sections = [
  { id: "kalibrasi", label: "Kurva Kalibrasi", icon: Flask },
  { id: "korelasi", label: "Korelasi (R)", icon: ChartLineUp },
  { id: "working-range", label: "Working Range & Validasi", icon: Calculator },
  { id: "blanko", label: "Limit Deteksi (Blanko)", icon: Flask },
  { id: "spike", label: "Uji Spike", icon: Calculator },
  { id: "acceptance", label: "Uji Keberterimaan", icon: FileText },
] as const;

export default function CalculatePage() {
  const [activeSection, setActiveSection] = useState<typeof sections[number]["id"]>("kalibrasi");
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [glass, setGlass] = useState(true);
  const kalibrasiRef = useRef<KalibrasiRow[]>([]);
  const wrLowRef = useRef<ReplicateRow[]>([]);
  const wrHighRef = useRef<ReplicateRow[]>([]);
  const blankoRef = useRef<ReplicateRow[]>([]);
  const spikeRef = useRef<SpikeRow[]>([]);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const {
    kalibrasi,
    wrLow,
    wrHigh,
    blanko,
    spike,
    stdRendah,
    setStdRendah,
    stdTinggi,
    setStdTinggi,
    spikeNominal,
    mdlRequirement,
    setMdlRequirement,
    idFields,
    setIdFields,
    calibration,
    korelasiCara1,
    korelasiCara2,
    linearTable,
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
    curvePoints,
    updateKalibrasi,
    updateWrLow,
    updateWrHigh,
    updateBlanko,
    updateSpike,
    addRow,
    removeRow,
    addKalibrasiRow,
    removeKalibrasiRow,
    predictFromAbsorbance,
    setKalibrasi,
    setWrLow,
    setWrHigh,
    setBlanko,
    setSpike,
    draft,
  } = useValverCalculations();

  useEffect(() => {
    kalibrasiRef.current = kalibrasi;
    wrLowRef.current = wrLow;
    wrHighRef.current = wrHigh;
    blankoRef.current = blanko;
    spikeRef.current = spike;
  }, [kalibrasi, wrLow, wrHigh, blanko, spike]);

  const allValid = calibration && lowResult.n >= 2 && highResult.n >= 2;
  const enteredCalibrationRows = kalibrasi.filter((row) => row.x.trim() !== "" && row.y.trim() !== "").length;

  return (
    <div className={glass ? "calculator-theme liquid-glass" : "calculator-theme"}>
      <DisableZoom />
      <DraftNotice draft={draft} mode="recovery" />
      <ResetDraftDialog draft={draft} />
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-sm" style={{ background: "rgba(0, 0, 0, 0.8)" }}>
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-title"
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl shadow-black/50 md:p-8"
            style={{ borderColor: "var(--accent)", background: "var(--surface-elevated)" }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                <Flask size={22} weight="bold" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Sebelum Memulai</p>
                <h2 id="disclaimer-title" className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Catatan Penggunaan Valver</h2>
              </div>
            </div>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>Valver dibuat sebagai media pembelajaran dan alat bantu pengembangan untuk memahami proses verifikasi metode analisis UV-Vis.</p>
              <p>Hasil yang ditampilkan bergantung pada data yang Anda masukkan. Gunakan aplikasi ini secara bijak dan lakukan verifikasi ulang terhadap prosedur serta hasil analisis sesuai kebutuhan Anda. Developer tidak bertanggung jawab atas keputusan, kerugian, atau dampak yang timbul dari penggunaan aplikasi di luar tujuan pembelajaran dan pengembangan.</p>
              <p className="pl-3" style={{ borderLeft: "2px solid var(--accent)" }}>Dukung developer dengan mengikuti Instagram: <a href="https://www.instagram.com/athaar.mp?igsi=MTl2NG5saHlkd21wYw==" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4" style={{ color: "var(--accent)" }}><span style={{ textDecorationColor: "color-mix(in srgb, var(--accent) 40%, transparent)" }}>@athaar.mp</span></a></p>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <Link href="/" className="rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-colors" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>Batal</Link>
              <button type="button" onClick={() => setShowDisclaimer(false)} className="rounded-xl px-4 py-3 text-sm font-semibold transition-colors" style={{ background: "var(--accent)", color: "var(--surface)" }}>Setuju & Lanjutkan</button>
            </div>
          </motion.div>
        </div>
      )}
      <div inert={draft.status === "loading" || draft.status === "choice" || draft.status === "blocked"} className="calculate-page min-h-[100dvh] overflow-x-hidden" style={{ background: "var(--surface)" }}>
        <div className="calculate-atmosphere" aria-hidden="true">
          <span className="calculate-orb calculate-orb-one" />
          <span className="calculate-orb calculate-orb-two" />
          <span className="calculate-scanline" />
        </div>
        {/* Header */}
        <header className="calculate-header sticky top-0 z-40 backdrop-blur-md border-b" style={{ background: "color-mix(in srgb, var(--surface) 90%, transparent)", borderColor: "var(--border-default)" }}>
          <div className="max-w-full mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-xl tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
                  <Flask size={20} weight="bold" style={{ color: "var(--surface)" }} />
                </span>
                <span className="hidden sm:block">Valver</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1 rounded-xl p-1" role="tablist" aria-label="Calculator sections" style={{ background: "var(--surface-muted)" }}>
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    role="tab"
                    aria-selected={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="calculate-tab flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={
                      activeSection === section.id
                        ? { background: "var(--accent-muted)", color: "var(--accent)", borderColor: "var(--accent)" }
                        : { color: "var(--text-secondary)" }
                    }
                  >
                    {typeof section.icon === "string" ? (
                      <span className="text-lg">{section.icon}</span>
                    ) : (
                      <section.icon size={16} weight="bold" />
                    )}
                    {section.label}
                  </motion.button>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <PDFExportButton
                  calibration={calibration}
                  lowResult={lowResult}
                  highResult={highResult}
                  blankoResult={blankoResult}
                  spikeResult={spikeResult}
                  precision={precision}
                  accuracyLow={accuracyLow}
                  accuracyHigh={accuracyHigh}
                  mdl={mdl}
                  acceptance={acceptance}
                  acceptanceItems={acceptanceItems}
                  stdRendah={stdRendah}
                  stdTinggi={stdTinggi}
                  spikeNominal={spikeNominal}
                  mdlRequirement={mdlRequirement}
                  contentRef={mainContentRef}
                  kalibrasiRows={kalibrasi}
                  wrLowRows={wrLow}
                  wrHighRows={wrHigh}
                  blankoRows={blanko}
                  spikeRows={spike}
                  korelasiCara1={korelasiCara1 as unknown as { rows: Array<{ [key: string]: number }> } | null}
                  korelasiCara2={korelasiCara2 as unknown as { rows: Array<{ [key: string]: number }>; sumRow: { sumdx2: number; sumdy2: number; sumdxdy: number } } | null}
                  linearRows={linearTable?.rows as unknown as Array<{ [key: string]: number }> ?? []}
                />
              </div>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="md:hidden px-4 pb-4 overflow-x-auto">
            <nav className="flex gap-2 pb-2" role="tablist" aria-label="Calculator sections">
              {sections.map((section) => (
                <button
                  key={section.id}
                  role="tab"
                  aria-selected={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                  style={
                    activeSection === section.id
                      ? { background: "var(--accent-muted)", color: "var(--accent)", borderColor: "var(--accent)" }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  {typeof section.icon === "string" ? (
                    <span className="text-lg">{section.icon}</span>
                  ) : (
                    <section.icon size={14} weight="bold" />
                  )}
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 md:px-6 py-6">
        <div className="flex min-w-0 w-full">
          {/* Main Content */}
          <div className="w-full min-w-0" ref={mainContentRef}>
            <DraftNotice draft={draft} />
            {/* Reset Button - moved above tables */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <SurfaceThemeToggle glass={glass} onChange={setGlass} />
              <button type="button" onClick={draft.clear} disabled={draft.status === "loading" || draft.status === "choice" || draft.status === "blocked"} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>Reset perhitungan</button>
            </div>

            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    {sections.find((s) => s.id === activeSection)?.label}
                  </h1>
                  <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
                    {getSectionDescription(activeSection)}
                  </p>
                </div>
                {activeSection === "kalibrasi" && calibration && (
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    <StatBadge label="R" value={calibration.R1.toFixed(4)} color="cyan" />
                    <StatBadge label="R²" value={(calibration.R1 * calibration.R1).toFixed(4)} color="blue" />
                    <StatBadge label="Slope" value={calibration.B.toFixed(4)} color="amber" />
                  </div>
                )}
              </div>

              {/* Settings for Spike */}
              {activeSection === "spike" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6 p-4 rounded-xl border"
                  style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <SpikeNominalDisplay value={spikeNominal} />
                    <SettingInput label="MDL Requirement" value={mdlRequirement} onChange={setMdlRequirement} />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Section Content - Inline Switch */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {(() => {
                switch (activeSection) {
                  case "kalibrasi":
                    return (
                      <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6 min-w-0">
                          <KalibrasiTable
                            data={kalibrasi}
                            calibration={calibration}
                            onUpdate={updateKalibrasi}
                            onAddRow={addKalibrasiRow}
                            onRemoveRow={removeKalibrasiRow}
                            dataRef={kalibrasiRef}
                            onDataChange={() => setKalibrasi([...kalibrasiRef.current])}
                          />
                          <CalibrationChart calibration={calibration} />
                        </div>
                        <div className="space-y-6 min-w-0">
                          {calibration && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 rounded-xl border"
                              style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}
                            >
                              <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Ringkasan Regresi</h4>
                              <div className="space-y-3">
                                <StatRow label="Persamaan" value={`y = ${calibration.B.toFixed(6)}x + ${calibration.A.toFixed(6)}`} />
                                <StatRow label="Slope (B)" value={calibration.B.toFixed(6)} />
                                <StatRow label="Intercept (A)" value={calibration.A.toFixed(6)} />
                                <StatRow label="R" value={calibration.R1.toFixed(6)} />
                                <StatRow label="R²" value={(calibration.R1 * calibration.R1).toFixed(6)} />
                                <StatRow label="n" value={calibration.n.toString()} />
                              </div>
                            </motion.div>
                          )}
                          {linearTable && calibration && (
                            <LinearTable linearTable={linearTable} calibration={calibration} />
                          )}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl border"
                            style={{ borderColor: "var(--accent)", background: "var(--accent-muted)" }}
                          >
                            <p className="text-sm" style={{ color: "var(--accent)" }}>
                              {!calibration && enteredCalibrationRows >= 2
                                ? "Tidak dapat dihitung: periksa angka, variasi konsentrasi dan absorbansi, serta slope yang tidak boleh nol."
                                : "Minimal 2 titik data valid. Gunakan rentang konsentrasi yang mencakup area kerja metode."}
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    );

                  case "korelasi":
                    return (
                      <div className="min-w-0 w-full max-w-5xl space-y-6 overflow-hidden">
                        <KorelasiSection
                          korelasiCara1={korelasiCara1}
                          korelasiCara2={korelasiCara2}
                          calibration={calibration}
                        />
                      </div>
                    );

                  case "working-range":
                    return (
                      <div className="min-w-0 w-full max-w-full space-y-8 overflow-hidden">
                        {/* Settings for both WR Low and High */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl border"
                          style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingInput label="Standar Rendah (ppm)" value={stdRendah} onChange={setStdRendah} />
                            <SettingInput label="Standar Tinggi (ppm)" value={stdTinggi} onChange={setStdTinggi} />
                          </div>
                        </motion.div>

                        {/* Working Range Tables - 2 Column Layout */}
                        <div className="grid min-w-0 w-full max-w-full grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="min-w-0 max-w-full overflow-hidden">
                            <WorkingRangeTable
                            title="Standar Rendah"
                            data={wrLow}
                            result={lowResult}
                            stdConc={stdRendah}
                            onStdConcChange={setStdRendah}
                            onUpdate={updateWrLow}
                            onAddRow={() => addRow(setWrLow)}
                            onRemoveRow={(i) => removeRow(setWrLow, i)}
                            isLow={true}
                            accuracy={accuracyLow}
                            precision={precision}
                            dataRef={wrLowRef}
                            onDataChange={() => setWrLow([...wrLowRef.current])}
                             calibration={calibration}
                           />
                          </div>
                          <div className="min-w-0 max-w-full overflow-hidden">
                           <WorkingRangeTable
                            title="Standar Tinggi"
                            data={wrHigh}
                            result={highResult}
                             stdConc={stdTinggi}
                             onStdConcChange={setStdTinggi}
                             onUpdate={updateWrHigh}
                            onAddRow={() => addRow(setWrHigh)}
                            onRemoveRow={(i) => removeRow(setWrHigh, i)}
                            isLow={false}
                            accuracy={accuracyHigh}
                            dataRef={wrHighRef}
                            onDataChange={() => setWrHigh([...wrHighRef.current])}
                            calibration={calibration}
                          />
                          </div>
                        </div>

                        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                          <ResultStatCard tone="measurement"
                            label="S² Standar Rendah"
                            value={Number.isFinite(lowResult.s2) ? formatNumber(lowResult.s2, 8) : "-"}
                          />
                          <ResultStatCard tone="measurement"
                            label="S² Standar Tinggi"
                            value={Number.isFinite(highResult.s2) ? formatNumber(highResult.s2, 8) : "-"}
                          />
                        </div>

                        <div className="min-w-0 w-full rounded-xl border p-4 md:p-6" style={{ borderColor: "var(--border-default)", background: "var(--surface-muted)" }}>
                          <h3 className="mb-4 text-lg font-bold" style={{ color: "var(--text-primary)" }}>Uji Kesetaraan Working Range</h3>
                          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                            <ResultStatCard tone="result"
                              label="PG = S² Tinggi / S² Rendah"
                              value={Number.isFinite(lowResult.s2) && Number.isFinite(highResult.s2) && lowResult.s2 !== 0 ? formatNumber(highResult.s2 / lowResult.s2, 6) : "-"}
                            />
                            <ResultStatCard tone="reference" label="F tabel" value="5,18" />
                            <div className="flex min-w-0 flex-col justify-center rounded-lg border p-3" style={{ borderColor: "var(--border-default)", background: "var(--surface-muted)" }}>
                              <div className="mb-1 text-[10px]" style={{ color: "var(--text-muted)" }}>Status</div>
                              <div className="break-words text-sm font-semibold" style={Number.isFinite(lowResult.s2) && Number.isFinite(highResult.s2) && lowResult.s2 !== 0 && highResult.s2 / lowResult.s2 < 5.18 ? { color: "#22c55e" } : { color: "#ef4444" }}>
                                <CalculationStatusBadge status={acceptance.workingRange.status} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {precision && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="min-w-0 w-full max-w-full overflow-hidden rounded-xl border p-4 md:p-6"
                            style={{ borderColor: "var(--border-default)", background: "var(--surface-muted)" }}
                          >
                            <h3 className="mb-4 text-lg font-bold md:mb-6 md:text-xl" style={{ color: "var(--text-primary)" }}>Perhitungan Presisi</h3>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6">
                              <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wide md:text-sm" style={{ color: "var(--text-muted)" }}>Standar Rendah</h4>
                                <div className="grid grid-cols-2 gap-2 md:gap-4">
                                  <ResultStatCard tone="measurement" label="SD" value={Number.isFinite(precision.sdLow) ? formatNumber(precision.sdLow, 8) : "-"} />
                                  <ResultStatCard tone="result" label="SDR (%)" value={Number.isFinite(precision.sdrLow) ? `${precision.sdrLow.toFixed(3)}%` : "-"} />
                                  <ResultStatCard tone="reference" label="CV Horwitz" value={Number.isFinite(precision.cvLow) ? precision.cvLow.toFixed(3) : "-"} />
                                  <ResultStatCard tone="reference" label="0.67 × CV Horwitz" value={Number.isFinite(precision.cv67Low) ? precision.cv67Low.toFixed(3) : "-"} />
                                </div>
                                <div className="text-center">
                                  <CalculationStatusBadge status={precision.statusLow} />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wide md:text-sm" style={{ color: "var(--text-muted)" }}>Standar Tinggi</h4>
                                <div className="grid grid-cols-2 gap-2 md:gap-4">
                                  <ResultStatCard tone="measurement" label="SD" value={Number.isFinite(precision.sdHigh) ? formatNumber(precision.sdHigh, 8) : "-"} />
                                  <ResultStatCard tone="result" label="SDR (%)" value={Number.isFinite(precision.sdrHigh) ? `${precision.sdrHigh.toFixed(3)}%` : "-"} />
                                  <ResultStatCard tone="reference" label="CV Horwitz" value={Number.isFinite(precision.cvHigh) ? precision.cvHigh.toFixed(3) : "-"} />
                                  <ResultStatCard tone="reference" label="0.67 × CV Horwitz" value={Number.isFinite(precision.cv67High) ? precision.cv67High.toFixed(3) : "-"} />
                                </div>
                                <div className="text-center">
                                  <CalculationStatusBadge status={precision.statusHigh} />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {accuracyLow && accuracyHigh && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="min-w-0 w-full max-w-full overflow-hidden rounded-xl border p-4 md:p-6"
                            style={{ borderColor: "var(--border-default)", background: "var(--surface-muted)" }}
                          >
                            <h3 className="mb-4 text-lg font-bold md:mb-6 md:text-xl" style={{ color: "var(--text-primary)" }}>Perhitungan Akurasi</h3>
                            {(!calibration || calibration.validRows.length < 2) ? (
                              <div className="rounded-lg border p-4 text-sm" style={{ background: "rgba(245, 158, 11, 0.1)", borderColor: "rgba(245, 158, 11, 0.3)", color: "#fcd34d" }}>
                                Perhitungan akurasi tidak bisa dilakukan karena tabel kurva kalibrasi masih kosong atau belum memiliki minimal 2 titik data valid.
                              </div>
                            ) : (
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6">
                              <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wide md:text-sm" style={{ color: "var(--text-muted)" }}>Standar Rendah</h4>
                                <ResultStatCard tone="accuracy" label="% Akurasi" value={Number.isFinite(accuracyLow.accuracy) ? `${accuracyLow.accuracy.toFixed(2)}%` : "-"} />
                                <div className="text-center">
                                  <CalculationStatusBadge status={accuracyLow.status} />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wide md:text-sm" style={{ color: "var(--text-muted)" }}>Standar Tinggi</h4>
                                <ResultStatCard tone="accuracy" label="% Akurasi" value={Number.isFinite(accuracyHigh.accuracy) ? `${accuracyHigh.accuracy.toFixed(2)}%` : "-"} />
                                <div className="text-center">
                                  <CalculationStatusBadge status={accuracyHigh.status} />
                                </div>
                              </div>
                            </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    );

                  case "blanko":
                    return (
                      <div className="min-w-0 w-full max-w-5xl space-y-6 overflow-hidden">
                         <BlankoTable
                          data={blanko}
                          result={blankoResult}
                          onUpdate={updateBlanko}
                          onAddRow={() => addRow(setBlanko)}
                          onRemoveRow={(i) => removeRow(setBlanko, i)}
                          mdlBlanko={mdl.mdlBlanko}
                          dataRef={blankoRef}
                          onDataChange={() => setBlanko([...blankoRef.current])}
                          calibration={calibration}
                        />
                      </div>
                    );

                  case "spike":
                    return (
                      <div className="min-w-0 w-full max-w-5xl space-y-6 overflow-hidden">
                        <SpikeTable
                          data={spike}
                          result={spikeResult}
                          spikeNominal={spikeNominal}
                          onUpdate={updateSpike}
                          onAddRow={() => addRow(setSpike)}
                          onRemoveRow={(i) => removeRow(setSpike, i)}
                          mdlSpike={mdl.mdlSpike}
                          loqSpike={mdl.loqSpike}
                          recovery={mdl.recovery}
                          snRatio={safeRatio(spikeResult.avg, Math.sqrt(spikeResult.s2))}
                          avgRecovery={spikeResult.avg && spikeNominal ? (spikeResult.avg / parseFloat(spikeNominal)) * 100 : undefined}
                          dataRef={spikeRef}
                          onDataChange={() => setSpike([...spikeRef.current])}
                          calibration={calibration}
                        />
                      </div>
                    );

                  case "acceptance":
                    return (
                      <div className="min-w-0 w-full max-w-5xl space-y-6 overflow-hidden">
                        <AcceptanceCriteriaPanel acceptanceItems={acceptanceItems} mdlRequirement={mdlRequirement} />
                      </div>
                    );

                  default:
                    return null;
                }
              })()}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  </div>
  );
}

function getSectionDescription(section: typeof sections[number]["id"]): string {
  const descriptions: Record<string, string> = {
    kalibrasi: "Masukkan data konsentrasi (ppm) dan absorbansi untuk menghitung regresi linear dan kurva kalibrasi",
    korelasi: "Perhitungan koefisien korelasi (R) dengan dua metode: Rumus Σxy dan Rumus Σ(x−x̄)(y−ȳ). Tabel linearitas menampilkan nilai sebelum dan sesudah linear (prediksi Ŷ)",
    "working-range": "Data replikat standar rendah dan tinggi untuk perhitungan presisi (CV Horwitz), akurasi, dan validasi working range",
    blanko: "Data blanko untuk perhitungan Limit Deteksi (MDL = 5 × SD)",
    spike: "Data spike recovery untuk perhitungan MDL, LOQ, Recovery, dan S/N Ratio",
    acceptance: "Ringkasan semua kriteria keberterimaan metode (OK / NOT OK)",
  };
  return descriptions[section] || "";
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, { background: string; color: string; borderColor: string }> = {
    cyan: { background: "var(--accent-muted)", color: "var(--accent)", borderColor: "var(--accent)" },
    blue: { background: "rgba(59, 130, 246, 0.2)", color: "#3b82f6", borderColor: "rgba(59, 130, 246, 0.3)" },
    amber: { background: "rgba(245, 158, 11, 0.2)", color: "#f59e0b", borderColor: "rgba(245, 158, 11, 0.3)" },
    green: { background: "rgba(34, 197, 94, 0.2)", color: "#22c55e", borderColor: "rgba(34, 197, 94, 0.3)" },
  };
  const c = colors[color] ?? colors.cyan;
  return (
    <span className="px-3 py-1 rounded-full border text-xs font-medium" style={c}>
      {label}: <span className="font-mono">{value}</span>
    </span>
  );
}

function SettingInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input
        type="number"
        step="0.001"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
        style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}
      />
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: "var(--border-subtle)" }}>
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span className="font-mono" style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 md:p-3 rounded-lg border" style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}>
      <div className="text-[10px] md:text-xs mb-1 truncate" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="text-sm md:text-lg font-mono font-semibold break-all" style={{ color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}
"use client";

import { motion } from "motion/react";
import { PDFExportButton } from "./calculator/PDFExport";
import { ResetButton } from "./ResetButton";

interface FooterActionsProps {
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
  stdRendah: string;
  stdTinggi: string;
  spikeNominal: string;
  mdlRequirement: string;
  onReset: () => void;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

export function FooterActions({
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
  stdRendah,
  stdTinggi,
  spikeNominal,
  mdlRequirement,
  onReset,
  contentRef,
}: FooterActionsProps) {
  const hasData = calibration && (calibration.validRows?.length ?? 0) > 0;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="sticky bottom-0 z-40 backdrop-blur-md border-t py-4 px-4 md:px-6"
      style={{
        background: "color-mix(in srgb, var(--surface) 95%, transparent)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="max-w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-3">
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
          stdRendah={stdRendah}
          stdTinggi={stdTinggi}
          spikeNominal={spikeNominal}
          mdlRequirement={mdlRequirement}
          contentRef={contentRef}
        />
      </div>
    </motion.footer>
  );
}
"use client";

import { motion } from "motion/react";
import { CheckCircle, XCircle, WarningCircle } from "@phosphor-icons/react";
import { AcceptanceCriteriaItem } from "@/lib/types";

interface AcceptanceCriteriaProps {
  acceptanceItems: AcceptanceCriteriaItem[];
  mdlRequirement: string;
}

export function AcceptanceCriteriaPanel({ acceptanceItems, mdlRequirement }: AcceptanceCriteriaProps) {
  const allOK = acceptanceItems.every((item) => item.isOK);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Uji Keberterimaan MDL
        </h3>
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl border"
          style={{
            background: allOK ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
            borderColor: allOK ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
          }}
        >
          <span className="font-medium" style={{ color: allOK ? "#22c55e" : "#ef4444" }}>
            {allOK ? "SEMUA OK" : "ADA NOT OK"}
          </span>
          {allOK ? (
            <CheckCircle size={18} weight="bold" className="text-green-500" />
          ) : (
            <WarningCircle size={18} weight="bold" className="text-red-500" />
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--surface-muted)",
          borderColor: "var(--border-default)",
        }}
      >
        <div
          className="px-4 py-3 border-b font-semibold"
          style={{
            color: "var(--text-secondary)",
            borderColor: "var(--border-default)",
            background: "var(--surface-elevated)",
          }}
        >
          Uji Keberterimaan MDL
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
          {acceptanceItems.map((item, iIdx) => (
            <CriteriaRow key={iIdx} item={item} index={iIdx} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CriteriaRow({ item, index }: { item: AcceptanceCriteriaItem; index: number }) {
  return (
    <div
      className="px-4 py-3 transition-colors hover:bg-opacity-50"
      style={{ background: "var(--surface-muted)" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
          style={{
            background: item.isOK ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
          }}
        >
          {item.isOK ? (
            <CheckCircle size={14} weight="bold" className="text-green-500" />
          ) : (
            <XCircle size={14} weight="bold" className="text-red-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {item.label}
          </p>
          <p className="font-mono text-lg mt-0.5" style={{ color: "var(--text-primary)" }}>
            {item.hasil}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Kriteria: {item.requirement}
          </p>
        </div>
        <div
          className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium"
          style={{
            background: item.isOK ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
            color: item.isOK ? "#22c55e" : "#ef4444",
          }}
        >
          {item.isOK ? "OK" : "NOT OK"}
        </div>
      </div>
    </div>
  );
}

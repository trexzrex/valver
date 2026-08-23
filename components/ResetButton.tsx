"use client";

import { motion } from "motion/react";
import { Repeat } from "@phosphor-icons/react";

interface ResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
}

export function ResetButton({ onReset, disabled = false }: ResetButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onReset}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)", transition: "all 0.2s" }}
    >
      <Repeat size={16} weight="bold" />
      Reset Data
    </motion.button>
  );
}
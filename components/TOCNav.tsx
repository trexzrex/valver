"use client";

import { motion } from "motion/react";
import { CaretRight, Flask, ChartLineUp, Ruler, MagnifyingGlass, Drop, ClipboardText } from "@phosphor-icons/react";

const sections = [
  { id: "kalibrasi", label: "Kurva Kalibrasi", icon: Flask },
  { id: "korelasi", label: "Korelasi (R)", icon: ChartLineUp },
  { id: "working-range", label: "Working Range & Validasi", icon: Ruler },
  { id: "blanko", label: "Limit Deteksi", icon: MagnifyingGlass },
  { id: "spike", label: "Uji Spike", icon: Drop },
  { id: "acceptance", label: "Keberterimaan MDL", icon: ClipboardText },
] as const;

interface TOCNavProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

export function TOCNav({ activeSection, onNavigate }: TOCNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="sticky top-20 lg:top-24 z-30 hidden lg:block"
      aria-label="Table of Contents"
    >
      <div
        className="rounded-xl p-4 max-h-[calc(100vh-8rem)] overflow-y-auto border"
        style={{
          background: "var(--surface-muted)",
          borderColor: "var(--border-default)",
        }}
      >
        <h4
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Daftar Isi
        </h4>
        <ul className="space-y-1" role="list">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <li key={section.id}>
                <button
                  onClick={() => onNavigate(section.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left"
                  style={{
                    background: isActive ? "var(--accent-muted)" : "transparent",
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    border: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={16} weight="bold" />
                  <span className="flex-1">{section.label}</span>
                  {isActive && <CaretRight size={16} weight="bold" style={{ color: "var(--accent)" }} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}

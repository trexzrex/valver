"use client";

import { motion } from "motion/react";
import { User, Hash, GraduationCap } from "@phosphor-icons/react";
import { IDFields } from "@/lib/types";

interface IDFieldsProps {
  fields: IDFields;
  onUpdate: (field: "nama" | "nis" | "kelas", value: string) => void;
}

export function IDFieldsComponent({ fields, onUpdate }: IDFieldsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border"
      style={{
        background: "var(--surface-muted)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="flex flex-col gap-2">
        <label
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          <User size={14} weight="bold" style={{ color: "var(--accent)" }} />
          Nama
        </label>
        <input
          type="text"
          value={fields.nama}
          onChange={(e) => onUpdate("nama", e.target.value)}
          placeholder="Masukkan nama lengkap"
          className="w-full px-3 py-2 border rounded-lg text-sm"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-default)",
            color: "var(--text-primary)",
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          <Hash size={14} weight="bold" style={{ color: "var(--accent)" }} />
          NIS
        </label>
        <input
          type="text"
          value={fields.nis}
          onChange={(e) => onUpdate("nis", e.target.value)}
          placeholder="Masukkan NIS / Nomor Induk"
          className="w-full px-3 py-2 border rounded-lg text-sm"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-default)",
            color: "var(--text-primary)",
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          <GraduationCap size={14} weight="bold" style={{ color: "var(--accent)" }} />
          Kelas
        </label>
        <input
          type="text"
          value={fields.kelas}
          onChange={(e) => onUpdate("kelas", e.target.value)}
          placeholder="Contoh: XII IPA 1 / Kelompok 3"
          className="w-full px-3 py-2 border rounded-lg text-sm"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border-default)",
            color: "var(--text-primary)",
          }}
        />
      </div>
    </motion.div>
  );
}

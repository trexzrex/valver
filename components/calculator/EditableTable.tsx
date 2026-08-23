"use client";

import { motion } from "motion/react";
import { Plus, Trash, Calculator } from "@phosphor-icons/react";
import { handlePaste } from "@/lib/utils/pasteHandler";
import { useCallback } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  editable?: boolean;
  onChange?: (index: number, value: string) => void;
  value?: (row: T) => string;
  className?: string;
  /** Field order untuk paste handler */
  fieldOrder?: string[];
  startField?: string;
}

interface EditableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onAddRow?: () => void;
  onRemoveRow: (index: number) => void;
  minRows?: number;
  className?: string;
  emptyMessage?: string;
  /** Custom footer rows (misalnya baris sigma dan rata-rata khusus) */
  footerRows?: React.ReactNode;
  /** Enable horizontal scroll for table (mobile friendly) */
  scrollable?: boolean;
  /** Data array reference untuk paste handler */
  dataRef?: React.MutableRefObject<T[]>;
  /** Callback saat data berubah */
  onDataChange?: () => void;
}

export function EditableTable<T>({
  data,
  columns,
  onAddRow,
  onRemoveRow,
  minRows = 1,
  className = "",
  emptyMessage = "Tidak ada data",
  footerRows,
  scrollable = false,
  dataRef,
  onDataChange,
}: EditableTableProps<T>) {
  const canRemove = data.length > minRows;

  const handlePasteEvent = useCallback((event: React.ClipboardEvent<HTMLInputElement>, rowIndex: number, col: Column<T>) => {
    if (!dataRef || !onDataChange || !col.fieldOrder || !col.startField) return;
    
    handlePaste(event, {
      dataArr: dataRef.current,
      fieldOrder: col.fieldOrder,
      makeEmptyRow: () => ({} as T),
      startRow: rowIndex,
      startField: col.startField,
      onUpdate: onDataChange,
    });
  }, [dataRef, onDataChange]);

  if (data.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`min-w-0 w-full max-w-full overflow-hidden rounded-xl border ${className}`} style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)" }}>
      <div className="min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain touch-pan-x scrollable-table">
        <table className="w-max min-w-[760px] text-sm">
        <thead>
          <tr className="border-b" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs ${col.className || ""}`}
                style={{ color: "var(--text-secondary)" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.03 }}
              className="border-b transition-colors"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-3 ${col.className || ""}`}
                >
                  {col.key === "actions" ? (
                    <div className="flex items-center gap-2">
                      {canRemove && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onRemoveRow(rowIndex)}
                          className="p-1.5 rounded-lg hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          style={{ color: "var(--text-muted)" }}
                          aria-label="Hapus baris"
                        >
                          <Trash size={16} weight="bold" />
                        </motion.button>
                      )}
                    </div>
                  ) : col.render ? (
                    col.render(row, rowIndex)
                  ) : col.editable && col.onChange && col.value ? (
                    <input
                      type="number"
                      step="any"
                      value={col.value(row)}
                      onChange={(e) => col.onChange!(rowIndex, e.target.value)}
                      onKeyDown={(e) => {
                        // Allow: backspace, delete, tab, escape, enter, home, end, left, right, arrows
                        const allowedKeys = [
                          "Backspace", "Delete", "Tab", "Escape", "Enter",
                          "Home", "End", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
                          ".", "-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
                        ];
                        // Allow Ctrl/Cmd+A, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X
                        if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
                          return;
                        }
                        if (!allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => handlePasteEvent(e, rowIndex, col)}
                      className="w-full min-w-[80px] px-3 py-2 border rounded-lg transition-all text-sm"
                      style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}
                      placeholder="-"
                      inputMode="decimal"
                    />
                  ) : (
                    String((row as Record<string, unknown>)[String(col.key)] ?? "\u2014")
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
        {footerRows && (
          <tfoot>
            {footerRows}
          </tfoot>
        )}
      </table>
      </div>

      {onAddRow && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddRow}
          className="w-auto max-w-[90vw] mx-auto mt-4 py-3 px-6 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium"
          style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
        >
          <Plus size={18} weight="bold" style={{ color: "var(--accent)" }} />
          Tambah Baris
        </motion.button>
      )}
    </div>
  );
}
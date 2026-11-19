import { CalculationStatus, statusLabels } from "@/lib/calculationStatus";

export function CalculationStatusBadge({ status }: { status: CalculationStatus }) {
  const color = status === "pass" ? "#22c55e" : status === "fail" ? "#ef4444" : "#d97706";
  return <span className="inline-block rounded-lg px-3 py-2 text-sm font-semibold" style={{ color, background: `${color}18` }}>{statusLabels[status]}</span>;
}

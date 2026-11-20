type ResultTone = "measurement" | "result" | "reference" | "accuracy";

export function ResultStatCard({ label, value, tone }: { label: string; value: string; tone: ResultTone }) {
  return (
    <div data-tone={tone} className="result-stat-card min-w-0 rounded-lg border border-l-[3px] p-3 md:p-4">
      <div className="mb-2 text-xs leading-5" style={{ color: "var(--text-secondary)" }}>{label}</div>
      <div className="result-stat-value break-words font-mono text-base font-semibold tabular-nums md:text-xl">{value}</div>
    </div>
  );
}

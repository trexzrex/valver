export function SurfaceThemeToggle({ glass, onChange }: { glass: boolean; onChange: (glass: boolean) => void }) {
  return (
    <div role="group" aria-label="Tema permukaan kalkulator" className="surface-theme-toggle inline-flex items-center gap-1 rounded-xl border p-1" style={{ borderColor: "var(--border-default)", background: "var(--surface-elevated)" }}>
      {[{ label: "Standar", value: false }, { label: "Liquid glass", value: true }].map(option => (
        <button key={option.label} type="button" aria-pressed={glass === option.value} onClick={() => onChange(option.value)}
          className="min-h-10 rounded-lg px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ background: glass === option.value ? "var(--accent-muted)" : "transparent", color: glass === option.value ? "var(--accent)" : "var(--text-secondary)" }}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

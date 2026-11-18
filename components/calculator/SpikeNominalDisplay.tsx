interface SpikeNominalDisplayProps {
  value: string;
}

export function SpikeNominalDisplay({ value }: SpikeNominalDisplayProps) {
  const nominal = value === "" ? NaN : Number(value);
  const hasNominal = Number.isFinite(nominal) && nominal > 0;

  return (
    <div>
      <p className="mb-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
        Spike Nominal (ppm) · Otomatis
      </p>
      <p className="rounded-lg border px-3 py-2 text-sm font-mono" style={{ background: "var(--surface-muted)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
        {hasNominal
          ? nominal.toLocaleString("id-ID", { maximumSignificantDigits: 15 })
          : "Menunggu data kalibrasi"}
      </p>
      <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
        Ditentukan otomatis dari median konsentrasi kalibrasi positif.
      </p>
    </div>
  );
}

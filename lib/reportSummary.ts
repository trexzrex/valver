// Shared by interactive tables and exported reports. Empty is not a measured zero.
export function summarizeNumbers(values: Array<string | number | null | undefined>) {
  const valid = values.flatMap(value => {
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) return [];
    const numeric = Number(value);
    return Number.isFinite(numeric) ? [numeric] : [];
  });
  const sum = valid.length ? valid.reduce((total, value) => total + value, 0) : NaN;
  return { count: valid.length, sum, average: valid.length ? sum / valid.length : NaN };
}

// The built-in PDF fonts cannot encode Greek letters or combining overbars.
export function pdfMathText(value: string): string {
  return value.replaceAll("Σ", "Sigma ").replaceAll("√", "sqrt")
    .replaceAll("x̄", "x_mean").replaceAll("ȳ", "y_mean").replaceAll("ŷ", "y_pred")
    .replaceAll("−", "-").replaceAll("²", "^2");
}

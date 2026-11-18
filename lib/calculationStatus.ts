export type CalculationStatus = "incomplete" | "invalid" | "pass" | "fail";

export const statusLabels: Record<CalculationStatus, string> = {
  incomplete: "Belum cukup data",
  invalid: "Tidak dapat dihitung",
  pass: "OK",
  fail: "NOT OK",
};

export function evaluateStatus(count: number, minimum: number, values: number[], passes: boolean): CalculationStatus {
  if (count < minimum || values.some(Number.isNaN)) return count < minimum ? "incomplete" : "invalid";
  if (!values.every(Number.isFinite)) return "invalid";
  return passes ? "pass" : "fail";
}

export function safeRatio(numerator: number, denominator: number): number {
  return Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0
    ? numerator / denominator
    : NaN;
}

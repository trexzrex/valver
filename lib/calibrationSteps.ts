import type { CalibrationResult } from "@/lib/types";

export interface CalibrationStep {
  id: string;
  label: string;
  formula: string;
  substitution: string;
  result: string;
  formulaLatex: string;
  substitutionLatex: string;
  resultLatex: string;
}

// Display only: calculations always retain their original full precision.
export function formatStepNumber(value: number): string {
  return Number(value.toPrecision(8)).toString();
}

export function formatMathNumber(value: number): string {
  return formatStepNumber(value).replace(/e([+-]?\d+)/, (_, exponent) => ` \\times 10^{${Number(exponent)}}`);
}

export function buildCalibrationSteps(calibration: CalibrationResult | null): CalibrationStep[] {
  if (!calibration) return [];
  const { n, sumx, sumy, sumx2, sumy2, sumxy, avgx, avgy, A, B, R1, R2 } = calibration;
  if (![n, sumx, sumy, sumx2, sumy2, sumxy, avgx, avgy, A, B, R1, R2].every(Number.isFinite)) return [];
  const f = formatStepNumber;
  const v = (value: number) => value < 0 ? `(${f(value)})` : f(value);
  const dx2 = calibration.rows.reduce((s, r) => s + (r.x - avgx) ** 2, 0);
  const dy2 = calibration.rows.reduce((s, r) => s + (r.y - avgy) ** 2, 0);
  const dxdy = calibration.rows.reduce((s, r) => s + (r.x - avgx) * (r.y - avgy), 0);
  const numerator = `${n} × ${v(sumxy)} − ${v(sumx)} × ${v(sumy)}`;
  const xDenominator = `${n} × ${v(sumx2)} − ${v(sumx)}²`;
  const yDenominator = `${n} × ${v(sumy2)} − ${v(sumy)}²`;
  const tex = formatMathNumber;
  const t = (value: number) => value < 0 ? `\\left(${tex(value)}\\right)` : tex(value);
  const numTex = `${n} \\times ${t(sumxy)} - ${t(sumx)} \\times ${t(sumy)}`;
  const xTex = `${n} \\times ${t(sumx2)} - ${t(sumx)}^2`;
  const yTex = `${n} \\times ${t(sumy2)} - ${t(sumy)}^2`;
  const latex = [
    { formulaLatex: String.raw`b = \frac{n\sum xy - (\sum x)(\sum y)}{n\sum x^2 - (\sum x)^2}`, substitutionLatex: `b = \\frac{${numTex}}{${xTex}}`, resultLatex: `b = ${tex(B)}` },
    { formulaLatex: String.raw`a = \bar{y} - b\bar{x}`, substitutionLatex: `a = ${t(avgy)} - ${t(B)} \\times ${t(avgx)}`, resultLatex: `a = ${tex(A)}` },
    { formulaLatex: "y = bx + a", substitutionLatex: `y = ${t(B)} \\times x + ${t(A)}`, resultLatex: `y = ${t(B)}x ${A < 0 ? "-" : "+"} ${tex(Math.abs(A))}` },
    { formulaLatex: String.raw`r = \frac{n\sum xy - (\sum x)(\sum y)}{\sqrt{\left[n\sum x^2 - (\sum x)^2\right]\left[n\sum y^2 - (\sum y)^2\right]}}`, substitutionLatex: `r = \\frac{${numTex}}{\\sqrt{\\left[${xTex}\\right]\\left[${yTex}\\right]}}`, resultLatex: `r = ${tex(R1)}` },
    { formulaLatex: String.raw`r = \frac{\sum (x-\bar{x})(y-\bar{y})}{\sqrt{\sum (x-\bar{x})^2}\,\sqrt{\sum (y-\bar{y})^2}}`, substitutionLatex: `\\begin{gathered} \\bar{x} = ${tex(avgx)}, \\quad \\bar{y} = ${tex(avgy)} \\\\[0.8em] r = \\frac{${t(dxdy)}}{\\sqrt{${tex(dx2)}} \\times \\sqrt{${tex(dy2)}}} \\end{gathered}`, resultLatex: `r = ${tex(R2)}` },
    { formulaLatex: "R^2 = r^2", substitutionLatex: `R^2 = ${t(R1)}^2`, resultLatex: `R^2 = ${tex(R1 * R1)}` },
  ];
  return [
    { id: "slope", label: "Slope (b)", formula: "b = [nΣxy − (Σx)(Σy)] / [nΣx² − (Σx)²]", substitution: `b = [${numerator}] / [${xDenominator}]`, result: f(B) },
    { id: "intercept", label: "Intercept (a)", formula: "a = ȳ − b × x̄", substitution: `a = ${v(avgy)} − ${v(B)} × ${v(avgx)}`, result: f(A) },
    { id: "equation", label: "Persamaan garis", formula: "y = bx + a", substitution: `y = ${v(B)} × x + ${v(A)}`, result: `y = ${f(B)}x ${A < 0 ? "−" : "+"} ${f(Math.abs(A))}` },
    { id: "r1", label: "r (Rumus 1)", formula: "r = [nΣxy − (Σx)(Σy)] / √([nΣx² − (Σx)²] × [nΣy² − (Σy)²])", substitution: `r = [${numerator}] / √([${xDenominator}] × [${yDenominator}])`, result: f(R1) },
    { id: "r2", label: "r (Rumus 2)", formula: "r = Σ[(x − x̄)(y − ȳ)] / (√[Σ(x − x̄)²] × √[Σ(y − ȳ)²])", substitution: `x̄ = ${f(avgx)}; ȳ = ${f(avgy)}; r = ${v(dxdy)} / (√(${f(dx2)}) × √(${f(dy2)}))`, result: f(R2) },
    { id: "rsquared", label: "R²", formula: "R² = r² (menggunakan r Rumus 1)", substitution: `R² = ${v(R1)}²`, result: f(R1 * R1) },
  ].map((step, index) => ({ ...step, ...latex[index] }));
}

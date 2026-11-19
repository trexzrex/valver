import { renderToString } from "katex";

export function MathFormula({ latex, label }: { latex: string; label: string }) {
  // Expressions are authored in calibrationSteps; interpolated inputs are finite numbers only.
  const html = renderToString(latex, {
    displayMode: true,
    output: "htmlAndMathml",
    trust: false,
    throwOnError: false,
  });
  return (
    <div role="region" aria-label={label} tabIndex={0}
      className="max-w-full overflow-x-auto rounded-xl border px-4 py-5 text-base focus-visible:outline-2 focus-visible:outline-offset-2 [&_.katex-display]:!m-0 [&_.katex-display]:!text-left"
      style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}>
      <div className="w-max min-w-full" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

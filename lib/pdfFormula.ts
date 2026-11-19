import { renderToString } from "katex";

export interface FormulaImage {
  data: string;
  width: number;
  height: number;
}

// Render in an isolated white document: application themes (including modern
// color functions unsupported by html2canvas) must not leak into the report.
export async function renderPdfFormula(latex: string): Promise<FormulaImage> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = "position:fixed;left:-10000px;top:0;width:1200px;height:600px;border:0;pointer-events:none";
  document.body.appendChild(iframe);
  try {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("Dokumen render rumus tidak tersedia");
    const rules: string[] = [];
    const collect = (list: CSSRuleList) => {
      for (const rule of Array.from(list)) {
        if (rule instanceof CSSFontFaceRule && rule.cssText.includes("KaTeX")) rules.push(rule.cssText);
        else if (rule instanceof CSSStyleRule && rule.selectorText.includes("katex")) rules.push(rule.cssText);
        else if ("cssRules" in rule) collect((rule as CSSGroupingRule).cssRules);
      }
    };
    for (const sheet of Array.from(document.styleSheets)) {
      try { collect(sheet.cssRules); } catch { /* Ignore inaccessible third-party stylesheets. */ }
    }
    const style = doc.createElement("style");
    style.textContent = rules.join("\n") + "\nhtml,body{margin:0;background:#fff;color:#111} .katex-display{margin:0;text-align:left} #formula{display:inline-block;padding:16px;font-size:20px;background:#fff;color:#111;white-space:nowrap}";
    doc.head.appendChild(style);
    const node = doc.createElement("div");
    node.id = "formula";
    node.innerHTML = renderToString(latex, { displayMode: true, output: "html", trust: false, throwOnError: true });
    doc.body.appendChild(node);
    // Force layout before waiting so the iframe's KaTeX font requests start.
    node.getBoundingClientRect();
    await doc.fonts.ready;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(node, { scale: 3, backgroundColor: "#ffffff", logging: false, foreignObjectRendering: true });
    return { data: canvas.toDataURL("image/png"), width: canvas.width / 3, height: canvas.height / 3 };
  } finally {
    iframe.remove();
  }
}

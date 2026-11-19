const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

// Load project TypeScript without adding a separate test framework.
function loadProjectFile(relativePath) {
  const filename = path.resolve(__dirname, "..", relativePath);
  const source = readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  const localRequire = (id) => {
    if (id.startsWith("@/")) return loadProjectFile(`${id.slice(2)}.ts`);
    if (id.startsWith(".")) {
      return loadProjectFile(path.relative(path.resolve(__dirname, ".."), path.resolve(path.dirname(filename), `${id}.ts`)));
    }
    return require(id);
  };
  new Function("require", "exports", compiled)(localRequire, exports);
  return exports;
}

test("spike nominal displays an automatic value, not an editable input", () => {
  const { SpikeNominalDisplay } = loadProjectFile("components/calculator/SpikeNominalDisplay.tsx");
  const html = renderToStaticMarkup(React.createElement(SpikeNominalDisplay, { value: "1.5782" }));
  assert.match(html, /1[,.]5782/);
  assert.match(html, /median konsentrasi kalibrasi positif/);
  assert.doesNotMatch(html, /<input/);
});

test("spike nominal explains that calibration is required when empty", () => {
  const { SpikeNominalDisplay } = loadProjectFile("components/calculator/SpikeNominalDisplay.tsx");
  const html = renderToStaticMarkup(React.createElement(SpikeNominalDisplay, { value: "" }));
  assert.match(html, /Menunggu data kalibrasi/);
  assert.doesNotMatch(html, /NaN|<input/);
});

test("calculation hook no longer exposes an unused manual spike setter", () => {
  const { useValverCalculations } = loadProjectFile("hooks/useValverCalculations.ts");
  let result;
  function Probe() {
    result = useValverCalculations();
    return null;
  }
  renderToStaticMarkup(React.createElement(Probe));
  assert.equal(result.spikeNominal, "");
  assert.equal("setSpikeNominal" in result, false);
  assert.equal(result.stdRendah, "0.2");
  assert.equal(result.stdTinggi, "10");
});

test("project recovery formula remains unchanged for the Excel spike dataset", () => {
  const { computeReplicateSet, computeMDL } = loadProjectFile("lib/calculations.ts");
  const rows = [1.5313, 1.5328, 1.532, 1.533, 1.5344, 1.5345, 1.5339, 1.5318, 1.5337, 1.5325]
    .map((ppm) => ({ abs: "", ppm: String(ppm) }));
  const result = computeMDL(computeReplicateSet([]), computeReplicateSet(rows), 1.5782);
  assert.ok(Math.abs(result.recovery - 97.13534406285642) < 1e-10);
});

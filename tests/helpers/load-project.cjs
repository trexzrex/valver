const { readFileSync } = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function loadProjectFile(relativePath, overrides = {}) {
  const filename = path.resolve(__dirname, "../..", relativePath);
  const source = readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  const localRequire = (id) => {
    if (Object.hasOwn(overrides, id)) return overrides[id];
    if (id.startsWith("@/")) return loadProjectFile(`${id.slice(2)}.ts`, overrides);
    if (id.startsWith(".")) return loadProjectFile(path.relative(path.resolve(__dirname, "../.."), path.resolve(path.dirname(filename), `${id}.ts`)), overrides);
    return require(id);
  };
  new Function("require", "exports", compiled)(localRequire, exports);
  return exports;
}
module.exports = { loadProjectFile };

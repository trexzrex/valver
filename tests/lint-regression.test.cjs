const test = require("node:test");
const assert = require("node:assert/strict");
const { ESLint } = require("eslint");

const eslint = new ESLint();

test("CommonJS test helpers may require modules", async () => {
  const results = await eslint.lintText('const assert = require("node:assert/strict"); assert.ok(true);', { filePath: "tests/example.test.cjs" });
  assert.equal(results.flatMap(result => result.messages).filter(message => message.ruleId === "@typescript-eslint/no-require-imports").length, 0);
});

test("application code still rejects CommonJS imports", async () => {
  const results = await eslint.lintText('const fs = require("node:fs"); export { fs };', { filePath: "lib/example.ts" });
  assert.equal(results.flatMap(result => result.messages).filter(message => message.ruleId === "@typescript-eslint/no-require-imports").length, 1);
});

test("draft initialization obeys React effect state rules", async () => {
  const results = await eslint.lintFiles(["hooks/useCalculationDraft.ts"]);
  assert.deepEqual(results.flatMap(result => result.messages).filter(message => message.severity === 2), []);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const {loadProjectFile} = require('./helpers/load-project.cjs');
const {computeCalibration} = loadProjectFile('lib/calculations.ts');
const {buildCalibrationSteps} = loadProjectFile('lib/calibrationSteps.ts');

test('formula and numeric substitution use structured fractions, radicals and powers', () => {
 const steps = buildCalibrationSteps(computeCalibration([{x:'0',y:'1'},{x:'1',y:'3'},{x:'2',y:'5'}]));
 for (const index of [0,3,4]) {
  assert.match(steps[index].formulaLatex, /\\frac\{/);
  assert.match(steps[index].substitutionLatex, /\\frac\{/);
 }
 assert.match(steps[3].formulaLatex, /\\sqrt\{/);
 assert.match(steps[3].substitutionLatex, /3 \\times 13/);
 assert.match(steps[1].formulaLatex, /\\bar\{y\}/);
 assert.match(steps[5].substitutionLatex, /\^2/);
});

test('all generated expressions render fractions and MathML without parser errors', () => {
 const katex = require('katex');
 const datasets = [ [{x:'0',y:'1'},{x:'1',y:'3'}], [{x:'0',y:'-0.000000001'},{x:'1',y:'-0.000000002'}] ];
 for (const data of datasets) for (const step of buildCalibrationSteps(computeCalibration(data))) {
  for (const expression of [step.formulaLatex, step.substitutionLatex, step.resultLatex]) {
   const html = katex.renderToString(expression, {displayMode:true, throwOnError:true, trust:false});
   assert.match(html, /<math/);
   assert.doesNotMatch(html, /katex-error/);
  }
 }
});

test('scientific notation and negative values remain valid math rather than ambiguous text', () => {
 const steps = buildCalibrationSteps(computeCalibration([{x:'0',y:'-0.000000001'},{x:'1',y:'-0.000000002'}]));
 assert.match(steps[1].substitutionLatex, /\\times 10\^\{-9\}/);
 assert.match(steps[1].substitutionLatex, /\\left\(/);
});

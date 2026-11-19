const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const {loadProjectFile} = require('./helpers/load-project.cjs');
const calculations = loadProjectFile('lib/calculations.ts');
const math = loadProjectFile('components/calculator/MathFormula.tsx');
const overrides = {
 '@/components/calculator/MathFormula': math,
 './EditableTable': {EditableTable: () => React.createElement('table', {'data-test-table':true})},
 '@phosphor-icons/react': {CaretDown: () => null},
 'motion/react': {motion:{div: ({initial, animate, transition, ...props}) => React.createElement('div', props)}},
};
const {KorelasiSection} = loadProjectFile('components/calculator/KorelasiSection.tsx', overrides);
function render(data) {
 const calibration = calculations.computeCalibration(data);
 return renderToStaticMarkup(React.createElement(KorelasiSection, {
 calibration,
 korelasiCara1: calibration && calculations.computeKorelasiCara1(calibration),
 korelasiCara2: calibration && calculations.computeKorelasiCara2(calibration),
 }));
}
test('both correlation tables are followed by their own typeset formula, substitution and result', () => {
 const html = render([{x:'0',y:'1'},{x:'1',y:'3'},{x:'2',y:'5'}]);
 for (const method of [1,2]) {
  assert.ok(html.includes(`Rumus umum r (Rumus ${method})`));
  assert.ok(html.includes(`Substitusi angka r (Rumus ${method})`));
  assert.ok(html.includes(`Hasil akhir r (Rumus ${method})`));
 }
 assert.equal((html.match(/data-test-table/g)||[]).length,2);
 assert.ok(html.indexOf('data-test-table') < html.indexOf('Rumus umum r (Rumus 1)'));
 assert.ok(html.lastIndexOf('data-test-table') < html.indexOf('Rumus umum r (Rumus 2)'));
 assert.match(html, /mfrac/); assert.match(html, /sqrt/);
 assert.doesNotMatch(html, /katex-error|NaN|Infinity/);
});
test('substitution follows changed inputs and invalid calibration never renders formulas', () => {
 const first = render([{x:'0',y:'1'},{x:'1',y:'3'}]);
 const changed = render([{x:'0',y:'1'},{x:'1',y:'5'}]);
 assert.notEqual(first,changed);
 const empty = render([]);
 assert.doesNotMatch(empty,/katex|NaN|Infinity/);
});

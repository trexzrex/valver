const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const {loadProjectFile} = require('./helpers/load-project.cjs');
const calc = loadProjectFile('lib/calculations.ts');
const {LinearTable} = loadProjectFile('components/calculator/LinearTable.tsx', {
 './EditableTable': {EditableTable:()=>React.createElement('table')},
 '@/components/calculator/MathFormula':loadProjectFile('components/calculator/MathFormula.tsx'),
 'motion/react':{motion:{div:({initial,animate,transition,...props})=>React.createElement('div',props)}},
});
function render(data){const calibration=calc.computeCalibration(data);return renderToStaticMarkup(React.createElement(LinearTable,{calibration,linearTable:calibration&&calc.computeLinearTable(calibration)}));}
test('linear table explains prediction with coefficients and substitution for every complete pair',()=>{
 const html=render([{x:'0',y:'-1'},{x:'1',y:'2'},{x:'',y:'9'},{x:'2',y:'5'}]);
 assert.match(html,/Perhitungan absorbansi prediksi/);
 assert.match(html,/<details/);
 for(const row of [1,2,3]) assert.ok(html.includes(`Substitusi absorbansi baris ${row}`));
 assert.ok(!html.includes('Substitusi absorbansi baris 4'));
 assert.match(html,/Koefisien regresi/);
 assert.match(html,/b = 3/);assert.match(html,/a = -1/);
 assert.match(html,/hasil pengukuran baru/);
 assert.doesNotMatch(html,/katex-error|NaN|Infinity/);
});
test('invalid calibration renders no prediction steps',()=>{assert.doesNotMatch(render([]),/Perhitungan absorbansi prediksi|katex/);});

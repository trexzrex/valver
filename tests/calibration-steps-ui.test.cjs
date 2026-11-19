const test = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { loadProjectFile } = require('./helpers/load-project.cjs');
const { computeCalibration } = loadProjectFile('lib/calculations.ts');
const { CalibrationSteps } = loadProjectFile('components/calculator/CalibrationSteps.tsx', {
  '@/components/calculator/MathFormula': loadProjectFile('components/calculator/MathFormula.tsx'),
});

test('renders six accessible disclosure buttons with results always visible', () => {
  const calibration = computeCalibration([{ x: '0', y: '1' }, { x: '1', y: '3' }]);
  const html = renderToStaticMarkup(React.createElement(CalibrationSteps, { calibration }));
  assert.match(html, /Langkah Perhitungan Kalibrasi/);
  assert.match(html, /Buka semua langkah/);
  assert.equal((html.match(/aria-expanded="false"/g) || []).length, 7);
  assert.match(html, /Slope \(b\)/);
  assert.match(html, /Intercept \(a\)/);
  assert.match(html, /y = 2x \+ 1/);
  assert.match(html, /Rumus umum/);
  assert.match(html, /Substitusi angka/);
  assert.doesNotMatch(html, /NaN|Infinity/);
});

test('empty calibration explains why steps are unavailable', () => {
  const html = renderToStaticMarkup(React.createElement(CalibrationSteps, { calibration: null }));
  assert.match(html, /belum dapat ditampilkan/);
  assert.doesNotMatch(html, /NaN|Infinity|aria-expanded/);
});

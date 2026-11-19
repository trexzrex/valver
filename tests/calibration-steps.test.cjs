const test = require('node:test');
const assert = require('node:assert/strict');
const { loadProjectFile } = require('./helpers/load-project.cjs');
const { computeCalibration } = loadProjectFile('lib/calculations.ts');
const { buildCalibrationSteps } = loadProjectFile('lib/calibrationSteps.ts');
const data = [{ x: '0', y: '1' }, { x: '1', y: '3' }, { x: '2', y: '5' }];

test('steps show lowercase a/b, actual substitutions and all six results', () => {
  const steps = buildCalibrationSteps(computeCalibration(data));
  assert.equal(steps.length, 6);
  assert.equal(steps[0].label, 'Slope (b)');
  assert.equal(steps[1].label, 'Intercept (a)');
  assert.equal(steps[0].result, '2');
  assert.equal(steps[1].result, '1');
  assert.equal(steps[2].result, 'y = 2x + 1');
  assert.match(steps[0].substitution, /3 × 13/);
  assert.match(steps[3].substitution, /3 × 35/);
  assert.match(steps[4].substitution, /4.*√\(2\).*√\(8\)/);
  assert.equal(steps[5].result, '1');
});

test('uses only complete pairs and updates with input, including negative intercept', () => {
  const changed = computeCalibration([{ x: '0', y: '-1' }, { x: '1', y: '2' }, { x: '', y: '99' }]);
  const steps = buildCalibrationSteps(changed);
  assert.match(steps[0].substitution, /2 × 2/);
  assert.equal(steps[2].result, 'y = 3x − 1');
});

test('missing or degenerate calibration produces no misleading numeric steps', () => {
  for (const data of [[], [{ x: '1', y: '2' }], [{ x: '1', y: '2' }, { x: '1', y: '3' }], [{ x: '1', y: '2' }, { x: '2', y: '2' }]]) {
    assert.deepEqual(buildCalibrationSteps(computeCalibration(data)), []);
  }
});

test('presentation rounds only displayed numbers and retains small nonzero values', () => {
  const calibration = computeCalibration([{ x: '0', y: '0' }, { x: '1', y: '0.000000001' }]);
  const before = JSON.stringify(calibration);
  const steps = buildCalibrationSteps(calibration);
  assert.notEqual(steps[0].result, '0');
  assert.equal(JSON.stringify(calibration), before);
});

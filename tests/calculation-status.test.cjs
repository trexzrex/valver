const assert = require('node:assert/strict');
const test = require('node:test');
const { loadProjectFile } = require('./helpers/load-project.cjs');
const c = loadProjectFile('lib/calculations.ts');
const set = (...values) => c.computeReplicateSet(values.map(ppm => ({ abs: '', ppm: String(ppm) })));

test('identical replicates retain zero SD and MDL', () => {
  const result = set(1, 1, 1);
  assert.equal(c.computePrecision(result, result, 1, 1).sdLow, 0);
  assert.equal(c.computeMDL(result, result, 1).mdlSpike, 0);
  assert.equal(c.computeMDL(result, result, 1).mdlBlanko, 0);
});
test('empty criteria are incomplete, not failed, and contain no NaN', () => {
  const empty = set();
  const items = c.computeAcceptanceCriteriaItems(empty, empty, empty, empty, NaN, .2, 10);
  assert.ok(items.every(item => item.status === 'incomplete'));
  assert.ok(items.every(item => !item.hasil.includes('NaN')));
});
test('zero denominator gives invalid PG and S/N, not infinity or a pass', () => {
  const same = set(1, 1);
  const acceptance = c.computeAcceptanceCriteria(same, same, same, same, 1, 1, 1);
  assert.equal(acceptance.workingRange.status, 'invalid');
  const items = c.computeAcceptanceCriteriaItems(same, same, same, same, 1, 1, 1);
  assert.equal(items[3].status, 'invalid');
  assert.equal(items[1].status, 'pass');
});
test('accuracy distinguishes missing data and zero nominal', () => {
  assert.equal(c.computeAccuracy(NaN, 1).status, 'incomplete');
  assert.equal(c.computeAccuracy(1, 0).status, 'invalid');
  assert.equal(c.computeAccuracy(1, 1).status, 'pass');
});
test('degenerate calibration is rejected and partial numbers are not parsed', () => {
  assert.equal(c.computeCalibration([{x:'1',y:'1'},{x:'1',y:'2'}]), null);
  assert.equal(set('1garbage', 'Infinity').n, 0);
});

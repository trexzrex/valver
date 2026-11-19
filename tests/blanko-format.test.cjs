const test = require('node:test');
const assert = require('node:assert/strict');
const { loadProjectFile } = require('./helpers/load-project.cjs');

test('blanko deviation summaries use eight decimals and suppress rounded negative zero', () => {
  const { formatBlankoDeviation } = loadProjectFile('lib/utils/numberFormat.ts');
  assert.equal(formatBlankoDeviation(1.734723e-18), '0,00000000');
  assert.equal(formatBlankoDeviation(-1.734723e-18), '0,00000000');
  assert.equal(formatBlankoDeviation(0.0000000123), '0,00000001');
  assert.equal(formatBlankoDeviation(-0.123456789), '-0,12345679');
  assert.equal(formatBlankoDeviation(NaN), '-');
});

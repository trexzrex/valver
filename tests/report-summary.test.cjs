const test = require('node:test');
const assert = require('node:assert/strict');
const { loadProjectFile } = require('./helpers/load-project.cjs');

test('report summaries ignore empty values but include explicit zero', () => {
  const { summarizeNumbers } = loadProjectFile('lib/reportSummary.ts');
  assert.deepEqual(summarizeNumbers(['0.120', '0.122', '']), { count: 2, sum: 0.242, average: 0.121 });
  assert.deepEqual(summarizeNumbers(['', '0', '2', 'invalid']), { count: 2, sum: 2, average: 1 });
  const empty = summarizeNumbers(['', null, NaN, undefined]);
  assert.equal(empty.count, 0);
  assert.equal(Number.isNaN(empty.average), true);
  assert.equal(Number.isNaN(empty.sum), true);
});

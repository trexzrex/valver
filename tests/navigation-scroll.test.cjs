const test = require('node:test');
const assert = require('node:assert/strict');
const { loadProjectFile } = require('./helpers/load-project.cjs');
const { nextNavigationHidden } = loadProjectFile('lib/navigationScroll.ts');
test('navigation follows scroll direction without flicker and respects interaction locks', () => {
  assert.deepEqual(nextNavigationHidden(false, 40, 45, false), {hidden:false, anchor:40});
  assert.deepEqual(nextNavigationHidden(false, 40, 60, false), {hidden:true, anchor:60});
  assert.deepEqual(nextNavigationHidden(true, 100, 80, false), {hidden:false, anchor:80});
  assert.equal(nextNavigationHidden(true, 100, 120, true).hidden, false);
  assert.equal(nextNavigationHidden(true, 40, 0, false).hidden, false);
});

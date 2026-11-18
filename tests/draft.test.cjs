const test = require('node:test');
const assert = require('node:assert/strict');
const { loadProjectFile } = require('./helpers/load-project.cjs');
const draft = () => loadProjectFile('lib/draft.ts');
test('draft round trips inputs but excludes identity and results', () => {
  const { createDraft, parseDraft, defaultInputs } = draft();
  const inputs = defaultInputs(); inputs.kalibrasi[0].x = '1,2'; inputs.spike.push({abs:'2',ppm:'3'});
  const saved = createDraft({...inputs, idFields:{nama:'Private'}, calibration:{B:2}}, 1000);
  assert.deepEqual(parseDraft(JSON.stringify(saved), 1001).data, inputs);
  assert.equal(JSON.stringify(saved).includes('Private'), false);
  assert.equal('calibration' in saved.data, false);
});
test('expired, future, corrupt, wrong version and malformed drafts are rejected', () => {
  const { createDraft, parseDraft, defaultInputs, DRAFT_TTL } = draft();
  const saved = createDraft(defaultInputs(), 1000);
  assert.equal(parseDraft(JSON.stringify(saved), 1000 + DRAFT_TTL).reason, 'expired');
  assert.equal(parseDraft(JSON.stringify(saved), 999).reason, 'invalid');
  assert.equal(parseDraft('{', 1001).reason, 'invalid');
  assert.equal(parseDraft(JSON.stringify({...saved,version:2}), 1001).reason, 'invalid');
  assert.equal(parseDraft(JSON.stringify({...saved,data:{...saved.data,spike:[{abs:42,ppm:''}]}}),1001).reason,'invalid');
});
test('draft validation bounds input lengths and row counts', () => {
  const { createDraft, parseDraft, defaultInputs } = draft();
  const saved = createDraft(defaultInputs(), 1000);
  saved.data.blanko = Array.from({length:1001},()=>({abs:'',ppm:''}));
  assert.equal(parseDraft(JSON.stringify(saved),1001).reason,'invalid');
});

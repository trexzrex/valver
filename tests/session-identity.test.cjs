const test = require('node:test');
const assert = require('node:assert/strict');
const { NextRequest } = require('next/server');
const { loadProjectFile } = require('./helpers/load-project.cjs');
const session = loadProjectFile('lib/server/session.ts', { 'server-only': {} });
test('report identity is selected only by verified session and never cached', async () => {
  const previous = process.env.VALVER_SESSION_SECRET;
  process.env.VALVER_SESSION_SECRET = 'a'.repeat(32);
  let selectedId;
  let calls = 0;
  const identity = { nama: 'Penguji', nis: '123456', kelas: 'XII A' };
  const { GET } = loadProjectFile('app/api/session/route.ts', {
    '@/lib/server/session': session,
    '@/lib/server/supabase': { createServerDatabase: () => ({ from: () => ({ select: () => ({ eq: (_key, id) => {
      calls++; selectedId = id;
      return { single: async () => ({ data: identity, error: null }) };
    } }) }) }) },
  });
  try {
    const request = cookie => new NextRequest('http://localhost:3000/api/session', { headers: { cookie: `valver_session=${cookie}` } });
    assert.equal((await GET(request('forged'))).status, 401);
    assert.equal(calls, 0);
    const id = '11111111-1111-4111-8111-111111111111';
    const response = await GET(request(session.createSessionToken(id, 'a'.repeat(32))));
    assert.equal(response.status, 200);
    assert.equal(selectedId, id);
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.deepEqual(await response.json(), { identity });
  } finally {
    if (previous === undefined) delete process.env.VALVER_SESSION_SECRET;
    else process.env.VALVER_SESSION_SECRET = previous;
  }
});

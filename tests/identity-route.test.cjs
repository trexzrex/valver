const assert = require('node:assert/strict');
const test = require('node:test');
const { NextRequest } = require('next/server');
const { loadProjectFile } = require('./helpers/load-project.cjs');
const session = loadProjectFile('lib/server/session.ts', { 'server-only': {} });
let inserts = 0;
const { POST } = loadProjectFile('app/api/users/route.ts', {
  '@/lib/server/session': session,
  '@/lib/server/supabase': { createServerDatabase: () => ({ from: () => ({ insert: () => {
    inserts++;
    return { select: () => ({ single: async () => ({ data: { id: 'd09e5ba5-2222-4333-8444-555555555555' }, error: null }) }) };
  } }) }) },
});
const request = (body, origin = 'http://localhost:3000', headers = {}) => new NextRequest('http://localhost:3000/api/users', {
  method: 'POST', headers: { host: 'localhost:3000', origin, 'content-type': 'application/json', ...headers }, body,
});
test('route rejects cross-origin and invalid data before accessing database', async () => {
  inserts = 0;
  assert.equal((await POST(request('{}', 'https://other.example'))).status, 403);
  assert.equal((await POST(request('{}', 'http://localhost:3000', { host: 'valver.example' }))).status, 403);
  assert.equal((await POST(request('{}', 'null'))).status, 403);
  assert.equal((await POST(request('{'))).status, 400);
  assert.equal((await POST(request(JSON.stringify({ nama: {}, nis: '123456', kelas: 'XII' })))).status, 400);
  assert.equal((await POST(request('x'.repeat(5000)))).status, 413);
  assert.equal(inserts, 0);
});
test('same-origin accepts loopback, LAN, proxy and default-port hosts', async () => {
  inserts = 0;
  assert.equal((await POST(request('{}', 'http://127.0.0.1:3000', { host: '127.0.0.1:3000' }))).status, 400);
  assert.equal((await POST(request('{}', 'http://192.168.100.8:3000', { host: '192.168.100.8:3000' }))).status, 400);
  assert.equal((await POST(request('{}', 'https://valver.example', { host: 'internal:3000', 'x-forwarded-host': 'valver.example' }))).status, 400);
  assert.equal((await POST(request('{}', 'https://valver.example', { host: 'valver.example:443' }))).status, 400);
  assert.equal((await POST(request('{}', 'https://valver.example', { host: 'valver.example:8443' }))).status, 403);
  assert.equal(inserts, 0);
});
test('successful submission issues HttpOnly signed cookie and does not return identity', async () => {
  const previous = process.env.VALVER_SESSION_SECRET;
  process.env.VALVER_SESSION_SECRET = 'a'.repeat(32);
  try {
    const response = await POST(request(JSON.stringify({ nama: 'Athar', nis: '123456', kelas: 'XII' })));
    assert.equal(response.status, 200);
    assert.match(response.headers.get('set-cookie'), /HttpOnly/i);
    assert.match(response.headers.get('set-cookie'), /SameSite=lax/i);
    assert.equal(session.verifySessionToken(response.cookies.get(session.SESSION_COOKIE).value, 'a'.repeat(32)), true);
    assert.equal((await response.json()).data, undefined);
  } finally {
    if (previous === undefined) delete process.env.VALVER_SESSION_SECRET;
    else process.env.VALVER_SESSION_SECRET = previous;
  }
});
test('protected page rejects forged cookie but accepts a valid signed session', () => {
  const previous = process.env.VALVER_SESSION_SECRET;
  process.env.VALVER_SESSION_SECRET = 'a'.repeat(32);
  try {
    const { middleware } = loadProjectFile('middleware.ts', { '@/lib/server/session': session });
    const forged = new NextRequest('http://localhost:3000/calculate', { headers: { cookie: 'valver_session=anything' } });
    assert.equal(middleware(forged).status, 307);
    const token = session.createSessionToken('d09e5ba5-2222-4333-8444-555555555555', 'a'.repeat(32));
    const valid = new NextRequest('http://localhost:3000/calculate', { headers: { cookie: `valver_session=${token}` } });
    assert.equal(middleware(valid).headers.get('x-middleware-next'), '1');
  } finally {
    if (previous === undefined) delete process.env.VALVER_SESSION_SECRET;
    else process.env.VALVER_SESSION_SECRET = previous;
  }
});

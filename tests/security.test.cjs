const assert = require('node:assert/strict');
const test = require('node:test');
const { loadProjectFile } = require('./helpers/load-project.cjs');

test('identity validation rejects malformed types and enforces form rules', () => {
  const { validateIdentity } = loadProjectFile('lib/server/identity.ts');
  for (const value of [null, [], {}, {nama:1,nis:'123456',kelas:'XII'}, {nama:'Athar',nis:'123',kelas:'XII'}, {nama:'A'.repeat(101),nis:'123456',kelas:'XII'}]) {
    assert.equal(validateIdentity(value).success, false);
  }
  assert.deepEqual(validateIdentity({nama:' Athar ',nis:'123456',kelas:' XII IPA 1 '}), {success:true,data:{nama:'Athar',nis:'123456',kelas:'XII IPA 1'}});
});
test('signed sessions reject unsigned, tampered, expired and future tokens', () => {
  const { createSessionToken, verifySessionToken } = loadProjectFile('lib/server/session.ts', {'server-only':{}});
  const secret = 'a'.repeat(32);
  const id = 'd09e5ba5-2222-4333-8444-555555555555';
  const token = createSessionToken(id, secret, 1000);
  assert.equal(verifySessionToken(token, secret, 1001), true);
  assert.equal(verifySessionToken(id, secret, 1001), false);
  assert.equal(verifySessionToken(token + 'x', secret, 1001), false);
  assert.equal(verifySessionToken(token, 'b'.repeat(32), 1001), false);
  assert.equal(verifySessionToken(token, secret, 1000 + 86400), false);
  assert.equal(verifySessionToken(token, secret, 999), false);
  assert.equal(verifySessionToken(token, '', 1001), false);
  assert.throws(() => createSessionToken(id, '', 1000));
});
test('same-origin check compares Origin with the Host the request arrived on', () => {
  const { isSameOrigin, normalizeHost } = loadProjectFile('lib/server/origin.ts');
  const make = (headers) => ({ headers: { get: (name) => headers[name] ?? null } });
  assert.equal(normalizeHost(' Example.COM:443 '), 'example.com');
  assert.equal(normalizeHost('example.com:8443'), 'example.com:8443');
  assert.equal(isSameOrigin(make({ origin: 'http://localhost:3000', host: 'localhost:3000' })), true);
  assert.equal(isSameOrigin(make({ origin: 'http://127.0.0.1:3000', host: '127.0.0.1:3000' })), true);
  assert.equal(isSameOrigin(make({ origin: 'http://192.168.1.5:3000', host: '192.168.1.5:3000' })), true);
  assert.equal(isSameOrigin(make({ origin: 'https://valver.example', host: 'valver.example:443' })), true);
  assert.equal(isSameOrigin(make({ origin: 'https://valver.example', host: 'internal:3000', 'x-forwarded-host': 'valver.example, proxy.internal' })), true);
  assert.equal(isSameOrigin(make({ origin: 'https://other.example', host: 'valver.example' })), false);
  assert.equal(isSameOrigin(make({ origin: 'https://valver.example:8443', host: 'valver.example' })), false);
  assert.equal(isSameOrigin(make({ host: 'valver.example' })), false);
  assert.equal(isSameOrigin(make({ origin: 'null', host: 'valver.example' })), false);
  assert.equal(isSameOrigin(make({ origin: 'https://user:pass@valver.example', host: 'valver.example' })), false);
  assert.equal(isSameOrigin(make({ origin: 'ftp://valver.example', host: 'valver.example' })), false);
});

const assert = require('node:assert/strict');
const { generateKeyPairSync, sign, createHmac } = require('node:crypto');
const { createRequire } = require('node:module');
const { after, test } = require('node:test');
const express = require('express');
const nock = require('nock');

Object.assign(process.env, {
  M2M_PROVIDER: 'keycloak', KEYCLOAK_ISSUER: 'https://community-keycloak.test/realms/m2m',
  KEYCLOAK_TOKEN_URL: 'https://community-keycloak.test/m2m/token', KEYCLOAK_AUDIENCE: 'community-api',
  KEYCLOAK_CLIENT_ID: 'community-app', KEYCLOAK_CLIENT_SECRET: 'synthetic-test-secret', KEYCLOAK_SCOPE: 'read:groups',
  VALID_ISSUERS: '["https://member.test/"]', AUTH_USER_AUDIENCES: '["member-api"]', AUTH_SECRET: 'synthetic-member-secret',
});
const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });
const { authenticateMember, getMachineToken } = require('../src/server/services/keycloak');
const core = require('tc-core-library-js');
const originalFetch = globalThis.fetch;
const jwks = nock('https://community-keycloak.test').persist().get('/realms/m2m/protocol/openid-connect/certs')
  .reply(200, { keys: [{ ...keys.publicKey.export({ format: 'jwk' }), kid: 'community-test', alg: 'RS256', use: 'sig' }] });

/** Sign synthetic member/service claims; never uses real credentials or external transport. */
function token(machine, overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: machine ? 'RS256' : 'HS256', kid: 'community-test' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: machine ? process.env.KEYCLOAK_ISSUER : 'https://member.test/', aud: machine ? 'community-api' : 'member-api',
    iat: now, exp: now + 300, sub: machine ? 'service-community' : 'member-77',
    ...(machine ? { azp: 'community-app', gty: 'client-credentials', scope: 'read:groups' } : { userId: 77, handle: 'member', roles: ['Administrator'], scope: 'read:groups' }),
    ...overrides,
  })).toString('base64url');
  const body = `${header}.${payload}`;
  const signature = machine ? sign('RSA-SHA256', Buffer.from(body), keys.privateKey) : createHmac('sha256', process.env.AUTH_SECRET).update(body).digest();
  return `${body}.${signature.toString('base64url')}`;
}

after(() => { globalThis.fetch = originalFetch; nock.cleanAll(); });

test('real HTTP member boundary normalizes identity and rejects service/malformed tokens', async () => {
  const app = express();
  app.get('/protected', authenticateMember, (req, res) => res.json(req.authUser));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const url = `http://127.0.0.1:${server.address().port}/protected`;
    for (const [authorization, expected] of [[undefined, 401], ['Bearer broken', 401], [`Bearer ${token(true)}`, 403], [`Bearer ${token(true, { aud: 'other-api' })}`, 401]]) {
      const response = await originalFetch(url, { headers: authorization ? { authorization } : {} });
      assert.equal(response.status, expected);
    }
    const response = await originalFetch(url, { headers: { authorization: `Bearer ${token(false)}` } });
    assert.equal(response.status, 200);
    const principal = await response.json();
    assert.equal(principal.userId, 77);
    assert.equal(principal.kind, 'user');
    assert.deepEqual(principal.scopes, []);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

test('server provider verifies and caches Keycloak tokens with no Auth0 proxy payload', async () => {
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls += 1;
    assert.equal(url, process.env.KEYCLOAK_TOKEN_URL);
    assert.deepEqual(JSON.parse(options.body), { grant_type: 'client_credentials', client_id: 'community-app', client_secret: 'synthetic-test-secret', audience: 'community-api', scope: 'read:groups' });
    return new Response(JSON.stringify({ access_token: token(true), expires_in: 300 }), { status: 200 });
  };
  try {
    const issued = await getMachineToken();
    assert.equal(await getMachineToken(), issued);
    assert.equal(calls, 1);
    assert.equal((await core.auth.createValidator().verify(issued)).kind, 'service');
    assert.equal(jwks.isDone(), true);
  } finally { globalThis.fetch = originalFetch; }
});

test('browser facade cannot issue tokens and nested React core resolves immutable prerelease', async () => {
  const facade = require('../src/client/shims/core-auth');
  await assert.rejects(facade.auth.m2m().getMachineToken(), /server-only/);
  const nested = createRequire(require.resolve('topcoder-react-lib/package.json'));
  assert.equal(nested('tc-core-library-js/package.json').version, '4.0.0-keycloak.0');
});

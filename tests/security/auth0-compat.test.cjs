const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(authorize, userInfo) {
  let constructorOptions;
  const module = { exports: {} };
  class WebAuth {
    constructor(options) {
      constructorOptions = options;
      this.popup = { authorize };
      this.client = { userInfo };
    }
  }
  vm.runInNewContext(fs.readFileSync(require.resolve('../../tools/auth0-compat/index.cjs'), 'utf8'), {
    module, window: { location: { origin: 'https://www.topcoder.com' } }, require: name => { assert.equal(name, 'auth0-engine'); return { WebAuth }; },
  });
  const client = new module.exports({ domain: 'example.auth0.com', clientID: 'fixture' });
  return { client, constructorOptions };
}

test('adapts the verified modern SDK result to the legacy social callback', () => {
  const { client, constructorOptions } = setup((options, callback) => {
    assert.equal(options.connection, 'github');
    // Caller-supplied state must not replace the SDK-generated CSRF transaction.
    assert.equal(options.state, undefined);
    assert.equal(options.nonce, undefined);
    callback(null, { accessToken: 'fixture-access', idToken: 'fixture-id' });
  }, (token, callback) => {
    assert.equal(token, 'fixture-access');
    callback(null, { sub: 'github|123', nickname: 'member' });
  });
  assert.equal(constructorOptions.domain, 'example.auth0.com');
  let invoked = false;
  client.signin({ connection: 'github', state: 'caller-controlled' }, (error, profile, id, access) => {
    invoked = true;
    assert.equal(error, null);
    assert.equal(profile.user_id, 'github|123');
    assert.equal(profile.identities[0].connection, 'github');
    assert.equal(profile.identities[0].user_id, '123');
    assert.equal(id, 'fixture-id');
    assert.equal(access, 'fixture-access');
  });
  assert.equal(invoked, true);
});

test('propagates SDK verification errors and never fetches a profile on failure', () => {
  const rejection = new Error('invalid_token');
  const { client } = setup((options, callback) => callback(rejection), () => assert.fail('Unexpected profile lookup'));
  client.signin({}, error => assert.equal(error, rejection));
});

test('rejects missing authentication results and profiles', () => {
  for (const result of [null, {}, { idToken: 'fixture' }]) {
    const { client } = setup((options, callback) => callback(null, result), () => assert.fail('Unexpected profile lookup'));
    client.signin({}, error => assert.equal(error.message, 'Missing authentication result'));
  }
  const { client } = setup((options, callback) => callback(null, { accessToken: 'fixture' }), (token, callback) => callback(null, {}));
  client.signin({}, error => assert.equal(error.message, 'Missing user profile'));
});

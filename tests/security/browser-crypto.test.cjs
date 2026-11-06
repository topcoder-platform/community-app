const assert = require('node:assert/strict');
const { test } = require('node:test');
const native = require('node:crypto');
const browser = require('../../config/webpack/browser-crypto.cjs');

test('browser SHA-256 HMAC matches the server for user payloads and binary keys', () => {
  for (const key of ['fixture-secret', Buffer.from([0, 128, 255, 32])]) {
    const expected = native.createHmac('sha256', key).update('12345-').update('1793941200').digest('hex');
    assert.equal(browser.createHmac('sha256', key).update('12345-').update('1793941200').digest('hex'), expected);
  }
});

test('browser hashing retains streaming updates and binary digests', () => {
  const input = Buffer.from('security fixture 🚀');
  assert.deepEqual(browser.createHash('sha256').update(input).digest(), native.createHash('sha256').update(input).digest());
});

test('browser random APIs preserve Buffer, typed-array, and callback contracts', async () => {
  const bytes = browser.randomBytes(32);
  assert.equal(Buffer.isBuffer(bytes), true);
  assert.equal(bytes.length, 32);
  const target = new Uint8Array(32).fill(9);
  assert.equal(browser.randomFillSync(target, 4, 20), target);
  assert.deepEqual([...target.slice(0, 4)], [9, 9, 9, 9]);
  assert.deepEqual([...target.slice(24)], new Array(8).fill(9));
  await new Promise((resolve, reject) => browser.randomFill(Buffer.alloc(16), (error, output) => {
    if (error) return reject(error);
    assert.equal(output.length, 16);
    return resolve();
  }));
  await new Promise((resolve, reject) => browser.randomBytes(16, (error, output) => {
    if (error) return reject(error);
    assert.equal(output.length, 16);
    return resolve();
  }));
});

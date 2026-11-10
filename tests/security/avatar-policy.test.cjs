const { test } = require('node:test');
const assert = require('node:assert/strict');
const { avatarRequest } = require('../../src/server/security/avatar-policy.cjs');
const base = 'https://www.topcoder.com';
const allowed = new Set([base, 'https://topcoder-media.s3.amazonaws.com']);

test('allows existing relative and S3 avatars with bounded sizes', () => {
  assert.deepEqual(avatarRequest('/i/m/user.jpg', 32, base, allowed), {
    origin: base, path: '/i/m/user.jpg', dimension: 32,
  });
  assert.equal(avatarRequest('https://topcoder-media.s3.amazonaws.com/member/a.png', undefined, base, allowed).dimension, 100);
});

test('blocks metadata, localhost, alternate origins, credentials and scheme tricks', () => {
  for (const url of [
    'http://169.254.169.254/latest/meta-data/', 'https://127.0.0.1/',
    '//evil.example/a.png', 'https://www.topcoder.com.evil.example/a.png',
    'https://www.topcoder.com@evil.example/a.png', 'https://user@www.topcoder.com/a.png',
    'https://www.topcoder.com:8443/a.png', 'file:///etc/passwd',
    'https://www.topcoder.com\\@evil.example/../../..',
  ]) {
    // A backslash is normalized by WHATWG URL; it can only remain on the approved origin.
    if (url.includes('\\')) assert.equal(avatarRequest(url, 32, base, allowed).origin, base);
    else assert.throws(() => avatarRequest(url, 32, base, allowed), undefined, url);
  }
});

test('rejects oversized input and invalid resize dimensions before any network request', () => {
  assert.throws(() => avatarRequest('a'.repeat(4097), 100, base, allowed));
  for (const size of [0, -1, 15, 1025, Infinity, NaN, 32.5, '', '1000000000', ['32', '64']]) {
    assert.throws(() => avatarRequest('/i/m/user.jpg', size, base, allowed));
  }
});

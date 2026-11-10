const { test } = require('node:test');
const assert = require('node:assert/strict');
const parseXml = require('../../src/shared/utils/xml-parser.cjs');

test('RSS conversion retains strings, arrays, attributes, CDATA and XML entities', () => {
  const result = parseXml('<?xml version="1.0"?><rss version="2.0"><channel><title>A &amp; B</title><item id="001"><title><![CDATA[<b>News</b>]]></title><count>001</count></item><item id="002"/><empty/></channel></rss>');
  assert.deepEqual(result, { rss: { version: '2.0', channel: {
    title: 'A & B', item: [{ id: '001', title: '<b>News</b>', count: '001' }, { id: '002' }], empty: {},
  } } });
  assert.deepEqual(parseXml('<xml></xml>'), { xml: {} });
  assert.deepEqual(parseXml('<xml attr=""/>'), { xml: { attr: '' } });
  assert.deepEqual(parseXml('<link href="https://example.test">News</link>'), { link: { href: 'https://example.test', $t: 'News' } });
});

test('XML rejects malformed, oversized, deeply nested and DTD input', () => {
  for (const input of [undefined, '<a>', '<!DOCTYPE a [<!ENTITY e SYSTEM "file:///etc/passwd">]><a>&e;</a>', `<a>${'x'.repeat(1024 * 1024)}</a>`, `${'<a>'.repeat(102)}${'</a>'.repeat(102)}`]) {
    assert.throws(() => parseXml(input));
  }
});

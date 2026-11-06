const assert = require('node:assert/strict');
const { test } = require('node:test');
const merge = require('./index.cjs');

const payload = () => JSON.parse('{"__proto__":{"isAdmin":true},"constructor":{"prototype":{"isAdmin":true}},"prototype":{"isAdmin":true},"safe":1}');
function assertSafe(value) {
  assert.equal(Object.getPrototypeOf(value), Object.prototype);
  assert.equal(value.isAdmin, undefined);
  for (const key of ['__proto__', 'constructor', 'prototype']) assert.equal(Object.hasOwn(value, key), false);
  assert.equal({}.isAdmin, undefined);
}

test('rejects prototype keys on both target and source, including null-prototype targets', () => {
  for (const target of [{}, Object.create(null), payload()]) {
    assertSafe(merge(target, payload()));
    assert.equal(merge(target, payload()).safe, 1);
  }
  assertSafe(merge(payload(), {}));
});

test('protects cloned nested objects and arrays with null or primitive target placeholders', () => {
  for (const target of [null, undefined, false, 1, 'value', {}]) {
    assertSafe(merge({ nested: target }, { nested: payload() }).nested);
  }
  assertSafe(merge({ values: [] }, { values: [payload()] }).values[0]);
  assertSafe(merge.all([{ nested: payload() }, { nested: { kept: true } }]).nested);
});

test('does not execute forbidden getters on either input', () => {
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    const input = {};
    Object.defineProperty(input, key, { enumerable: true, get() { throw new Error('forbidden getter'); } });
    assertSafe(merge(input, {}));
    assertSafe(merge({}, input));
  }
});

test('preserves recursive object merging, array concatenation, and input isolation', () => {
  const target = { a: { one: 1 }, values: [{ one: 1 }] };
  const source = { a: { two: 2 }, values: [{ two: 2 }] };
  const result = merge(target, source);
  assert.deepEqual(result, { a: { one: 1, two: 2 }, values: [{ one: 1 }, { two: 2 }] });
  result.a.one = 9;
  result.values[0].one = 9;
  assert.equal(target.a.one, 1);
  assert.equal(target.values[0].one, 1);
});

test('preserves custom array merging, custom key merging, clone=false and all()', () => {
  assert.deepEqual(merge({ a: [1] }, { a: [2] }, { arrayMerge: (_, source) => source }), { a: [2] });
  assert.deepEqual(merge({ a: { x: 1 } }, { a: { y: 2 } }, { customMerge: key => key === 'a' ? () => ({ custom: true }) : undefined }), { a: { custom: true } });
  const nested = { value: true };
  assert.equal(merge({}, { nested }, { clone: false }).nested, nested);
  assert.deepEqual(merge.all([{ one: 1 }, { two: 2 }]), { one: 1, two: 2 });
  assert.throws(() => merge.all({}), /array/);
});

test('preserves symbols, special objects and the custom mergeability hook', () => {
  const key = Symbol('metadata');
  const date = new Date();
  const regex = /fixture/;
  const react = { $$typeof: Symbol.for('react.element') };
  const result = merge({}, { [key]: { nested: true }, date, regex, react });
  assert.deepEqual(result[key], { nested: true });
  assert.equal(result.date, date);
  assert.equal(result.regex, regex);
  assert.equal(result.react, react);
  class Fixture { constructor() { this.value = 1; } }
  const fixture = new Fixture();
  assert.equal(merge({}, { fixture }, { isMergeableObject: value => value && Object.getPrototypeOf(value) === Object.prototype }).fixture, fixture);
});

test('does not copy properties inherited from an input prototype', () => {
  const source = Object.create({ inherited: true });
  source.safe = 1;
  assert.deepEqual(merge({}, source), { safe: 1 });
});


test('fails closed when an exotic target throws during a membership check', () => {
  const target = new Proxy({ safe: 1 }, { has() { throw new Error('unsafe target'); } });
  assert.throws(() => merge(target, { safe: { nested: true } }), /unsafe target/);
});

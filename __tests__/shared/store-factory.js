const MODULE = require.resolve('shared/store-factory');

afterAll(() => {
  process.env.NODE_ENV = 'test';
});

beforeEach(() => {
  jest.resetModules();
});

test('Does not throw', () => {
  expect(() => require(MODULE)).not.toThrow();
});

test('Does not throw in dev', () => {
  process.env.NODE_ENV = 'development';
  expect(() => require(MODULE)).not.toThrow();
  process.env.NODE_ENV = 'test';
});


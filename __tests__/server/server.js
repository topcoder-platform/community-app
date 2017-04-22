import _ from 'lodash';

const MODULE = require.resolve('server/server');

jest.setMock('webpack', _.noop);
jest.setMock('../../config/webpack/development', {
  output: {
    publicPath: '',
  },
});
jest.setMock('../../src/server/renderer', _.noop);

jest.setMock('webpack-dev-middleware', () =>
  (req, res, next) => next && next(),
);

jest.setMock('webpack-hot-middleware', () =>
  (req, res, next) => next && next(),
);

afterAll(() => {
  delete process.env.FRONT_END;
  process.env.NODE_ENV = 'test';
});

beforeEach(() => {
  jest.resetModules();
});

test('Throws when executed at front end', () => {
  process.env.FRONT_END = true;
  expect(() => require(MODULE)).toThrow();
  delete process.env.FRONT_END;
});

test('Does not throw when executed at the back end', () => {
  expect(() => require(MODULE)).not.toThrow();
});

test('Does not throw when executed at the back end in dev', () => {
  process.env.NODE_ENV = 'development';
  expect(() => require(MODULE)).not.toThrow();
  process.env.NODE_ENV = 'test';
});

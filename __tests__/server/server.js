import _ from 'lodash';

const MODULE = require.resolve('server/server');

jest.setMock('../../config/webpack/development', {
  output: {
    publicPath: '',
  },
});
jest.setMock(require.resolve('server/renderer'), _.noop);

afterAll(() => {
  delete process.env.DEV_TOOLS;
  delete process.env.FRONT_END;
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

test('Does not throw when executed with pipe name', () => {
  process.env.PORT = 80;
  expect(() => require(MODULE)).not.toThrow();
  delete process.env.PORT;
});

test('Does not throw when uses dev tools', () => {
  process.env.DEV_TOOLS = true;
  expect(() => require(MODULE)).not.toThrow();
  delete process.env.DEV_TOOLS;
});

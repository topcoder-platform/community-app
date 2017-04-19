/* eslint-env browser */

/* eslint-disable import/no-dynamic-require */
const MODULE = '../../src/client';

window.CONFIG = {
  ACCOUNTS_APP_CONNECT_URL: 'https://dummy.url',
  COOKIES: {
    MAXAGE: 7,
    SECURE: false,
  },
};

jest.setMock('browser-cookies', {
  erase: () => {},
  get: () => 'Dummy cookie',
  set: () => {},
});

jest.setMock('tc-accounts', {
  configureConnector: () => undefined,
  decodeToken: () => 'Decoded user object',
  getFreshToken: () => Promise.resolve('Dummy token'),
});

let FRONT_END;

beforeAll(() => {
  FRONT_END = process.env.FRONT_END;
  delete process.env.FRONT_END;
});

test('should not start without process.env.FRONT_END evaluating true', () => {
  expect(() => require(MODULE).default).toThrow();
});

test('should start whit process.env.FRONT_END evaluating true', () => {
  jest.resetModules();
  process.env.FRONT_END = true;
  expect(require(MODULE).default).toBeNull();
});

afterAll(() => {
  process.env.FRONT_END = FRONT_END;
});

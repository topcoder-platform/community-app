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

test('should not start without process.env.FRONT_END evaluating true', () => {
  expect(() => require(MODULE)).toThrow();
});

test('should start whit process.env.FRONT_END evaluating true', () => {
  jest.resetModules();
  process.env.FRONT_END = true;
  require(MODULE);
});

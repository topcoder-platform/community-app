/* eslint-env browser */

window.CONFIG = 'Client-side config';
jest.setMock('config', 'Server-side config');

beforeEach(() => jest.resetModules());

test('Serves config from node-config at the server-side', () => {
  delete process.env.FRONT_END;
  expect(require('utils/config')).toBe('Server-side config');
});

test('Serves config from window.CONFIG at the client-side', () => {
  process.env.FRONT_END = true;
  expect(require('utils/config')).toBe('Client-side config');
});

import request from 'supertest';

const MODULE = require.resolve('server/server');

describe('tc-communities api test', () => {
  let server;
  beforeEach(() => {
    jest.resetModules();
    server = require(MODULE).default;
  });
  test('get community filter', () => request(server).get('/api/tc-communities')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      }));
  test('get community meta', () => request(server).get('/api/tc-communities/wipro/meta')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      }));
  test('get non-exist community meta', () => request(server).get('/api/tc-communities/noop/meta')
      .then((response) => {
        expect(response.statusCode).toBe(404);
      }));
});

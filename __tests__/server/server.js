import request from 'supertest';
import config from 'config';

jest.mock('utils/logger');

const MODULE = require.resolve('server/server');

jest.setMock('../../config/webpack/development', {
  output: {
    publicPath: '',
  },
});

jest.setMock(require.resolve('server/renderer'), (req, res, next) => next());

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

describe('Api test', () => {
  let server;
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    process.env.SERVER_API_KEY = config.SERVER_API_KEY;
    jest.resetModules();
    jest.mock('morgan');
    jest.mock('utils/logger');
    server = require(MODULE).default;
  });
  test('post to /community-app-assets/api/logger', () => request(server).post('/community-app-assets/api/logger')
    .set('Authorization', `ApiKey ${config.SERVER_API_KEY}`)
    .send({ data: 'data' })
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
  test('post to /community-app-assets/api/logger without api key', () => request(server).post('/community-app-assets/api/logger')
    .send({ data: 'data' })
    .then((response) => {
      expect(response.statusCode).toBe(403);
    }));
  test('post to /community-app-assets/api/xml2json', () => request(server).post('/community-app-assets/api/xml2json')
    .set('Authorization', `ApiKey ${config.SERVER_API_KEY}`)
    .send({ xml: '<xml></xml>' })
    .then((response) => {
      expect(response.text).toBe('{"xml":{}}');
    }));
  test('status 404', () => request(server).get('/ELB-HealthChecker/2.0')
    .then((response) => {
      expect(response.statusCode).toBe(404);
    }));
  test('status 500', () => request(server).post('/community-app-assets/api/logger')
    .set('Authorization', `ApiKey ${config.SERVER_API_KEY}`)
    .then((response) => {
      expect(response.statusCode).toBe(500);
    }));
  test('status 500 Internal Error', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    jest.setMock(require.resolve('server/renderer'), () => { throw new Error(); });
    server = require(MODULE).default;
    return request(server).post('/api/noop')
      .then((response) => {
        expect(response.text).toBe('Internal Server Error');
        delete process.env.NODE_ENV;
      });
  });
});

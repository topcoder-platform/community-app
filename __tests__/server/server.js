import request from 'supertest';

let FRONT_END;

beforeEach(() => {
  FRONT_END = process.env.FRONT_END;
  delete process.env.FRONT_END;
});

test('it should start successfully', (done) => {
  const app = require('server/server').default;
  request(app)
    .get('/')
    .expect(200)
    .then(done);
});

test('it should respond to 404', (done) => {
  const app = require('server/server').default;
  request(app)
    .get('/four-0-four')
    .expect(404)
    .then(done);
});

afterEach(() => {
  process.env.FRONT_END = FRONT_END;
});

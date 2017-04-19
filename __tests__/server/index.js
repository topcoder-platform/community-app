let FRONT_END;
let server;
let originalRequire;

beforeAll(() => {
  originalRequire = require;
  global.require = require('require-uncached');
  FRONT_END = process.env.FRONT_END;
  delete process.env.FRONT_END;
});

test('it should listen on specified PORT', (done) => {
  const PORT = 3000;
  process.env.PORT = PORT;
  server = require('server').default;
  const port = server.address().port;
  expect(port).toBe(PORT);
  server.close(done);
});

test('it should throw error on same PORT', (done) => {
  const PORT = 3000;
  process.env.PORT = PORT;
  const firstServer = require('server', { bustCache: true }).default;
  firstServer.on('listening', () => {
    expect(require('server', { bustCache: true }).default).toThrow();
  });
  setTimeout(() => firstServer.close(done), 1000);
});

// test('it should support named pipe', (done) => {
//   const pipeName = 'named-pipe';
//   process.env.PORT = pipeName;
//   const namedPipeServer = require('server', { bustCache: true }).default;

//   expect(namedPipeServer.address()).toBe(pipeName);

//   namedPipeServer.close(done);
// });

afterAll(() => {
  process.env.FRONT_END = FRONT_END;
  global.require = originalRequire;
});

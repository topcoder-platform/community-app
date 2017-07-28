import _ from 'lodash';

const SRC = '../../src';

/* Mock http */

const mockServer = {
  listen: jest.fn(),
  on: jest.fn(),
};

jest.setMock('http', {
  createServer: jest.fn(() => mockServer),
});

jest.setMock(`${SRC}/server/server`, {
  set: jest.fn(),
});

// test('Should not throw', () => {
//   expect(() => require('server')).not.toThrow();
// });

describe('port', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('Positive port', () => {
    process.env.PORT = '3456';
    expect(() => require('server')).not.toThrow();
  });

  test('Negative port', () => {
    process.env.PORT = '-1';
    expect(() => require('server')).not.toThrow();
  });

  test('String port', () => {
    process.env.PORT = 'abc';
    expect(() => require('server')).not.toThrow();
  });
});

describe('Successfully created server', () => {
  beforeAll(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.PORT = '';
    process.env.NODE_ENV = 'test';
    require('server');
  });

  let onError;
  test('A single error handler is created', () => {
    onError = mockServer.on.mock.calls.filter(call => call[0] === 'error');
    expect(onError.length).toBe(1);
    onError = onError[0][1];
    expect(_.isFunction(onError)).toBe(true);
  });

  test('onError throws for any syscall except of listen', () => {
    const err = new Error();
    err.syscall = 'syscall';
    expect(() => onError(err)).toThrow(err);
  });

  test('onError handles EACCESS error as expected', () => {
    const err = new Error();
    err.syscall = 'listen';
    err.code = 'EACCES';
    console.error = jest.fn();
    process.exit = jest.fn();
    onError(err);
    expect(console.error).toHaveBeenCalledWith('Port 3000 requires elevated privileges');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('onError handles EADDRINUSE error as expected', () => {
    const err = new Error();
    err.syscall = 'listen';
    err.code = 'EADDRINUSE';
    console.error = jest.fn();
    process.exit = jest.fn();
    onError(err);
    expect(console.error).toHaveBeenCalledWith('Port 3000 is already in use');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('onError throws for unknown errors', () => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.PORT = 'string';
    require('server');
    onError = mockServer.on.mock.calls.filter(call => call[0] === 'error')[0][1];
    const err = new Error();
    err.syscall = 'listen';
    expect(() => onError(err)).toThrow(err);
  });

  let onListen;
  test('A single listen handler is created', () => {
    onListen = mockServer.on.mock.calls.filter(call => call[0] === 'listening');
    expect(onListen.length).toBe(1);
    onListen = onListen[0][1];
    expect(_.isFunction(onListen)).toBe(true);
  });

  test('onListen is called with string address', () => {
    mockServer.address = () => 'localhost';
    console.log = jest.fn();
    onListen();
    expect(console.log).toHaveBeenCalledWith('Server listening on pipe localhost in test mode');
  });

  test('onListen is called with object address', () => {
    mockServer.address = () => ({ port: 8000 });
    onListen();
    expect(console.log).toHaveBeenCalledWith('Server listening on port 8000 in test mode');
  });
});

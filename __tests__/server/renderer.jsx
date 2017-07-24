
const MODULE = require.resolve('server/renderer');

const renderer = require(MODULE).default;

const res = {
  send: () => {},
  status: () => {},
};

test('valid url', () => {
  const req = {
    url: '/',
    query: {},
    subdomains: [],
  };
  expect(() => renderer(req, res)).not.toThrow();
});

test('invalid url', () => {
  const req = {
    url: '/noop',
    query: {},
    subdomains: [],
  };
  expect(() => renderer(req, res)).not.toThrow();
});



beforeAll(() => {
  jest.mock('react-dom/server', () => ({
    renderToString: () => 'RENDER',
  }));
});

afterAll(() => {
  jest.unmock('react-dom/server');
});

test('should not throw errors', () => {
  const renderer = require('server/renderer').default;
  const res = {
    send: () => {},
  };
  expect(() => renderer(undefined, res)).not.toThrow();
});

test('should enable DevTools on development mode', () => {

});

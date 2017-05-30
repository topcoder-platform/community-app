jest.setMock('react-dom/server', {
  renderToString: () => 'RENDER',
});

const renderer = require('server/renderer').default;

test('should not throw errors', () => {
  const req = {
    url: '/',
  };
  const res = {
    send: () => {},
  };
  expect(() => renderer(req, res)).not.toThrow();
});

jest.setMock('react-dom/server', {
  renderToString: () => 'RENDER',
});

const renderer = require('server/renderer').default;

test('should not throw errors', () => {
  const res = {
    send: () => {},
  };
  expect(() => renderer(undefined, res)).not.toThrow();
});

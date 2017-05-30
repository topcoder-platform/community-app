import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Routes from 'routes';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render(<Routes />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

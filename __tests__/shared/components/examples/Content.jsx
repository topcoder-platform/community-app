import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Content from 'components/examples/Content';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render(<Content />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

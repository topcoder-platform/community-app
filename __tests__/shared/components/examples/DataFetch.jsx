import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import DataFetch from 'components/examples/DataFetch';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render(<DataFetch />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TopcoderFooter from 'components/TopcoderFooter';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render(<TopcoderFooter />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

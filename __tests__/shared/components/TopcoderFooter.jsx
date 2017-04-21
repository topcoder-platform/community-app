import React from 'react';
import Renderer from 'react-test-renderer/shallow';

test('Matches shallow shapshot', () => {
  delete process.env.FRONT_END;
  process.env.NODE_ENV = 'development';
  const TopcoderFooter = require('components/TopcoderFooter').default;
  const renderer = new Renderer();
  renderer.render(<TopcoderFooter />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

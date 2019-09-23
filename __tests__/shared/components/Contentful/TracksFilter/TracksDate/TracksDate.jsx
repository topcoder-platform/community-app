import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { TracksDateInner } from 'components/Contentful/TracksFilter/TracksDate';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<TracksDateInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

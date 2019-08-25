import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { TracksFilterInner } from 'components/Contentful/TracksFilter/TracksFilter';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<TracksFilterInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

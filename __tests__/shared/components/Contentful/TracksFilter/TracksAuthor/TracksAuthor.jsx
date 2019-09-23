import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { TracksAuthorInner } from 'components/Contentful/TracksFilter/TracksAuthor';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
    selected: 'All authors',
  };
  renderer.render(<TracksAuthorInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

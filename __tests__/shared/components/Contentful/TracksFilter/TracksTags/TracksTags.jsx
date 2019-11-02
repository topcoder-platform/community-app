import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { TracksTagsInner } from 'components/Contentful/TracksFilter/TracksTags';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<TracksTagsInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

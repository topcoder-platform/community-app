import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { TracksTreeInner } from 'components/Contentful/TracksTree/TracksTree';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<TracksTreeInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

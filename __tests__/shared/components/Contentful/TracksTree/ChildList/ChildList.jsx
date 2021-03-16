import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { ChildListInner } from 'components/Contentful/TracksTree/ChildList';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<ChildListInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

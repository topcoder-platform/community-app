import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { ChildListRowInner } from 'components/Contentful/TracksTree/ChildListRow';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<ChildListRowInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { FilterTagsInner } from 'components/Contentful/SearchPageFilter/FilterTags';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<FilterTagsInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

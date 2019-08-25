import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { SearchPageFilterInner } from 'components/Contentful/SearchPageFilter/SearchPageFilter';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<SearchPageFilterInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

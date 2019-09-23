import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { FilterDateInner } from 'components/Contentful/SearchPageFilter/FilterDate';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<FilterDateInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

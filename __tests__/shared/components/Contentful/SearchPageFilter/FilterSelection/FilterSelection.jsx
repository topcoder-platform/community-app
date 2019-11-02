import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { FilterSelectionInner } from 'components/Contentful/SearchPageFilter/FilterSelection';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
  };
  renderer.render(<FilterSelectionInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

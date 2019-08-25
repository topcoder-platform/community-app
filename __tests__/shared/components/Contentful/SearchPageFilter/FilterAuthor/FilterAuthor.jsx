import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { FilterAuthorInner } from 'components/Contentful/SearchPageFilter/FilterAuthor';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
    selected: 'All authors',
  };
  renderer.render(<FilterAuthorInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

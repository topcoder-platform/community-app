import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { SearchPageFilterInner } from 'components/Contentful/SearchPageFilter/SearchPageFilter';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
    startDate: '2019-08-01T07:21:20.249Z',
    endDate: '2019-09-01T07:21:20.249Z',
  };
  renderer.render(<SearchPageFilterInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

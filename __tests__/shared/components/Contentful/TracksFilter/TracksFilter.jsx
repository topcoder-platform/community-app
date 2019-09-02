import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { TracksFilterInner } from 'components/Contentful/TracksFilter/TracksFilter';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    theme: {},
    startDate: '2019-08-01T07:21:20.249Z',
    endDate: '2019-09-01T07:21:20.249Z',
  };
  renderer.render(<TracksFilterInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

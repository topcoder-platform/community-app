import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { ShapeInner } from 'components/Contentful/Shape/Shape';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    id: '1',
    shape: {},
    shapeSvg: {
      file: {
        url: 'https://www.topcoder.com',
      },
    },
    theme: {},
  };
  renderer.render(<ShapeInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

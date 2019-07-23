import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { ImageInner } from 'components/Contentful/Image/Image';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    id: '1',
    image: {},
    imageSource: {
      file: {
        url: 'https://www.topcoder.com',
      },
    },
    clipSvg: {
      file: {
        url: 'https://www.topcoder.com',
      },
    },
    theme: {},
  };
  renderer.render(<ImageInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import { MemberCardInner } from 'components/Contentful/MemberCard/MemberCard';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    memberCard: {
      country: 'es',
    },
    trackIcon: {
      file: {
        url: 'https://www.topcoder.com',
      },
    },
    theme: {},
  };
  renderer.render(<MemberCardInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

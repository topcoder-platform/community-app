import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Content from 'components/Content';

// jest.mock('topcoder-react-utils', () =>
// require('topcoder-react-utils/dist/src/mock'));

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render(<Content />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

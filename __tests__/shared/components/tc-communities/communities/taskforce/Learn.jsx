import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Learn from 'components/tc-communities/communities/taskforce/Learn';

test('Match shadow snapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Learn />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

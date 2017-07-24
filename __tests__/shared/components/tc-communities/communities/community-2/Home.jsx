import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Home from 'components/tc-communities/communities/community-2/Home';

test('Match shadow snapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Home news={[]} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

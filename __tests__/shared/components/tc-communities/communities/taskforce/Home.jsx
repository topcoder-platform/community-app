import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Home from 'components/tc-communities/communities/taskforce/Home';

test('Match shadow snapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Home news={[{ link: 'link' }]} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

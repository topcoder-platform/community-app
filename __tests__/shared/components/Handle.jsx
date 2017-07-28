import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Handle from 'components/Handle';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Handle handle="abc" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

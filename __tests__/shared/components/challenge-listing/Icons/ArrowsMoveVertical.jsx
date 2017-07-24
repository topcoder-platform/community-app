import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ArrowsMoveVertical from 'components/challenge-listing/Icons/ArrowsMoveVertical';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <ArrowsMoveVertical />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});


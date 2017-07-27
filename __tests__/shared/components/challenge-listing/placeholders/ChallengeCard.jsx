import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ChallengeCardPlaceholder from 'components/challenge-listing/placeholders/ChallengeCard';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <ChallengeCardPlaceholder id={1} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

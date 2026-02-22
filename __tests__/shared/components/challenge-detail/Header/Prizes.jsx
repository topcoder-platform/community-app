import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Prizes from 'components/challenge-detail/Header/Prizes';

describe('Challenge detail header prizes', () => {
  test('renders leaderboard-scoring label for fun challenges', () => {
    const renderer = new Renderer();
    renderer.render((
      <Prizes
        isFunChallenge
        pointPrizes={[]}
        prizes={[{ type: 'USD', value: 1 }]}
      />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('renders normal placement prizes when fun challenge is false', () => {
    const renderer = new Renderer();
    renderer.render((
      <Prizes
        isFunChallenge={false}
        pointPrizes={[]}
        prizes={[{ type: 'USD', value: 1000 }]}
      />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

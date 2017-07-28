import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import Podium from 'components/Leaderboard/Podium';

const mockUserObj = {
  rank: 1,
  photourl: 'some.fake.string',
  'challenge_stats.winner_handle': 'overachieving.mofo',
  'challenge_stats.count': 99999,
  points: 9999999999,
};

const mockLeaderboardData = [mockUserObj, mockUserObj, mockUserObj, mockUserObj];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <Podium competitors={mockLeaderboardData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <Podium competitors={[]} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

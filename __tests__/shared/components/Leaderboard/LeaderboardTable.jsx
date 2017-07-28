import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import LeaderboardTable from 'components/Leaderboard/LeaderboardTable';

const mockUserObj = {
  rank: 1,
  'challenge_stats.photo_url': 'some.fake.string',
  'user.handle': 'overachieving.mofo',
  'challenge.count': 99999,
  'project_result.final_score': 9999999999,
  'challenge_stats.winner_handle': 'winnner',
  'challenge_stats.count': 0,
  points: 0,
};

const mockUserObj2 = {
  rank: 1,
  'challenge_stats.photo_url': '/assets/a.jpg',
  'user.handle': 'overachieving.mofo',
  'challenge.count': 99999,
  'project_result.final_score': 9999999999,
  'challenge_stats.winner_handle': 'winnner',
  'challenge_stats.count': 0,
  points: 0,
};

const mockLeaderboardData = [mockUserObj, mockUserObj, mockUserObj, mockUserObj2];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <LeaderboardTable competitors={mockLeaderboardData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

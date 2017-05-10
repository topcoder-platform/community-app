import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import LeaderboardTable from 'components/Leaderboard/LeaderboardTable';

const mockUserObj = {
  rank: 1,
  avatarUrl: 'some.fake.string',
  'user.handle': 'overachieving.mofo',
  wins: 99999,
  'project_result.final_score': 9999999999,
};

const mockLeaderboardData = [mockUserObj, mockUserObj, mockUserObj, mockUserObj];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <LeaderboardTable competitors={mockLeaderboardData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

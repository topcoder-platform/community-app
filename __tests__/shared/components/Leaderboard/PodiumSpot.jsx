import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import PodiumSpot from 'components/Leaderboard/PodiumSpot';

const mockUserObj = {
  rank: 1,
  photourl: 'some.fake.string',
  'user.handle': 'overachieving.mofo',
  'challenge.count': 99999,
  'project_result.final_score': 9999999999,
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <PodiumSpot competitor={mockUserObj} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

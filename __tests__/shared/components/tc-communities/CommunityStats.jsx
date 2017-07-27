import React from 'react';
import _ from 'lodash';
import Rnd from 'react-test-renderer/shallow';
import GroupStats from 'components/tc-communities/CommunityStats';

const mockDatas = [
  {
    stats: {
      numChallenges: 10,
      numMembers: 20,
      numProjects: 30,
      openPrizes: 40,
    },
  },
  {
    stats: {
    },
  },
];

const rnd = new Rnd();

test('Snapshot match', () => {
  _.forEach(mockDatas, (data) => {
    rnd.render((
      <GroupStats {...data} />
    ));
    expect(rnd.getRenderOutput()).toMatchSnapshot();
  });
});

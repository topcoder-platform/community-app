import actions from 'actions/stats';

jest.mock('services/groups.js');

const result = {
  communityId: undefined,
  stats: {
    numMembers: 500,
  },
};

describe('stats.getGroupStats fetch all', async () => {
  const a = actions.stats.getCommunityStats({ groupIds: [1] }, [], 'TOKEN');

  test('has expected type', () => {
    expect(a.type).toBe('STATS/GET_COMMUNITY_STATS');
  });

  test('payload is a promise which resolves to the expected object', async () => {
    await expect(a.payload).resolves.toEqual(result);
  });
});

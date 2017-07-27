import actions from 'actions/stats';

let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

const response1 = {
  ok: true,
  json: () => ({
    result: {
      status: 200,
      content: [{
        allPhases: [{
          phaseType: 'Registration',
          phaseStatus: 'Open',
        }],
        groupIds: [],
        totalPrize: 0,
      }, {
        allPhases: [{
          phaseType: 'Registration',
          phaseStatus: 'Open',
        }],
        groupIds: [],
        totalPrize: 0,
      }],
      metadata: {
        totalCount: 2,
      },
    },
  }),
};

const response2 = {
  ok: true,
  json: () => ({
    result: {
      status: 200,
      content: [],
      metadata: {
        totalCount: 10,
      },
    },
  }),
};

const result = {
  communityId: undefined,
  stats: {
    numChallenges: 0,
    numMembers: 0,
    openPrizes: '$0',
  },
};

describe('stats.getGroupStats fetch all', () => {
  global.fetch = jest.fn(() => Promise.resolve(response1));

  const a = actions.stats.getCommunityStats('1');

  test('has expected type', () => {
    expect(a.type).toBe('STATS/GET_COMMUNITY_STATS');
  });

  test('payload is a promise which resolves to the expected object', () => {
    expect(a.payload).toEqual(result);
  });
});

describe('stats.getGroupStats fetch partial', () => {
  global.fetch = jest.fn(() => Promise.resolve(response2));

  const a = actions.stats.getCommunityStats('1');

  test('has expected type', () => {
    expect(a.type).toBe('STATS/GET_COMMUNITY_STATS');
  });

  test('payload is a promise which resolves to the expected object', () => {
    expect(a.payload).toEqual(result);
  });
});

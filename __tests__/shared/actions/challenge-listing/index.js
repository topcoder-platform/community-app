const mockGetChallenges = jest.fn(() => Promise.resolve({
  challenges: [],
  meta: { allChallengesCount: 0 },
}));
const mockGetService = jest.fn(() => ({
  getChallenges: mockGetChallenges,
}));

jest.mock('@topcoder-platform/tc-auth-lib', () => ({
  decodeToken: jest.fn(() => ({ userId: 123 })),
}));

jest.mock('utils/tc', () => ({
  processSRM: jest.fn(),
}));

jest.mock('topcoder-react-lib', () => ({
  errors: {
    fireErrorMessage: jest.fn(),
  },
  services: {
    challenge: {
      getService: mockGetService,
    },
  },
}));

const actions = require('actions/challenge-listing').default.challengeListing;

const backendFilter = { legacyId: 12345 };
const frontFilter = {
  sorts: {
    all: 'startDate',
    my: 'startDate',
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('live challenge listing filters', () => {
  test('requests every started active challenge for All', async () => {
    const action = actions.getAllChallengesDone(
      'all-uuid',
      0,
      backendFilter,
      'token',
      frontFilter,
    );

    await action.payload;

    expect(mockGetChallenges).toHaveBeenCalledWith(expect.objectContaining({
      backendFilter,
      frontFilter: expect.objectContaining({
        status: 'ACTIVE',
        startDateEnd: expect.any(String),
      }),
    }));
    expect(mockGetChallenges.mock.calls[0][0].frontFilter)
      .not.toHaveProperty('currentPhaseName');
  });

  test('requests all active challenges registered to the member', async () => {
    const action = actions.getMyChallengesDone(
      'my-uuid',
      0,
      backendFilter,
      'token',
      frontFilter,
    );

    await action.payload;

    expect(mockGetChallenges).toHaveBeenCalledWith(expect.objectContaining({
      backendFilter,
      frontFilter: expect.objectContaining({
        memberId: '123',
        status: 'ACTIVE',
      }),
    }));
    expect(mockGetChallenges.mock.calls[0][0].frontFilter)
      .not.toHaveProperty('currentPhaseName');
  });

  test('counts every started active challenge', async () => {
    const action = actions.getTotalChallengesCountDone(
      'count-uuid',
      'token',
      frontFilter,
    );

    await action.payload;

    expect(mockGetChallenges).toHaveBeenCalledWith(expect.objectContaining({
      frontFilter: expect.objectContaining({
        isLightweight: true,
        status: 'ACTIVE',
        startDateEnd: expect.any(String),
      }),
    }));
    expect(mockGetChallenges.mock.calls[0][0].frontFilter)
      .not.toHaveProperty('currentPhaseName');
  });
});

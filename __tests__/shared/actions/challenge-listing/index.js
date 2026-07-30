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
  test('only requests All challenges with an open submission phase', async () => {
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
        currentPhaseName: 'Submission',
        status: 'ACTIVE',
      }),
    }));
  });

  test('only requests My Challenges with an open submission phase', async () => {
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
        currentPhaseName: 'Submission',
        memberId: '123',
        status: 'ACTIVE',
      }),
    }));
  });

  test('counts only live challenges with an open submission phase', async () => {
    const action = actions.getTotalChallengesCountDone(
      'count-uuid',
      'token',
      frontFilter,
    );

    await action.payload;

    expect(mockGetChallenges).toHaveBeenCalledWith(expect.objectContaining({
      frontFilter: expect.objectContaining({
        currentPhaseName: 'Submission',
        isLightweight: true,
        status: 'ACTIVE',
      }),
    }));
  });
});

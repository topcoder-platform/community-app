import { mockAction } from 'utils/mock';

const mockChallengeActions = {
  fetchChallengeInit: mockAction('FETCH_CHALLENGE_INIT'),
  fetchChallengeDone: mockAction(
    'FETCH_CHALLENGE_DONE',
    Promise.resolve('payload'),
  ),
  fetchSubmissionsDone: mockAction(
    'FETCH_SUBMISSION_DONE',
    Promise.resolve('payload'),
  ),
};
jest.setMock(require.resolve('actions/challenge'), mockChallengeActions);

const mockSmpActions = {
  smp: {
    fetchSubmissionsDone: mockAction(
      'FETCH_SUBMISSION_DONE',
      Promise.resolve('payload'),
    ),
  },
};
jest.setMock(require.resolve('actions/smp'), mockSmpActions);

jest.setMock(require.resolve('reducers/my-submissions-management'),
  state => ({ ...state }),
);

const reducers = require('reducers/challenge');

beforeEach(() => jest.clearAllMocks());

function testReducer(reducer, istate) {
  let state;

  test('Creates expected intial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(istate);
  });

  test('Handles fetchChallengeInit as expected', () => {
    state = reducer(state, mockChallengeActions.fetchChallengeInit());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetails: true,
      fetchChallengeFailure: false,
      details: null,
    });
  });
}

describe('Default reducer', () =>
  testReducer(reducers.default, {
    mySubmissionsManagement: {},
  }),
);

describe('Factory without http request', () =>
  reducers.factory().then(res =>
    testReducer(res, {
      mySubmissionsManagement: {},
    }),
  ),
);

describe('Factory with server-side rendering', () =>
  reducers.factory({
    cookies: {
      tcjwt: 'TcAuthTokenV2',
      tctV3: 'TcAuthTokenV3',
    },
    url: '/challenge/12345/my-submissions',
  }).then(res =>
    testReducer(res, {
      mySubmissionsManagement: {},
    }),
  ),
);

describe('Factory without server-side rendering', () =>
  reducers.factory({
    url: '/some-random-url',
  }).then(res =>
    testReducer(res, {
      mySubmissionsManagement: {},
    }),
  ),
);

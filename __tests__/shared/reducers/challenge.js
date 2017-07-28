import { mockAction } from 'utils/mock';

const mockChallengeActions = {
  fetchChallengeInit: mockAction('FETCH_CHALLENGE_INIT'),
  fetchChallengeDone: mockAction(
    'FETCH_CHALLENGE_DONE',
    'payload',
  ),
  fetchChallengeDoneError: mockAction(
    'FETCH_CHALLENGE_DONE',
    null,
    'Unknown error',
  ),
  fetchSubmissionsInit: mockAction(
    'FETCH_SUBMISSION_INIT',
  ),
  fetchSubmissionsDone: mockAction(
    'FETCH_SUBMISSION_DONE',
    [{ submissionId: '1' }],
  ),
  fetchSubmissionsDoneError: mockAction(
    'FETCH_SUBMISSION_DONE',
    null,
    'Unknown error',
  ),
};
jest.setMock(require.resolve('actions/challenge'), mockChallengeActions);

const mockSmpActions = {
  smp: {
    fetchSubmissionsDone: mockAction(
      'FETCH_SUBMISSION_DONE',
      Promise.resolve('payload'),
    ),
    deleteSubmissionDone: mockAction(
      'DELETE_SUBMISSION_DONE',
      'payload',
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

  test('Handles fetchChallengeDone as expected', () => {
    state = reducer(state, mockChallengeActions.fetchChallengeDone());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetails: false,
      fetchChallengeFailure: false,
      details: 'payload',
    });
  });

  test('Handles fetchChallengeDone with error as expected', () => {
    state = reducer(state, mockChallengeActions.fetchChallengeDoneError());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetails: false,
      fetchChallengeFailure: 'Unknown error',
      details: null,
    });
  });

  test('Handles fetchSubmissionsInit as expected', () => {
    state = reducer(state, mockChallengeActions.fetchSubmissionsInit());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetails: false,
      fetchChallengeFailure: 'Unknown error',
      details: null,
      loadingMySubmissions: true,
      mySubmissions: { v2: null },
    });
  });

  test('Handles fetchSubmissionsDone as expected', () => {
    state = reducer(state, mockChallengeActions.fetchSubmissionsDone());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetails: false,
      fetchChallengeFailure: 'Unknown error',
      details: null,
      mySubmissions: { v2: [{ submissionId: '1' }] },
      fetchMySubmissionsFailure: false,
      loadingMySubmissions: false,
    });
  });

  test('Handles deleteSubmissionDone as expected', () => {
    state = reducer(state, mockSmpActions.smp.deleteSubmissionDone());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetails: false,
      fetchChallengeFailure: 'Unknown error',
      details: null,
      fetchMySubmissionsFailure: false,
      loadingMySubmissions: false,
      mySubmissions: { v2: [{ submissionId: '1' }] },
    });
  });

  test('Handles fetchSubmissionsDoneError as expected', () => {
    state = reducer(state, mockChallengeActions.fetchSubmissionsDoneError());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetails: false,
      fetchChallengeFailure: 'Unknown error',
      details: null,
      mySubmissions: { v2: [] },
      loadingMySubmissions: false,
      fetchMySubmissionsFailure: 'Unknown error',
    });
  });
}

describe('Default reducer', () =>
  testReducer(reducers.default, {
    mySubmissionsManagement: {},
  }),
);

jest.clearAllMocks();
jest.resetAllMocks();

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
      v3jwt: 'TcAuthTokenV3',
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

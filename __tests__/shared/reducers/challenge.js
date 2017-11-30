import { mockAction } from 'utils/mock';

/* TODO: challenge actions module should be properly mocked */
const mockChallengeActions = {
  challenge: {
    getDetailsInit: mockAction('CHALLENGE/GET_DETAILS_INIT', '12345'),
    getDetailsDone: mockAction(
      'CHALLENGE/GET_DETAILS_DONE', [{
        id: 12345,
        tag: 'v3-details',
      }, {
        challengeId: '12345',
        tag: 'v2-details',
      }, {
        id: 12345,
        tag: 'v3-user-details',
      }],
    ),
    getDetailsDoneError: mockAction(
      'CHALLENGE/GET_DETAILS_DONE',
      null,
      'Unknown error',
    ),
    getSubmissionsInit: mockAction(
      'GET_SUBMISSION_INIT',
    ),
    getSubmissionsDone: mockAction(
      'GET_SUBMISSION_DONE',
      [{ submissionId: '1' }],
    ),
    getSubmissionsDoneError: mockAction(
      'GET_SUBMISSION_DONE',
      null,
      'Unknown error',
    ),
  },
  DETAIL_TABS: {
    DETAILS: 'details',
  },
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

  test('Handles CHALLENGE/GET_DETAILS_INIT as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getDetailsInit(12345));
    expect(state).toEqual({
      mySubmissions: {},
      mySubmissionsManagement: {},
      loadingCheckpoints: false,
      loadingDetailsForChallengeId: '12345',
      loadingResultsForChallengeId: '',
      fetchChallengeFailure: false,
      details: null,
      checkpoints: null,
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
    });
  });

  test('Handles CHALLENGE/GET_DETAILS_DONE as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getDetailsDone());
    expect(state).toEqual({
      fetchChallengeFailure: false,
      mySubmissions: {},
      mySubmissionsManagement: {},
      loadingCheckpoints: false,
      loadingDetailsForChallengeId: '',
      details: {
        id: 12345,
        tag: 'v3-user-details',
      },
      checkpoints: null,
      loadingResultsForChallengeId: '',
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
    });
  });

  test('Handles CHALLENGE/GET_DETAILS_DONE with error as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getDetailsDoneError());
    expect(state).toEqual({
      fetchChallengeFailure: 'Unknown error',
      mySubmissions: {},
      mySubmissionsManagement: {},
      loadingCheckpoints: false,
      loadingDetailsForChallengeId: '',
      details: {
        id: 12345,
        tag: 'v3-user-details',
      },
      checkpoints: null,
      loadingResultsForChallengeId: '',
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
    });
  });

  test('Handles fetchSubmissionsInit as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getSubmissionsInit());
    expect(state).toEqual({
      fetchChallengeFailure: 'Unknown error',
      loadingSubmissionsForChallengeId: undefined,
      mySubmissions: { challengeId: '', v2: null },
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '',
      details: {
        id: 12345,
        tag: 'v3-user-details',
      },
      checkpoints: null,
      loadingCheckpoints: false,
      loadingResultsForChallengeId: '',
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
    });
  });

  test('Handles fetchSubmissionsDone as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getSubmissionsDone());
    expect(state).toEqual({
      fetchChallengeFailure: 'Unknown error',
      loadingSubmissionsForChallengeId: '',
      mySubmissions: { challengeId: undefined, v2: undefined },
      mySubmissionsManagement: {},

      loadingDetailsForChallengeId: '',
      details: {
        id: 12345,
        tag: 'v3-user-details',
      },
      checkpoints: null,
      loadingCheckpoints: false,
      loadingResultsForChallengeId: '',
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
    });
  });

  test.skip('Handles deleteSubmissionDone as expected', () => {
    state = reducer(state, mockSmpActions.smp.deleteSubmissionDone());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '',
      fetchChallengeFailure: 'Unknown error',
      details: null,
      checkpoints: null,
      loadingCheckpoints: false,
      loadingResultsForChallengeId: '',
      fetchMySubmissionsFailure: false,
      loadingMySubmissions: false,
      mySubmissions: { v2: [{ submissionId: '1' }] },
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
    });
  });

  test.skip('Handles fetchSubmissionsDoneError as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getSubmissionsDoneError());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '',
      fetchChallengeFailure: 'Unknown error',
      details: null,
      checkpoints: null,
      mySubmissions: { v2: [] },
      loadingCheckpoints: false,
      loadingMySubmissions: false,
      loadingResultsForChallengeId: '',
      fetchMySubmissionsFailure: 'Unknown error',
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
    });
  });
}

describe('Default reducer', () =>
  testReducer(reducers.default, {
    details: null,
    checkpoints: null,
    loadingCheckpoints: false,
    loadingDetailsForChallengeId: '',
    loadingResultsForChallengeId: '',
    mySubmissions: {},
    mySubmissionsManagement: {},
    registering: false,
    results: null,
    resultsLoadedForChallengeId: '',
    selectedTab: 'details',
    unregistering: false,
  }),
);

jest.clearAllMocks();
jest.resetAllMocks();

describe('Factory without http request', () =>
  reducers.factory().then(res =>
    testReducer(res, {
      details: null,
      checkpoints: null,
      loadingCheckpoints: false,
      loadingDetailsForChallengeId: '',
      mySubmissionsManagement: {},
      registering: false,
      unregistering: false,
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
      details: null,
      checkpoints: null,
      loadingCheckpoints: false,
      loadingDetailsForChallengeId: '',
      mySubmissionsManagement: {},
      registering: false,
      unregistering: false,
    }),
  ),
);

describe('Factory without server-side rendering', () =>
  reducers.factory({
    url: '/some-random-url',
  }).then(res =>
    testReducer(res, {
      details: null,
      checkpoints: null,
      loadingCheckpoints: false,
      loadingDetailsForChallengeId: '',
      mySubmissionsManagement: {},
      registering: false,
      unregistering: false,
    }),
  ),
);

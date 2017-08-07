import { mockAction } from 'utils/mock';

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
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '12345',
      fetchChallengeFailure: false,
      details: null,
      detailsV2: null,
      checkpoints: null,
      registering: false,
      unregistering: false,
    });
  });

  test('Handles CHALLENGE/GET_DETAILS_DONE as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getDetailsDone());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '',
      fetchChallengeFailure: false,
      details: {
        id: 12345,
        tag: 'v3-user-details',
      },
      detailsV2: {
        challengeId: '12345',
        tag: 'v2-details',
      },
      checkpoints: null,
      registering: false,
      unregistering: false,
    });
  });

  test('Handles CHALLENGE/GET_DETAILS_DONE with error as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getDetailsDoneError());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '',
      fetchChallengeFailure: 'Unknown error',
      details: null,
      detailsV2: null,
      checkpoints: null,
      registering: false,
      unregistering: false,
    });
  });

  test('Handles fetchSubmissionsInit as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getSubmissionsInit());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '',
      fetchChallengeFailure: 'Unknown error',
      details: null,
      detailsV2: null,
      checkpoints: null,
      loadingMySubmissions: true,
      mySubmissions: { v2: null },
      registering: false,
      unregistering: false,
    });
  });

  test('Handles fetchSubmissionsDone as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getSubmissionsDone());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '',
      fetchChallengeFailure: 'Unknown error',
      details: null,
      detailsV2: null,
      checkpoints: null,
      mySubmissions: { v2: [{ submissionId: '1' }] },
      fetchMySubmissionsFailure: false,
      loadingMySubmissions: false,
      registering: false,
      unregistering: false,
    });
  });

  test('Handles deleteSubmissionDone as expected', () => {
    state = reducer(state, mockSmpActions.smp.deleteSubmissionDone());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '',
      fetchChallengeFailure: 'Unknown error',
      details: null,
      detailsV2: null,
      checkpoints: null,
      fetchMySubmissionsFailure: false,
      loadingMySubmissions: false,
      mySubmissions: { v2: [{ submissionId: '1' }] },
      registering: false,
      unregistering: false,
    });
  });

  test('Handles fetchSubmissionsDoneError as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getSubmissionsDoneError());
    expect(state).toEqual({
      mySubmissionsManagement: {},
      loadingDetailsForChallengeId: '',
      fetchChallengeFailure: 'Unknown error',
      details: null,
      detailsV2: null,
      checkpoints: null,
      mySubmissions: { v2: [] },
      loadingMySubmissions: false,
      fetchMySubmissionsFailure: 'Unknown error',
      registering: false,
      unregistering: false,
    });
  });
}

describe('Default reducer', () =>
  testReducer(reducers.default, {
    details: null,
    detailsV2: null,
    checkpoints: null,
    loadingDetailsForChallengeId: '',
    mySubmissionsManagement: {},
    registering: false,
    unregistering: false,
  }),
);

jest.clearAllMocks();
jest.resetAllMocks();

describe('Factory without http request', () =>
  reducers.factory().then(res =>
    testReducer(res, {
      details: null,
      detailsV2: null,
      checkpoints: null,
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
      detailsV2: null,
      checkpoints: null,
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
      detailsV2: null,
      checkpoints: null,
      loadingDetailsForChallengeId: '',
      mySubmissionsManagement: {},
      registering: false,
      unregistering: false,
    }),
  ),
);

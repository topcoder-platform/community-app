/* TODO: These tests should be refactored to the best practices and moved to
 * `topcoder-react-lib`, whether the corresponding reducer has been moved
 * already. */

test.skip('PLACEHOLDER', () => {});

/*
import _ from 'lodash';
import { redux } from 'topcoder-react-utils';
import { mock, actions } from 'topcoder-react-lib';

const { mockAction } = mock;

jest.setMock('@topcoder-platform/tc-auth-lib', {
  decodeToken: () => 'User object',
  isTokenExpired: () => false,
});

const mockChallengeActions = {
  challenge: {
    getDetailsInit: mockAction('CHALLENGE/GET_DETAILS_INIT', '12345'),
    getDetailsDone: mockAction('CHALLENGE/GET_DETAILS_DONE', Promise.resolve({
      id: 12345,
      tag: 'v3-normalized-details',
    })),
    getDetailsDoneError: mockAction(
      'CHALLENGE/GET_DETAILS_DONE',
      { challengeId: '12345' },
      'Unknown error',
    ),
    getSubmissionsInit: mockAction('CHALLENGE/GET_SUBMISSIONS_INIT', '12345'),
    getSubmissionsDone: mockAction(
      'CHALLENGE/GET_SUBMISSIONS_DONE',
      Promise.resolve({ challengeId: '12345', submissions: [{ submissionId: '1' }] }),
    ),
    getSubmissionsDoneError: mockAction(
      'CHALLENGE/GET_SUBMISSIONS_DONE',
      { challengeId: '12345' },
      'Unknown error',
    ),
  },
  DETAIL_TABS: {
    DETAILS: 'details',
  },
};

_.merge(actions, mockChallengeActions);

const mockSmpActions = {
  smp: {
    deleteSubmissionDone: mockAction(
      'SMP/DELETE_SUBMISSION_DONE',
      '1',
    ),
  },
};
_.merge(actions, mockSmpActions);

const reducers = require('reducers/challenge');

beforeEach(() => jest.clearAllMocks());

const defaultState = {
  details: null,
  checkpoints: null,
  loadingCheckpoints: false,
  loadingDetailsForChallengeId: '',
  loadingResultsForChallengeId: '',
  mySubmissions: {},
  mySubmissionsManagement: {
    showDetails: [],
    showModal: false,
    toBeDeletedId: 0,
  },
  registering: false,
  results: null,
  resultsLoadedForChallengeId: '',
  selectedTab: 'details',
  unregistering: false,
  updatingChallengeUuid: '',
};

let reducer;
function testReducer(istate) {
  let state;

  test('Creates expected intial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(istate);
    state = _.clone(defaultState);
  });

  test('Handles CHALLENGE/GET_DETAILS_INIT as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getDetailsInit(12345));
    expect(state).toEqual({
      mySubmissions: {},
      mySubmissionsManagement: {
        showDetails: [],
        showModal: false,
        toBeDeletedId: 0,
      },
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
      updatingChallengeUuid: '',
    });
  });

  test('Handles CHALLENGE/GET_DETAILS_DONE as expected', () =>
    redux.resolveAction(mockChallengeActions.challenge.getDetailsDone()).then((action) => {
      state = reducer(state, action);
      expect(state).toEqual({
        fetchChallengeFailure: false,
        mySubmissions: {},
        mySubmissionsManagement: {
          showDetails: [],
          showModal: false,
          toBeDeletedId: 0,
        },
        loadingCheckpoints: false,
        loadingDetailsForChallengeId: '',
        details: {
          id: 12345,
          tag: 'v3-normalized-details',
        },
        checkpoints: null,
        loadingResultsForChallengeId: '',
        registering: false,
        results: null,
        resultsLoadedForChallengeId: '',
        selectedTab: 'details',
        unregistering: false,
        updatingChallengeUuid: '',
      });
    }));

  test('Handles CHALLENGE/GET_DETAILS_DONE with error as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getDetailsDoneError());
    expect(state).toEqual({
      fetchChallengeFailure: 'Unknown error',
      mySubmissions: {},
      mySubmissionsManagement: {
        showDetails: [],
        showModal: false,
        toBeDeletedId: 0,
      },
      loadingCheckpoints: false,
      loadingDetailsForChallengeId: '',
      details: {
        id: 12345,
        tag: 'v3-normalized-details',
      },
      checkpoints: null,
      loadingResultsForChallengeId: '',
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
      updatingChallengeUuid: '',
    });
  });

  test('Handles fetchSubmissionsInit as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getSubmissionsInit());
    expect(state).toEqual({
      fetchChallengeFailure: 'Unknown error',
      loadingSubmissionsForChallengeId: '12345',
      mySubmissions: { challengeId: '', v2: null },
      mySubmissionsManagement: {
        showDetails: [],
        showModal: false,
        toBeDeletedId: 0,
      },
      loadingDetailsForChallengeId: '',
      details: {
        id: 12345,
        tag: 'v3-normalized-details',
      },
      checkpoints: null,
      loadingCheckpoints: false,
      loadingResultsForChallengeId: '',
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
      updatingChallengeUuid: '',
    });
  });

  test('Handles fetchSubmissionsDone as expected', () =>
    redux.resolveAction(mockChallengeActions.challenge.getSubmissionsDone()).then((action) => {
      state = reducer(state, action);
      expect(state).toEqual({
        fetchChallengeFailure: 'Unknown error',
        loadingSubmissionsForChallengeId: '',
        mySubmissions: { challengeId: '12345', v2: [{ submissionId: '1' }] },
        mySubmissionsManagement: {
          showDetails: [],
          showModal: false,
          toBeDeletedId: 0,
        },
        loadingDetailsForChallengeId: '',
        details: {
          id: 12345,
          tag: 'v3-normalized-details',
        },
        checkpoints: null,
        loadingCheckpoints: false,
        loadingResultsForChallengeId: '',
        registering: false,
        results: null,
        resultsLoadedForChallengeId: '',
        selectedTab: 'details',
        unregistering: false,
        updatingChallengeUuid: '',
      });
    }));

  test('Handles deleteSubmissionDone as expected', () => {
    state = reducer(state, mockSmpActions.smp.deleteSubmissionDone());
    expect(state).toEqual({
      fetchChallengeFailure: 'Unknown error',
      loadingSubmissionsForChallengeId: '',
      mySubmissions: { challengeId: '12345', v2: [] },
      mySubmissionsManagement: {
        showDetails: [],
        deletingSubmission: false,
        showModal: false,
        toBeDeletedId: 0,
      },
      loadingDetailsForChallengeId: '',
      details: {
        id: 12345,
        tag: 'v3-normalized-details',
      },
      checkpoints: null,
      loadingCheckpoints: false,
      loadingResultsForChallengeId: '',
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
      updatingChallengeUuid: '',
    });
  });

  test('Handles fetchSubmissionsDoneError as expected', () => {
    state = reducer(state, mockChallengeActions.challenge.getSubmissionsDoneError());
    expect(state).toEqual({
      fetchChallengeFailure: 'Unknown error',
      loadingSubmissionsForChallengeId: '',
      mySubmissions: { challengeId: '', v2: null },
      mySubmissionsManagement: {
        showDetails: [],
        deletingSubmission: false,
        showModal: false,
        toBeDeletedId: 0,
      },
      loadingDetailsForChallengeId: '',
      details: {
        id: 12345,
        tag: 'v3-normalized-details',
      },
      checkpoints: null,
      loadingCheckpoints: false,
      loadingResultsForChallengeId: '',
      registering: false,
      results: null,
      resultsLoadedForChallengeId: '',
      selectedTab: 'details',
      unregistering: false,
      updatingChallengeUuid: '',
    });
  });
}

describe('Default reducer', () => {
  beforeAll((done) => {
    reducers.default.then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer(defaultState);
});

jest.clearAllMocks();
jest.resetAllMocks();

describe('Factory without http request', () => {
  beforeAll((done) => {
    reducers.factory().then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer(defaultState);
});

describe('Factory with server-side rendering', () => {
  beforeAll((done) => {
    reducers.factory({
      cookies: {
        tcjwt: 'TcAuthTokenV2',
      },
      url: '/challenges/12345/my-submissions',
    }).then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer({
    details: {
      id: 12345,
      tag: 'v3-normalized-details',
    },
    checkpoints: null,
    loadingCheckpoints: false,
    loadingDetailsForChallengeId: '',
    loadingResultsForChallengeId: '',
    loadingSubmissionsForChallengeId: '',
    fetchChallengeFailure: false,
    mySubmissions: { challengeId: '12345', v2: [{ submissionId: '1' }] },
    mySubmissionsManagement: {
      showDetails: [],
      showModal: false,
      toBeDeletedId: 0,
    },
    registering: false,
    results: null,
    resultsLoadedForChallengeId: '',
    selectedTab: 'details',
    unregistering: false,
    updatingChallengeUuid: '',
  });
});

describe('Factory without server-side rendering', () => {
  beforeAll((done) => {
    reducers.factory({
      url: '/some-random-url',
    }).then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer(defaultState);
});

*/

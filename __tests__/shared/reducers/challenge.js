import chActions from 'actions/challenge';
import smpActions from 'actions/smp';

import defaultReducer, { factory } from 'reducers/challenge';
import { toFSA } from 'utils/redux';

let reducer = defaultReducer;

const mockFetch = (resolvesTo) => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => resolvesTo }));
};

jest.mock('utils/config', () => ({
  API: {
    V2: 'API-URL-V2',
    V3: 'API-URL-V3',
  },
}));

function testReducer(expectedInitialState) {
  let state;

  test('creates expected initial state', () => {
    state = reducer(undefined, {});
    // console.log(state);
    expect(state).toEqual(expectedInitialState);
  });

  test('properly handles fetch challenge init', () => {
    state = reducer(state, chActions.fetchChallengeInit());
    expect(state.details).toBeNull();
    expect(state.loadingDetails).toBeTruthy();
  });

  test('properly handles challenge loading with success', () => {
    mockFetch({ result: { content: ['EXPECTED_PAYLOAD'] } });

    return toFSA(chActions.fetchChallengeDone({})).then((action) => {
      state = reducer(state, action);
      expect(state.details).toEqual('EXPECTED_PAYLOAD');
      expect(state.loadingDetails).toBeFalsy();
    });
  });

  test('properly handles fetch submissions init', () => {
    state = reducer(state, chActions.fetchSubmissionsInit());

    expect(state.mySubmissions).toEqual({ v2: null });
    expect(state.loadingMySubmissions).toBeTruthy();
  });

  test('properly handles submissions loading with success', () => {
    mockFetch({ submissions: 'EXPECTED_PAYLOAD' });

    return toFSA(chActions.fetchSubmissionsDone({})).then((action) => {
      state = reducer(state, action);

      expect(state.mySubmissions).toEqual({ v2: 'EXPECTED_PAYLOAD' });
      expect(state.loadingMySubmissions).toBeFalsy();
    });
  });

  test('properly handles deleteSubmissionDone', () => {
    state = reducer({
      mySubmissions: { v2: [{ submissionId: 'TO_BE_DELETED' }] },
    }, {});

    return toFSA(smpActions.smp.deleteSubmissionDone(null, 'TO_BE_DELETED')).then((action) => {
      state = reducer(state, action);

      expect(state.mySubmissions.v2.length).toEqual(0);
    });
  });
}

describe('default reducer', () => {
  mockFetch({});
  reducer = defaultReducer;

  testReducer({ mySubmissionsManagement: {} });
});

describe('factory without http request', () => {
  mockFetch({ hoho: 'hoho' });
  beforeAll((done) => {
    const req = 'arbitrary request';
    factory(req).then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer({
    details: null,
    loadingDetails: false,
    loadingMySubmissions: false,
    mySubmissions: {
      v2: null,
    },
    mySubmissionsManagement: {
      showDetails: [],
      showModal: false,
      toBeDeletedId: 0,
    },
  });
});

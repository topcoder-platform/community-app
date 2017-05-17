import actions from 'actions/leaderboard';
import defaultReducer, { factory } from 'reducers/leaderboard';
import { toFSA } from 'utils/redux';

const DUMMY_PAYLOAD = [{ 'user.handle': 'fake.username' }];
const DUMMY_AUTH = { tokenV3: 'token' };
const DUMMY_LEADERBOARD_API_URL = 'some/api/url';

const fetchFailureMock = jest.fn(() =>
  Promise.reject(new Error('ERROR')),
);

const fetchSuccessMock = jest.fn(() =>
  Promise.resolve({
    json: () => (DUMMY_PAYLOAD),
  }),
);

function testReducer(reducer, expectedInitialState) {
  let state;

  test('creates expected initial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(expectedInitialState);
  });

  test('properly handles fetch leaderboard init', () => {
    state = reducer(state, actions.leaderboard.fetchLeaderboardInit());
    expect(state).toEqual({
      data: null,
      failed: false,
      loading: true,
      loadedApiUrl: null,
    });
  });

  test('properly handles data loading with success', () => {
    global.fetch = fetchSuccessMock;
    return toFSA(actions.leaderboard.fetchLeaderboardDone(DUMMY_AUTH, DUMMY_LEADERBOARD_API_URL))
      .then((action) => {
        state = reducer(state, action);
        expect(state).toEqual({
          data: DUMMY_PAYLOAD,
          failed: false,
          loading: false,
          loadedApiUrl: DUMMY_LEADERBOARD_API_URL,
        });
      });
  });

  test('properly handles data loading with failure', () => {
    global.fetch = fetchFailureMock;
    return toFSA(actions.leaderboard.fetchLeaderboardDone(DUMMY_AUTH, DUMMY_LEADERBOARD_API_URL))
      .then((action) => {
        state = reducer(state, action);
        expect(state).toEqual({
          data: null,
          failed: true,
          loading: false,
          loadedApiUrl: null,
        });
      });
  });
}

global.fetch = fetchSuccessMock;
describe('default reducer', () => testReducer(defaultReducer, {}));

global.fetch = fetchSuccessMock;
describe('factory without http request', () =>
  factory().then(res => testReducer(res, {})),
);

global.fetch = fetchSuccessMock;
describe('factory with matching http request and success response', () =>
  factory({
    url: '/leaderboard',
  }).then(res =>
    testReducer(res, {
      data: DUMMY_PAYLOAD,
      failed: false,
      loading: false,
      loadedApiUrl: '/leaderboard',
    }),
  ),
);

global.fetch = fetchFailureMock;
describe('factory with matching http request and network failure', () =>
  factory({
    url: '/leaderboard',
  }).then(res =>
    testReducer(res, {
      data: null,
      failed: true,
      loading: false,
      loadedApiUrl: null,
    }),
  ),
);

import { mock } from 'topcoder-react-lib';

const { mockAction } = mock;

const mockMetaActions = {
  tcCommunities: {
    meta: {
      mobileToggle: mockAction('TC_COMMUNITIES/META/MOBILE_TOGGLE'),
      fetchDataInit: mockAction('TC_COMMUNITIES/META/FETCH_DATA_INIT', 'test-community'),
      fetchDataDone: mockAction(
        'TC_COMMUNITIES/META/FETCH_DATA_DONE',
        Promise.resolve('payload'),
      ),
    },
  },
};
jest.setMock(require.resolve('actions/tc-communities/meta'), mockMetaActions);

const reducers = require('reducers/tc-communities/meta');

beforeEach(() => jest.clearAllMocks());

function testReducer(reducer, istate) {
  let state;

  test('Creates expected intial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(istate);
  });

  test('Handles fetchDataInit as expected', () => {
    state = reducer(state, mockMetaActions.tcCommunities.meta.fetchDataInit());
    expect(state).toEqual({
      data: {},
      lastUpdateOfMetaData: 0,
      loadingMetaDataForCommunityId: 'test-community',
    });
  });

  test('Handles mobileToggle as expected', () => {
    state = reducer(state, mockMetaActions.tcCommunities.meta.mobileToggle());
    expect(state.isMobileOpen).toBeTruthy();

    state = reducer(state, mockMetaActions.tcCommunities.meta.mobileToggle());
    expect(state.isMobileOpen).toBeFalsy();
  });
}

const INITIAL_STATE = {
  data: {},
  lastUpdateOfMetaData: 0,
  loadingMetaDataForCommunityId: '',
};

describe('Default reducer', () => {
  testReducer(reducers.default, INITIAL_STATE);
});

describe('Factory without http request', () =>
  reducers.factory().then(res =>
    testReducer(res, INITIAL_STATE)));

describe('Factory with server-side rendering', () =>
  reducers.factory({
    url: '/community/communityId/header',
  }).then(res =>
    testReducer(res, INITIAL_STATE)));

describe('Factory without server-side rendering', () =>
  reducers.factory({
    url: '/some-random-url',
  }).then(res =>
    testReducer(res, INITIAL_STATE)));

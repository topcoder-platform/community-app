import { mockAction } from 'utils/mock';

const mockHeaderActions = {
  tcCommunities: {
    header: {
      mobileToggle: mockAction('TC_COMMUNITIES/HEADER/MOBILE_TOGGLE'),
      fetchDataInit: mockAction('TC_COMMUNITIES/HEADER/FETCH_DATA_INIT'),
      fetchDataDone: mockAction(
        'TC_COMMUNITIES/HEADER/FETCH_DATA_DONE',
        Promise.resolve('payload'),
      ),
    },
  },
};
jest.setMock(require.resolve('actions/tc-communities/header'), mockHeaderActions);

const reducers = require('reducers/tc-communities/header');

beforeEach(() => jest.clearAllMocks());

function testReducer(reducer, istate) {
  let state;

  test('Creates expected intial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(istate);
  });

  test('Handles fetchDataInit as expected', () => {
    state = reducer(state, mockHeaderActions.tcCommunities.header.fetchDataInit());
    expect(state).toEqual({
      communityId: null,
      logoUrl: null,
      menuItems: [],
      failed: false,
      loading: true,
      cssUrl: null,
    });
  });

  test('Handles mobileToggle as expected', () => {
    state = reducer(state, mockHeaderActions.tcCommunities.header.mobileToggle());
    expect(state.isMobileOpen).toBeTruthy();

    state = reducer(state, mockHeaderActions.tcCommunities.header.mobileToggle());
    expect(state.isMobileOpen).toBeFalsy();
  });
}

describe('Default reducer', () => {
  testReducer(reducers.default, {});
});

describe('Factory without http request', () =>
  reducers.factory().then(res =>
    testReducer(res, {}),
  ),
);

describe('Factory with server-side rendering', () =>
  reducers.factory({
    url: '/community/communityId/header',
  }).then(res =>
    testReducer(res, {}),
  ),
);

describe('Factory without server-side rendering', () =>
  reducers.factory({
    url: '/some-random-url',
  }).then(res =>
    testReducer(res, {}),
  ),
);

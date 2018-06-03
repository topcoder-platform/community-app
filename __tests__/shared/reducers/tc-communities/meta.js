import mockDate from 'mockdate';
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

const reducer = require('reducers/tc-communities/meta');

beforeAll(() => {
  mockDate.set('2018-06-03T02:15:55Z');
});

beforeEach(() => jest.clearAllMocks());

afterAll(() => {
  mockDate.reset();
});

function testReducer(r) {
  let state;

  function check(action) {
    state = r(state, action);
    expect(state).toMatchSnapshot();
    mockDate.set(Date.now() + 1234);
  }

  test('Creates expected intial state', () => {
    check('@@INIT');
  });

  test('Handles fetchDataInit as expected', () => {
    check(mockMetaActions.tcCommunities.meta.fetchDataInit());
  });

  test('Handles mobileToggle as expected', () => {
    check(mockMetaActions.tcCommunities.meta.mobileToggle());
    check(state, mockMetaActions.tcCommunities.meta.mobileToggle());
  });
}

const INITIAL_STATE = {
  data: {},
  lastUpdateOfMetaData: 0,
  loadingMetaDataForCommunityId: '',
};

describe('Default reducer', () => {
  testReducer(reducer.default, INITIAL_STATE);
});

describe('Factory without http request', () =>
  reducer.factory().then(res =>
    testReducer(res, INITIAL_STATE)));

describe('Factory with server-side rendering', () =>
  reducer.factory({
    url: '/community/communityId/header',
  }).then(res =>
    testReducer(res, INITIAL_STATE)));

describe('Factory without server-side rendering', () =>
  reducer.factory({
    url: '/some-random-url',
  }).then(res =>
    testReducer(res, INITIAL_STATE)));

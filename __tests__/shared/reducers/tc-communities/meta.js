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

function testReducer(createReducer) {
  let resolvedReducer;
  let state;

  beforeAll(async () => {
    resolvedReducer = await createReducer();
  });

  function check(action) {
    state = resolvedReducer(state, action);
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

describe('Default reducer', () => {
  testReducer(() => reducer.default);
});

describe('Factory without http request', () => {
  testReducer(() => reducer.factory());
});

describe('Factory with server-side rendering', () => {
  testReducer(() => reducer.factory({
    url: '/community/communityId/header',
  }));
});

describe('Factory without server-side rendering', () => {
  testReducer(() => reducer.factory({
    url: '/some-random-url',
  }));
});

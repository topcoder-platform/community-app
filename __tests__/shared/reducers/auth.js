import { mockAction } from 'utils/mock';
import { redux } from 'topcoder-react-utils';

const dummy = 'DUMMY';

const mockActions = {
  auth: {
    loadProfile: mockAction('LOAD_PROFILE', Promise.resolve('Profile')),
    setTcTokenV2: mockAction('SET_TC_TOKEN_V2', 'Token V2'),
    setTcTokenV3: mockAction('SET_TC_TOKEN_V3', 'Token V3'),
  },
};
jest.setMock(require.resolve('actions/auth'), mockActions);

jest.setMock('tc-accounts', {
  decodeToken: () => 'User object',
  isTokenExpired: () => false,
});

const reducers = require('reducers/auth');

function testReducer(reducer, istate) {
  test('Initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(istate);
  });

  test('Load profile', () =>
    redux.resolveAction(mockActions.auth.loadProfile()).then((action) => {
      const state = reducer({ dummy }, action);
      expect(state).toEqual({
        authenticating: false,
        dummy,
        profile: 'Profile',
      });
    }));

  test('Set TC Token V2', () => {
    const state = reducer({ dummy }, mockActions.auth.setTcTokenV2());
    expect(state).toEqual({
      dummy,
      tokenV2: 'Token V2',
    });
  });

  test('Set TC Token V3', () => {
    const state = reducer({ dummy }, mockActions.auth.setTcTokenV3());
    expect(state).toEqual({
      dummy,
      tokenV3: 'Token V3',
      user: 'User object',
    });
  });

  test('Set TC Token V3 with failure', () => {
    mockActions.auth.setTcTokenV3 = mockAction('SET_TC_TOKEN_V3', null);
    const state = reducer({ dummy }, mockActions.auth.setTcTokenV3());
    expect(state).toEqual({
      dummy,
      tokenV3: null,
      user: null,
    });
    mockActions.auth.setTcTokenV3 = mockAction('SET_TC_TOKEN_V3', 'Token V3');
  });
}

describe('Default reducer', () => {
  testReducer(reducers.default, {
    authenticating: true,
  });
});

describe('Factory without server side rendering', () =>
  reducers.factory().then(res =>
    testReducer(res, {})));

describe('Factory with server side rendering', () =>
  reducers.factory({
    cookies: {
      tcjwt: 'Token V2',
      v3jwt: 'Token V3',
    },
  }).then(res =>
    testReducer(res, {})));

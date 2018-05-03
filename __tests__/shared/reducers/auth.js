import _ from 'lodash';
import { redux } from 'topcoder-react-utils';
import { actions, mock } from 'topcoder-react-lib';
import communityActions from 'actions/tc-communities';

const { mockAction } = mock;

const dummy = 'DUMMY';

const mockActions = {
  auth: {
    loadProfile: mockAction('LOAD_PROFILE', Promise.resolve({ groups: [{ id: '1' }] })),
    setTcTokenV2: mockAction('SET_TC_TOKEN_V2', 'Token V2'),
    setTcTokenV3: mockAction('SET_TC_TOKEN_V3', 'Token V3'),
  },
};

_.merge(actions, mockActions);

jest.setMock('tc-accounts', {
  decodeToken: () => 'User object',
  isTokenExpired: () => false,
});

const mockCommunityActions = {
  tcCommunity: {
    joinDone: mockAction('JOIN_DONE', Promise.resolve({ groupId: '2' })),
  },
};
_.merge(communityActions, mockCommunityActions);

const reducers = require('reducers/auth');

let reducer;

function testReducer(istate) {
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
        profile: { groups: [{ id: '1' }] },
      });
    }));

  test('Join group', () =>
    redux.resolveAction(communityActions.tcCommunity.joinDone()).then((action) => {
      const state = reducer({ profile: { groups: [{ id: '1' }] } }, action);
      expect(state).toEqual({
        profile: { groups: [{ id: '1' }, { id: '2' }] },
      });
    }));
}

describe('Default reducer', () => {
  beforeAll((done) => {
    reducers.default.then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer({
    authenticating: true,
    tokenV2: '',
    tokenV3: '',
    user: null,
  });
});

describe('Factory without server side rendering', () => {
  beforeAll((done) => {
    reducers.factory().then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer({
    authenticating: true,
    tokenV2: '',
    tokenV3: '',
    user: null,
  });
});

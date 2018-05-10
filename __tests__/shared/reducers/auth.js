import { mockAction } from 'utils/mock';
import { redux } from 'topcoder-react-utils';

const dummy = 'DUMMY';
const handle = 'tcscoder';
const photoURL = 'http://url';

const mockActions = {
  auth: {
    loadProfile: mockAction('LOAD_PROFILE', Promise.resolve('Profile')),
    setTcTokenV2: mockAction('SET_TC_TOKEN_V2', 'Token V2'),
    setTcTokenV3: mockAction('SET_TC_TOKEN_V3', 'Token V3'),
  },
  profile: {
    uploadPhotoDone: mockAction('UPLOAD_PHOTO_DONE', Promise.resolve({ handle, photoURL })),
    deletePhotoDone: mockAction('DELETE_PHOTO_DONE', Promise.resolve({ handle })),
    updateProfileDone: mockAction('UPDATE_PROFILE_DONE', Promise.resolve({ handle, photoURL: 'http://newurl' })),
  },
};
jest.setMock(require.resolve('actions/auth'), mockActions);
jest.setMock(require.resolve('actions/profile'), mockActions);

jest.setMock('tc-accounts', {
  decodeToken: () => 'User object',
  isTokenExpired: () => false,
});

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

  test('Upload photo', () =>
    redux.resolveAction(mockActions.profile.uploadPhotoDone()).then((action) => {
      const state = reducer({ profile: { handle } }, action);
      expect(state).toEqual({
        profile: {
          handle,
          photoURL,
        },
      });
    }));

  test('Delete photo', () =>
    redux.resolveAction(mockActions.profile.deletePhotoDone()).then((action) => {
      const state = reducer({ profile: { handle, photoURL } }, action);
      expect(state).toEqual({
        profile: {
          handle,
          photoURL: null,
        },
      });
    }));

  test('Update profile', () =>
    redux.resolveAction(mockActions.profile.updateProfileDone()).then((action) => {
      const state = reducer({ profile: { handle, photoURL } }, action);
      expect(state).toEqual({
        profile: {
          handle,
          photoURL: 'http://newurl',
        },
      });
    }));
}

describe('Default reducer', () => {
  reducer = reducers.default;
  testReducer({ authenticating: true });
});

describe('Factory without server side rendering', () => {
  beforeAll((done) => {
    reducers.factory().then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer({
    authenticating: true, user: null, tokenV2: '', tokenV3: '',
  });
});

describe('Factory with server side rendering', () => {
  beforeAll((done) => {
    reducers.factory({
      cookies: {
        tcjwt: 'Token V2',
        v3jwt: 'Token V3',
      },
    }).then((res) => {
      reducer = res;
      done();
    });
  });

  testReducer({
    authenticating: false, user: 'User object', profile: 'Profile', tokenV2: 'Token V2', tokenV3: 'Token V3',
  });
});

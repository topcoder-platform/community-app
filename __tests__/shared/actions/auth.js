jest.setMock('isomorphic-fetch', {});

const GROUPS_REQ_URL =
  'https://api.topcoder-dev.com/v3/groups?memberId=12345&membershipType=user';
const PROFILE_REQ_URL = 'https://api.topcoder-dev.com/v3/members/username12345';

global.fetch = jest.fn(url => Promise.resolve({
  json: () => {
    let content;
    switch (url) {
      case GROUPS_REQ_URL: content = ['Group1', 'Group2']; break;
      case PROFILE_REQ_URL: content = { userId: 12345 }; break;
      default: throw new Error('Unexpected URL!');
    }
    return {
      result: { content, status: 200 },
    };
  },
}));

jest.setMock('tc-accounts', {
  decodeToken: token => (token === 'token' ? {
    handle: 'username12345',
    userId: '12345',
  } : undefined),
});

const actions = require('actions/auth').default;

describe('fetch with success response', () => {
  beforeEach(() => jest.clearAllMocks());

  test('auth.loadProfile works as expected when authenticated', () => {
    const action = actions.auth.loadProfile('token');
    expect(action.type).toBe('AUTH/LOAD_PROFILE');
    return action.payload.then((res) => {
      expect(global.fetch).toHaveBeenCalledWith(
        PROFILE_REQ_URL, {
          headers: {
            Authorization: 'Bearer token',
            'Content-Type': 'application/json',
          },
        },
      );
      expect(global.fetch).toHaveBeenCalledWith(
        GROUPS_REQ_URL, {
          headers: {
            Authorization: 'Bearer token',
            'Content-Type': 'application/json',
          },
        },
      );
      expect(res).toEqual({
        groups: ['Group1', 'Group2'],
        userId: 12345,
      });
    });
  });

  test('auth.loadProfile with empty token', () => {
    const action = actions.auth.loadProfile('');
    expect(action.type).toBe('AUTH/LOAD_PROFILE');
    return action.payload.then((res) => {
      expect(res).toBe(null);
    });
  });
});

describe('fetch with failed response', () => {
  beforeAll(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => ({
        result: { status: 404 },
      }),
    }));
  });

  test('fetch return 404', () => {
    const action = actions.auth.loadProfile('token');
    expect(action.type).toBe('AUTH/LOAD_PROFILE');
    return action.payload.then((res) => {
      expect(res).toEqual({
        groups: [],
      });
    });
  });
});

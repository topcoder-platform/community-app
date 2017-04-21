jest.setMock('isomorphic-fetch', {});

global.fetch = jest.fn(() => Promise.resolve({
  json: () => ({
    result: {
      content: 'CONTENT',
    },
  }),
}));

jest.setMock('tc-accounts', {
  decodeToken: token => (token === 'token' ? {
    handle: 'username12345',
  } : undefined),
});

const actions = require('actions/auth').default;

beforeEach(() => jest.clearAllMocks());

test('auth.loadProfile works as expected when authenticated', () => {
  const action = actions.auth.loadProfile('token');
  expect(action.type).toBe('AUTH/LOAD_PROFILE');
  return action.payload.then((res) => {
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.topcoder-dev.com/v3/members/username12345', {
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
        },
      },
    );
    expect(res).toBe('CONTENT');
  });
});

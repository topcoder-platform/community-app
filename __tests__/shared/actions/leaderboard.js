import actions from 'actions/leaderboard';

const mockFetch = resolvesTo => jest.fn(() =>
  Promise.resolve({ json: () => resolvesTo }));

let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('challenge.fetchLeaderboardInit', () => {
  const a = actions.leaderboard.fetchLeaderboardInit();

  test('has expected type', () => {
    expect(a.type).toBe('LEADERBOARD/FETCH_LEADERBOARD_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('challenge.fetchLeaderboardDone', () => {
  global.fetch = mockFetch([{ 'user.handle': 'fake.username' }]);

  const a = actions.leaderboard.fetchLeaderboardDone({});

  test('has expected type', () => {
    expect(a.type).toBe('LEADERBOARD/FETCH_LEADERBOARD_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res[0]['user.handle']).toEqual('fake.username')));
});

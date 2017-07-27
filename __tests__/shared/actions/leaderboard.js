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

describe('leaderboard.fetchLeaderboardInit', () => {
  const a = actions.leaderboard.fetchLeaderboardInit();

  test('has expected type', () => {
    expect(a.type).toBe('LEADERBOARD/FETCH_LEADERBOARD_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('leaderboard.fetchLeaderboardDone', () => {
  global.fetch = mockFetch([{ 'user.handle': 'fake.username' }]);

  const a = actions.leaderboard.fetchLeaderboardDone({}, '');

  test('has expected type', () => {
    expect(a.type).toBe('LEADERBOARD/FETCH_LEADERBOARD_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res.data[0]['user.handle']).toEqual('fake.username')));
});

describe('leaderboard.fetchLeaderboardDone with token', () => {
  global.fetch = mockFetch([{ 'user.handle': 'fake.username' }]);

  const a = actions.leaderboard.fetchLeaderboardDone({ tokenV3: 'token' }, '');

  test('has expected type', () => {
    expect(a.type).toBe('LEADERBOARD/FETCH_LEADERBOARD_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res.data[0]['user.handle']).toEqual('fake.username')));
});


describe('leaderboard.fetchLeaderboardDone with mocky', () => {
  global.fetch = mockFetch([{ 'user.handle': 'fake.username' }]);

  const a = actions.leaderboard.fetchLeaderboardDone({}, 'http://www.mocky.io');

  test('has expected type', () => {
    expect(a.type).toBe('LEADERBOARD/FETCH_LEADERBOARD_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res.data[0]['user.handle']).toEqual('fake.username')));
});

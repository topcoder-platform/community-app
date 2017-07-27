import dashboardActions from 'actions/dashboard';

const actions = dashboardActions.dashboard;

const mockFetch = (ok, resolvesTo) => jest.fn(() =>
  Promise.resolve({ ok, json: () => resolvesTo }));

jest.mock('utils/config', () => ({
  API: {
    V2: 'API-URL-V2',
    V3: 'API-URL-V3',
  },
  URL: {
    BLOG: 'BLOG',
  },
}));

let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
  delete process.env.FRONT_END;
});

describe('dashboard.getSubtrackRanksInit', () => {
  const a = actions.getSubtrackRanksInit();

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_SUBTRACK_RANKS_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('dashboard.getSrmsInit', () => {
  const a = actions.getSrmsInit();

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_SRMS_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('dashboard.getBlogsInit', () => {
  const a = actions.getBlogsInit();

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_BLOGS_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('dashboard.getSubtrackRanksDone', () => {
  global.fetch = mockFetch(true, { result: { status: 200, content: {} } });

  const a = actions.getSubtrackRanksDone('token', 'handle');

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_SUBTRACK_RANKS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual([])));
});

describe('dashboard.getSrmsDone with user', () => {
  global.fetch = mockFetch(true, { result: { status: 200, content: [{ id: '1' }] } });

  const a = actions.getSrmsDone('token', 'handle');

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_SRMS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual([{ currentPhase: 'CODING', id: '1', userStatus: 'registered' }])));
});

describe('dashboard.getSrmsDone without user', () => {
  global.fetch = mockFetch(true, { result: { status: 200, content: [{ id: '1' }] } });

  const a = actions.getSrmsDone('token', '');

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_SRMS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual([{ id: '1' }])));
});

describe('dashboard.getIosRegistration with registered', () => {
  global.fetch = mockFetch(true, { result: { status: 200, content: true } });

  const a = actions.getIosRegistration('token', 'userId');

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_IOS_REGISTRATION');
  });

  test('payload is a promise which resolves to the expected value', () =>
    a.payload.then(res => expect(res).toEqual(true)));
});

describe('dashboard.getIosRegistration with unregistered', () => {
  global.fetch = mockFetch(true, { result: { status: 200, content: false } });

  const a = actions.getIosRegistration('token', 'userId');

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_IOS_REGISTRATION');
  });

  test('payload is a promise which resolves to the expected value', () =>
    a.payload.then(res => expect(res).toEqual(false)));
});


describe('dashboard.getBlogsDone with data', () => {
  process.env.FRONT_END = '';
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, text: () => '<rss><channel><item></item><item></item></channel></rss>' }));

  const a = actions.getBlogsDone();

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_BLOGS_DONE');
  });

  test('payload is a promise which resolves to the expected value', () =>
    a.payload.then(res => expect(res).toEqual([{}, {}])));
});

describe('dashboard.getBlogsDone with error', () => {
  process.env.FRONT_END = '';
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, statusText: 'Wrong text' }));

  const a = actions.getBlogsDone();

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_BLOGS_DONE');
  });

  test('payload is a promise which resolves to the expected value', () =>
    a.payload.catch(res => expect(res.toString()).toMatch('Error')));
});

describe('dashboard.registerIos', () => {
  global.fetch = mockFetch(true, { result: { status: 200, content: false } });

  const a = actions.registerIos('token', 'userId');

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/REGISTER_IOS');
  });

  test('payload is a promise which resolves to the expected value', () =>
    a.payload.then(res => expect(res).toEqual(false)));
});

describe('dashboard.getUserFinancials', () => {
  global.fetch = mockFetch(true, { result: { status: 200, content: [{ amount: 1 }] } });

  const a = actions.getUserFinancials('token', 'handle');

  test('has expected type', () => {
    expect(a.type).toBe('DASHBOARD/GET_USER_FINANCIALS');
  });

  test('payload is a promise which resolves to the expected value', () =>
    a.payload.then(res => expect(res).toEqual(1)));
});

import actions from 'actions/tc-communities/news';

afterAll(() => {
  delete process.env.FRONT_END;
});

describe('tcCommunities.news.getNewsDone', () => {
  process.env.FRONT_END = true;
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    text: () => '<xml></xml>',
  }));

  const a = actions.tcCommunities.news.getNewsDone();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/NEWS/GET_NEWS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual({ xml: {} })));
});

describe('tcCommunities.news.getNewsDone with error response', () => {
  process.env.FRONT_END = true;
  global.fetch = jest.fn(() => Promise.resolve({
    ok: false,
    statusText: 'error',
  }));

  const a = actions.tcCommunities.news.getNewsDone();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/NEWS/GET_NEWS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.catch(res => expect(res.toString()).toMatch('Error')));
});

import actions from 'actions/tc-communities/header';

const mockFetch = (resolvesTo, is404) => jest.fn(() => (
  is404
    ? Promise.resolve({ json: () => resolvesTo, status: 404 })
    : Promise.resolve({ json: () => resolvesTo, status: 200 })
));

let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('tcCommunities.header.mobileToggle', () => {
  const a = actions.tcCommunities.header.mobileToggle();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/HEADER/MOBILE_TOGGLE');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('tcCommunities.header.fetchDataInit', () => {
  const a = actions.tcCommunities.header.fetchDataInit();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/HEADER/FETCH_DATA_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('tcCommunities.header.fetchDataDone', () => {
  global.fetch = mockFetch({ communityId: 'someId' });

  const a = actions.tcCommunities.header.fetchDataDone('someId');

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/HEADER/FETCH_DATA_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual({ communityId: 'someId' })));

  global.fetch = mockFetch({ communityId: 'someId' }, true);

  const a404 = actions.tcCommunities.header.fetchDataDone('someId');

  test('has expected type', () => {
    expect(a404.type).toBe('TC_COMMUNITIES/HEADER/FETCH_DATA_DONE');
  });

  test('payload is a promise which rejects to the expected object', () =>
    a404.payload.catch(err => expect(err).toEqual({ communityId: 'someId', error: '404' })));
});

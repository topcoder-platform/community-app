import actions from 'actions/tc-communities/meta';

/*
  As test are being run in server environment
  we have to mock getCommunitiesMetadata function which is used in this case
  by header actions
 */
jest.mock('utils/tc', () => ({
  getCommunitiesMetadata: communityId => (
    communityId !== 'someId404'
      ? Promise.resolve({ communityId })
      : Promise.reject({ communityId, error: '404' })
  ),
}));

afterAll(() => {
  delete process.env.FRONT_END;
});

describe('tcCommunities.meta.mobileToggle', () => {
  const a = actions.tcCommunities.meta.mobileToggle();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/META/MOBILE_TOGGLE');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('tcCommunities.meta.fetchDataInit', () => {
  const a = actions.tcCommunities.meta.fetchDataInit();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/META/FETCH_DATA_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('tcCommunities.meta.fetchDataDone', () => {
  const a = actions.tcCommunities.meta.fetchDataDone('someId');

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/META/FETCH_DATA_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual({ communityId: 'someId' })));

  const a404 = actions.tcCommunities.meta.fetchDataDone('someId404');

  test('has expected type', () => {
    expect(a404.type).toBe('TC_COMMUNITIES/META/FETCH_DATA_DONE');
  });

  test('payload is a promise which rejects to the expected object', () =>
    a404.payload.catch(err => expect(err).toEqual({ communityId: 'someId404', error: '404' })));
});

describe('tcCommunities.meta.fetchDataDone at frontend', () => {
  global.fetch = jest.fn(() => Promise.resolve({
    status: 200,
    json: () => 'dummy',
  }));
  process.env.FRONT_END = true;

  const a = actions.tcCommunities.meta.fetchDataDone('someId');

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/META/FETCH_DATA_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual('dummy')));
});

describe('tcCommunities.meta.fetchDataDone at frontend with 404 response', () => {
  global.fetch = jest.fn(() => Promise.resolve({
    status: 404,
    json: () => 'dummy',
  }));
  process.env.FRONT_END = true;

  const a = actions.tcCommunities.meta.fetchDataDone('someId');

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/META/FETCH_DATA_DONE');
  });

  test('payload is a promise which rejects', () =>
    expect(a.payload).rejects.toBeDefined());
});

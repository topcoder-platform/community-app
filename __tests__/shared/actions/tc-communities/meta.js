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

describe('tcCommunities.header.mobileToggle', () => {
  const a = actions.tcCommunities.meta.mobileToggle();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/META/MOBILE_TOGGLE');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('tcCommunities.header.fetchDataInit', () => {
  const a = actions.tcCommunities.meta.fetchDataInit();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/META/FETCH_DATA_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('tcCommunities.header.fetchDataDone', () => {
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

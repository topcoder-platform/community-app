import actions from 'actions/tc-communities/meta';

/*
  As test are being run in server environment
  we have to mock getCommunitiesMetadata function which is used in this case
  by header actions
 */
jest.mock('services/communities', () => ({
  getService: () => ({
    getMetadata: communityId => (
      communityId !== 'someId404'
        ? Promise.resolve({ communityId })
        : Promise.reject({ communityId, error: '404' }) // eslint-disable-line prefer-promise-reject-errors
    ),
  }),
}));

describe('tcCommunities.meta.mobileToggle', () => {
  const a = actions.tcCommunities.meta.mobileToggle();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/META/MOBILE_TOGGLE');
  });

  test('payload is undefined', () => expect(a.payload).toBeUndefined());
});

describe('tcCommunities.meta.fetchDataInit', () => {
  const a = actions.tcCommunities.meta.fetchDataInit();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITIES/META/FETCH_DATA_INIT');
  });

  test('payload is undefined', () => expect(a.payload).toBeUndefined());
});

describe('tcCommunities.meta.fetchDataDone', () => {
  test('resolves metadata with the operation id', async () => {
    const action = actions.tcCommunities.meta.fetchDataDone('someId');
    expect(action.type).toBe('TC_COMMUNITIES/META/FETCH_DATA_DONE');
    await expect(action.payload).resolves.toEqual({
      data: { communityId: 'someId' },
      loadingOperationId: 'someId',
      timestamp: expect.any(Number),
    });
  });

  test('propagates metadata failures', async () => {
    const action = actions.tcCommunities.meta.fetchDataDone('someId404');
    await expect(action.payload).rejects.toEqual({ communityId: 'someId404', error: '404' });
  });
});

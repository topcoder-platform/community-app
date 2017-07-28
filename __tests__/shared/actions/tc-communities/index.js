import actions from 'actions/tc-communities/index';

describe('tcCommunity.joinDone at frontend with 404 response', () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => ({
      result: {
        status: 200,
        content: 'dummy',
      },
    }),
  }));

  const a = actions.tcCommunity.joinDone();

  test('has expected type', () => {
    expect(a.type).toBe('TC_COMMUNITY/JOIN_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual('dummy')));
});

import actions from 'actions/challenge';

const mockFetch = (resolvesTo) => jest.fn(() =>
  Promise.resolve({json: () => resolvesTo}));

describe('challenge.fetchChallengeInit', () => {
  const a = actions.fetchChallengeInit();

  test('has expected type', () => {
    expect(a.type).toBe('FETCH_CHALLENGE_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('challenge.fetchSubmissionsInit', () => {
  const a = actions.fetchSubmissionsInit();

  test('has expected type', () => {
    expect(a.type).toBe('FETCH_SUBMISSIONS_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('challenge.fetchChallengeDone', () => {
  global.fetch = mockFetch({result: {content: ['DUMMY DATA']}});

  const a = actions.fetchChallengeDone({});

  test('has expected type', () => {
    expect(a.type).toBe('FETCH_CHALLENGE_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual('DUMMY DATA')));
});


describe('challenge.fetchSubmissionsDone', () => {
  global.fetch = mockFetch({submissions: 'DUMMY DATA'});

  const a = actions.fetchSubmissionsDone({});

  test('has expected type', () => {
    expect(a.type).toBe('FETCH_SUBMISSIONS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual('DUMMY DATA')));
});

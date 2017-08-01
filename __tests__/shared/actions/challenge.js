import actions from 'actions/challenge';

const mockFetch = resolvesTo => jest.fn(() =>
  Promise.resolve({ json: () => resolvesTo }));

jest.mock('utils/config', () => ({
  API: {
    V2: 'API-URL-V2',
    V3: 'API-URL-V3',
  },
}));

let originalFetch;

beforeAll(() => {
  originalFetch = global.fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('challenge.fetchChallengeInit', () => {
  const a = actions.challenge.getDetailsInit(12345);

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE/GET_DETAILS_INIT');
  });

  test('payload is the challenge ID, converted to string, if necessary', () =>
    expect(a.payload).toBe('12345'));
});

describe('challenge.fetchSubmissionsInit', () => {
  const a = actions.challenge.getSubmissionsInit();

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE/GET_SUBMISSIONS_INIT');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('challenge.getDetailsDone', () => {
  global.fetch = mockFetch({ result: { content: ['DUMMY DATA'] } });

  const a = actions.challenge.getDetailsDone(12345);

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE/GET_DETAILS_DONE');
  });

  /* TODO: This test does not work anymore, as the action was refactored to
   * use challenges service for API v3 calls, while API v2 calls still happen
   * the way they used to. Thus, we need a better mock of fetch to test it,
   * or some alternative approach. */
  test.skip('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual(
      ['DUMMY DATA', { result: { content: ['DUMMY DATA'] } }, {}])));
});


describe('challenge.fetchSubmissionsDone', () => {
  global.fetch = mockFetch({ submissions: 'DUMMY DATA' });

  const a = actions.challenge.getSubmissionsDone({});

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE/GET_SUBMISSIONS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual('DUMMY DATA')));
});

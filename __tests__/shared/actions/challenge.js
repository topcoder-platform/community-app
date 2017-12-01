import actions from 'actions/challenge';

jest.mock('services/challenges');

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
  const a = actions.challenge.getSubmissionsInit(12345);

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE/GET_SUBMISSIONS_INIT');
  });

  test('payload is challengeId', () =>
    expect(a.payload).toBe('12345'));
});

describe('challenge.getDetailsDone', () => {
  global.fetch = mockFetch({ result: { content: ['DUMMY DATA'] } });

  const a = actions.challenge.getDetailsDone(12345);

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE/GET_DETAILS_DONE');
  });

  const mockChallenge =
    require('services/__mocks__/data/challenge-normalized.json');
  mockChallenge.communities = new Set(mockChallenge.communities);

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual(mockChallenge)),
  );
});

describe('challenge.fetchSubmissionsDone', () => {
  global.fetch = mockFetch({
    challengeId: '12345',
    submissions: 'DUMMY DATA',
  });

  const a = actions.challenge.getSubmissionsDone(12345, {});

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE/GET_SUBMISSIONS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual({
      challengeId: '12345',
      submissions: 'DUMMY DATA',
    })));
});

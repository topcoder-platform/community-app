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

  const mockChallenge =
    require('services/__mocks__/data/challenges-v3.json').result.content[0];

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toEqual([
      mockChallenge, {
        submissions: 'DUMMY DATA',
      }, undefined,
    ])),
  );
});

describe('challenge.fetchSubmissionsDone', () => {
  global.fetch = mockFetch({ submissions: 'DUMMY DATA' });

  const a = actions.challenge.getSubmissionsDone({});

  test('has expected type', () => {
    expect(a.type).toBe('CHALLENGE/GET_SUBMISSIONS_DONE');
  });

  test('payload is a promise which resolves to the expected object', () =>
    a.payload.then(res => expect(res).toBe('DUMMY DATA')));
});

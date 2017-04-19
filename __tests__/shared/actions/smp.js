import actions from 'actions/smp';

jest.mock('utils/config', () => ({
  API: {
    V2: 'https://api.topcoder-dev.com/v2',
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

describe('smp.showDetails', () => {
  const a = actions.smp.showDetails('PAYLOAD');

  test('has expected type', () => {
    expect(a.type).toBe('SMP/SHOW_DETAILS');
  });

  test('payload is identity', () =>
    expect(a.payload).toEqual('PAYLOAD'));
});

describe('smp.cancelDelete', () => {
  const a = actions.smp.cancelDelete('PAYLOAD');

  test('has expected type', () => {
    expect(a.type).toBe('SMP/CANCEL_DELETE');
  });

  test('payload is undefined', () =>
    expect(a.payload).toBeUndefined());
});

describe('smp.confirmDelete', () => {
  const a = actions.smp.confirmDelete('PAYLOAD');

  test('has expected type', () => {
    expect(a.type).toBe('SMP/CONFIRM_DELETE');
  });

  test('payload is identity', () =>
    expect(a.payload).toEqual('PAYLOAD'));
});

describe('smp.deleteSubmissionDone', () => {
  const a = actions.smp.deleteSubmissionDone('challengeId', 'submissionId');

  test('has expected type', () => {
    expect(a.type).toBe('SMP/DELETE_SUBMISSION_DONE');
  });

  test('payload be submissionId', () =>
    a.payload.then(res => expect(res).toEqual('submissionId')));
});

describe('smp.downloadSubmission', () => {
  global.fetch = resolvesTo => Promise.resolve({
    json: () => Promise.resolve(resolvesTo),
  });

  const a = actions.smp.downloadSubmission({}, 'design', 'submissionId');

  test('has expected type', () => {
    expect(a.type).toBe('SMP/DOWNLOAD_SUBMISSION');
  });

  test('payload be submissionId', () =>
    a.payload.then(res => expect(res).toEqual('https://api.topcoder-dev.com/v2/design/download/submissionId?submissionType=original')));
});

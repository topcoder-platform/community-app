import actions from 'actions/smp';

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
  global.fetch = jest.fn(() => Promise.resolve());

  const a = actions.smp.deleteSubmissionDone('Token V3', 'submissionId');

  test('has expected type', () => {
    expect(a.type).toBe('SMP/DELETE_SUBMISSION_DONE');
  });

  test('Calls the correct endpoint', () => {
    expect(global.fetch).toHaveBeenCalledWith('https://api.topcoder-dev.com/v3/submissions/submissionId', {
      headers: {
        Authorization: 'Bearer Token V3',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
  });

  test('payload be submissionId', () =>
    a.payload.then(res => expect(res).toEqual('submissionId')));
});

describe('smp.downloadSubmission', () => {
  test('does not throw', () => {
    expect(() =>
      actions.smp.downloadSubmission({}, 'design', '12345')).not.toThrow();
  });
});

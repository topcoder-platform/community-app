/* eslint-env jest */
import {
  getSubmissionLimit,
  getSubmissionLimitReachedMessage,
} from '../../../../src/shared/utils/challenge-detail/submission-limit';

describe('getSubmissionLimit', () => {
  test('returns null when submission-limit metadata is missing', () => {
    expect(getSubmissionLimit([])).toBeNull();
  });

  test('returns null for the current unlimited payload', () => {
    expect(getSubmissionLimit([{
      name: 'submissionLimit',
      value: JSON.stringify({
        count: '',
        limit: 'false',
        unlimited: 'true',
      }),
    }])).toBeNull();
  });

  test('returns the count for the current limited payload', () => {
    expect(getSubmissionLimit([{
      name: 'submissionLimit',
      value: JSON.stringify({
        count: '3',
        limit: 'true',
        unlimited: 'false',
      }),
    }])).toBe(3);
  });

  test('supports legacy numeric values', () => {
    expect(getSubmissionLimit([{
      name: 'submissionLimit',
      value: 1,
    }])).toBe(1);
    expect(getSubmissionLimit([{
      name: 'submissionLimit',
      value: '2',
    }])).toBe(2);
  });

  test('returns null for malformed and invalid counts', () => {
    expect(getSubmissionLimit([{
      name: 'submissionLimit',
      value: '{invalid',
    }])).toBeNull();
    expect(getSubmissionLimit([{
      name: 'submissionLimit',
      value: JSON.stringify({
        count: '0',
        limit: 'true',
        unlimited: 'false',
      }),
    }])).toBeNull();
  });
});

describe('getSubmissionLimitReachedMessage', () => {
  test('uses the requested singular limit message', () => {
    expect(getSubmissionLimitReachedMessage(1)).toBe(
      'This challenge allows only one submission, and you\'ve already submitted.'
        + ' To replace it, delete your existing submission first.',
    );
  });

  test('uses a plural message for larger limits', () => {
    expect(getSubmissionLimitReachedMessage(3)).toBe(
      'This challenge allows only 3 submissions, and you\'ve already reached that limit.'
        + ' To replace one, delete an existing submission first.',
    );
  });
});

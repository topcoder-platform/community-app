/* eslint-env jest */
import {
  belongsToActiveSubmissionPhase,
  getActiveSubmissionCount,
  getActiveSubmissionType,
  getSubmissionLimit,
  getSubmissionLimitReachedMessage,
  hasReachedSubmissionLimit,
} from '../../../../src/shared/utils/challenge-detail/submission-limit';

const LIMITED_TO_ONE_METADATA = [{
  name: 'submissionLimit',
  value: JSON.stringify({
    count: '1',
    limit: 'true',
    unlimited: 'false',
  }),
}];

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

describe('active submission phase limits', () => {
  test('resolves checkpoint and contest submission types independently', () => {
    expect(getActiveSubmissionType([
      { isOpen: true, name: 'Checkpoint Submission' },
      { isOpen: false, name: 'Submission' },
    ])).toBe('CHECKPOINT_SUBMISSION');
    expect(getActiveSubmissionType([
      { isOpen: false, name: 'Checkpoint Submission' },
      { isOpen: true, name: 'Submission' },
    ])).toBe('CONTEST_SUBMISSION');
  });

  test('does not count checkpoint submissions against the contest limit', () => {
    const phases = [
      { isOpen: false, name: 'Checkpoint Submission' },
      { isOpen: true, name: 'Submission' },
    ];
    const submissions = [{
      id: 'checkpoint-submission',
      type: 'CHECKPOINT_SUBMISSION',
    }];

    expect(getActiveSubmissionCount(submissions, phases)).toBe(0);
    expect(hasReachedSubmissionLimit(
      LIMITED_TO_ONE_METADATA,
      submissions,
      phases,
    )).toBe(false);
  });

  test('counts current and legacy submissions from the active phase', () => {
    const phases = [{ isOpen: true, name: 'Checkpoint Submission' }];
    const submissions = [
      { id: 'current-checkpoint', type: 'CHECKPOINT_SUBMISSION' },
      { id: 'legacy-checkpoint', submissionType: 'checkpoint' },
      { id: 'contest-submission', type: 'CONTEST_SUBMISSION' },
    ];

    expect(getActiveSubmissionCount(submissions, phases)).toBe(2);
    expect(hasReachedSubmissionLimit(
      LIMITED_TO_ONE_METADATA,
      submissions,
      phases,
    )).toBe(true);
  });

  test('does not apply concept limits during final fix', () => {
    const phases = [{ isOpen: true, name: 'Final Fix' }];
    const submissions = [{
      id: 'final-fix-submission',
      type: 'STUDIO_FINAL_FIX_SUBMISSION',
    }];

    expect(getActiveSubmissionCount(submissions, phases)).toBe(0);
    expect(hasReachedSubmissionLimit(
      LIMITED_TO_ONE_METADATA,
      submissions,
      phases,
    )).toBe(false);
  });
});

describe('belongsToActiveSubmissionPhase', () => {
  test('allows deleting a checkpoint submission while the checkpoint phase is open', () => {
    const phases = [
      { isOpen: true, name: 'Checkpoint Submission' },
      { isOpen: false, name: 'Submission' },
    ];

    expect(belongsToActiveSubmissionPhase(
      { id: 'checkpoint-submission', type: 'CHECKPOINT_SUBMISSION' },
      phases,
    )).toBe(true);
    expect(belongsToActiveSubmissionPhase(
      { id: 'legacy-checkpoint', submissionType: 'checkpoint' },
      phases,
    )).toBe(true);
  });

  test('blocks deleting a checkpoint submission once the submission phase opens', () => {
    const phases = [
      { isOpen: false, name: 'Checkpoint Submission' },
      { isOpen: true, name: 'Submission' },
    ];

    expect(belongsToActiveSubmissionPhase(
      { id: 'checkpoint-submission', type: 'CHECKPOINT_SUBMISSION' },
      phases,
    )).toBe(false);
    expect(belongsToActiveSubmissionPhase(
      { id: 'contest-submission', type: 'CONTEST_SUBMISSION' },
      phases,
    )).toBe(true);
  });

  test('blocks deleting anything once every submission phase is closed', () => {
    const phases = [
      { isOpen: false, name: 'Checkpoint Submission' },
      { isOpen: false, name: 'Submission' },
      { isOpen: true, name: 'Checkpoint Review' },
      { isOpen: true, name: 'Review' },
    ];

    expect(belongsToActiveSubmissionPhase(
      { id: 'checkpoint-submission', type: 'CHECKPOINT_SUBMISSION' },
      phases,
    )).toBe(false);
    expect(belongsToActiveSubmissionPhase(
      { id: 'contest-submission', type: 'CONTEST_SUBMISSION' },
      phases,
    )).toBe(false);
  });

  test('resolves to false for missing submissions or phases', () => {
    expect(belongsToActiveSubmissionPhase(null, [{ isOpen: true, name: 'Submission' }])).toBe(false);
    expect(belongsToActiveSubmissionPhase({ type: 'CONTEST_SUBMISSION' }, undefined)).toBe(false);
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

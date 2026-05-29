import {
  getDisplayedScores,
  isActiveTestStatus,
  getSubmissionTestProgress,
} from '../../../../../../src/shared/components/challenge-detail/MySubmissions/SubmissionsList';

describe('getDisplayedScores', () => {
  test('shows final scores when a system review already produced one before review completes', () => {
    expect(getDisplayedScores(
      {
        finalScore: 100,
        initialScore: 100,
        provisionalScore: 0,
      },
      {
        phases: [
          {
            isOpen: true,
            name: 'Registration',
            scheduledStartDate: '2030-01-01T00:00:00.000Z',
          },
        ],
      },
    )).toEqual({
      finalScore: 100,
      provisionalScore: 100,
    });
  });

  test('shows final scores after the review phase is complete', () => {
    expect(getDisplayedScores(
      {
        finalScore: 100,
        initialScore: 95,
        provisionalScore: 0,
      },
      {
        phases: [
          {
            isOpen: false,
            name: 'Review',
            scheduledStartDate: '2000-01-01T00:00:00.000Z',
          },
        ],
      },
    )).toEqual({
      finalScore: 100,
      provisionalScore: 95,
    });
  });
});

describe('getSubmissionTestProgress', () => {
  it('formats marathon test progress metadata for display', () => {
    expect(getSubmissionTestProgress({
      reviewSummations: [
        {
          metadata: {
            testProcess: 'system',
            testProgress: 0.2,
            testStatus: 'FAILED',
          },
        },
      ],
    })).toEqual({
      process: 'system',
      progressPercent: '20%',
      status: 'FAILED',
    });
  });
});

describe('isActiveTestStatus', () => {
  it('keeps provisional scores hidden while tests are still running', () => {
    expect(isActiveTestStatus('IN PROGRESS')).toBe(true);
    expect(isActiveTestStatus('SUCCESS')).toBe(false);
    expect(isActiveTestStatus('FAILED')).toBe(false);
  });
});

/* eslint-env jest */
import {
  getDisplayedScores,
  getSubmissionTestProgress,
} from '../../../../src/shared/components/challenge-detail/MySubmissions/SubmissionsList';

describe('getDisplayedScores', () => {
  it('shows final scores when a system review has already produced one', () => {
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

  it('hides final scores while review is active and no final result exists yet', () => {
    expect(getDisplayedScores(
      {
        finalScore: null,
        initialScore: 95,
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
      finalScore: null,
      provisionalScore: 95,
    });
  });

  it('shows final scores once the review phase is complete', () => {
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
  it('returns process, status, and percent from safe review summation metadata', () => {
    expect(getSubmissionTestProgress({
      reviewSummations: [
        {
          metadata: {
            testProcess: 'provisional',
            testProgress: 0.25,
            testStatus: 'SUCCESS',
            testProgressDetails: {
              updatedAt: '2026-05-01T00:00:00.000Z',
            },
          },
        },
        {
          metadata: {
            testProcess: 'system',
            testProgress: 0.75,
            testStatus: 'IN PROGRESS',
            testProgressDetails: {
              updatedAt: '2026-05-01T01:00:00.000Z',
            },
          },
        },
      ],
    })).toEqual({
      process: 'system',
      progressPercent: '75%',
      status: 'IN PROGRESS',
    });
  });

  it('ignores per-seed metadata and returns blank display data when progress is absent', () => {
    expect(getSubmissionTestProgress({
      reviewSummation: [
        {
          metadata: {
            testScores: [
              {
                score: 1,
                seed: 123456789,
              },
            ],
          },
        },
      ],
    })).toEqual({});
  });
});

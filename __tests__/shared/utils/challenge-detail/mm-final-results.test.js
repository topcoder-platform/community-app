/* eslint-env jest */
import {
  hasVisibleMmFinalResults,
  isReviewPhaseComplete,
  shouldShowFinalMmResults,
} from '../../../../src/shared/utils/challenge-detail/mm-final-results';

describe('mm-final-results utilities', () => {
  const activeReviewChallenge = {
    phases: [
      {
        isOpen: true,
        name: 'Review',
        scheduledStartDate: '2030-01-01T00:00:00.000Z',
      },
    ],
  };

  it('detects when the review phase has completed', () => {
    expect(isReviewPhaseComplete({
      phases: [
        {
          isOpen: false,
          name: 'Review',
          scheduledStartDate: '2000-01-01T00:00:00.000Z',
        },
      ],
    })).toBe(true);
  });

  it('keeps final Marathon Match results hidden while review is active and no final score exists', () => {
    expect(shouldShowFinalMmResults(activeReviewChallenge, [
      {
        finalRank: null,
        submissions: [
          {
            finalScore: null,
          },
        ],
      },
    ])).toBe(false);
  });

  it('keeps final Marathon Match results hidden while submissions are still open', () => {
    const submissionPhaseChallenge = {
      phases: [
        {
          isOpen: true,
          name: 'Submission',
          scheduledStartDate: '2030-01-01T00:00:00.000Z',
        },
      ],
    };

    expect(shouldShowFinalMmResults(submissionPhaseChallenge, [
      {
        finalRank: 1,
        submissions: [
          {
            finalScore: 100,
          },
        ],
      },
    ])).toBe(false);
  });

  it('shows final Marathon Match results as soon as a final score is available', () => {
    const mmSubmissions = [
      {
        finalRank: 1,
        submissions: [
          {
            finalScore: 100,
          },
        ],
      },
    ];

    expect(hasVisibleMmFinalResults(mmSubmissions)).toBe(true);
    expect(shouldShowFinalMmResults(activeReviewChallenge, mmSubmissions)).toBe(true);
  });
});

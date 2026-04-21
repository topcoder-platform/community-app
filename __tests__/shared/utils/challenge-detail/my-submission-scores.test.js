/* eslint-env jest */
import { getDisplayedScores } from '../../../../src/shared/components/challenge-detail/MySubmissions/SubmissionsList';

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

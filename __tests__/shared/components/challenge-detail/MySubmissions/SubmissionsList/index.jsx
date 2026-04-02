import { getDisplayedScores } from '../../../../../../src/shared/components/challenge-detail/MySubmissions/SubmissionsList';

describe('getDisplayedScores', () => {
  test('uses the initial score as the provisional score before review completes', () => {
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
      finalScore: null,
      provisionalScore: 100,
    });
  });

  test('shows final scores once the review phase is complete', () => {
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

import { getDisplayedMmScores } from '../../../../../src/shared/components/challenge-detail/Submissions/score-display';

describe('getDisplayedMmScores', () => {
  test('prefers initial score over a stale provisional score', () => {
    expect(getDisplayedMmScores({
      finalScore: 100,
      initialScore: 100,
      provisionalScore: 0,
    })).toEqual({
      finalScore: 100,
      provisionalScore: 100,
    });
  });

  test('falls back to provisional score when initial score is unavailable', () => {
    expect(getDisplayedMmScores({
      finalScore: '95.25',
      provisionalScore: '94.5',
    })).toEqual({
      finalScore: 95.25,
      provisionalScore: 94.5,
    });
  });
});

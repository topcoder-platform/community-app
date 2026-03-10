import { getPrizePointsUI } from 'utils/challenge-detail/helper';

describe('utils/challenge-detail/helper', () => {
  describe('getPrizePointsUI', () => {
    test('returns Fun for fun challenges without placement prizes', () => {
      expect(getPrizePointsUI({
        funChallenge: true,
        prizeSets: [],
      })).toBe('Fun');
    });
  });
});

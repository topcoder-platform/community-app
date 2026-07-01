import {
  getDisplayWinners,
  isWiproRegistrationBlocked,
  mapStateToProps,
} from 'containers/challenge-detail';

describe('Challenge detail Wipro registration guard', () => {
  test('blocks Wipro members when challenge disallows Wipro participation', () => {
    expect(isWiproRegistrationBlocked('member@wipro.com', {
      wiproAllowed: false,
      type: 'Challenge',
    })).toBe(true);
  });

  test('does not block Wipro members when challenge allows Wipro participation', () => {
    expect(isWiproRegistrationBlocked('member@wipro.com', {
      wiproAllowed: true,
      type: 'Challenge',
    })).toBe(false);
  });

  test('does not block non-Wipro members when challenge disallows Wipro participation', () => {
    expect(isWiproRegistrationBlocked('member@example.com', {
      wiproAllowed: false,
      type: 'Challenge',
    })).toBe(false);
  });

  test('matches Wipro domain case-insensitively and ignores surrounding spaces', () => {
    expect(isWiproRegistrationBlocked('  MEMBER@WIPRO.COM ', {
      wiproAllowed: false,
      type: 'Challenge',
    })).toBe(true);
  });

  test('does not block Wipro members for Topgear Task even when the flag is false', () => {
    expect(isWiproRegistrationBlocked('member@wipro.com', {
      wiproAllowed: false,
      type: 'Topgear Task',
    })).toBe(false);
  });
});

describe('Challenge detail winners filter', () => {
  test('includes legacy winners with "Final" type for non-task challenges', () => {
    const winners = getDisplayWinners({
      type: 'Challenge',
      winners: [
        { handle: 'legacyFinal', type: 'Final' },
        { handle: 'newFinal', type: 'final' },
        { handle: 'provisionalWinner', type: 'provisional' },
      ],
    });

    expect(winners).toEqual([
      { handle: 'legacyFinal', type: 'Final' },
      { handle: 'newFinal', type: 'final' },
    ]);
  });

  test('does not filter winners for task challenges', () => {
    const winners = getDisplayWinners({
      type: 'Task',
      winners: [
        { handle: 'taskWinner', type: 'provisional' },
      ],
    });

    expect(winners).toEqual([
      { handle: 'taskWinner', type: 'provisional' },
    ]);
  });
});

describe('Challenge detail MM submissions state mapping', () => {
  function createState() {
    return {
      auth: {
        user: {},
      },
      challenge: {
        details: {
          id: 'challenge-id',
          registrants: [
            {
              memberHandle: 'alpha',
              memberId: '101',
              rating: 1200,
            },
            {
              memberHandle: 'beta',
              memberId: '102',
              rating: 1500,
            },
          ],
          submissions: [
            {
              createdAt: '2026-06-29T01:00:00.000Z',
              id: 'raw-alpha',
              memberId: '101',
              registrant: {
                memberHandle: 'alpha',
                memberId: '101',
              },
            },
          ],
        },
        mmSubmissions: {
          challengeId: 'challenge-id',
          data: [
            {
              finalRank: null,
              member: 'alpha',
              memberId: '101',
              provisionalRank: 1,
              submissions: [
                {
                  finalScore: null,
                  provisionalScore: 75,
                  status: 'completed',
                  submissionId: 'raw-alpha',
                  submissionTime: '2026-06-29T01:00:00.000Z',
                },
              ],
            },
            {
              finalRank: null,
              member: 'beta',
              memberId: '102',
              provisionalRank: 2,
              submissions: [
                {
                  finalScore: null,
                  provisionalScore: 70,
                  status: 'completed',
                  submissionId: 'full-beta',
                  submissionTime: '2026-06-28T01:00:00.000Z',
                },
              ],
            },
          ],
        },
        reviewSummations: {
          challengeId: 'challenge-id',
          data: [
            {
              aggregateScore: 75,
              id: 'summation-alpha',
              isProvisional: true,
              reviewedDate: '2026-06-29T01:10:00.000Z',
              submissionId: 'raw-alpha',
              submitterHandle: 'alpha',
              submitterId: '101',
            },
          ],
        },
        statisticsData: [],
        checkpoints: {},
      },
      challengeListing: {
        challengeTypes: [],
        challengeTypesMap: {},
        openForRegistrationChallenges: {},
      },
      lookup: {
        allCountries: [],
        reviewTypes: [],
      },
      page: {
        challengeDetails: {
          checkpoints: {},
          feedbackOpen: {},
        },
      },
      tcCommunities: {
        list: {
          data: [],
          loadingUuid: '',
          timestamp: 0,
        },
      },
      terms: {
        loadingTermsForEntity: null,
        terms: [],
      },
      topcoderHeader: {},
    };
  }

  test('keeps fully fetched MM submitters when review summations are present', () => {
    const props = mapStateToProps(createState(), {
      challengesUrl: '/challenges',
      match: {
        params: {
          challengeId: 'challenge-id',
        },
      },
    });

    expect(props.mmSubmissions.map(submission => submission.member)).toEqual([
      'alpha',
      'beta',
    ]);
  });
});

import {
  buildChallengeLoginUrl,
  ChallengeDetailPageContainer,
  getDisplayWinners,
  isGroupedChallenge,
  isGroupedChallengeAccessError,
  isWiproRegistrationBlocked,
  mapStateToProps,
  shouldLoginForGroupedChallenge,
  shouldLoginForGroupedChallengeError,
} from 'containers/challenge-detail';
import { getChallengeSubmissions as mockedGetChallengeSubmissions } from 'services/submissions';

jest.mock('services/submissions', () => ({
  getChallengeSubmissions: jest.fn(),
  getSubmissionArtifacts: jest.fn(),
}));

/**
 * Creates the minimal challenge-detail context needed to exercise submit navigation.
 *
 * @param {Object} propOverrides Optional container prop replacements.
 * @return {Object} Method context with mocked state updates and navigation.
 * @throws Does not throw.
 */
function createSubmitNavigationContext(propOverrides = {}) {
  const context = {
    props: {
      auth: {
        tokenV3: 'token-v3',
        user: { userId: 'member-id' },
      },
      challenge: {
        metadata: [{
          name: 'submissionLimit',
          value: JSON.stringify({
            count: '1',
            limit: 'true',
            unlimited: 'false',
          }),
        }],
        phases: [{ isOpen: true, name: 'Submission' }],
        track: 'Design',
      },
      challengeId: 'challenge-id',
      challengesUrl: '/challenges',
      history: { push: jest.fn() },
      mySubmissions: [],
      ...propOverrides,
    },
    setState: jest.fn((state, callback) => {
      if (callback) callback();
    }),
    submissionLimitCheckPending: false,
  };

  return context;
}

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

describe('Challenge detail My Submissions count', () => {
  test('uses the total attempt count when only the latest MM submission is loaded', () => {
    const state = {
      auth: {
        user: {
          handle: 'member',
          userId: '123',
        },
      },
      challenge: {
        checkpoints: {},
        details: {
          id: 'challenge-id',
          registrants: [{ memberHandle: 'member', memberId: '123' }],
          submissions: [],
        },
        mmSubmissions: {
          challengeId: 'challenge-id',
          data: [{
            member: 'member',
            memberId: '123',
            submissionCount: 3,
            submissions: [{ submissionId: 'latest-submission' }],
          }],
        },
        reviewSummations: [],
        statisticsData: [],
      },
      challengeListing: {},
      domain: {},
      lookup: {
        allCountries: [],
        reviewTypes: [],
      },
      page: {
        challengeDetails: {
          feedbackOpen: {},
        },
      },
      tcCommunities: {
        list: {},
      },
      terms: {},
      topcoderHeader: {},
    };

    const props = mapStateToProps(state, {
      challengesUrl: '/challenges',
      match: {
        params: { challengeId: 'challenge-id' },
      },
    });

    expect(props.mySubmissions).toHaveLength(1);
    expect(props.mySubmissionsCount).toBe(3);
  });
});

describe('Challenge detail submit navigation limit', () => {
  beforeEach(() => {
    mockedGetChallengeSubmissions.mockReset();
  });

  test('blocks navigation when complete history reaches the limit but local history is empty', async () => {
    mockedGetChallengeSubmissions.mockResolvedValue({
      data: [{ id: 'contest-submission' }],
    });
    const context = createSubmitNavigationContext();
    const event = { preventDefault: jest.fn() };

    await ChallengeDetailPageContainer.prototype.onSubmitChallenge.call(context, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockedGetChallengeSubmissions).toHaveBeenCalledWith(
      'token-v3',
      'challenge-id',
      {
        memberId: 'member-id',
        type: 'CONTEST_SUBMISSION',
      },
    );
    expect(context.props.history.push).not.toHaveBeenCalled();
    expect(context.submissionLimitCheckPending).toBe(false);
  });

  test('navigates after complete history confirms a submission slot remains', async () => {
    mockedGetChallengeSubmissions.mockResolvedValue({ data: [] });
    const context = createSubmitNavigationContext();
    const event = { preventDefault: jest.fn() };

    await ChallengeDetailPageContainer.prototype.onSubmitChallenge.call(context, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(context.props.history.push)
      .toHaveBeenCalledWith('/challenges/challenge-id/submit');
    expect(context.submissionLimitCheckPending).toBe(false);
  });

  test('leaves unlimited and final-fix links to their normal navigation', async () => {
    const unlimitedContext = createSubmitNavigationContext({
      challenge: {
        metadata: [],
        phases: [{ isOpen: true, name: 'Submission' }],
        track: 'Design',
      },
    });
    const finalFixContext = createSubmitNavigationContext({
      challenge: {
        metadata: [{
          name: 'submissionLimit',
          value: JSON.stringify({
            count: '1',
            limit: 'true',
            unlimited: 'false',
          }),
        }],
        phases: [{ isOpen: true, name: 'Final Fix' }],
        track: 'Design',
      },
    });
    const unlimitedEvent = { preventDefault: jest.fn() };
    const finalFixEvent = { preventDefault: jest.fn() };

    await ChallengeDetailPageContainer.prototype.onSubmitChallenge.call(
      unlimitedContext,
      unlimitedEvent,
    );
    await ChallengeDetailPageContainer.prototype.onSubmitChallenge.call(
      finalFixContext,
      finalFixEvent,
    );

    expect(unlimitedEvent.preventDefault).not.toHaveBeenCalled();
    expect(finalFixEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockedGetChallengeSubmissions).not.toHaveBeenCalled();
  });

  test('fails closed and releases the click guard when complete-history lookup fails', async () => {
    mockedGetChallengeSubmissions.mockRejectedValue(new Error('network error'));
    const context = createSubmitNavigationContext();

    await ChallengeDetailPageContainer.prototype.onSubmitChallenge.call(
      context,
      { preventDefault: jest.fn() },
    );

    expect(context.props.history.push).not.toHaveBeenCalled();
    expect(context.submissionLimitCheckPending).toBe(false);
    expect(context.setState).toHaveBeenLastCalledWith(
      { submissionLimitCheckPending: false },
      expect.any(Function),
    );
  });

  test('ignores repeated clicks while the complete-history lookup is pending', async () => {
    let resolveSubmissions;
    mockedGetChallengeSubmissions.mockReturnValue(new Promise((resolve) => {
      resolveSubmissions = resolve;
    }));
    const context = createSubmitNavigationContext();

    const firstClick = ChallengeDetailPageContainer.prototype.onSubmitChallenge.call(
      context,
      { preventDefault: jest.fn() },
    );
    const repeatedClick = ChallengeDetailPageContainer.prototype.onSubmitChallenge.call(
      context,
      { preventDefault: jest.fn() },
    );

    expect(mockedGetChallengeSubmissions).toHaveBeenCalledTimes(1);
    resolveSubmissions({ data: [] });
    await Promise.all([firstClick, repeatedClick]);

    expect(context.props.history.push).toHaveBeenCalledTimes(1);
  });
});

describe('Challenge detail grouped challenge login guard', () => {
  beforeEach(() => {
    document.cookie = 'tc_utm=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  test('detects grouped challenge payloads from array or map groups', () => {
    expect(isGroupedChallenge({ groups: ['group-id'] })).toBe(true);
    expect(isGroupedChallenge({ groups: { 'group-id': true } })).toBe(true);
    expect(isGroupedChallenge({ groups: [] })).toBe(false);
    expect(isGroupedChallenge({ groups: {} })).toBe(false);
  });

  test('requires login only for anonymous grouped challenge payloads', () => {
    expect(shouldLoginForGroupedChallenge({}, { groups: ['group-id'] })).toBe(true);
    expect(shouldLoginForGroupedChallenge({ tokenV3: 'token' }, { groups: ['group-id'] }))
      .toBe(false);
    expect(shouldLoginForGroupedChallenge({}, { groups: [] })).toBe(false);
  });

  test('detects grouped challenge access errors for anonymous detail requests', () => {
    expect(isGroupedChallengeAccessError({ payload: new Error('Forbidden') })).toBe(true);
    expect(isGroupedChallengeAccessError(new Error('You do not have access to this group')))
      .toBe(true);
    expect(isGroupedChallengeAccessError(new Error('Not Found'))).toBe(false);

    expect(shouldLoginForGroupedChallengeError({}, { payload: new Error('Forbidden') }))
      .toBe(true);
    expect(shouldLoginForGroupedChallengeError({ tokenV3: 'token' }, new Error('Forbidden')))
      .toBe(false);
  });

  test('builds a login URL that preserves the original challenge URL', () => {
    const retUrl = 'https://www.topcoder.com/challenges/abc?tab=details#timeline';
    const loginUrl = buildChallengeLoginUrl(retUrl);
    const parsedUrl = new URL(loginUrl);

    expect(`${parsedUrl.origin}${parsedUrl.pathname}`)
      .toBe('https://accounts-auth0.topcoder-dev.com/member');
    expect(parsedUrl.searchParams.get('retUrl')).toBe(retUrl);
    expect(parsedUrl.searchParams.get('utm_source')).toBe('community-app-main');
  });
});

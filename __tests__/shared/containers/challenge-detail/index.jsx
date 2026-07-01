import {
  buildChallengeLoginUrl,
  getDisplayWinners,
  isGroupedChallenge,
  isGroupedChallengeAccessError,
  isWiproRegistrationBlocked,
  shouldLoginForGroupedChallenge,
  shouldLoginForGroupedChallengeError,
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

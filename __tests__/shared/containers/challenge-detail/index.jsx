import { getDisplayWinners, isWiproRegistrationBlocked } from 'containers/challenge-detail';

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

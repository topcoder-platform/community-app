import { getDisplayWinners, isWiproRegistrationBlocked } from 'containers/challenge-detail';

describe('Challenge detail Wipro registration guard', () => {
  test('blocks Wipro members when challenge disallows Wipro participation', () => {
    expect(isWiproRegistrationBlocked('member@wipro.com', false)).toBe(true);
  });

  test('does not block Wipro members when challenge allows Wipro participation', () => {
    expect(isWiproRegistrationBlocked('member@wipro.com', true)).toBe(false);
  });

  test('does not block non-Wipro members when challenge disallows Wipro participation', () => {
    expect(isWiproRegistrationBlocked('member@example.com', false)).toBe(false);
  });

  test('matches Wipro domain case-insensitively and ignores surrounding spaces', () => {
    expect(isWiproRegistrationBlocked('  MEMBER@WIPRO.COM ', false)).toBe(true);
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

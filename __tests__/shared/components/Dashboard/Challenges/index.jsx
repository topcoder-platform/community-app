import React from 'react';
import renderer from 'react-test-renderer';

import ChallengesFeed from 'components/Dashboard/Challenges';

function renderChallenge(challenge) {
  return renderer.create((
    <ChallengesFeed
      challenges={[challenge]}
      loading={false}
    />
  )).toJSON();
}

describe('Dashboard Challenges feed', () => {
  test('shows Fun label for fun challenges', () => {
    const view = renderChallenge({
      id: 'challenge-fun',
      name: 'Challenge one',
      funChallenge: true,
      prizeSets: [
        {
          type: 'PLACEMENT',
          prizes: [{ type: 'USD', value: 0 }],
        },
      ],
    });

    const text = JSON.stringify(view);
    expect(text).toContain('Fun');
    expect(text).not.toContain('$0');
  });

  test('shows calculated prize amount for regular challenges', () => {
    const view = renderChallenge({
      id: 'challenge-regular',
      name: 'Challenge two',
      funChallenge: false,
      prizeSets: [
        {
          type: 'PLACEMENT',
          prizes: [{ type: 'USD', value: 44 }],
        },
      ],
    });

    expect(JSON.stringify(view)).toContain('$44');
  });
});

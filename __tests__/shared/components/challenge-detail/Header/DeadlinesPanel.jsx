import React from 'react';

import DeadlinesPanel from 'components/challenge-detail/Header/DeadlinesPanel';
import Card from 'components/challenge-detail/Header/DeadlinesPanel/Card';

describe('Challenge deadline labels', () => {
  test('preserves a checkpoint phase name without an identity replacement', () => {
    const panel = DeadlinesPanel({
      deadlines: [{
        name: 'Checkpoint',
        scheduledEndDate: '2030-01-02T00:00:00.000Z',
        scheduledStartDate: '2030-01-01T00:00:00.000Z',
      }],
    });
    const cards = React.Children.toArray(panel.props.children)
      .filter(child => child.type === Card);

    expect(cards[0].props.title).toBe('Checkpoint');
  });
});

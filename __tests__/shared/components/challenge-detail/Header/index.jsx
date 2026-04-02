import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Header from 'components/challenge-detail/Header';

function collectText(node) {
  if (typeof node === 'string') {
    return [node];
  }

  if (!React.isValidElement(node)) {
    return [];
  }

  return React.Children.toArray(node.props.children)
    .reduce((acc, child) => acc.concat(collectText(child)), []);
}

function renderHeader(challengeOverrides = {}) {
  const renderer = new Renderer();
  renderer.render(
    <Header
      challenge={{
        events: [],
        id: 'challenge-id',
        legacy: {},
        metadata: [],
        name: 'Challenge title',
        numOfCheckpointSubmissions: 0,
        numOfRegistrants: 0,
        numOfSubmissions: 0,
        phases: [
          {
            isOpen: true,
            name: 'Registration',
            scheduledEndDate: '2030-01-02T00:00:00.000Z',
            scheduledStartDate: '2030-01-01T00:00:00.000Z',
          },
        ],
        pointPrizes: [],
        prizeSets: [],
        skills: [],
        status: 'ACTIVE',
        tags: [],
        track: 'Development',
        type: 'Challenge',
        ...challengeOverrides,
      }}
      challengeTypesMap={[
        { abbreviation: 'CH', name: 'Challenge' },
        { abbreviation: 'TSK', name: 'Task' },
      ]}
      challengesUrl="/challenges"
      checkpoints={[]}
      hasFirstPlacement={false}
      hasRecommendedChallenges={false}
      hasRegistered={false}
      hasThriveArticles={false}
      isLoggedIn
      mySubmissions={[]}
      numWinners={1}
      onSelectorClicked={jest.fn()}
      onSort={jest.fn()}
      onToggleDeadlines={jest.fn()}
      openForRegistrationChallenges={{}}
      registerForChallenge={jest.fn()}
      registering={false}
      selectedView="details"
      setChallengeListingFilter={jest.fn()}
      showDeadlineDetail={false}
      submissionEnded={false}
      unregisterFromChallenge={jest.fn()}
      unregistering={false}
      viewAsTable={false}
    />,
  );

  return renderer.getRenderOutput();
}

describe('Challenge detail header actions', () => {
  test('hides registration and submission actions for task challenges', () => {
    const output = renderHeader({
      phases: [
        {
          isOpen: false,
          name: 'Registration',
          scheduledEndDate: '2030-01-02T00:00:00.000Z',
          scheduledStartDate: '2030-01-01T00:00:00.000Z',
        },
        {
          isOpen: true,
          name: 'Submission',
          scheduledEndDate: '2030-01-03T00:00:00.000Z',
          scheduledStartDate: '2030-01-02T00:00:00.000Z',
        },
      ],
      task: {
        isTask: true,
      },
      type: 'Task',
    });

    expect(collectText(output)).not.toContain('Register');
    expect(collectText(output)).not.toContain('Unregister');
    expect(collectText(output)).not.toContain('Submit a solution');
  });

  test('hides registration and submission actions for task payloads from work app', () => {
    const output = renderHeader({
      task: {
        isTask: true,
      },
    });

    expect(collectText(output)).not.toContain('Register');
    expect(collectText(output)).not.toContain('Unregister');
    expect(collectText(output)).not.toContain('Submit a solution');
  });

  test('shows registration and submission actions for non-task challenges', () => {
    const output = renderHeader();

    expect(collectText(output)).toContain('Register');
    expect(collectText(output)).toContain('Submit a solution');
  });
});

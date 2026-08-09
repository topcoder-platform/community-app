import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Header from 'components/challenge-detail/Header';
import TabSelector from 'components/challenge-detail/Header/TabSelector';

jest.mock('react-responsive', () => ({
  useMediaQuery: () => true,
}));

function collectText(node) {
  if (typeof node === 'string' || typeof node === 'number') {
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
        drPoints: null,
        events: [],
        funChallenge: false,
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
        prizeSets: [
          {
            type: 'placement',
            prizes: [{ type: 'USD', value: 1000 }],
          },
        ],
        reliabilityBonus: 0,
        skills: [],
        status: 'ACTIVE',
        tags: [],
        track: 'Development',
        type: 'Challenge',
        ...challengeOverrides,
      }}
      challengeTypesMap={{}}
      challengesUrl="/challenges"
      checkpoints={{}}
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
  test('hides registration and submission actions for classic task challenges', () => {
    const output = renderHeader({
      type: 'Task',
    });

    expect(collectText(output)).not.toContain('Register');
    expect(collectText(output)).not.toContain('Unregister');
    expect(collectText(output)).not.toContain('Submit a solution');
  });

  test('hides registration and submission actions for work-app task payloads', () => {
    const output = renderHeader({
      task: {
        isTask: true,
      },
    });

    expect(collectText(output)).not.toContain('Register');
    expect(collectText(output)).not.toContain('Unregister');
    expect(collectText(output)).not.toContain('Submit a solution');
  });

  test('hides registration and submission actions for pure v5 task payloads', () => {
    const output = renderHeader({
      legacy: {
        pureV5Task: true,
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

describe('Challenge detail tab counts', () => {
  test('renders the MM submission total independently of loaded attempts', () => {
    const renderer = new Renderer();
    renderer.render(
      <TabSelector
        challenge={{
          id: 'challenge-id',
          legacy: {},
          metadata: [],
          tags: [],
          type: 'Marathon Match',
        }}
        checkpointCount={0}
        hasRegistered
        isLoggedIn
        isMM
        mySubmissions={[{ submissionId: 'latest-submission' }]}
        mySubmissionsCount={3}
        numOfCheckpointSubmissions={0}
        numOfRegistrants={4}
        numOfSubmissions={4}
        numWinners={0}
        onSelectorClicked={jest.fn()}
        onSort={jest.fn()}
        selectedView="submissions"
        trackLower="data science"
        viewAsTable={false}
      />,
    );

    const text = collectText(renderer.getRenderOutput());
    const mySubmissionsLabelIndex = text.indexOf('My Submissions');

    expect(text[mySubmissionsLabelIndex + 1]).toBe(3);
  });
});

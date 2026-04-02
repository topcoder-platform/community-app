import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Header from 'components/challenge-detail/Header';

<<<<<<< HEAD
const defaultProps = {
  challenge: {
    id: '300001',
    drPoints: null,
    events: [],
    funChallenge: false,
    metadata: [],
    name: 'Challenge title',
    numOfCheckpointSubmissions: 0,
    numOfRegistrants: 0,
    numOfSubmissions: 0,
    phases: [
      {
        name: 'Registration',
        isOpen: true,
        scheduledEndDate: '2030-01-02T00:00:00.000Z',
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
  },
  challengeTypesMap: {},
  challengesUrl: '/challenges',
  checkpoints: {},
  hasFirstPlacement: false,
  hasRecommendedChallenges: false,
  hasRegistered: false,
  hasThriveArticles: false,
  isLoggedIn: true,
  mySubmissions: [],
  numWinners: 0,
  onSelectorClicked: () => {},
  onSort: () => {},
  onToggleDeadlines: () => {},
  openForRegistrationChallenges: {},
  registerForChallenge: () => {},
  registering: false,
  selectedView: 'details',
  setChallengeListingFilter: () => {},
  showDeadlineDetail: false,
  submissionEnded: false,
  unregisterFromChallenge: () => {},
  unregistering: false,
  viewAsTable: false,
};

/**
 * Collects text nodes from a shallow-rendered React tree.
 * @param {*} node React node to inspect.
 * @returns {string[]} Flattened text content.
 */
function collectText(node) {
  if (typeof node === 'string') return [node];
  if (!node || !node.props) return [];

  return React.Children.toArray(node.props.children).reduce(
    (result, child) => result.concat(collectText(child)),
    [],
  );
=======
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
>>>>>>> bebcd7d6d3567960f13b1718b6491fb166b23b20
}

describe('Challenge detail header actions', () => {
  test('hides registration and submission actions for task challenges', () => {
<<<<<<< HEAD
    const renderer = new Renderer();

    renderer.render((
      <Header
        {...defaultProps}
        challenge={{
          ...defaultProps.challenge,
          type: 'Task',
        }}
      />
    ));

    const output = renderer.getRenderOutput();
=======
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
>>>>>>> bebcd7d6d3567960f13b1718b6491fb166b23b20

    expect(collectText(output)).not.toContain('Register');
    expect(collectText(output)).not.toContain('Unregister');
    expect(collectText(output)).not.toContain('Submit a solution');
  });
<<<<<<< HEAD
=======

  test('shows registration and submission actions for non-task challenges', () => {
    const output = renderHeader();

    expect(collectText(output)).toContain('Register');
    expect(collectText(output)).toContain('Submit a solution');
  });
>>>>>>> bebcd7d6d3567960f13b1718b6491fb166b23b20
});

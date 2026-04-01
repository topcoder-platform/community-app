import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Header from 'components/challenge-detail/Header';

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
}

describe('Challenge detail header actions', () => {
  test('hides registration and submission actions for task challenges', () => {
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

    expect(collectText(output)).not.toContain('Register');
    expect(collectText(output)).not.toContain('Unregister');
    expect(collectText(output)).not.toContain('Submit a solution');
  });
});

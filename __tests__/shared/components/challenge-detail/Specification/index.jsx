import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import { SPECS_TAB_STATES } from 'actions/page/challenge-details';
import ChallengeDetailsView from 'components/challenge-detail/Specification';

describe('Challenge detail specification Wipro payments', () => {
  test('does not render the payment terms section for Wipro group challenges', () => {
    const renderer = new Renderer();
    renderer.render((
      <ChallengeDetailsView
        auth={{}}
        challenge={{
          description: 'Challenge description',
          descriptionFormat: 'HTML',
          events: [],
          groups: ['wipro-group-id'],
          legacy: { forumId: 0 },
          metadata: [],
          phases: [],
          track: 'Development',
          userDetails: { roles: [] },
        }}
        challengesUrl="/challenges"
        communitiesList={[{
          communityId: 'wipro',
          groupIds: ['wipro-group-id'],
        }]}
        savingChallenge={false}
        setSpecsTabState={jest.fn()}
        specsTabState={SPECS_TAB_STATES.VIEW}
        terms={[]}
        updateChallenge={jest.fn()}
      />
    ));

    const renderedText = JSON.stringify(renderer.getRenderOutput());

    expect(renderedText).toContain('Challenge Overview');
    expect(renderedText).not.toContain('Payments');
    expect(renderedText).not.toContain('For employees of Wipro Technologies');
  });
});

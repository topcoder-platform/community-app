import { shallow } from 'enzyme';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import SubmissionManagement from 'components/SubmissionManagement/SubmissionManagement';

/**
 * Renders the regular My Submissions page with an open Design upload phase.
 *
 * @param {Object} propOverrides Optional component prop replacements.
 * @return {ShallowWrapper} Rendered Submission Management component.
 * @throws {Error} Propagates errors raised while shallow-rendering the component.
 */
function renderSubmissionManagement(propOverrides = {}) {
  return shallow(
    <SubmissionManagement
      challenge={{
        name: 'Design challenge',
        phases: [{
          isOpen: true,
          name: 'Submission',
          scheduledEndDate: '2030-08-20T00:00:00.000Z',
          scheduledStartDate: '2030-08-10T00:00:00.000Z',
        }],
        status: 'ACTIVE',
        track: 'Design',
      }}
      challengeUrl="/challenges/challenge-id"
      onAddSubmission={jest.fn()}
      showDetails={{}}
      submissionPhaseStartDate="2030-08-10T00:00:00.000Z"
      submissionWorkflowRuns={{}}
      {...propOverrides}
    />,
  );
}

describe('Submission Management Add Submission action', () => {
  test('routes through the authoritative limit handler', () => {
    const onAddSubmission = jest.fn();
    const wrapper = renderSubmissionManagement({ onAddSubmission });
    const button = wrapper.find(PrimaryButton).last();

    expect(button.prop('to')).toBe('/challenges/challenge-id/submit');
    expect(button.prop('onClick')).toBe(onAddSubmission);
    expect(button.prop('disabled')).toBe(false);
  });

  test('supports checkpoint uploads on the regular My Submissions route', () => {
    const wrapper = renderSubmissionManagement({
      challenge: {
        name: 'Design challenge',
        phases: [{
          isOpen: true,
          name: 'Checkpoint Submission',
          scheduledEndDate: '2030-08-20T00:00:00.000Z',
          scheduledStartDate: '2030-08-10T00:00:00.000Z',
        }],
        status: 'ACTIVE',
        track: 'Design',
      },
    });

    expect(wrapper.find(PrimaryButton)).toHaveLength(1);
  });

  test('disables direct routing while the limit lookup is pending', () => {
    const wrapper = renderSubmissionManagement({
      submissionLimitCheckPending: true,
    });
    const button = wrapper.find(PrimaryButton).last();

    expect(button.prop('disabled')).toBe(true);
    expect(button.prop('to')).toBeNull();
  });
});

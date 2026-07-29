import { shallow } from 'enzyme';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import { TABS as DETAIL_TABS } from 'actions/page/challenge-details';
import Uploading from 'components/SubmissionPage/Uploading';
import { COMPETITION_TRACKS } from 'utils/tc';

/**
 * Shallow-renders the successful submission upload state for navigation tests.
 * @param {Object} overrides Props that replace the default Marathon Match fixture values.
 * @return {ShallowWrapper} Enzyme wrapper used to inspect and invoke the success action.
 * @throws {Error} Does not intentionally throw; Enzyme may surface invalid render props.
 */
function renderUploading(overrides = {}) {
  return shallow(
    <Uploading
      back={jest.fn()}
      challengeId="challenge-id"
      challengeName="Challenge name"
      challengesUrl="/challenges"
      error=""
      isMarathonMatch
      isSubmitting={false}
      reset={jest.fn()}
      retry={jest.fn()}
      selectChallengeDetailsTab={jest.fn()}
      submitDone
      track={COMPETITION_TRACKS.DS}
      uploadProgress={1}
      {...overrides}
    />,
  );
}

describe('Uploading submission success actions', () => {
  test('opens the challenge My Submissions tab for marathon matches', () => {
    const back = jest.fn();
    const selectChallengeDetailsTab = jest.fn();
    const wrapper = renderUploading({ back, selectChallengeDetailsTab });
    const button = wrapper.find(PrimaryButton);

    expect(button.prop('to')).toBe(
      `/challenges/challenge-id?tab=${DETAIL_TABS.MY_SUBMISSIONS}`,
    );

    button.prop('onClick')();

    expect(back).toHaveBeenCalledTimes(1);
    expect(selectChallengeDetailsTab).toHaveBeenCalledWith(DETAIL_TABS.MY_SUBMISSIONS);
  });

  test('keeps the legacy My Submissions page for non-marathon challenges', () => {
    const back = jest.fn();
    const selectChallengeDetailsTab = jest.fn();
    const wrapper = renderUploading({
      back,
      isMarathonMatch: false,
      selectChallengeDetailsTab,
      track: COMPETITION_TRACKS.DEV,
    });
    const button = wrapper.find(PrimaryButton);

    expect(button.prop('to')).toBe('/challenges/challenge-id/my-submissions');

    button.prop('onClick')();

    expect(back).toHaveBeenCalledTimes(1);
    expect(selectChallengeDetailsTab).not.toHaveBeenCalled();
  });
});

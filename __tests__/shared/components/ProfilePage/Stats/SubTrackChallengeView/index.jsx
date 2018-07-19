import _ from 'lodash';
import SubTrackChallengeView from 'components/ProfilePage/Stats/SubTrackChallengeView';
import React from 'react';
import R from 'react-test-renderer/shallow';
import develop from './__mocks__/develop.json';

const mockState = {
  auth: {
    profile: {},
  },
  members: {
    thomaskranitsas: {
      subtrackChallenges: develop,
      challengesHasMore: false,
      loadingSubTrackChallengesUUID: '',
    },
  },
};

test('SubtrackChallengeView matches shallow snapshot', () => {
  const r = new R();
  r.render((<SubTrackChallengeView
    handle="thomaskranitsas"
    track="DEVELOP"
    subTrack="FIRST_2_FINISH"
    userId={12345}
    store={{
      dispatch: () => _.noop,
      getState: () => mockState,
      subscribe: _.noop,
    }}
  />));
  expect(r.getRenderOutput()).toMatchSnapshot();
});

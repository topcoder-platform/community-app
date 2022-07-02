import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import ProfilePage from 'components/ProfilePage';

import emptyProfile from './__mocks__/empty-profile.json';
import fullProfile from './__mocks__/full-profile.json';

const rnd = new Renderer();

const mockState = {
  auth: {
    profile: {},
  },
  members: {
    testHandle: {
      subtrackChallenges: [],
      challengesHasMore: false,
      loadingSubTrackChallengesUUID: '',
    },
  },
};

it('renders an empty Profile correctly', () => {
  rnd.render((<ProfilePage
    {...emptyProfile}
    store={{
      dispatch: () => _.noop,
      getState: () => mockState,
      subscribe: _.noop,
    }}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders a full Profile correctly', () => {
  rnd.render((<ProfilePage
    {...fullProfile}
    store={{
      dispatch: () => _.noop,
      getState: () => mockState,
      subscribe: _.noop,
    }}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

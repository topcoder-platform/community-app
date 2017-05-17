import _ from 'lodash';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';

const rnd = new Rnd();

const mockState = {
  tcCommunities: {
    meta: {
      communityId: 'someId',
      loading: false,
      leaderboardApiUrl: 'some/api/url',
    },
  },
};

const Content = require('containers/tc-communities/Content').default;

test('Matches shapshot', () => {
  rnd.render((
    <Content
      match={{
        params: {
          communityId: 'someId',
          pageId: 'somePageId',
          history: {},
          location: {},
        },
      }}
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

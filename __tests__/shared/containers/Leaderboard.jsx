import _ from 'lodash';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';

const rnd = new Rnd();

const mockUserObj = {
  rank: 1,
  avatarUrl: 'some.fake.string',
  'challenge_stats.winner_handle': 'overachieving.mofo',
  'challenge_stats.count': 99999,
  'project_result.final_score': 9999999999,
};
const mockLeaderboardData = [mockUserObj, mockUserObj, mockUserObj, mockUserObj];

const mockLeaderboardActions = {
  leaderboard: {
    fetchLeaderboardInit: jest.fn(),
    fetchLeaderboardDone: jest.fn(() => mockLeaderboardData),
  },
};
jest.setMock(require.resolve('actions/leaderboard'), mockLeaderboardActions);

const mockState = {
  leaderboard: {
    data: mockLeaderboardData,
    loading: false,
  },
};

const mockState2 = {
  leaderboard: {},
};

const Leaderboard = require('containers/Leaderboard').default;

beforeEach(() => jest.clearAllMocks());

test('Matches shapshot', () => {
  rnd.render((
    <Leaderboard
      store={{
        dispatch: () => _.noop,
        getState: () => mockState,
        subscribe: _.noop,
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

test('Triggers data loading, if necessary', () => {
  TU.renderIntoDocument((
    <Leaderboard
      store={{
        dispatch: () => _.noop,
        getState: () => mockState2,
        subscribe: _.noop,
      }}
    />
  ));
  expect(mockLeaderboardActions.leaderboard.fetchLeaderboardInit).toHaveBeenCalled();
  expect(mockLeaderboardActions.leaderboard.fetchLeaderboardDone).toHaveBeenCalled();
});

const obj = TU.renderIntoDocument((
  <Leaderboard
    store={{
      dispatch: () => _.noop,
      getState: () => mockState,
      subscribe: _.noop,
    }}
  />
));

const props = obj.selector.props;

test('loadLeaderboard dispatch', () => {
  props.loadLeaderboard();
  expect(mockLeaderboardActions.leaderboard.fetchLeaderboardInit).toHaveBeenCalled();
  expect(mockLeaderboardActions.leaderboard.fetchLeaderboardDone).toHaveBeenCalled();
});

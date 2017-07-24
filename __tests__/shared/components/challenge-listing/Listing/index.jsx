import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';

const loadMoreDraft = jest.fn();
const loadMorePast = jest.fn();
const selectBucket = jest.fn();
const setFilterState = jest.fn();
const setSort = jest.fn();

const mockDatas = [{
  activeBucket: 'activeBucket',
  auth: {
    tokenV3: 'token',
    user: {
      handle: 'handle',
    },
  },
  challenges: [],
  loadingDraftChallenges: false,
  loadingPastChallenges: false,
  loadMoreDraft,
  loadMorePast,
  selectBucket,
  setFilterState,
  setSort,
  sorts: {},
}, {
  activeBucket: 'PAST',
  auth: {
    tokenV3: 'token',
    user: {
      handle: 'handle',
    },
  },
  challenges: [],
  loadingDraftChallenges: false,
  loadingPastChallenges: false,
  loadMoreDraft,
  loadMorePast,
  selectBucket,
  setFilterState,
  setSort,
  sorts: {},
}, {
  activeBucket: 'UPCOMING',
  auth: {
    tokenV3: 'token',
    user: {
      handle: 'handle',
    },
  },
  challenges: [],
  loadingDraftChallenges: false,
  loadingPastChallenges: false,
  loadMoreDraft,
  loadMorePast,
  selectBucket,
  setFilterState,
  setSort,
  sorts: {},
}, {
  activeBucket: 'activeBucket',
  auth: {
    tokenV3: 'token',
  },
  challenges: [],
  loadingDraftChallenges: false,
  loadingPastChallenges: false,
  loadMoreDraft,
  loadMorePast,
  selectBucket,
  setFilterState,
  setSort,
  sorts: {},
}, {
  activeBucket: 'ONGOING',
  auth: {
    tokenV3: 'token',
  },
  challenges: [],
  loadingDraftChallenges: false,
  loadingPastChallenges: false,
  loadMoreDraft,
  loadMorePast,
  selectBucket,
  setFilterState,
  setSort,
  sorts: {},
}];

jest.mock('utils/challenge-listing/buckets', () => ({
  getBuckets: () => ({
    activeBucket: {},
    saved: {},
    OPEN_FOR_REGISTRATION: {},
    PAST: {},
    ONGOING: {},
    MY: {},
    UPCOMING: {},
  }),
  BUCKETS: {
    ALL: 'activeBucket',
    SAVED_FILTER: 'saved',
    OPEN_FOR_REGISTRATION: 'OPEN_FOR_REGISTRATION',
    PAST: 'PAST',
    ONGOING: 'ONGOING',
    MY: 'MY',
    UPCOMING: 'UPCOMING',
  },
}),
);

const Listing = require('components/challenge-listing/Listing').default;

afterAll(() => {
  jest.clearAllMocks();
});

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  _.forEach(mockDatas, (data) => {
    renderer.render((
      <Listing {...data} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});


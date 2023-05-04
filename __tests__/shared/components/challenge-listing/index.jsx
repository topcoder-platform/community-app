import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';

let ChallengeListing = require('components/challenge-listing').default;

const selectBucket = jest.fn();
const setFilterState = jest.fn();
const setSort = jest.fn();

const mockData1 = {
  activeBucket: 'abc',
  challenges: [],
  filterState: {},
  lastUpdateOfActiveChallenges: 1500124537142,
  loadingChallenges: false,
  loadingDraftChallenges: false,
  loadingPastChallenges: false,
  selectBucket,
  setFilterState,
  setSort,
  sorts: {},
  auth: {},
  location: {},
};

const mockData2 = _.extend({}, mockData1, {
  communityFilter: {},
  loadingChallenges: true,
  location: {},
});

describe('Matches shallow shapshot 1', () => {
  test('shapshot 1', () => {
    const renderer = new Renderer();

    renderer.render((
      <ChallengeListing {...mockData1} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});


describe('Matches shallow shapshot 2', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('react-responsive', () => ({
      useMediaQuery: () => true,
    }));
    ChallengeListing = require('components/challenge-listing').default;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('shapshot 2', () => {
    // require('utils/config');
    const renderer = new Renderer();

    renderer.render((
      <ChallengeListing {...mockData2} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

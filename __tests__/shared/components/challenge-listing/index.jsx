import React from 'react';
import Renderer from 'react-test-renderer/shallow';

const ChallengeListing = require('components/challenge-listing').default;

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
};

describe('Matches shallow shapshot 1', () => {
  test('shapshot 1', () => {
    const renderer = new Renderer();

    renderer.render((
      <ChallengeListing {...mockData1} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

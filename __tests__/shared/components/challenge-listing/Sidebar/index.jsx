import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import Sidebar from 'components/challenge-listing/Sidebar';

const changeFilterName = jest.fn();
const deleteSavedFilter = jest.fn();
const dragSavedFilterMove = jest.fn();
const dragSavedFilterStart = jest.fn();
const resetFilterName = jest.fn();
const selectBucket = jest.fn();
const selectSavedFilter = jest.fn();
const setEditSavedFiltersMode = jest.fn();
const updateAllSavedFilters = jest.fn();
const updateSavedFilter = jest.fn();

const mockDatas = [
  {
    activeBucket: 'activeBucket',
    activeSavedFilter: 3,
    buckets: {},
    challenges: [{ id: '1', registrationOpen: 'open' }],
    changeFilterName,
    communityFilter: {},
    deleteSavedFilter,
    disabled: false,
    dragState: {},
    dragSavedFilterMove,
    dragSavedFilterStart,
    editSavedFiltersMode: false,
    filterState: {},
    isAuth: false,
    resetFilterName,
    savedFilters: [],
    selectBucket,
    selectSavedFilter,
    setEditSavedFiltersMode,
    updateAllSavedFilters,
    updateSavedFilter,
  }, {
    activeBucket: 'activeBucket',
    activeSavedFilter: 3,
    buckets: {},
    challenges: [{ id: '1', registrationOpen: 'open' }],
    changeFilterName,
    communityFilter: {},
    deleteSavedFilter,
    disabled: false,
    dragState: {},
    dragSavedFilterMove,
    dragSavedFilterStart,
    editSavedFiltersMode: true,
    filterState: {},
    isAuth: false,
    resetFilterName,
    savedFilters: [],
    selectBucket,
    selectSavedFilter,
    setEditSavedFiltersMode,
    updateAllSavedFilters,
    updateSavedFilter,
  },
];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  _.forEach(mockDatas, (data) => {
    renderer.render((
      <Sidebar {...data} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});


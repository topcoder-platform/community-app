import { mockAction } from 'utils/mock';

jest.mock('utils/url', () => ({
  updateQuery: () => {},
}));
const defaultReducer = require('reducers/challenge-listing/sidebar').default;

const mockActions = {
  changeFilterName: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/CHANGE_FILTER_NAME',
    payload,
    error,
  ),
  deleteSavedFilter: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/DELETE_SAVED_FILTER',
    payload,
    error,
  ),
  dragSavedFilterMove: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/DRAG_SAVED_FILTER_MOVE',
    payload,
    error,
  ),
  dragSavedFilterStart: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/DRAG_SAVED_FILTER_START',
    payload,
    error,
  ),
  getSavedFilters: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/GET_SAVED_FILTERS',
    payload,
    error,
  ),
  resetFilterName: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/RESET_FILTER_NAME',
    payload,
    error,
  ),
  saveFilter: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/SAVE_FILTER',
    payload,
    error,
  ),
  selectBucket: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/SELECT_BUCKET',
    payload,
    error,
  ),
  selectSavedFilter: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/SELECT_SAVED_FILTER',
    payload,
    error,
  ),
  setEditSavedFiltersMode: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/SET_EDIT_SAVED_FILTERS_MODE',
    payload,
    error,
  ),
  updateSavedFilter: (payload, error) => mockAction(
    'CHALLENGE_LISTING/SIDEBAR/UPDATE_SAVED_FILTER',
    payload,
    error,
  ),
};

let expectedState = {
  activeBucket: 'all',
  activeSavedFilter: 0,
  editSavedFiltersMode: false,
  savedFilters: [],
};

function testReducer(reducer) {
  let state;

  test('creates expected initial state', () => {
    state = reducer(undefined, {});
    expect(state).toEqual(expectedState);
  });

  test('properly handles saveFilter', () => {
    state = reducer(state, mockActions.saveFilter({ name: 'name', filter: '"filter"' })());
    expectedState = {
      ...expectedState,
      activeBucket: 'saved-filter',
      activeSavedFilter: 0,
      savedFilters: [{ name: 'name', filter: 'filter' }],
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles changeFilterName', () => {
    state = reducer(state, mockActions.changeFilterName({ index: 0, name: 'other' })());
    expectedState = {
      ...expectedState,
      savedFilters: [{
        name: 'other',
        savedName: 'name',
        filter: 'filter',
      }],
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles deleteSavedFilter', () => {
    state = reducer(state, mockActions.deleteSavedFilter('id')());
    expect(state).toEqual(expectedState);
  });

  test('properly handles dragSavedFilterStart', () => {
    state = reducer(state, mockActions.dragSavedFilterStart('payload')());
    expectedState = {
      ...expectedState,
      dragState: 'payload',
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles dragSavedFilterMove', () => {
    state = reducer(state, mockActions.dragSavedFilterMove({ currentIndex: -1 })());
    expectedState = {
      ...expectedState,
      dragState: { currentIndex: 0 },
    };
    expect(state).toEqual(expectedState);

    state = reducer(state, mockActions.dragSavedFilterMove({ currentIndex: 2 })());
    expect(state).toEqual(expectedState);

    state = reducer(state, mockActions.dragSavedFilterMove({ currentIndex: 0 })());
    expect(state).toEqual(expectedState);
  });

  test('properly handles getSavedFilters', () => {
    const savedFilters = [{ name: 'name', filter: 'filter', savedName: 'savedName', id: '1' }, { name: 'name2', filter: 'filter2' }];
    state = reducer(state, mockActions.getSavedFilters(savedFilters)());
    expectedState = {
      ...expectedState,
      savedFilters,
    };
    expect(state).toEqual(expectedState);
  });


  test('properly handles resetFilterName', () => {
    state = reducer(state, mockActions.resetFilterName(1)());
    expect(state).toEqual(expectedState);

    state = reducer(state, mockActions.resetFilterName(0)());
    expectedState = {
      ...expectedState,
      savedFilters: [{ filter: 'filter', name: 'savedName', id: '1' }, { name: 'name2', filter: 'filter2' }],
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles selectBucket', () => {
    state = reducer(state, mockActions.selectBucket('all')());
    expectedState = {
      ...expectedState,
      activeBucket: 'all',
    };
    expect(state).toEqual(expectedState);

    state = reducer(state, mockActions.selectBucket('saved-filter')());
    expectedState = {
      ...expectedState,
      activeBucket: 'saved-filter',
    };
    expect(state).toEqual(expectedState);

    state = reducer(state, mockActions.selectBucket('upcoming')());
    expectedState = {
      ...expectedState,
      activeBucket: 'upcoming',
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles selectSavedFilter', () => {
    state = reducer(state, mockActions.selectSavedFilter(1)());
    expectedState = {
      ...expectedState,
      activeBucket: 'saved-filter',
      activeSavedFilter: 1,
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles setEditSavedFiltersMode', () => {
    state = reducer(state, mockActions.setEditSavedFiltersMode(true)());
    expectedState = {
      ...expectedState,
      editSavedFiltersMode: true,
    };
    expect(state).toEqual(expectedState);
  });

  test('properly handles updateSavedFilter', () => {
    state = reducer(state, mockActions.updateSavedFilter({ id: '1', filter: '"another filter"' })());
    expectedState = {
      ...expectedState,
      editSavedFiltersMode: true,
      savedFilters: [{ filter: 'another filter', id: '1' }, { name: 'name2', filter: 'filter2' }],
    };
    expect(state).toEqual(expectedState);
  });
}

describe('default reducer', () => testReducer(defaultReducer));

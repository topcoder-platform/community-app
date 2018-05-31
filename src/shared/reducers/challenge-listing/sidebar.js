/**
 * Challenge listing sidebar reducer.
 */

/* global alert */
/* eslint-disable no-alert */

import _ from 'lodash';
import actions from 'actions/challenge-listing/sidebar';
import { logger } from 'topcoder-react-lib';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import { handleActions } from 'redux-actions';
import { updateQuery } from 'utils/url';

const MAX_FILTER_NAME_LENGTH = 35;

/**
 * Handles changeFilterName action.
 * @param {Object} state
 * @param {Object} action
 */
function onChangeFilterName(state, { payload: { index, name } }) {
  const savedFilters = _.clone(state.savedFilters);
  savedFilters[index] = {
    ...savedFilters[index],
    error: name.trim() ? '' : 'Filter name must not be empty',
    name: name.slice(0, MAX_FILTER_NAME_LENGTH),
  };
  if (_.isUndefined(savedFilters[index].savedName)) {
    savedFilters[index].savedName = state.savedFilters[index].name;
  }
  return { ...state, savedFilters };
}

/**
 * Handles outcome of the deleteSavedFilter action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onDeleteSavedFilter(state, action) {
  if (action.error) {
    logger.error(action.payload);
    return state;
  }
  const id = action.payload;
  return {
    ...state,
    savedFilters: state.savedFilters.filter(item => item.id !== id),
  };
}

function onDragSavedFilterMove(state, action) {
  const dragState = _.clone(action.payload);
  if (dragState.currentIndex < 0) dragState.currentIndex = 0;
  else if (dragState.currentIndex >= state.savedFilters.length) {
    dragState.currentIndex = state.savedFilters.length - 1;
  }
  const savedFilters = _.clone(state.savedFilters);
  const [filter] = savedFilters.splice(state.dragState.currentIndex, 1);
  savedFilters.splice(dragState.currentIndex, 0, filter);
  return {
    ...state,
    dragState,
    savedFilters,
  };
}

function onDragSavedFilterStart(state, action) {
  return { ...state, dragState: action.payload };
}

/**
 * Handles outcome of saveFilter action.
 * @param {Object} state
 * @param {Object} action
 */
function onFilterSaved(state, action) {
  if (action.error) {
    logger.error(action.payload);
    alert('Failed to save the filter!');
    return {
      ...state,
      isSavingFilter: false,
    };
  }

  const newSavedFilter = {
    ...action.payload,
    filter: JSON.parse(action.payload.filter),
  };

  return {
    ...state,
    activeBucket: newSavedFilter.filter.isForReviewOpportunities ?
      BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER : BUCKETS.SAVED_FILTER,
    activeSavedFilter: state.savedFilters.length,
    savedFilters: state.savedFilters.concat(newSavedFilter),
    isSavingFilter: false,
  };
}

/**
 * Resets filter name to the last one saved to the API.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onResetFilterName(state, action) {
  const index = action.payload;
  if (_.isUndefined(state.savedFilters[index].savedName)) return state;
  const savedFilters = _.clone(state.savedFilters);
  savedFilters[index] = {
    ...savedFilters[index],
    error: '',
    name: savedFilters[index].savedName,
  };
  delete savedFilters[index].savedName;
  return { ...state, savedFilters };
}

function onSelectBucket(state, { payload }) {
  switch (payload) {
    case BUCKETS.ALL:
    case BUCKETS.SAVED_FILTER:
      updateQuery({ bucket: undefined });
      break;
    default:
      updateQuery({ bucket: payload });
      break;
  }
  return { ...state, activeBucket: payload };
}

function onSelectSavedFilter(state, { payload }) {
  const { isForReviewOpportunities } = state.savedFilters[payload].filter;
  updateQuery({
    bucket: isForReviewOpportunities ? BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER : undefined,
  });
  return {
    ...state,
    activeBucket: isForReviewOpportunities ?
      BUCKETS.SAVED_REVIEW_OPPORTUNITIES_FILTER : BUCKETS.SAVED_FILTER,
    activeSavedFilter: payload,
  };
}

/**
 * Handles outcome of the updateSavedFilterAction.
 * @param {Object} state
 * @param {Object} action
 */
function onUpdateSavedFilter(state, action) {
  if (action.error) {
    logger.error(action.payload);
    return state;
  }
  const filter = action.payload;
  const index = _.findIndex(state.savedFilters, item => item.id === filter.id);
  const savedFilters = _.clone(state.savedFilters);
  savedFilters[index] = filter;
  savedFilters[index].filter = JSON.parse(filter.filter);
  return { ...state, savedFilters };
}

function create(initialState = {}) {
  const a = actions.challengeListing.sidebar;
  return handleActions({
    [a.changeFilterName]: onChangeFilterName,
    [a.deleteSavedFilter]: onDeleteSavedFilter,
    [a.dragSavedFilterMove]: onDragSavedFilterMove,
    [a.dragSavedFilterStart]: onDragSavedFilterStart,
    [a.getSavedFilters]: (state, action) => ({
      ...state,
      savedFilters: action.error ? [] : action.payload,
    }),
    [a.resetFilterName]: onResetFilterName,
    [a.saveFilterDone]: onFilterSaved,
    [a.saveFilterInit]: state => ({
      ...state,
      isSavingFilter: true,
    }),
    [a.selectBucket]: onSelectBucket,
    [a.selectSavedFilter]: onSelectSavedFilter,
    [a.setEditSavedFiltersMode]: (state, { payload }) => ({
      ...state,
      editSavedFiltersMode: payload,
    }),
    [a.updateSavedFilter]: onUpdateSavedFilter,
  }, _.defaults(initialState, {
    activeBucket: BUCKETS.ALL,
    activeSavedFilter: 0,
    editSavedFiltersMode: false,
    savedFilters: [],
    isSavingFilter: false,
  }));
}

export function factory(req) {
  const state = {};

  if (req) {
    state.activeBucket = req.query.bucket;
  }

  return Promise.resolve(create(state));
}

export default create();

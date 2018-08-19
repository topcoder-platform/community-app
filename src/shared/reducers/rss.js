/**
 * Reducer for actions related to data loading from RSS feeds.
 */

import _ from 'lodash';
import actions from 'actions/rss';
import { logger, errors } from 'topcoder-react-lib';
import { handleActions } from 'redux-actions';

const { fireErrorMessage } = errors;

/**
 * Removes a feed from the state, which also silently cancels any pending data
 * loading.
 * @param {Object} state
 * @param {String} payload Internal feed name.
 * @return {Object} New state.
 */
function onDrop(state, { payload }) {
  if (!state[payload]) return state;
  return _.omit(state, payload);
}

/**
 * Removes all loaded feeds and cancels any pending loading operations.
 * @return {Object} New state.
 */
function onDropAll() {
  return {};
}

/**
 * Marks the beginning of loading of the specified feed data.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetInit(state, action) {
  const { feed, uuid } = action.payload;
  const obj = state[feed] ? _.clone(state[feed]) : {
    data: null,
    timestamp: 0,
  };
  obj.loadingUuid = uuid;
  return {
    ...state,
    [feed]: obj,
  };
}

/**
 * Finalizes a pending loading operation for RSS feed data.
 * @param {Object} state
 * @param {Boolean} error
 * @param {Object} payload
 * @return {Object} New state.
 */
function onGetDone(state, { error, payload }) {
  if (error) {
    logger.error('Failed to load RSS feed', payload);
    fireErrorMessage('ERROR: Failed to load RSS feed', '');
    return state;
  }

  const { feed, uuid, data } = payload;
  if (!state[feed] || uuid !== state[feed].loadingUuid) return state;
  return {
    ...state,
    [feed]: {
      data,
      loadingUuid: '',
      timestamp: Date.now(),
    },
  };
}

/**
 * Creates RSS reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.rss;
  return handleActions({
    [a.drop]: onDrop,
    [a.dropAll]: onDropAll,
    [a.getInit]: onGetInit,
    [a.getDone]: onGetDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();

import _ from 'lodash';
import actions from 'actions/cms/dashboard/announcements';
import { logger, errors } from 'topcoder-react-lib';
import { handleActions } from 'redux-actions';

const { fireErrorMessage } = errors;

/**
 * Inits the loading of the active announcement.
 * @param {Object} state
 * @param {String} payload Operation UUID.
 * @return {Object} New state.
 */
function onGetActiveInit(state, { payload }) {
  return {
    ...state,
    active: {
      ...state.active,
      loadingUuid: payload,
    },
  };
}

/**
 * Loads the active announcement.
 * @param {Object} state
 * @param {Boolean} error
 * @param {Object} payload
 * @return {Object} New state.
 */
function onGetActiveDone(state, { error, payload }) {
  if (error) {
    logger.error('Failed to get the active announcement', payload);
    fireErrorMessage('Failed to get the active announcement', '');
    return state;
  }

  const { assets, data, uuid } = payload;
  if (uuid !== state.active.loadingUuid) return state;
  return {
    ...state,
    active: {
      assets,
      data,
      loadingUuid: '',
      timestamp: Date.now(),
    },
  };
}

/**
 * Inits the preview loading.
 * @param {Object} state
 * @param {String} payload Operation UUID.
 * @return {Object} New state.
 */
function onGetPreviewInit(state, { payload }) {
  return {
    ...state,
    preview: {
      ...state.preview,
      loadingUuid: payload,
    },
  };
}

/**
 * Received the loaded announcement preview.
 * @param {Object} state
 * @param {Boolean} error
 * @param {Object} payload
 * @return {Object} New state.
 */
function onGetPreviewDone(state, { error, payload }) {
  if (error) {
    fireErrorMessage('Failed to get announcement preview', '');
    return state;
  }

  const { assets, data, uuid } = payload;
  if (uuid !== state.preview.loadingUuid) return state;
  return {
    ...state,
    preview: {
      assets,
      data,
      loadingUuid: '',
      timestamp: Date.now(),
    },
  };
}

/**
 * Inits the loading of scheduled announcements list.
 * @param {Object} state Old state.
 * @param {String} payload Operation UUID.
 * @return {Object} New state.
 */
function onGetScheduledInit(state, { payload }) {
  return {
    ...state,
    scheduled: {
      ...state.scheduled,
      loadingUuid: payload,
    },
  };
}

/**
 * Receives the loaded list of scheduled announcements.
 * @param {Object} state Old state.
 * @param {Object} error Operation error, if any.
 * @param {String} payload Object with two fields:
 *  - data {Array} - Loaded list;
 *  - uuid {String} - Operation UUID;
 * @return {Object} New state.
 */
function onGetScheduledDone(state, { error, payload }) {
  if (error) {
    fireErrorMessage('Failed to get the list of scheduled announcements', '');
    return state;
  }

  const { uuid, data } = payload;
  if (uuid !== state.scheduled.loadingUuid) return state;
  return {
    ...state,
    scheduled: {
      data,
      loadingUuid: '',
      timestamp: Date.now(),
    },
  };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} New reducer.
 */
function create(state = {}) {
  const a = actions.cms.dashboard.announcements;
  return handleActions({
    [a.getActiveInit]: onGetActiveInit,
    [a.getActiveDone]: onGetActiveDone,
    [a.getPreviewInit]: onGetPreviewInit,
    [a.getPreviewDone]: onGetPreviewDone,
    [a.getScheduledInit]: onGetScheduledInit,
    [a.getScheduledDone]: onGetScheduledDone,
  }, _.defaults(state, {
    active: {
      assets: {},
      data: {},
      loadingUuid: '',
      timestamp: 0,
    },
    preview: {
      assets: {},
      data: {},
      loadingUuid: '',
      timestamp: 0,
    },
    scheduled: {
      data: [],
      loadingUuid: '',
      timestamp: 0,
    },
  }));
}

export default create();

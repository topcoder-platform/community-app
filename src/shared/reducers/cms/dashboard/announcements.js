import _ from 'lodash';
import actions from 'actions/cms/dashboard/announcements';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { fireErrorMessage } from 'utils/errors';

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
  }));
}

export default create();

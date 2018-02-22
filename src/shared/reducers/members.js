/**
 * Reducer for the Redux store segment that holds members data.
 */

import _ from 'lodash';
import actions from 'actions/members';
import { logger } from 'utils/logger';
import { handleActions } from 'redux-actions';
import { fireErrorMessage } from 'utils/errors';

/**
 * Drops information about a member.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onDrop(state, { payload }) {
  if (!state[payload]) return state;
  return _.omit(state, payload);
}

/**
 * Drops all loaded information on members.
 * @return {Object} New state.
 */
function onDropAll() {
  return {};
}

/**
 * Inits the loading of member achievements.
 * @param {Object} state
 * @param {String} action.handle
 * @param {String} action.uuid
 * @return {Object} New state.
 */
function onGetAchievementsInit(state, action) {
  const { handle, uuid } = action.payload;
  let res = state[handle];
  res = res ? _.clone(res) : {};
  res.achievements = { loadingUuid: uuid };
  return { ...state, [handle]: res };
}

/**
 * Finalizes the loading of member achievements.
 * @param {Object} state
 * @param {Object} error
 * @param {Array} payload.data
 * @param {String} payload.handle
 * @param {String} payload.uuid
 * @return {Object} New state.
 */
function onGetAchievementsDone(state, { error, payload }) {
  if (error) {
    logger.error('Failed to load member achievements', payload);
    fireErrorMessage('Failed to load member achievements');
    return state;
  }

  const { data, handle, uuid } = payload;
  if (uuid !== _.get(state[handle], 'achievements.loadingUuid')) return state;
  return {
    ...state,
    [handle]: {
      ...state[handle],
      achievements: { data, timestamp: Date.now() },
    },
  };
}

/**
 * Initializes the loading of member financial information.
 * @param {Object} state
 * @param {String} action.payload.handle
 * @param {String} action.payload.uuid
 * @return {Object} New state.
 */
function onGetFinancesInit(state, action) {
  const { handle, uuid } = action.payload;
  const envelop = {
    ...(state[handle] || {}),
    finances: {
      loadingUuid: uuid,
      timestamp: 0,
    },
  };
  return {
    ...state,
    [handle]: envelop,
  };
}

/**
 * Finalizes a pending loading of member financial information.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetFinancesDone(state, { error, payload }) {
  if (error) {
    logger.error('Failed to get user financial info', payload);
    fireErrorMessage('Failed to get user financial info', '');
    return state;
  }

  const { data, handle, uuid } = payload;
  if (uuid !== _.get(state[handle], 'finances.loadingUuid')) return state;
  return {
    ...state,
    [handle]: {
      ...state[handle],
      finances: {
        data,
        loadingUuid: '',
        timestamp: Date.now(),
      },
    },
  };
}

/**
 * Inits the loading of member stats.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetStatsInit(state, action) {
  const { handle, uuid } = action.payload;
  let res = state[handle];
  res = res ? _.clone(res) : {};
  res.stats = { loadingUuid: uuid };
  return {
    ...state,
    [handle]: res,
  };
}

/**
 * Finalizes the loading of member stats.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetStatsDone(state, { error, payload }) {
  if (error) {
    logger.error('Failed to get member stats', payload);
    fireErrorMessage('Failed to get member stats', '');
    return state;
  }

  const { data, handle, uuid } = payload;
  if (uuid !== _.get(state[handle], 'stats.loadingUuid')) return state;
  return {
    ...state,
    [handle]: {
      ...state[handle],
      stats: { data, timestamp: Date.now() },
    },
  };
}

/**
 * Creates reduces with the specified intial state.
 * @param {Object} state Optional. If not given, the default one is generated.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.members;
  return handleActions({
    [a.drop]: onDrop,
    [a.dropAll]: onDropAll,
    [a.getAchievementsInit]: onGetAchievementsInit,
    [a.getAchievementsDone]: onGetAchievementsDone,
    [a.getFinancesInit]: onGetFinancesInit,
    [a.getFinancesDone]: onGetFinancesDone,
    [a.getStatsInit]: onGetStatsInit,
    [a.getStatsDone]: onGetStatsDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();

import _ from 'lodash';
import { handleActions } from 'redux-actions';
import { logger } from 'topcoder-react-lib';

import actions from 'actions/page/profile';

/**
 * Inits the loading of user's badges.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function getGamificationBadgesInit(state, { payload }) {
  const { handle } = payload;
  return {
    ...state,
    [handle]: {
      ...state[handle],
      badges: {},
    },
  };
}

/**
 * Finalizes the loading of user's badges.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function getGamificationBadgesDone(state, { error, payload }) {
  if (error) {
    logger.error('Failed to get user badges', payload);
    return state;
  }

  const { badges, handle } = payload;

  return {
    ...state,
    [handle]: {
      ...state[handle],
      badges,
    },
  };
}

/**
 * Creates a new reducer.
 * @param {Object} state Optional. Initial state.
 * @return {Function} Reducer.
 */
function create(defaultState = {}) {
  const a = actions.page.profile;
  return handleActions({
    [a.getGamificationBadgesInit]: getGamificationBadgesInit,
    [a.getGamificationBadgesDone]: getGamificationBadgesDone,
  }, _.defaults(defaultState, {}));
}

export default create();

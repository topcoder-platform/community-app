/**
 * Reducer for Lookup API data
 */
import _ from 'lodash';
import logger from 'utils/logger';
import actions from 'actions/lookup';
import { handleActions } from 'redux-actions';

/**
 * Handles LOOKUP/GET_APPROVED_SKILLS action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetApprovedSkills(state, { payload, error }) {
  if (error) {
    logger.error('Failed to get approved skill tags', payload);
    return { ...state, loadingApprovedSkillsError: true };
  }

  return ({
    ...state,
    loadingApprovedSkillsError: false,
    approvedSkills: payload,
  });
}

/**
 * Creates lookup reducer with the specified intial state.
 * @param {Object} initialState Optional. If not given, the default state is assumed.
 * @return {Function} Reducer.
 */
function create(initialState) {
  const a = actions.lookup;
  return handleActions({
    [a.getApprovedSkills]: onGetApprovedSkills,
  }, _.defaults(initialState, {
    approvedSkills: [],
  }));
}

/**
 * Factory which creates a new reducer.
 * @return Promise which resolves to the new reducer.
 */
export function factory() {
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();

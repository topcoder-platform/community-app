/**
 * Reducer for Profile API data
 */
import _ from 'lodash';
import actions from 'actions/profile';
import { handleActions } from 'redux-actions';

/**
 * Handles PROFILE/GET_ACHIEVEMENTS_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetAchievementsDone(state, { payload, error }) {
  if (error) {
    return { ...state, loadingError: true };
  }

  return ({
    ...state,
    achievements: payload.Achievements,
    copilot: payload.copilot,
    country: payload.country,
    loadingError: false,
  });
}

/**
 * Handles PROFILE/GET_EXTERNAL_ACCOUNTS_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetExternalAccountsDone(state, { payload, error }) {
  if (error) {
    return { ...state, loadingError: true };
  }

  return ({
    ...state,
    externalAccounts: payload,
  });
}

/**
 * Handles PROFILE/GET_EXTERNAL_LINKS_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetExternalLinksDone(state, { payload, error }) {
  if (error) {
    return { ...state, loadingError: true };
  }

  return ({
    ...state,
    externalLinks: payload,
  });
}

/**
 * Handles PROFILE/GET_INFO_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetInfoDone(state, { payload, error }) {
  if (error) {
    return { ...state, loadingError: true };
  }

  return ({ ...state, info: payload, loadingError: false });
}

/**
 * Handles PROFILE/GET_SKILLS_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetSkillsDone(state, { payload, error }) {
  if (error) {
    return { ...state, loadingError: true };
  }

  return ({ ...state, skills: payload.skills, loadingError: false });
}

/**
 * Handles PROFILE/GET_STATS_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetStatsDone(state, { payload, error }) {
  if (error) {
    return { ...state, loadingError: true };
  }

  return ({ ...state, stats: payload, loadingError: false });
}

/**
 * Handles PROFILE/GET_STATS_HISTORY_DONE action.
 * @param {Object} state
 * @param {Object} action Payload will be JSON from api call
 * @return {Object} New state
 */
function onGetStatsHistoryDone(statsHistory, { payload, error }) {
  if (error) {
    return { ...statsHistory, loadingError: true };
  }

  return ({ ...statsHistory, statsHistory: payload, loadingError: false });
}

function create(initialState) {
  const a = actions.profile;
  return handleActions({
    [a.loadProfile]: (state, action) => ({ ...state, profileForHandle: action.payload }),
    [a.getAchievementsInit]: state => state,
    [a.getAchievementsDone]: onGetAchievementsDone,
    [a.getExternalAccountsInit]: state => state,
    [a.getExternalAccountsDone]: onGetExternalAccountsDone,
    [a.getExternalLinksInit]: state => state,
    [a.getExternalLinksDone]: onGetExternalLinksDone,
    [a.getInfoInit]: state => state,
    [a.getInfoDone]: onGetInfoDone,
    [a.getSkillsInit]: state => state,
    [a.getSkillsDone]: onGetSkillsDone,
    [a.getStatsInit]: state => state,
    [a.getStatsDone]: onGetStatsDone,
    [a.getStatsHistoryInit]: state => state,
    [a.getStatsHistroyDone]: onGetStatsHistoryDone,
  }, _.defaults(initialState, {
    achievements: null,
    copilot: false,
    country: '',
    info: null,
    loadingError: false,
    skills: null,
    stats: null,
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

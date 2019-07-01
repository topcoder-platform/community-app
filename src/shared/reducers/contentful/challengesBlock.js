/**
 * Reducer for state.challengesBlock
 */

import actions from 'actions/contentful';
import { handleActions } from 'redux-actions';

/**
 * Handles challengesBlock.getChallengesBlockInit action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onGetChallengesBlockInit(state, action) {
  return {
    ...state,
    [action.payload.id]: {
      loading: true,
      challenges: [],
      fields: {},
    },
  };
}

/**
 * Handles challengesBlock.getChallengesBlockDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onGetChallengesBlockDone(state, action) {
  return {
    ...state,
    [action.payload.id]: {
      loading: false,
      challenges: action.payload.challenges,
      fields: action.payload.fields,
    },
  };
}

/**
 * Creates challengesBlock reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  return handleActions({
    [actions.contentful.getChallengesBlockInit]: onGetChallengesBlockInit,
    [actions.contentful.getChallengesBlockDone]: onGetChallengesBlockDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();

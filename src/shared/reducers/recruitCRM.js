/**
 * Reducer for state.recruit
 */
import _ from 'lodash';
import actions from 'actions/recruitCRM';
import { handleActions } from 'redux-actions';

/**
 * Handles recruit.getJobsInit action.
 * @param {Object} state Previous state.
 */
function onInit(state) {
  return {
    ...state,
    jobs: {},
    loading: true,
  };
}

/**
 * Handles recruit.getJobsDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onDone(state, { payload }) {
  return {
    ...state,
    loading: false,
    jobs: payload.data,
  };
}

/**
 * Handles recruit.getJobInit action.
 * @param {Object} state Previous state.
 */
function onJobInit(state, { payload }) {
  return {
    ...state,
    [payload.id]: {
      loading: true,
    },
  };
}

/**
 * Handles recruit.getJobDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onJobDone(state, { payload }) {
  return {
    ...state,
    [payload.id]: {
      loading: false,
      job: payload.data,
    },
  };
}

/**
 * Handles recruit.applyForJobInit action.
 * @param {Object} state Previous state.
 */
function onApplyForJobInit(state, { payload }) {
  const r = {
    ...state,
  };
  r[payload.id].applying = true;
  return r;
}

/**
 * Handles recruit.applyForJobDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onApplyForJobDone(state, action) {
  const r = {
    ...state,
  };
  if (!action.error) {
    r[action.payload.id].applying = false;
    r[action.payload.id].application = action.payload.data;
  }
  return r;
}

/**
 * Handles recruit.applyForJobInit action.
 * @param {Object} state Previous state.
 */
function onSearchCandidatesInit(state, { payload }) {
  const r = {
    ...state,
  };
  r[payload.email] = {};
  return r;
}

/**
 * Handles recruit.applyForJobDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onSearchCandidatesDone(state, { payload }) {
  const r = {
    ...state,
  };
  const profile = _.isArray(payload.data) ? {} : payload.data.data[0];
  r[payload.email].profile = profile;
  return r;
}

function onGetJobApplicationsInit(state) {
  return {
    ...state,
    applications: 0,
  };
}

function onGetJobApplicationsDone(state, { payload }) {
  return {
    ...state,
    applications: payload.data,
  };
}

/**
 * Handles recruit.getGigsInit action.
 * @param {Object} state Previous state.
 */
function onGigsInit(state) {
  return {
    ...state,
    gigs: [],
    gigsLoading: true,
  };
}

/**
 * Handles recruit.getGigsDone action.
 * @param {Object} state Previous state.
 * @param {Object} action The action.
 */
function onGigsDone(state, { payload }) {
  return {
    ...state,
    gigsLoading: false,
    gigs: payload.data,
  };
}

/**
 * Creates recruitCRM reducer with the specified initial state.
 * @param {Object} state Optional. If not given, the default one is
 *  generated automatically.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  return handleActions({
    [actions.recruit.getJobsInit]: onInit,
    [actions.recruit.getJobsDone]: onDone,
    [actions.recruit.getJobInit]: onJobInit,
    [actions.recruit.getJobDone]: onJobDone,
    [actions.recruit.applyForJobInit]: onApplyForJobInit,
    [actions.recruit.applyForJobDone]: onApplyForJobDone,
    [actions.recruit.searchCandidatesInit]: onSearchCandidatesInit,
    [actions.recruit.searchCandidatesDone]: onSearchCandidatesDone,
    [actions.recruit.getJobApplicationsInit]: onGetJobApplicationsInit,
    [actions.recruit.getJobApplicationsDone]: onGetJobApplicationsDone,
    [actions.recruit.getGigsInit]: onGigsInit,
    [actions.recruit.getGigsDone]: onGigsDone,
  }, state);
}

/* Reducer with the default initial state. */
export default create();

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
    jobs: _.filter(payload.data, job => job.enable_job_application_form === 1),
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
function onApplyForJobDone(state, { payload }) {
  const r = {
    ...state,
  };
  r[payload.id].applying = false;
  r[payload.id].application = payload.data;
  return r;
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
  }, state);
}

/* Reducer with the default initial state. */
export default create();

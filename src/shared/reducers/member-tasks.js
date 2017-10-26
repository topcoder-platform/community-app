/**
 * Member tasks reducer.
 */
/* global alert */

import _ from 'lodash';
import actions, { PAGE_SIZE } from 'actions/member-tasks';
import logger from 'utils/logger';
import { handleActions } from 'redux-actions';
import { isClientSide } from 'utils/isomorphy';

/**
 * Drops all tasks and cancels the ongoing loading operation, if it is pending.
 * @param {Object} state
 * @return {Object} New state.
 */
function onDropAll(state) {
  return {
    ...state,
    allLoaded: false,
    lastRequestedPageNum: -1,
    loadingUuid: '',
    tasks: [],
    timestamp: 0,
  };
}

/**
 * Stores into the state meta data about the initiated loading operation.
 * This will effectively cancel the already pending loading operation, if any.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetInit(state, { payload }) {
  return {
    ...state,
    lastRequestedPageNum: payload.pageNum,
    loadingUuid: payload.uuid,
  };
}

/**
 * Handles the actual result of the loading operation.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetDone(state, { error, payload }) {
  /* Bails out in case of error. */
  if (error) {
    logger.error(payload);
    /* NOTE: For now, using alert to inform about failures is kind of fine. */
    /* eslint-disable no-alert */
    if (isClientSide()) alert('Failed to load member tasks');
    /* eslint-enable no-alert */
    return state;
  }

  /* Silently ignores the action, if it has unexpected UUID. */
  const { projectId, tasks, uuid } = payload;
  if (uuid !== state.loadingUuid) return state;

  /* Generates the map of old tasks, and the count of old tasks related to
   * the specified project. */
  const taskMap = {};
  state.tasks.forEach((task) => {
    taskMap[task.id] = task;
  });

  /* Merges newly loaded tasks into the map of old ones. */
  tasks.forEach((task) => {
    taskMap[task.id] = task;
  });

  /* If the first page of tasks has been loaded, updates its timestamp. */
  let timestamps = state.timestamps;
  if (!state.lastRequestedPageNum) {
    timestamps = _.clone(timestamps);
    timestamps[projectId] = Date.now();
  }

  return {
    ...state,
    allLoaded: tasks.length < PAGE_SIZE,
    loadingUuid: '',
    tasks: _.values(taskMap),
    timestamps,
  };
}

/**
 * Creates a new member tasks reducer with the specified initial state.
 * @param {Object} state Optional. Initial state. Defaults to the default state.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.memberTasks;
  return handleActions({
    [a.dropAll]: onDropAll,
    [a.getInit]: onGetInit,
    [a.getDone]: onGetDone,
  }, _.defaults(state, {
    /* It is set true when a request to load tasks loads less tasks than a full
     * task page size. It is reset to false each time the page number 0 starts
     * to load. If you load task pages sequentially from the very first page,
     * with the same projectId and user specified by auth token, this flag
     * signals you when there is no more tasks to load. */
    allLoaded: false,

    /* Holds the number of the last requested task page. */
    lastRequestedPageNum: -1,

    /* Equals to the loading operation UUID when the result is pending; equals
     * empty string when nothing is being loaded. */
    loadingUuid: '',

    /* The list of tasks loaded so far. For better performance and user
     * experience it may contain tasks related to projects queried before;
     * be sure to filter it according to your needs. */
    tasks: [],

    /* Keys of this object are projectIds, and values keep the timestamps
     * corresponding to latest updates of the first page of tasks related
     * to those projects. */
    timestamps: {},
  }));
}

/* Exports default reducer. */
export default create();

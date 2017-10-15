/**
 * Actions for management of member tasks and payments. Under the hood it is
 * very similar to the challenge listing management, as these tasks are in fact
 * just challenges of a special kind); however, due to differences in the use
 * cases, we can implement task management more efficient with dedicated actions
 * and reducer; thus, this module.
 */

import { createActions } from 'redux-actions';
import { getService } from 'services/challenges';

/**
 * Holds the size of member tasks page for the MEMBER_TASK/GET_DONE action.
 * Mind that current version of TC API v3 restricts the possible page size
 * by 50 tasks anyway, thus setting this to a larger value will result in
 * problems.
 */
export const PAGE_SIZE = 50;

/**
 * Payload creator for the action that drops all loaded member tasks from Redux
 * state, and cancels any pending GET_DONE actions.
 * This no operation function is here just for the sake of documentation.
 */
function dropAll() {
  return null;
}

/**
 * Payload creator for the action that inits the loading of a member tasks page.
 * Note that dispatching this action before a previous loading operation has
 * been completed will cancel the previous loading operation.
 * @param {String} uuid UUID of the loading operation.
 * @param {Number} pageNum 0-based index of the page to load (PAGE_SIZE constant
 *  holds the page size).
 * @return {Object} Action payload.
 */
function getInit(uuid, pageNum) {
  return { pageNum, uuid };
}

/**
 * Payload creator for the action that actually loads a page of member tasks.
 * Prior to this action always dispatch the MEMBER_TASKS/GET_INIT action with
 * the same arguments. The result of MEMBER_TASKS/GET_DONE will be silently
 * discarted if its uuid is not stored in the Redux list of pending requests
 * to load tasks.
 * @param {String} uuid UUID of the loading operation.
 * @param {String} projectId Project filter for tasks.
 * @param {Number} pageNum 0-based index of the page to load (PAGE_SIZE constant
 *  holds the page size).
 * @param {String} tokenV3 Topcoder v3 auth token.
 * @return {Object} Action payload.
 */
function getDone(uuid, projectId, pageNum, tokenV3) {
  return getService(tokenV3).getChallenges({
    projectId,
  }, {
    limit: PAGE_SIZE,
    offset: pageNum * PAGE_SIZE,
  }).then(({ challenges, totalCount }) => ({
    projectId,
    tasks: challenges,
    totalCount,
    uuid,
  }));
}

export default createActions({
  MEMBER_TASKS: {
    DROP_ALL: dropAll,
    GET_INIT: getInit,
    GET_DONE: getDone,
  },
});

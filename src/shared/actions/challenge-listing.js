/**
 * Challenge listing actions.
 *
 * In the Redux state we keep an array of challenge objects loaded into the
 * listing(s), and a set of UUIDs of pending requests to load more challenges.
 * To load more challenges you should first dispatch GET_INIT action with some
 * UUID (use shortid package to generate it), then one of GET_CHALLENGES,
 * GET_MARATHON_MATCHES, GET_USER_CHALLENGES, or GET_USER_MARATHON_MATCHES
 * actions with the same UUID and a set of authorization, filtering, and
 * pagination options. Received challenges will be merged into the array of
 * challenges stored in the state, with some filtering options appended to the
 * challenge objects (so that we can filter them again at the frontend side:
 * challenge objects received from the backend do not include some of the
 * necessary data, like groupIds, lists of participating users, etc).
 *
 * RESET action allows to remove all loaded challenges and cancel any pending
 * requests to load challenges (removing an UUID from the set of pending
 * requests results in ignoring the response for that request).
 *
 * The backend includes into each response the total count of challenges
 * matching the specified filtering options (the actual number of challenge
 * objects included into the response might be smaller, due to the pagination
 * params). If "count" argument was provided in the dispatched action,
 * the total count of matching challenges from the response will be written
 * into a special map of counts in the Redux state.
 */

import logger from 'utils/logger';
import { createActions } from 'redux-actions';
import { getService } from 'services/challenges';

/**
 * Private. Common processing of promises returned from ChallengesService.
 * @param {Object} promise
 * @param {String} uuid
 * @param {Object} filters
 * @param {Object} countCategory
 * @param {String} user
 * @return {Promise}
 */
function handle(promise, uuid, filters, countCategory, user) {
  return promise.catch((error) => {
    logger.error(error);
    return {
      challenges: [],
      totalCount: 0,
    };
  }).then(res => ({
    challenges: res.challenges,
    filters,
    totalCount: countCategory ? {
      category: countCategory,
      value: res.totalCount,
    } : null,
    user: user || null,
    uuid,
  }));
}

/**
 * Gets a portion of challenges from the backend.
 * @param {String} uuid Should match an UUID stored into the state by
 *  a previously dispatched GET_INIT action. Reducer will ignore the challenges
 *  loaded by this action, if the UUID has already been removed from the set of
 *  UUIDs of pending fetch challenge actions. Also, once the action results are
 *  processed, its UUID is removed from the set of pending action UUIDs.
 * @param {Object} filters Optional. An object with filters to pass to the
 *  backend.
 * @param {Object} params Optional. An object with params to pass to the backend
 *  (except of the filter param, which is set by the previous argument).
 * @param {String} token Optional. Auth token for Topcoder API v3. Some of the
 *  challenges are visible only to the properly authenticated and authorized
 *  users. With this argument omitted you will fetch only public challenges.
 * @param {String} countCategory Optional. Specifies the category whereh the
 *  total count of challenges returned by this request should be written.
 * @param {String} user Optional. User handle. If specified, only challenges
 *  where this user has some role are loaded.
 * @return {Promise}
 */
function getChallenges(uuid, filters, params, token, countCategory, user) {
  const service = getService(token);
  const promise = user ?
    service.getUserChallenges(user, filters, params) :
    service.getChallenges(filters, params);
  return handle(promise, uuid, filters, countCategory, user);
}

/**
 * Writes specified UUID into the set of pending requests to load challenges.
 * This allows (1) to understand whether we are waiting to load any challenges;
 * (2) to cancel pending request by removing UUID from the set.
 * @param {String} uuid
 */
function getInit(uuid) {
  return uuid;
}

/**
 * Gets a portion of marathon matches from the backend. Parameters are the same
 * as for getChallenges() function.
 * @param {String} uuid
 * @param {Object} filters
 * @param {Object} params
 * @param {String} token
 * @param {String} countCategory
 * @param {String} user Optional. User handle. If specified, only challenges
 *  where this user has some role are loaded.
 * @param {Promise}
 */
function getMarathonMatches(uuid, filters, params, token, countCategory, user) {
  const service = getService(token);
  const promise = user ?
    service.getUserMarathonMatches(user, filters, params) :
    service.getMarathonMatches(filters, params);
  return handle(promise, uuid, filters, countCategory, user);
}

/**
 * This action tells Redux to remove all loaded challenges and to cancel
 * any pending requests to load more challenges.
 */
function reset() {
  return undefined;
}

/**
 * Corresponding action writes the filter given in string representation into
 * the Redux state.
 * @param {String} filter String representation of the filter.
 */
function setFilter(filter) {
  return filter;
}

export default createActions({
  CHALLENGE_LISTING: {
    GET_CHALLENGES: getChallenges,
    GET_INIT: getInit,
    GET_MARATHON_MATCHES: getMarathonMatches,
    RESET: reset,
    SET_FILTER: setFilter,
  },
});

/**
 * Challenge listing actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { decodeToken } from 'tc-accounts';
import 'isomorphic-fetch';
import { processSRM } from 'utils/tc';
import { errors, services } from 'topcoder-react-lib';

const { fireErrorMessage } = errors;
const { getService } = services.challenge;
const { getReviewOpportunitiesService } = services.reviewOpportunities;

/**
 * The maximum number of challenges to fetch in a single API call. Currently,
 * the backend never returns more than 50 challenges, even when a higher limit
 * was specified in the request. Thus, this constant should not be larger than
 * 50 (otherwise the frontend code will miss to load some challenges).
 */
const PAGE_SIZE = 50;

/**
 * The maximum number of review opportunities to fetch in a single API call.
 */
const REVIEW_OPPORTUNITY_PAGE_SIZE = 10;

/**
 * Private. Loads from the backend all challenges matching some conditions.
 * @param {Function} getter Given params object of shape { limit, offset }
 *  loads from the backend at most "limit" challenges, skipping the first
 *  "offset" ones. Returns loaded challenges as an array.
 * @param {Number} page Optional. Next page of challenges to load.
 * @param {Array} prev Optional. Challenges loaded so far.
 */
function getAll(getter, page = 0, prev) {
  /* Amount of challenges to fetch in one API call. 50 is the current maximum
   * amount of challenges the backend returns, event when the larger limit is
   * explicitely required. */

  return getter({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  }).then(({ challenges: chunk }) => {
    if (!chunk.length) return prev || [];
    return getAll(getter, 1 + page, prev ? prev.concat(chunk) : chunk);
  });
}

/**
 * Gets possible challenge subtracks.
 * @return {Promise}
 */
function getChallengeSubtracksDone() {
  return getService()
    .getChallengeSubtracks()
    .then(res => res.sort((a, b) => a.name.localeCompare(b.name)));
}

/**
 * Gets possible challenge tags (technologies).
 * @return {Promise}
 */
function getChallengeTagsDone() {
  return getService()
    .getChallengeTags()
    .then(res => res.map(item => item.name)
      .sort((a, b) => a.localeCompare(b)));
}

/**
 * Notifies about reloading of all active challenges. The UUID is stored in the
 * state, and only challenges fetched by getAllActiveChallengesDone action with
 * the same UUID will be accepted into the state.
 * @param {String} uuid
 * @return {String}
 */
function getAllActiveChallengesInit(uuid) {
  return uuid;
}

/**
 * Gets all active challenges from the backend.
 * Once this action is completed any active challenges saved to the state before
 * will be dropped, and the newly fetched ones will be stored there.
 * @param {String} uuid
 * @param {String} tokenV3 Optional. Topcoder auth token v3. Without token only
 *  public challenges will be fetched. With the token provided, the action will
 *  also fetch private challenges related to this user.
 * @return {Promise}
 */
function getAllActiveChallengesDone(uuid, tokenV3) {
  const filter = { status: 'ACTIVE' };
  const service = getService(tokenV3);
  const calls = [
    getAll(params => service.getChallenges(filter, params)),
  ];
  let user;
  if (tokenV3) {
    user = decodeToken(tokenV3).handle;
    // Handle any errors on this endpoint so that the non-user specific challenges
    // will still be loaded.
    calls.push(getAll(params => service.getUserChallenges(user, filter, params)
      .catch(() => ({ challenges: [] }))));
  }
  return Promise.all(calls).then(([ch, uch]) => {
    /* uch array contains challenges where the user is participating in
     * some role. The same challenge are already listed in res array, but they
     * are not attributed to the user there. This block of code marks user
     * challenges in an efficient way. */
    if (uch) {
      const map = {};
      uch.forEach((item) => { map[item.id] = item; });
      ch.forEach((item) => {
        if (map[item.id]) {
          /* It is fine to reassing, as the array we modifying is created just
           * above within the same function. */
          /* eslint-disable no-param-reassign */
          item.users[user] = true;
          item.userDetails = map[item.id].userDetails;
          /* eslint-enable no-param-reassign */
        }
      });
    }

    return { uuid, challenges: ch };
  });
}

/**
 * Notifies the state that we are about to load the specified page of draft
 * challenges.
 * @param {Number} page
 * @return {Object}
 */
function getDraftChallengesInit(uuid, page) {
  return { uuid, page };
}

/**
 * Gets the specified page of draft challenges
 * @param {Number} page Page of challenges to fetch.
 * @param {Object} filter Backend filter to use.
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @param {Promise}
 */
async function getDraftChallengesDone(uuid, page, filter, tokenV3) {
  const service = getService(tokenV3);
  return service.getChallenges({
    ...filter,
    status: 'DRAFT',
  }, {
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  }).then(({ challenges }) => ({ uuid, challenges }));
}

/**
 * Notifies the state that we are about to load the specified page of past
 * challenges.
 * @param {String} uuid
 * @param {Number} page
 * @param {Object} frontFilter
 * @return {Object}
 */
function getPastChallengesInit(uuid, page, frontFilter) {
  return { uuid, page, frontFilter };
}

/**
 * Gets the specified page of past challenges
 * @param {Number} page Page of challenges to fetch.
 * @param {Object} filter Backend filter to use.
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @param {Object} frontFilter Optional. Original frontend filter.
 * @param {Promise}
 */
async function getPastChallengesDone(
  uuid,
  page,
  filter,
  tokenV3,
  frontFilter = {},
) {
  const service = getService(tokenV3);
  return service.getChallenges({
    ...filter,
    status: 'COMPLETED',
  }, {
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  }).then(({ challenges }) => ({ uuid, challenges, frontFilter }));
}

/**
 * Action to get a list of currently open Review Opportunities using V3 API
 * @param {String} uuid Unique identifier for init/donen instance from shortid module
 * @param {Number} page Page of review opportunities to fetch.
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @return {Object} Action object
 */
function getReviewOpportunitiesDone(uuid, page, tokenV3) {
  return getReviewOpportunitiesService(tokenV3)
    .getReviewOpportunities(REVIEW_OPPORTUNITY_PAGE_SIZE, page * REVIEW_OPPORTUNITY_PAGE_SIZE)
    .then(loaded => ({ uuid, loaded }))
    .catch((error) => {
      fireErrorMessage('Error Getting Review Opportunities', error.content || error);
      return Promise.reject(error);
    });
}

/**
 * Payload creator for the action that inits the loading of SRMs.
 * @param {String} uuid
 * @return {String}
 */
function getSrmsInit(uuid) {
  return uuid;
}

/**
 * Payload creator for the action that loads SRMs.
 * @param {String} uuid
 * @param {String} handle
 * @param {Object} params
 * @param {String} tokenV3
 */
function getSrmsDone(uuid, handle, params, tokenV3) {
  const service = getService(tokenV3);
  const promises = [service.getSrms(params)];
  if (handle) {
    promises.push(service.getUserSrms(handle, params));
  }
  return Promise.all(promises).then((data) => {
    let srms = data[0];
    const userSrms = data[1];
    const userSrmsMap = {};
    _.forEach(userSrms, (srm) => {
      userSrmsMap[srm.id] = srm;
    });
    srms = _.map(srms, (srm) => {
      if (userSrmsMap[srm.id]) {
        return processSRM(srm);
      }
      return srm;
    });
    return { uuid, data: srms };
  });
}

export default createActions({
  CHALLENGE_LISTING: {
    DROP_CHALLENGES: _.noop,

    GET_ALL_ACTIVE_CHALLENGES_INIT: getAllActiveChallengesInit,
    GET_ALL_ACTIVE_CHALLENGES_DONE: getAllActiveChallengesDone,

    GET_CHALLENGE_SUBTRACKS_INIT: _.noop,
    GET_CHALLENGE_SUBTRACKS_DONE: getChallengeSubtracksDone,

    GET_CHALLENGE_TAGS_INIT: _.noop,
    GET_CHALLENGE_TAGS_DONE: getChallengeTagsDone,

    GET_DRAFT_CHALLENGES_INIT: getDraftChallengesInit,
    GET_DRAFT_CHALLENGES_DONE: getDraftChallengesDone,

    GET_PAST_CHALLENGES_INIT: getPastChallengesInit,
    GET_PAST_CHALLENGES_DONE: getPastChallengesDone,

    GET_REVIEW_OPPORTUNITIES_INIT: (uuid, page) => ({ uuid, page }),
    GET_REVIEW_OPPORTUNITIES_DONE: getReviewOpportunitiesDone,

    GET_SRMS_INIT: getSrmsInit,
    GET_SRMS_DONE: getSrmsDone,

    EXPAND_TAG: id => id,

    /* Pass in community ID. */
    SELECT_COMMUNITY: _.identity,

    SET_FILTER: _.identity,

    SET_SORT: (bucket, sort) => ({ bucket, sort }),
  },
});

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
 * The maximum number of challenges to fetch in a single API call.
 */
const PAGE_SIZE = 99;

/**
 * The maximum number of review opportunities to fetch in a single API call.
 */
const REVIEW_OPPORTUNITY_PAGE_SIZE = 1000;

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
    perPage: PAGE_SIZE,
    page: page + 1,
  }).then(({ challenges: chunk }) => {
    if (!chunk.length) return prev || [];
    return getAll(getter, 1 + page, prev ? prev.concat(chunk) : chunk);
  });
}

/**
 * Gets possible challenge types.
 * @return {Promise}
 */
function getChallengeTypesDone() {
  return getService()
    .getChallengeTypes()
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
function getActiveChallengesInit(uuid, page, frontFilter) {
  return { uuid, page, frontFilter };
}

/**
 * Get all challenges and match with user challenges
 * @param {String} uuid progress id
 * @param {String} tokenV3 token v3
 * @param {Object} filter filter object
 * @param {number} page start page
 */
function getAllActiveChallengesWithUsersDone(uuid, tokenV3, filter, page = 0) {
  const service = getService(tokenV3);
  const calls = [
    getAll(params => service.getChallenges(filter, params), page),
  ];
  let user;
  if (tokenV3) {
    user = decodeToken(tokenV3).userId;

    const newFilter = _.mapKeys(filter, (value, key) => {
      if (key === 'tag') return 'technologies';

      return key;
    });

    // Handle any errors on this endpoint so that the non-user specific challenges
    // will still be loaded.
    calls.push(getAll(params => service.getUserChallenges(user, newFilter, params)
      .catch(() => ({ challenges: [] }))), page);
  }
  return Promise.all(calls).then(([ch, uch]) => {
    /* uch array contains challenges where the user is participating in
@@ -111,8 +124,8 @@ function getAllActiveChallengesDone(uuid, tokenV3) {
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

    return { uuid, challenges: ch, ...filter };
  });
}

/** TODO: Inspect if the 2 actions bellow can be removed?
 * They do  duplicate what is done in `getActiveChallengesDone` but fetch all challenges
 * which was refactored in listing-improve
 */
function getAllActiveChallengesInit(uuid) {
  return uuid;
}
function getAllActiveChallengesDone(uuid, tokenV3) {
  const filter = { status: 'Active' };
  return getAllActiveChallengesWithUsersDone(uuid, tokenV3, filter);
}

function getAllUserChallengesInit(uuid) {
  return uuid;
}

function getAllUserChallengesDone(uuid, tokenV3) {
  const memberId = decodeToken(tokenV3).userId;
  const filter = { status: 'Active', memberId };
  return getAllActiveChallengesWithUsersDone(uuid, tokenV3, filter);
}

/**
 * Gets 1 page of active challenges (including marathon matches) from the backend.
 * Once this action is completed any active challenges saved to the state before
 * will be dropped, and the newly fetched ones will be stored there.
 * Loading of all challenges wil start in background.
 * @param {String} uuid
 * @param {Number} page
 * @param {Object} backendFilter Backend filter to use.
 * @param {String} tokenV3 Optional. Topcoder auth token v3. Without token only
 *  public challenges will be fetched. With the token provided, the action will
 *  also fetch private challenges related to this user.
 * @param {Object} frontFilter

 * @return {Promise}
 */
function getActiveChallengesDone(uuid, page, backendFilter, tokenV3, frontFilter = {}) {
  const filter = {
    ...backendFilter,
    status: 'Active',
  };
  const service = getService(tokenV3);
  const calls = [
    service.getChallenges(filter, {
      perPage: PAGE_SIZE,
      page: page + 1,
    }),
  ];
  let user;
  if (tokenV3) {
    user = decodeToken(tokenV3).userId;

    // Handle any errors on this endpoint so that the non-user specific challenges
    // will still be loaded.
    calls.push(service.getUserChallenges(user, filter, {})
      .catch(() => ({ challenges: [] })));
  }
  return Promise.all(calls).then(([ch]) => ({
    uuid,
    challenges: ch.challenges,
    meta: ch.meta,
    frontFilter,
  }));
}

/**
 * Init loading of all challenges
 * @param {String} uuid
 */
function getRestActiveChallengesInit(uuid) {
  return { uuid };
}

/**
 * Loading all challenges
 * @param {String} uuid progress id
 * @param {String} tokenV3 token v3
 */
function getRestActiveChallengesDone(uuid, tokenV3, filter) {
  const mergedFilter = {
    ...filter,
    status: 'Active',
  };
  return getAllActiveChallengesWithUsersDone(uuid, tokenV3, mergedFilter, 1);
}

/**
 * Prepare for getting all recommended challenges
 * @param {String} uuid progress id
 */
function getAllRecommendedChallengesInit(uuid) {
  return uuid;
}
/**
 * Get all recommended challenges
 * @param {String} uuid progress id
 * @param {String} tokenV3 token v3
 * @param {*} recommendedTags recommended tags
 */
function getAllRecommendedChallengesDone(uuid, tokenV3, recommendedTags) {
  const filter = {
    status: 'Active',
    ...(!_.isEmpty(recommendedTags) && { tag: recommendedTags }),
  };
  return getAllActiveChallengesWithUsersDone(uuid, tokenV3, filter);
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
 * Gets the specified page of past challenges (including MMs).
 * @param {Number} page Page of challenges to fetch.
 * @param {Object} filter Backend filter to use.
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @param {Object} frontFilter Optional. Original frontend filter.
 * @param {Object}
 */
function getPastChallengesDone(uuid, page, filter, tokenV3, frontFilter = {}) {
  const service = getService(tokenV3);
  return service.getChallenges({
    ...filter,
    status: 'Completed',
  }, {
    perPage: PAGE_SIZE,
    page: page + 1,
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

/**
 * Payload creator for the action that initialize user registered challenges.
 * @param {String} uuid
 * @return {String}
 */
function getUserChallengesInit(uuid) {
  return { uuid };
}

/**
 * Payload creator for the action that loads user registered challenges.
 * @param {String} userId
 * @return {String}
 */
function getUserChallengesDone(userId, tokenV3) {
  const service = getService(tokenV3);

  return service.getUserResources(userId, 1, 10000)
    .then(item => item)
    .catch((error) => {
      fireErrorMessage('Error Getting User Challenges', error.content || error);
      return Promise.reject(error);
    });
}

export default createActions({
  CHALLENGE_LISTING: {
    DROP_CHALLENGES: _.noop,

    GET_ALL_ACTIVE_CHALLENGES_INIT: getAllActiveChallengesInit,
    GET_ALL_ACTIVE_CHALLENGES_DONE: getAllActiveChallengesDone,

    GET_ALL_USER_CHALLENGES_INIT: getAllUserChallengesInit,
    GET_ALL_USER_CHALLENGES_DONE: getAllUserChallengesDone,

    GET_ALL_RECOMMENDED_CHALLENGES_INIT: getAllRecommendedChallengesInit,
    GET_ALL_RECOMMENDED_CHALLENGES_DONE: getAllRecommendedChallengesDone,

    GET_ACTIVE_CHALLENGES_INIT: getActiveChallengesInit,
    GET_ACTIVE_CHALLENGES_DONE: getActiveChallengesDone,

    GET_REST_ACTIVE_CHALLENGES_INIT: getRestActiveChallengesInit,
    GET_REST_ACTIVE_CHALLENGES_DONE: getRestActiveChallengesDone,

    GET_CHALLENGE_TYPES_INIT: _.noop,
    GET_CHALLENGE_TYPES_DONE: getChallengeTypesDone,

    GET_CHALLENGE_TAGS_INIT: _.noop,
    GET_CHALLENGE_TAGS_DONE: getChallengeTagsDone,

    GET_PAST_CHALLENGES_INIT: getPastChallengesInit,
    GET_PAST_CHALLENGES_DONE: getPastChallengesDone,

    GET_REVIEW_OPPORTUNITIES_INIT: (uuid, page) => ({ uuid, page }),
    GET_REVIEW_OPPORTUNITIES_DONE: getReviewOpportunitiesDone,

    GET_SRMS_INIT: getSrmsInit,
    GET_SRMS_DONE: getSrmsDone,

    GET_USER_CHALLENGES_INIT: getUserChallengesInit,
    GET_USER_CHALLENGES_DONE: getUserChallengesDone,

    EXPAND_TAG: id => id,

    /* Pass in community ID. */
    SELECT_COMMUNITY: _.identity,

    SET_FILTER: _.identity,

    SET_SORT: (bucket, sort) => ({ bucket, sort }),
  },
});

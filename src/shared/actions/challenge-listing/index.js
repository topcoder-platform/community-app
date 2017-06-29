/**
 * Challenge listing actions.
 */

/* global fetch */

import _ from 'lodash';
import qs from 'qs';
import { createActions } from 'redux-actions';
import { decodeToken } from 'tc-accounts';
import { getService } from 'services/challenges';
import 'isomorphic-fetch';

/**
 * The maximum number of challenges to fetch in a single API call. Currently,
 * the backend never returns more than 50 challenges, even when a higher limit
 * was specified in the request. Thus, this constant should not be larger than
 * 50 (otherwise the frontend code will miss to load some challenges).
 */
const PAGE_SIZE = 50;

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
  .then(res =>
    res.map(item => item.description)
    .sort((a, b) => a.localeCompare(b)),
  );
}

/**
 * Gets possible challenge tags (technologies).
 * @return {Promise}
 */
function getChallengeTagsDone() {
  return getService()
  .getChallengeTags()
  .then(res =>
    res.map(item => item.name)
    .sort((a, b) => a.localeCompare(b)),
  );
}

/**
 * Gets from the backend challenge filters for public groups, and for
 * the groups the authenticated user has access to.
 * NOTE: At the moment it works with a mocked API.
 * @param {Object} auth Optional
 * @return {Promise}
 */
function getCommunityFilters(auth) {
  let groups = [];
  if (auth.profile && auth.profile.groups) {
    groups = auth.profile.groups.map(g => g.id);
  }
  return fetch(`/api/tc-communities?${qs.stringify({ groups })}`)
  .then(res => (res.ok ? res.json() : new Error(res.statusText)));
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
 * Gets all active challenges (including marathon matches) from the backend.
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
    getAll(params => service.getMarathonMatches(filter, params)),
  ];
  let user;
  if (tokenV3) {
    user = decodeToken(tokenV3).handle;
    calls.push(getAll(params =>
      service.getUserChallenges(user, filter, params)));
    calls.push(getAll(params =>
      service.getUserMarathonMatches(user, filter, params)));
  }
  return Promise.all(calls).then(([ch, mm, uch, umm]) => {
    const challenges = ch.concat(mm);

    /* uch and umm arrays contain challenges where the user is participating in
     * some role. The same challenge are already listed in res array, but they
     * are not attributed to the user there. This block of code marks user
     * challenges in an efficient way. */
    if (uch) {
      const map = {};
      uch.forEach((item) => { map[item.id] = item; });
      umm.forEach((item) => { map[item.id] = item; });
      challenges.forEach((item) => {
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

    return { uuid, challenges };
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
 * Gets the specified page of draft challenges (including MMs).
 * @param {Number} page Page of challenges to fetch.
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @param {Object}
 */
function getDraftChallengesDone(uuid, page, tokenV3) {
  const service = getService(tokenV3);
  return Promise.all([
    service.getChallenges({ status: 'DRAFT' }, {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    service.getMarathonMatches({ status: 'DRAFT' }, {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
  ]).then(([{ challenges: chunkA }, { challenges: chunkB }]) =>
    ({ uuid, challenges: chunkA.concat(chunkB) }));
}

/**
 * Notifies the state that we are about to load the specified page of past
 * challenges.
 * @param {Number} page
 * @return {Object}
 */
function getPastChallengesInit(uuid, page) {
  return { uuid, page };
}

/**
 * Gets the specified page of past challenges (including MMs).
 * @param {Number} page Page of challenges to fetch.
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @param {Object}
 */
function getPastChallengesDone(uuid, page, tokenV3) {
  const service = getService(tokenV3);
  return Promise.all([
    service.getChallenges({ status: 'COMPLETED' }, {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    service.getMarathonMatches({ status: 'PAST' }, {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
  ]).then(([{ challenges: chunkA }, { challenges: chunkB }]) =>
    ({ uuid, challenges: chunkA.concat(chunkB) }));
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

    GET_COMMUNITY_FILTERS: getCommunityFilters,

    GET_DRAFT_CHALLENGES_INIT: getDraftChallengesInit,
    GET_DRAFT_CHALLENGES_DONE: getDraftChallengesDone,

    GET_PAST_CHALLENGES_INIT: getPastChallengesInit,
    GET_PAST_CHALLENGES_DONE: getPastChallengesDone,

    /* Pass in community ID. */
    SELECT_COMMUNITY: _.identity,

    SET_FILTER: _.identity,

    SET_SORT: (bucket, sort) => ({ bucket, sort }),
  },
});

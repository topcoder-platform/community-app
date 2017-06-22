/**
 * Reducer for state.challengeListing.
 *
 * This section of the state holds the following fields:
 *
 *  - challenges {Array} - Normalized challenge objects loaded from the
 *    backend. Normalization means that we add extra fields to the challenge
 *    and marathon match objects, received from different backend endpoints,
 *    to ensure that the rest of the code can handle them in a uniform way,
 *    and that we are able to filter them in all necessary ways (e.g., when
 *    we fetch challenges belonging to a specific group, returned challenge
 *    objects do not have group information; so we append group ids to these
 *    objects to be able to filter them out by groups on the frontend side);
 *
 *  - counts {Object} - Total counts of challenges in the backend. This object
 *    holds key - value pairs, where the key specifies a category and value
 *    specifies the total count of challenges under that category;
 *
 *  - oldestData {Number} - Timestamp of the moment of reducer construction,
 *    or of the last reset of this section of the state. This allows to
 *    automatically refresh loaded challenge data from time to time to
 *    ensure that displayed data are in reasonable sync with the backend.
 *
 *  - pendingRequests {Object} - Set of UUIDs of pending requests to
 *    load challenge data. It allows
 *    1. To see that we are loading something right now;
 *    2. To cancel pending requests (reducer will ignore resolved actions
 *       with UUID not present in this set at the time of resolution).
 *    Technically it is stored as a map of UUIDs to boolean values,
 *    as only plain objects can be safely stored into Redux state.
 */

import _ from 'lodash';
import actions from 'actions/challenge-listing';
import logger from 'utils/logger';
import SideBarFilter from
  'components/challenge-listing/SideBarFilters/SideBarFilter';
import { handleActions } from 'redux-actions';
import { COMMUNITY } from 'utils/tc';

/**
 * Normalizes a regular challenge object received from the backend.
 * NOTE: This function is copied from the existing code in the challenge listing
 * component. It is possible, that this normalization is not necessary after we
 * have moved to Topcoder API v3, but it is kept for now to minimize a risk of
 * breaking anything.
 * @param {Object} challenge Challenge object received from the backend.
 * @return {Object} Normalized challenge.
 */
export function normalizeChallenge(challenge) {
  const registrationOpen = challenge.allPhases.filter(d =>
    d.phaseType === 'Registration',
  )[0].phaseStatus === 'Open' ? 'Yes' : 'No';
  const groups = {};
  if (challenge.groupIds) {
    challenge.groupIds.forEach((id) => {
      groups[id] = true;
    });
  }
  return _.defaults(_.clone(challenge), {
    communities: new Set([COMMUNITY[challenge.track]]),
    groups,
    platforms: '',
    registrationOpen,
    technologies: '',
    submissionEndTimestamp: challenge.submissionEndDate,
  });
}

/**
 * Normalizes a marathon match challenge object received from the backend.
 * NOTE: This function is copied from the existing code in the challenge listing
 * component. It is possible, that this normalization is not necessary after we
 * have moved to Topcoder API v3, but it is kept for now to minimize a risk of
 * breaking anything.
 * @param {Object} challenge MM challenge object received from the backend.
 * @return {Object} Normalized challenge.
 */
export function normalizeMarathonMatch(challenge) {
  const endTimestamp = new Date(challenge.endDate).getTime();
  const allphases = [{
    challengeId: challenge.id,
    phaseType: 'Registration',
    phaseStatus: endTimestamp > Date.now() ? 'Open' : 'Close',
    scheduledEndTime: challenge.endDate,
  }];
  const groups = {};
  if (challenge.groupIds) {
    challenge.groupIds.forEach((id) => {
      groups[id] = true;
    });
  }
  return _.defaults(_.clone(challenge), {
    challengeCommunity: 'Data',
    challengeType: 'Marathon',
    allPhases: allphases,
    currentPhases: allphases.filter(phase => phase.phaseStatus === 'Open'),
    communities: new Set([COMMUNITY.DATA_SCIENCE]),
    currentPhaseName: endTimestamp > Date.now() ? 'Registration' : '',
    groups,
    numRegistrants: challenge.numRegistrants ? challenge.numRegistrants[0] : 0,
    numSubmissions: challenge.userIds ? challenge.userIds.length : 0,
    platforms: '',
    prizes: [0],
    registrationOpen: endTimestamp > Date.now() ? 'Yes' : 'No',
    registrationStartDate: challenge.startDate,
    submissionEndDate: challenge.endDate,
    submissionEndTimestamp: endTimestamp,
    technologies: '',
    totalPrize: 0,
    track: 'DATA_SCIENCE',
    status: endTimestamp > Date.now() ? 'ACTIVE' : 'COMPLETED',
    subTrack: 'MARATHON_MATCH',
  });
}

/**
 * Handles CHALLENGE_LISTING/GET_CHALLENGE_SUBTRACKS_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onGetChallengeSubtracksDone(state, action) {
  if (action.error) logger.error(action.payload);
  return {
    ...state,
    challengeSubtracks: action.error ? [] : action.payload,
    loadingChallengeSubtracks: false,
  };
}

/**
 * Handles CHALLENGE_LISTING/GET_CHALLENGE_TAGS_DONE action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
function onGetChallengeTagsDone(state, action) {
  if (action.error) logger.error(action.payload);
  return {
    ...state,
    challengeTags: action.error ? [] : action.payload,
    loadingChallengeTags: false,
  };
}

/**
 * Commong handling of all get challenge / get marathon matches actions.
 * This function merges already normalized data into the array of loaded
 * challenges.
 * @param {Object} state
 * @param {Object} action
 * @param {Function} normalizer A function to use for normalization of
 *  challenges contained in the payload to the common format expected by
 *  the frontend.
 * @return {Object} New state.
 */
function onGetDone(state, { payload }, normalizer) {
  /* Tests whether we should accept the result of this action, and removes
    UUID of this action from the set of pending actions. */
  if (!state.pendingRequests[payload.uuid]) return state;
  const pendingRequests = _.clone(state.pendingRequests);
  delete pendingRequests[payload.uuid];

  /* In case the payload holds a total count for some category of challenges,
    we write this count into the state, probably overwritting the old value. */
  let counts = state.counts;
  if (payload.totalCount) {
    counts = {
      ...counts,
      [payload.totalCount.category]: payload.totalCount.value || 0,
    };
  }

  if (!payload.challenges || !payload.challenges.length) {
    return {
      ...state,
      counts,
      pendingRequests,
    };
  }

  /* Merge of the known and received challenge data. First of all we reduce
    the array of already loaded challenges to the map, to allow efficient
    lookup. */
  const challenges = {};
  state.challenges.forEach((item) => {
    challenges[item.id] = item;
  });
  payload.challenges.forEach((item) => {
    const it = _.defaults(normalizer(item), {
      users: {},
    });

    /* Similarly it happens with users participating in the challenges. */
    if (payload.user) it.users[payload.user] = true;

    /* If we already had some data about this challenge loaded, we should
      properly merge-in the known information about groups and users. */
    const old = challenges[it.id];
    if (old) _.merge(it.users, old.users);

    challenges[it.id] = it;
  });

  return {
    ...state,
    challenges: _.toArray(challenges),
    counts,
    pendingRequests,
  };
}

/**
 * Handles the CHALLENGE_LISTING/GET_INIT action.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetInit(state, { payload }) {
  if (state.pendingRequests[payload]) {
    throw new Error('Request UUID is not unique.');
  }
  return {
    ...state,
    pendingRequests: {
      ...state.pendingRequests,
      [payload]: true,
    },
  };
}

/**
 * Handling of CHALLENGE_LISTING/GET_CHALLENGES
 * and CHALLENGE_LISTING/GET_USER_CHALLENGES actions.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetChallenges(state, action) {
  return onGetDone(state, action, normalizeChallenge);
}

/**
 * Handling of CHALLENGE_LISTING/GET_MARATHON_MATCHES
 * and CHALLENGE_LISTING/GET_USER_MARATHON_MATCHES actions.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onGetMarathonMatches(state, action) {
  return onGetDone(state, action, normalizeMarathonMatch);
}

/**
 * Cleans received data from the state, and cancels any pending requests to
 * fetch challenges. It does not reset total counts of challenges, as they
 * are anyway will be overwritten with up-to-date values.
 * @param {Object} state Previous state.
 * @return {Object} New state.
 */
function onReset(state) {
  return {
    ...state,
    challenges: [],
    oldestData: Date.now(),
    pendingRequests: {},
  };
}

/**
 * Creates a new Challenge Listing reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return Challenge Listing reducer.
 */
function create(initialState) {
  const a = actions.challengeListing;
  return handleActions({
    [a.getChallengeSubtracksDone]: onGetChallengeSubtracksDone,
    [a.getChallengeSubtracksInit]: state => ({
      ...state,
      loadingChallengeSubtracks: true,
    }),
    [a.getChallengeTagsDone]: onGetChallengeTagsDone,
    [a.getChallengeTagsInit]: state => ({
      ...state,
      loadingChallengeTags: true,
    }),
    [a.getChallenges]: onGetChallenges,
    [a.getInit]: onGetInit,
    [a.getMarathonMatches]: onGetMarathonMatches,
    [a.reset]: onReset,
    [a.setFilter]: (state, { payload }) => ({ ...state, filter: payload }),
  }, _.defaults(_.clone(initialState) || {}, {
    challenges: [],
    challengeSubtracks: [],
    challengeTags: [],
    counts: {},
    filter: (new SideBarFilter()).getURLEncoded(),
    oldestData: Date.now(),
    pendingRequests: {},
  }));
}

/**
 * The factory creates the new reducer with initial state tailored to the given
 * ExpressJS HTTP request, if specified (for server-side rendering). If no HTTP
 * request is specified, it creates the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return {Promise} Resolves to the new reducer.
 */
export function factory() {
  /* Server-side rendering is not implemented yet.
    Let's first ensure it all works fine without it. */
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();

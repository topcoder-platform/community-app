/**
 * This module provides a service for convenient manipulation with Topcoder
 * challenges via TC API.
 */

import _ from 'lodash';
// import qs from 'qs';
import { COMPETITION_TRACKS } from 'utils/tc';
import { getApiV2, getApiV3 } from './api';

import sampleApiV3Response from './data/challenges-v3.json';
import sampleApiV3ResponseSingle from './data/challenge-v3.json';
import sampleApiV2ResponseSingle from './data/challenge-v2.json';

export const ORDER_BY = {
  SUBMISSION_END_DATE: 'submissionEndDate',
};

/**
 * Normalizes a regular challenge details object received from the backend APIs.
 * NOTE: It is possible, that this normalization is not necessary after we
 * have moved to Topcoder API v3, but it is kept for now to minimize a risk of
 * breaking anything.
 * @param {Object} v3 Challenge object received from the /v3/challenges/{id}
 *  endpoint.
 * @param {Object} v3Filtered Challenge object received from the
 *  /v3/challenges?filter=id={id} endpoint.
 * @param {Object} v3User Challenge object received from the
 *  /v3//members/{username}/challenges?filter=id={id} endpoint.
 * If action was fired for authenticated visitor, v3_user will contain
 * details fetched specifically for the user (thus may include additional
 * data comparing to the standard API v3 response for the challenge details,
 * stored in v3_filtered).
 * @param {Object} v2 Challenge object received from the /v2/{type}/challenges/{id} endpoint.
 * @param {String} username Optional.
 * @return {Object} Normalized challenge object.
 */
export function normalizeChallengeDetails(v3, v3Filtered, v3User, v2, username) {
  // Normalize exising data to make it consistent with the rest of the code
  const challenge = {
    id: v3.challengeId,
    status: (v3.currentStatus || '').toUpperCase(),
    name: v3.challengeName,
    projectId: Number(v3.projectId),
    forumId: Number(v3.forumId),
    introduction: v3.introduction || '',
    detailedRequirements: v3.detailedRequirements,
    finalSubmissionGuidelines: v3.finalSubmissionGuidelines,
    screeningScorecardId: Number(v3.screeningScorecardId),
    reviewScorecardId: Number(v3.reviewScorecardId),
    numberOfCheckpointsPrizes: v3.numberOfCheckpointsPrizes,
    topCheckPointPrize: v3.topCheckPointPrize,
    submissionsViewable: v3.submissionsViewable || 'false',
    reviewType: v3.reviewType,
    allowStockArt: v3.allowStockArt === 'true',
    fileTypes: v3.filetypes || [],
    environment: v3.environment,
    codeRepo: v3.codeRepo,
    forumLink: v3.forumLink,
    submissionLimit: Number(v3.submissionLimit) || 0,
    drPoints: v3.digitalRunPoints,
    directUrl: v3.directUrl,
    technologies: _.isArray(v3.technology) ? v3.technology.join(', ') : '',
    platforms: _.isArray(v3.platforms) ? v3.platforms.join(', ') : '',
    prizes: v3.prize || [],
    events: v3.event ? [
      {
        eventName: v3.event.eventShortDesc,
        eventId: v3.event.id,
        description: v3.event.eventDescription,
      }] : [],
    mainEvent: v3.event ? {
      eventName: v3.event.eventShortDesc,
      eventId: v3.event.id,
      description: v3.event.eventDescription,
    } : {},
    terms: v3.terms,
    submissions: v3.submissions,
    checkpoints: v3.checkpoints,
    documents: v3.documents || [],
    numRegistrants: v3.numberOfRegistrants,
    numberOfCheckpointSubmissions: v3.numberOfCheckpointSubmissions,
    reliabilityBonus: v3.reliabilityBonus || 0,
  };

  // Fill missing data from v3_filtered
  if (v3Filtered) {
    const groups = {};
    if (v3Filtered.groupIds) {
      v3Filtered.groupIds.forEach((id) => {
        groups[id] = true;
      });
    }
    _.defaults(challenge, {
      track: v3Filtered.track,
      subTrack: v3Filtered.subTrack,
      submissionEndDate: v3Filtered.submissionEndDate, // Dates are not correct in v3
      submissionEndTimestamp: v3Filtered.submissionEndDate, // Dates are not correct in v3

      /* Taking phases from v3_filtered, because dates are not correct in v3 */
      allPhases: v3Filtered.allPhases || [],

      /* Taking phases from v3_filtered, because dates are not correct in v3 */
      currentPhases: v3Filtered.currentPhases || [],

      /* Taking winners from v3_filtered, because winners are returned empty in v3 */
      winners: v3Filtered.winners || [],

      /* v3 returns incorrect value for numberOfSubmissions for some reason */
      numSubmissions: v3Filtered.numSubmissions,
      groups,
    });
  }

  // Fill missing data from v3_user
  if (v3User) {
    _.defaults(challenge, {
      userDetails: v3User.userDetails,
    });
  }

  // Fill missing data from v2
  if (v2) {
    _.defaults(challenge, {
      round1Introduction: v2.round1Introduction || '', // This is always null in v3 for some reason
      round2Introduction: v2.round2Introduction || '', // This is always null in v3 for some reason
      registrants: v2.registrants || [], // Registrants are now only returned by v2

      /* Although v3 does return appealsEndDate, it causes incorrect 'Winners'
       * phase time for some reason */
      appealsEndDate: v2.appealsEndDate,
    });
  }

  // Fill some derived data
  const registrationOpen = _.some(
    challenge.allPhases,
    phase => phase.phaseType === 'Registration' && phase.phaseStatus === 'Open',
  ) ? 'Yes' : 'No';
  _.defaults(challenge, {
    communities: new Set([COMPETITION_TRACKS[challenge.track]]),
    registrationOpen,
    users: username ? { [username]: true } : {},
  });

  // A hot fix to show submissions for on-going challenges
  if ((!challenge.submissions || !challenge.submissions.length) && !_.isEmpty(v2)) {
    challenge.submissions = v2.registrants
      .filter(r => r.submissionDate)
      .sort((a, b) => a.submissionDate.localeCompare(b.submissionDate));
  }

  return challenge;
}

/**
 * Normalizes a regular challenge object received from the backend.
 * NOTE: This function is copied from the existing code in the challenge listing
 * component. It is possible, that this normalization is not necessary after we
 * have moved to Topcoder API v3, but it is kept for now to minimize a risk of
 * breaking anything.
 * @param {Object} challenge Challenge object received from the backend.
 * @param {String} username Optional.
 * @return {Object} Normalized challenge.
 */
export function normalizeChallenge(challenge, username) {
  const registrationOpen = challenge.allPhases.filter(d =>
    d.phaseType === 'Registration')[0].phaseStatus === 'Open' ? 'Yes' : 'No';
  const groups = {};
  if (challenge.groupIds) {
    challenge.groupIds.forEach((id) => {
      groups[id] = true;
    });
  }
  _.defaults(challenge, {
    communities: new Set([COMPETITION_TRACKS[challenge.track]]),
    groups,
    platforms: '',
    registrationOpen,
    technologies: '',
    submissionEndTimestamp: challenge.submissionEndDate,
    users: username ? { username: true } : {},
  });
}

/**
 * Normalizes a marathon match challenge object received from the backend.
 * NOTE: This function is copied from the existing code in the challenge listing
 * component. It is possible, that this normalization is not necessary after we
 * have moved to Topcoder API v3, but it is kept for now to minimize a risk of
 * breaking anything.
 * @param {Object} challenge MM challenge object received from the backend.
 * @param {String} username Optional.
 * @return {Object} Normalized challenge.
 */
export function normalizeMarathonMatch(challenge, username) {
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
  _.defaults(challenge, {
    challengeCommunity: 'Data',
    challengeType: 'Marathon',
    allPhases: allphases,
    currentPhases: allphases.filter(phase => phase.phaseStatus === 'Open'),
    communities: new Set([COMPETITION_TRACKS.DATA_SCIENCE]),
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
    users: username ? { username: true } : {},
  });
}

class ChallengesService {
  /**
   * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
   * @param {String} tokenV2 Optional. Auth token for Topcoder API v2.
   */
  constructor(tokenV3, tokenV2) {
    /**
     * Private function being re-used in all methods related to getting
     * challenges. It handles query-related arguments in the uniform way:
     * @param {String} endpoint API V3 endpoint, where the request will be send.
     * @param {Object} filters Optional. A map of filters to pass as `filter`
     *  query parameter (this function takes care to stringify it properly).
     * @param {Object} params Optional. A map of any other parameters beside
     *  `filter`.
     */
    const getChallenges = (endpoint) => {
      /*
      const query = {
        filter: qs.stringify(filters),
        ...params,
      };
      */
      let response;
      if (endpoint.match(/challenges/)) {
        response = sampleApiV3Response;
        /* TODO: Should we mock the filtering here for an advanced testing? */
      } else throw new Error('Requested endpoint has not been mocked yet.');
      return Promise.resolve(response.result.status === 200 ? {
        challenges: response.result.content || [],
        totalCount: response.result.metadata.totalCount,
      } : new Error(response.result.content));
    };

    this.private = {
      api: getApiV3(tokenV3),
      apiV2: getApiV2(tokenV2),
      getChallenges,
      tokenV2,
      tokenV3,
    };
  }

  /**
   * Gets challenge details from Topcoder API v3.
   * NOTE: This function also uses API v2 and other v3 endpoints for now, due
   * to some information is missing or
   * incorrect in the main v3 endpoint. This may change in the future.
   * @param {Number|String} challengeId
   * @return {Promise} Resolves to the challenge object.
   */
  async getChallengeDetails(challengeId) {
    const challengeV3 = sampleApiV3ResponseSingle;

    const challengeV3Filtered =
      await this.private.getChallenges('/challenges/', { id: challengeId })
        .then(res => res.challenges[0]);

    const challengeV2 = sampleApiV2ResponseSingle;
    const challenge = normalizeChallengeDetails(
      challengeV3,
      challengeV3Filtered,
      null,
      challengeV2,
      null,
    );

    return challenge;
  }

  /**
   * Gets possible challenge subtracks.
   * @return {Promise} Resolves to the array of subtrack names.
   */
  getChallengeSubtracks() {
    return Promise.all([
      this.private.apiV2.get('/design/challengetypes')
        .then(res => (res.ok ? res.json() : new Error(res.statusText))),
      this.private.apiV2.get('/develop/challengetypes')
        .then(res => (res.ok ? res.json() : new Error(res.statusText))),
    ]).then(([a, b]) => a.concat(b));
  }

  /**
   * Gets possible challenge tags (technologies).
   * @return {Promise} Resolves to the array of tag strings.
   */
  getChallengeTags() {
    return this.private.api.get('/technologies')
      .then(res => (res.ok ? res.json() : new Error(res.statusText)))
      .then(res => (
        res.result.status === 200 ?
          res.result.content :
          new Error(res.result.content)
      ));
  }

  /**
   * Gets challenges.
   * @param {Object} filters Optional.
   * @param {Object} params Optional.
   * @return {Promise} Resolves to the api response.
   */
  getChallenges(filters, params) {
    return this.private.getChallenges('/challenges/', filters, params)
      .then((res) => {
        res.challenges.forEach(item => normalizeChallenge(item));
        return res;
      });
  }

  /**
   * Gets marathon matches.
   * @param {Object} filters Optional.
   * @param {Object} params Optional.
   * @return {Promise} Resolve to the api response.
   */
  getMarathonMatches(filters, params) {
    return this.private.getChallenges('/marathonMatches/', filters, params)
      .then((res) => {
        res.challenges.forEach(item => normalizeMarathonMatch(item));
        return res;
      });
  }

  /**
   * Gets challenges of the specified user.
   * @param {String} username User whose challenges we want to fetch.
   * @param {Object} filters Optional.
   * @param {Number} params Optional.
   * @return {Promise} Resolves to the api response.
   */
  getUserChallenges(username, filters, params) {
    const endpoint = `/members/${username.toLowerCase()}/challenges/`;
    return this.private.getChallenges(endpoint, filters, params)
      .then((res) => {
        res.challenges.forEach(item => normalizeChallenge(item, username));
        return res;
      });
  }

  /**
   * Gets marathon matches of the specified user.
   * @param {String} username User whose challenges we want to fetch.
   * @param {Object} filters Optional.
   * @param {Number} params Optional.
   * @return {Promise} Resolves to the api response.
   */
  getUserMarathonMatches(username, filters, params) {
    const endpoint = `/members/${username.toLowerCase()}/mms/`;
    return this.private.getChallenges(endpoint, filters, params)
      .then((res) => {
        res.challenges.forEach(item => normalizeMarathonMatch(item, username));
        return res;
      });
  }

  /**
   * Registers user to the specified challenge.
   * @param {String} challengeId
   * @return {Promise}
   */
  register(challengeId) {
    const endpoint = `/challenges/${challengeId}/register`;
    return this.private.apiV2.postJson(endpoint)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }

  /**
   * Unregisters user from the specified challenge.
   * @param {String} challengeId
   * @return {Promise}
   */
  unregister(challengeId) {
    const endpoint = `/challenges/${challengeId}/unregister`;
    return this.private.apiV2.post(endpoint)
      .then(res => (res.ok ? res.json() : new Error(res.statusText)));
  }
}

/**
 * Returns a new or existing challenges service.
 * @param {String} tokenV3 Optional. Auth token for Topcoder API v3.
 * @param {String} tokenV2 Optional. Auth token for Topcoder API v2.
 * @return {Challenges} Challenges service object
 */
let lastInstance = null;
export function getService(tokenV3, tokenV2) {
  if (!lastInstance || lastInstance.tokenV3 !== tokenV3
  || lastInstance.tokenV2 !== tokenV2) {
    lastInstance = new ChallengesService(tokenV3, tokenV2);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;

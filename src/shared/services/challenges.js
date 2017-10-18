/**
 * This module provides a service for convenient manipulation with Topcoder
 * challenges via TC API.
 */

import _ from 'lodash';
import logger from 'utils/logger';
import moment from 'moment';
import qs from 'qs';
import { COMPETITION_TRACKS } from 'utils/tc';
import { getApiV2, getApiV3 } from './api';

export const ORDER_BY = {
  SUBMISSION_END_DATE: 'submissionEndDate',
};

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
    d.phaseType === 'Registration',
  )[0].phaseStatus === 'Open' ? 'Yes' : 'No';
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
    registrationOpen: endTimestamp > Date.now() &&
      (challenge.status !== 'PAST') ? 'Yes' : 'No',
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
    const getChallenges = (
      endpoint,
      filters = {},
      params = {},
    ) => {
      const query = {
        filter: qs.stringify(filters, { encode: false }),
        ...params,
      };
      return this.private.api.get(`${endpoint}?${qs.stringify(query)}`)
        .then(res => (res.ok ? res.json() : new Error(res.statusText)))
        .then(res => (
          res.result.status === 200 ? {
            challenges: res.result.content || [],
            totalCount: res.result.metadata.totalCount,
          } : new Error(res.result.content)
        ));
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
   * Activates closes specified challenge.
   * @param {Number} challengeId
   * @return {Promise} Resolves to null value in case of success; otherwise it
   *  is rejected.
   */
  async activate(challengeId) {
    let res = await this.private.api.post(
      `/challenges/${challengeId}/activate`);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (res.status !== 200) throw new Error(res.content);
    return res.content;
  }

  /**
   * Closes the specified challenge.
   * @param {Number} challengeId
   * @param {Number} winnerId
   * @return {Promise} Resolves to null value in case of success; otherwise it
   *  is rejected.
   */
  async close(challengeId) {
    // let url = `/challenges/${challengeId}/close`;
    let res = await this.private.api.post(
      `/challenges/${challengeId}/close`);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (res.status !== 200) throw new Error(res.content);
    return res.content;
  }

  /**
   * Creates a new payment task.
   * @param {Number} projectId
   * @param {Number} accountId Billing account ID.
   * @param {String} title
   * @param {String} description
   * @param {String} assignee
   * @param {Number} payment
   * @return {Promise} Resolves to the created challenge object (payment task).
   */
  async createTask(
    projectId,
    accountId,
    title,
    description,
    assignee,
    payment,
  ) {
    const payload = {
      param: {
        assignees: [assignee],
        billingAccountId: accountId,
        confidentialityType: 'public',
        milestoneId: 1,
        name: title,
        prizes: payment ? [payment] : [],
        projectId,
        registrationStartsAt: moment().toISOString(),
        reviewType: 'INTERNAL',
        subTrack: 'FIRST_2_FINISH',
        task: true,
      },
    };
    let res = await this.private.api.postJson('/challenges', payload);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (res.status !== 200) throw new Error(res.content);
    return res.content;
  }

  /**
   * Gets possible challenge subtracks.
   * @return {Promise} Resolves to the array of subtrack names.
   */
  getChallengeSubtracks() {
    return this.private.api.get('/challenge-types')
      .then(res => (res.ok ? res.json() : new Error(res.statusText)))
      .then(res => (
        res.result.status === 200 ?
          res.result.content :
          new Error(res.result.content)
      ));
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

  submit(body, challengeId, track, onProgress) {
    const url = track !== 'DESIGN' ?
      `/develop/challenges/${challengeId}/upload` :
      `/design/challenges/${challengeId}/submit`;
    return this.private.apiV2.upload(url, {
      body,
      headers: { 'Content-Type': null },
      method: 'POST',
    }, onProgress).then(
      res => res.json(),
      (err) => {
        logger.error(`Failed to submit to the challenge #${challengeId}`, err);
        throw err;
      },
    );
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
  if (!lastInstance || lastInstance.private.tokenV3 !== tokenV3
  || lastInstance.tokenV2 !== tokenV2) {
    lastInstance = new ChallengesService(tokenV3, tokenV2);
  }
  return lastInstance;
}

/* Using default export would be confusing in this case. */
export default undefined;

/**
 * This module provides a service for convenient manipulation with Topcoder
 * challenges via TC API.
 */

import _ from 'lodash';
import logger from 'utils/logger';
import moment from 'moment';
import qs from 'qs';
import { decodeToken } from 'tc-accounts';
import { setErrorIcon, ERROR_ICON_TYPES } from 'utils/errors';
import { COMPETITION_TRACKS, getApiResponsePayloadV3 } from 'utils/tc';
import { getApiV2, getApiV3 } from './api';

export const ORDER_BY = {
  SUBMISSION_END_DATE: 'submissionEndDate',
};

/**
 * Normalize name convention for subtrack
 * @param subTrack
 * @returns {*} new subtrack
 */
function normalizeNameConventionForSubtrack(subTrack) {
  switch (subTrack) {
    case 'Copilot Posting':
      return 'COPILOT_POSTING';
    case 'Web Design':
      return 'WEB_DESIGNS';
    case 'Logo Design':
      return 'LOGO_DESIGN';
    case 'Banners/Icons':
      return 'BANNERS_OR_ICONS';
    case 'Application Front-End Design':
      return 'APPLICATION_FRONT_END_DESIGN';
    case 'Widget or Mobile Screen Design':
      return 'WIDGET_OR_MOBILE_SCREEN_DESIGN';
    case 'Front-End Flash':
      return 'FRONT_END_FLASH';
    case 'Print/Presentation':
      return 'PRINT_OR_PRESENTATION';
    case 'Wireframes':
      return 'WIREFRAMES';
    case 'Idea Generation':
      return 'IDEA_GENERATION';
    case 'Studio Other':
      return 'STUDIO_OTHER';
    case 'Conceptualization':
      return 'CONCEPTUALIZATION';
    case 'Specification':
      return 'SPECIFICATION';
    case 'Architecture':
      return 'ARCHITECTURE';
    case 'Design':
      return 'DESIGN';
    case 'Development':
      return 'DEVELOPMENT';
    case 'RIA Build Competition':
      return 'RIA_BUILD_COMPETITION';
    case 'UI Prototype Competition':
      return 'UI_PROTOTYPE_COMPETITION';
    case 'Assembly Competition':
      return 'ASSEMBLY_COMPETITION';
    case 'Test Suites':
      return 'TEST_SUITES';
    case 'Test Scenarios':
      return 'TEST_SCENARIOS';
    case 'Content Creation':
      return 'CONTENT_CREATION';
    case 'Bug Hunt':
      return 'BUG_HUNT';
    case 'Design First2Finish':
      return 'DESIGN_FIRST_2_FINISH';
    case 'Code':
      return 'CODE';
    case 'First2Finish':
      return 'FIRST_2_FINISH';
    case 'Marathon Match':
    case 'DEVELOP_MARATHON_MATCH':
      return 'MARATHON_MATCH';
    default:
      return subTrack;
  }
}

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
export function normalizeChallengeDetails(v3, v3Filtered, v3User, username) {
  // Normalize exising data to make it consistent with the rest of the code
  const challenge = {
    ...v3,

    allPhases: v3.phases || [],
    submissionEndDate: v3.submissionEndDate,
    submissionEndTimestamp: v3.submissionEndDate,

    id: v3.challengeId,
    reliabilityBonus: v3Filtered.reliabilityBonus || 0,
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
  };

  // Fill missing data from v3_filtered
  if (v3Filtered) {
    const groups = {};
    if (v3Filtered.groupIds) {
      v3Filtered.groupIds.forEach((id) => {
        groups[id] = true;
      });
    }

    // Normalize name convention for subtrack
    const newsubTrack = normalizeNameConventionForSubtrack(v3Filtered.subTrack);
    _.defaults(challenge, {
      componentId: v3Filtered.componentId,
      contestId: v3Filtered.contestId,

      track: newsubTrack === 'MARATHON_MATCH' ? 'DATA_SCIENCE' : v3Filtered.track,
      subTrack: newsubTrack,

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

  // Fill some derived data
  const registrationOpen = _.some(challenge.allPhases,
    phase => phase.phaseType === 'Registration' && phase.phaseStatus === 'Open') ? 'Yes' : 'No';
  _.defaults(challenge, {
    communities: new Set([COMPETITION_TRACKS[challenge.track]]),
    registrationOpen,
    users: username ? { [username]: true } : {},
  });

  // A hot fix to show submissions for on-going challenges
  if (!challenge.submissions || !challenge.submissions.length) {
    challenge.submissions = v3.registrants
      .filter(r => r.submissionDate || '')
      .sort((a, b) => (a.submissionDate || '')
        .localeCompare(b.submissionDate || ''));
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

  // Normalize name convention for subtrack
  const newsubTrack = normalizeNameConventionForSubtrack(challenge.subTrack);
  _.set(challenge, 'subTrack', newsubTrack);
  _.set(challenge, 'track', newsubTrack === 'MARATHON_MATCH' ? 'DATA_SCIENCE' : challenge.track);
  _.defaults(challenge, {
    communities: new Set([COMPETITION_TRACKS[challenge.track]]),
    groups,
    platforms: '',
    registrationOpen,
    submissionEndTimestamp: challenge.submissionEndDate,
    users: username ? { [username]: true } : {},
  });
  /* eslint-disable no-param-reassign */
  if (!challenge.prizes) challenge.prizes = challenge.prize || [];
  if (!challenge.totalPrize) {
    challenge.totalPrize = challenge.prizes.reduce((sum, x) => sum + x, 0);
  }
  if (!challenge.technologies) challenge.technologies = '';
  /* eslint-enable no-param-reassign */
}

/**
 * Helper method that checks for HTTP error response and throws Error in this case.
 * @param {Object} res HTTP response object
 * @return {Object} API JSON response object
 * @private
 */
async function checkError(res) {
  if (!res.ok) {
    if (res.status >= 500) {
      setErrorIcon(ERROR_ICON_TYPES.API, '/challenges', res.statusText);
    }
    throw new Error(res.statusText);
  }
  const jsonRes = (await res.json()).result;
  if (jsonRes.status !== 200) throw new Error(jsonRes.content);
  return jsonRes;
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
    const getChallenges = async (
      endpoint,
      filters = {},
      params = {},
    ) => {
      const query = {
        filter: qs.stringify(filters, { encode: false }),
        ...params,
      };
      const url = `${endpoint}?${qs.stringify(query)}`;
      const res = await this.private.api.get(url).then(checkError);
      return {
        challenges: res.content || [],
        totalCount: res.metadata.totalCount,
      };
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
   * Activates the specified challenge.
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
   * @param {Number} winnerId Optional. ID of the assignee to declare the
   *  winner.
   * @return {Promise} Resolves to null value in case of success; otherwise it
   *  is rejected.
   */
  async close(challengeId, winnerId) {
    let url = `/challenges/${challengeId}/close`;
    if (winnerId) url = `${url}?winnerId=${winnerId}`;
    let res = await this.private.api.post(url);
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
   * Gets challenge details from Topcoder API v3.
   * NOTE: This function also uses API v2 and other v3 endpoints for now, due
   * to some information is missing or
   * incorrect in the main v3 endpoint. This may change in the future.
   * @param {Number|String} challengeId
   * @return {Promise} Resolves to the challenge object.
   */
  async getChallengeDetails(challengeId) {
    const challengeV3 = await this.private.api.get(`/challenges/${challengeId}`)
      .then(checkError).then(res => res.content);

    const challengeV3Filtered =
      await this.private.getChallenges('/challenges/', { id: challengeId })
        .then(res => res.challenges[0]);

    const username = this.private.tokenV3 && decodeToken(this.private.tokenV3).handle;
    const challengeV3User = username && await this.getUserChallenges(username, { id: challengeId })
      .then(res => res.challenges[0]);

    const challenge = normalizeChallengeDetails(
      challengeV3, challengeV3Filtered, challengeV3User, username);

    challenge.fetchedWithAuth = Boolean(this.private.api.private.token);

    return challenge;
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
   * Gets SRM matches.
   * @param {Object} params
   * @return {Promise}
   */
  async getSrms(params) {
    const res = await this.private.api.get(`/srms/?${qs.stringify(params)}`);
    return getApiResponsePayloadV3(res);
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
   * Gets SRM matches related to the user.
   * @param {String} handle
   * @param {Object} params
   * @return {Promise}
   */
  async getUserSrms(handle, params) {
    const url = `/members/${handle}/srms/?${qs.stringify(params)}`;
    const res = await this.private.api.get(url);
    return getApiResponsePayloadV3(res);
  }

  /**
   * Registers user to the specified challenge.
   * @param {String} challengeId
   * @return {Promise}
   */
  async register(challengeId) {
    const endpoint = `/challenges/${challengeId}/register`;
    const res = await this.private.api.postJson(endpoint);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  /**
   * Unregisters user from the specified challenge.
   * @param {String} challengeId
   * @return {Promise}
   */
  async unregister(challengeId) {
    const endpoint = `/challenges/${challengeId}/unregister`;
    const res = await this.private.api.post(endpoint);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
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
    return this.private.getChallenges(endpoint, filters, params);
  }

  /**
   * Submits a challenge submission.  Uses APIV2 for Development submission
   * and APIV3 for Design submisisons.
   * @param {Object} body
   * @param {String} challengeId
   * @param {String} track Either DESIGN or DEVELOP
   * @return {Promise}
   */
  submit(body, challengeId, track, onProgress) {
    let api;
    let contentType;
    let url;

    if (track === 'DESIGN') {
      api = this.private.api;
      contentType = 'application/json';
      url = '/submissions/'; // The submission info is contained entirely in the JSON body
    } else {
      api = this.private.apiV2;
      // contentType = 'multipart/form-data';
      contentType = null;
      url = `/develop/challenges/${challengeId}/upload`;
    }

    return api.upload(url, {
      body,
      headers: { 'Content-Type': contentType },
      method: 'POST',
    }, onProgress).then((res) => {
      const jres = JSON.parse(res);
      // Return result for Develop submission
      if (track === 'DEVELOP') {
        return jres;
      }
      // Design Submission requires an extra "Processing" POST
      const procId = jres.result.content.id;
      return api.upload(`/submissions/${procId}/process/`, {
        body: JSON.stringify({ param: jres.result.content }),
        headers: { 'Content-Type': contentType },
        method: 'POST',
      }, onProgress).then(procres => JSON.parse(procres));
    }, (err) => {
      logger.error(`Failed to submit to the challenge #${challengeId}`, err);
      throw err;
    });
  }

  /**
   * Updates the challenge (saves the give challenge to the API).
   * @param {Object} challenge
   * @param {String} tokenV3
   * @return {Promise}
   */
  async updateChallenge(challenge) {
    const URL = `/challenges/${challenge.id}`;
    const body = { param: challenge };
    let res = await this.private.api.putJson(URL, body);
    if (!res.ok) throw new Error(res.statusText);
    res = (await res.json()).result;
    if (res.status !== 200) throw new Error(res.content);
    return res.content;
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

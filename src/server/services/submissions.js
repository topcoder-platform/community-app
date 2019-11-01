/**
 * Encapsulates interactions with Topcoder Submission API.
 */

import _ from 'lodash';

import config from 'config';
import qs from 'qs';
import { services } from 'topcoder-react-lib';

import { fail } from '../utils/errors';
import { getM2MToken } from '../auth';

/**
 * Size of submissions page returned by TC API V5.
 */
const SUBMISSIONS_PAGE_SIZE = 500;

/**
 * Returns an instance of Topcoder API V5 service.
 * @return {Promise} Resolves to Topcoder API V5 service.
 */
async function getApi() {
  const token = await getM2MToken();
  return services.api.getApi('V5', token);
}

/**
 * Private. Loads from the backend all data matching some conditions.
 * @param {Function} getter Given params object of shape { limit, offset }
 *  loads from the backend at most "limit" data, skipping the first
 *  "offset" ones. Returns loaded data as an array.
 * @param {Number} page Optional. Next page of data to load.
 * @param {Number} perPage Optional. The size of the page content to load.
 * @param {Array} prev Optional. data loaded so far.
 */
function getAll(getter, page = 1, perPage = SUBMISSIONS_PAGE_SIZE, prev) {
  return getter({
    page,
    perPage,
  }).then((res) => {
    if (res.length === 0) {
      return prev || res;
    }
    // parse submissions
    let current = [];
    if (prev) {
      current = prev.concat(res);
    } else {
      current = res;
    }
    return getAll(getter, 1 + page, perPage, current);
  });
}

/**
 * Handles API response, throwing an error if necessary, returning decoded
 * payload otherwise.
 * @param {Object} fetchResult API response.
 * @return {Promise} Resolves to the response payload, or rejects with error.
 */
async function responseHandler(fetchResult) {
  if (!fetchResult.ok) fail(fetchResult.statusText);
  const response = await fetchResult.json();
  return response;
}

function removeDecimal(num) {
  const re = new RegExp('^-?\\d+');
  return num.toString().match(re)[0];
}

function toAcurateFixed(num, decimal) {
  const re = new RegExp(`^-?\\d+(?:.\\d{0,${(decimal)}})?`);
  return num.toString().match(re)[0];
}

function toFixed(num, decimal) {
  let res = parseFloat(num);
  if (_.isNaN(res)) return num;

  res = _.toFinite(toAcurateFixed(num, decimal));
  const integerResult = _.toFinite(removeDecimal(num));

  if (_.isInteger(res)) return integerResult;
  return res;
}

// function getMMChallengeHandleStyle(handle, registrants) {
//   const style = _.get(_.find(registrants, m => m.handle === handle), 'colorStyle', null);
//   if (style) return JSON.parse(style.replace(/(\w+):\s*([^;]*)/g, '{"$1": "$2"}'));
//   return {};
// }

/**
 * Process each submission rank of MM challenge
 * @param submissions the array of submissions
 */
function processRanks(submissions) {
  /* eslint-disable no-param-reassign */
  let maxFinalScore = 0;
  submissions.sort((a, b) => {
    let pA = _.get(a, 'submissions[0]', { provisionalScore: 0 }).provisionalScore;
    let pB = _.get(b, 'submissions[0]', { provisionalScore: 0 }).provisionalScore;
    if (pA === '-') pA = 0;
    if (pB === '-') pB = 0;
    if (pA === pB) {
      const timeA = new Date(_.get(a, 'submissions[0].submissionTime'));
      const timeB = new Date(_.get(b, 'submissions[0].submissionTime'));
      return timeA - timeB;
    }
    return pB - pA;
  });

  _.each(submissions, (submission, i) => {
    submissions[i].provisionalRank = i + 1;
  });

  submissions.sort((a, b) => {
    let pA = _.get(a, 'submissions[0]', { finalScore: 0 }).finalScore;
    let pB = _.get(b, 'submissions[0]', { finalScore: 0 }).finalScore;
    if (pA === '-') pA = 0;
    if (pB === '-') pB = 0;
    if (pA > 0) maxFinalScore = pA;
    if (pB > 0) maxFinalScore = pB;
    if (pA === pB) {
      const timeA = new Date(_.get(a, 'submissions[0].submissionTime'));
      const timeB = new Date(_.get(b, 'submissions[0].submissionTime'));
      return timeA - timeB;
    }
    return pB - pA;
  });
  if (maxFinalScore > 0) {
    _.each(submissions, (submission, i) => {
      submissions[i].finalRank = i + 1;
    });
  }
  return { submissions, maxFinalScore };
  /* eslint-disable no-param-reassign */
}

/**
 * Process submissions of MM challenge
 * @param submissions the array of submissions
 * @param registrants the challenge registrants
 */
// export function processMMSubmissions(submissions, registrants) {
export function processMMSubmissions(submissions) {
  const data = {};
  const result = [];

  _.each(submissions, (submission) => {
    const validReviews = _.filter(submission.review,
      r => !_.isEmpty(r) && (r.typeId !== config.AV_SCAN_SCORER_REVIEW_TYPE_ID));
    validReviews.sort((a, b) => {
      const dateA = new Date(a.created);
      const dateB = new Date(b.created);
      return dateB - dateA;
    });

    const provisionalScore = toFixed(_.get(validReviews, '[0].score', '-'), 5);
    const finalScore = toFixed(_.get(submission, 'reviewSummation[0].aggregateScore', '-'), 5);
    const status = _.get(validReviews, '[0].status', 'queued');

    const datum = {
      ...submission,
      submissionId: submission.id,
      submissionTime: submission.created,
      provisionalScore,
      finalScore,
      status,
    };
    const d = data[submission.createdBy];
    if (d) d.push(datum);
    else data[submission.createdBy] = [datum];
  });

  _.each(data, (value, key) => {
    result.push({
      submissions: [...value.sort((a, b) => new Date(b.submissionTime)
        .getTime() - new Date(a.submissionTime).getTime())],
      member: key,
      // colorStyle: getMMChallengeHandleStyle(key, registrants),
    });
  });

  const { submissions: finalSubmissions, maxFinalScore } = processRanks(result);
  finalSubmissions.sort((a, b) => {
    if (maxFinalScore === 0) {
      return a.provisionalRank - b.provisionalRank;
    }
    return a.finalRank - b.finalRank;
  });

  return finalSubmissions;
}

/**
 * Get submissions of challenge.
 * @param {String} challengeId
 * @return {Promise} Resolves to the api response.
 */
export async function getSubmissions(challengeId) {
  const raw = await getAll(async (params) => {
    const query = { challengeId, ...params };
    const url = `/submissions?${qs.stringify(query, { encode: false })}`;
    const api = await getApi();
    const response = await api.get(url);
    return responseHandler(response);
  });

  // const token = await getM2MToken();
  // const challengeService = await services.challenge.getService(token);
  // const registrants = await challengeService.getChallengeRegistrants(challengeId);
  // return processMMSubmissions(raw, registrants);
  return processMMSubmissions(raw);
}

/**
 * Get submission information by submission id
 * @param submissionId The submission id
 * @returns {Promise} Resolves to the api response.
 */
export async function getSubmissionInformation(submissionId) {
  const url = `/submissions/${submissionId}`;
  const api = await getApi();
  const response = await api.get(url);
  return responseHandler(response);
}

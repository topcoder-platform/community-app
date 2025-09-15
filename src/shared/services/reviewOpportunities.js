import { config } from 'topcoder-react-utils';
import _ from 'lodash';


const v6ApiUrl = config.API.V6;

/**
 * Fetches copilot opportunities.
 *
 * @param {number} page - Page number (1-based).
 * @param {number} pageSize - Number of items per page.
 * @returns {Promise<Object>} The fetched data.
 */
export default async function getReviewOpportunities(page, pageSize) {
  const offset = page * pageSize;

  const url = new URL(`${v6ApiUrl}/review-opportunities`);
  url.searchParams.append('limit', pageSize);
  url.searchParams.append('offset', offset);

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

/**
 * Sync the fields of V3 and V5 for front-end to process successfully
 * @param challenge - challenge to normalize
 */
function normalizeChallengePhases(challenge) {
  return {
    ...challenge,
    phases: _.map(challenge.phases, phase => ({
      ...phase,
      scheduledStartDate: phase.scheduledStartTime,
      scheduledEndDate: phase.scheduledEndTime,
    })),
  };
}


/**
   * Gets the details of the review opportunity for the corresponding challenge
   * @param {Number} challengeId The ID of the challenge (not the opportunity id)
   * @return {Object} The combined data of the review opportunity and challenge details
   */
export async function getDetails(challengeId, opportunityId) {
  const getReviewOpportunityUrl = new URL(`${v6ApiUrl}/review-opportunities/${opportunityId}`);
  const getChallengeUrl = new URL(`${v6ApiUrl}/challenges/${challengeId}`);

  try {
    const [opportunityRes, challengeRes] = await Promise.all([
      fetch(getReviewOpportunityUrl.toString(), { method: 'GET' }),
      fetch(getChallengeUrl.toString(), { method: 'GET' }),
    ]);

    if (!opportunityRes.ok) {
      throw new Error(`Failed to load review opportunity: ${opportunityRes.statusText}`);
    }
    if (!challengeRes.ok) {
      throw new Error(`Failed to load challenge details: ${challengeRes.statusText}`);
    }

    const opportunityData = await opportunityRes.json();
    const challengeData = await challengeRes.json();

    return {
      ...opportunityData.result.content,
      challenge: normalizeChallengePhases(challengeData),
    };
  } catch (err) {
    return Promise.reject(err);
  }
}

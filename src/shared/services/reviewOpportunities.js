import { config } from 'topcoder-react-utils';
import { withEstimatedReviewerPayments } from 'utils/reviewOpportunities';

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

  const data = await res.json();

  const opportunities = Array.isArray(data) ? data : [];
  return opportunities.map(opportunity => withEstimatedReviewerPayments(opportunity));
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
      ...withEstimatedReviewerPayments(opportunityData.result.content),
      challenge: challengeData,
    };
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
   * Submits review opportunity application for the specified challenge
   * @param {Number} challengeId The ID of the challenge (not the opportunity id)
   * @param {Array} roleIds List of review role IDs to apply for
   * @return {Promise} Resolves to the api response in JSON.
   */
export async function submitApplications(opportunityId, tokenV3) {
  const payload = {
    opportunityId,
    role: 'REVIEWER',
  };
  try {
    const res = await fetch(`${v6ApiUrl}/review-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenV3}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    return 'There was an error while submitting the application.';
  }
}

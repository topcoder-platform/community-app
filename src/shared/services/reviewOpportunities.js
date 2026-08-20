import { config } from 'topcoder-react-utils';
import { withEstimatedReviewerPayments } from 'utils/reviewOpportunities';

const v6ApiUrl = config.API.V6;

/**
 * Normalizes challenge details pulled from review opportunity payloads.
 * This is used as fallback when challenge API access is restricted (for example
 * grouped challenges whose review opportunities are public).
 *
 * @param {Object} opportunity Review opportunity details payload.
 * @param {string|number} challengeId Challenge id from route.
 * @returns {Object} Challenge-like object expected by the details page.
 */
function buildChallengeFallback(opportunity, challengeId) {
  const challenge = opportunity
    ? (opportunity.challenge || opportunity.challengeData || {})
    : {};

  return {
    ...challenge,
    id: challenge.id || challengeId,
    name: challenge.name || challenge.title || '',
    type: challenge.type || challenge.subTrack || '',
    phases: Array.isArray(challenge.phases) ? challenge.phases : [],
    terms: Array.isArray(challenge.terms) ? challenge.terms : [],
  };
}

/**
 * Builds the request options for review opportunity reads.
 * The token must be forwarded so that the API can evaluate the caller against
 * the groups of private challenges; anonymous calls only receive opportunities
 * of public challenges.
 *
 * @param {String} tokenV3 Optional. Topcoder auth token v3.
 * @returns {Object} Fetch options for a GET request.
 */
function getRequestOptions(tokenV3) {
  return {
    method: 'GET',
    headers: tokenV3 ? { Authorization: `Bearer ${tokenV3}` } : {},
  };
}

/**
 * Fetches review opportunities.
 *
 * @param {number} page - Page number (1-based).
 * @param {number} pageSize - Number of items per page.
 * @param {String} tokenV3 - Optional. Topcoder auth token v3.
 * @returns {Promise<Object>} The fetched data.
 */
export default async function getReviewOpportunities(page, pageSize, tokenV3) {
  const offset = page * pageSize;

  const url = new URL(`${v6ApiUrl}/review-opportunities`);
  url.searchParams.append('limit', pageSize);
  url.searchParams.append('offset', offset);

  const res = await fetch(url.toString(), getRequestOptions(tokenV3));

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
   * @param {Number} opportunityId The ID of the review opportunity
   * @param {String} tokenV3 Optional. Topcoder auth token v3.
   * @return {Object} The combined data of the review opportunity and challenge details
   */
export async function getDetails(challengeId, opportunityId, tokenV3) {
  const getReviewOpportunityUrl = new URL(`${v6ApiUrl}/review-opportunities/${opportunityId}`);
  const getChallengeUrl = new URL(`${v6ApiUrl}/challenges/${challengeId}`);
  const options = getRequestOptions(tokenV3);

  try {
    const [opportunityRes, challengeRes] = await Promise.all([
      fetch(getReviewOpportunityUrl.toString(), options),
      fetch(getChallengeUrl.toString(), options),
    ]);

    if (!opportunityRes.ok) {
      throw new Error(`Failed to load review opportunity: ${opportunityRes.statusText}`);
    }

    const opportunityData = await opportunityRes.json();
    const opportunityDetails = withEstimatedReviewerPayments(opportunityData.result.content);

    let challengeData;
    if (challengeRes.ok) {
      challengeData = await challengeRes.json();
    } else if (challengeRes.status === 403) {
      challengeData = buildChallengeFallback(opportunityDetails, challengeId);
    } else {
      throw new Error(`Failed to load challenge details: ${challengeRes.statusText}`);
    }

    return {
      ...opportunityDetails,
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

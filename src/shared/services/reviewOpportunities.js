import { config } from 'topcoder-react-utils';

const v6ApiUrl = config.API.V6;

/**
 * Fetches copilot opportunities.
 *
 * @param {number} page - Page number (1-based).
 * @param {number} pageSize - Number of items per page.
 * @param {string} sort - Sort order (e.g., 'createdAt desc').
 * @returns {Promise<Object>} The fetched data.
 */
export default async function getReviewOpportunities(page, pageSize) {
  const offset = page * pageSize;

  const url = new URL(`${v6ApiUrl}/review-opportunities`);
  url.searchParams.append('limit', pageSize);
  url.searchParams.append('offset', offset);

  const res = await fetch(url.toString(), { method: 'GET' });
  const data = await res.json();

  return data.map(item => ({
    ...item,
    challengeData: item.challengeData || item.challenge || {},
    type: item.type || '',
  }));
}

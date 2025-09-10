import { config } from 'topcoder-react-utils';

const v6ApiUrl = config.API.V6;

/**
 * Fetches copilot opportunities.
 *
 * @param {number} page - Page number (1-based).
 * @param {number} pageSize - Number of items per page.
 * @returns {Promise<Object>} The fetched data.
 */
export default function getReviewOpportunities(page, pageSize) {
  const offset = page * pageSize;

  const url = new URL(`${v6ApiUrl}/review-opportunities`);
  url.searchParams.append('limit', pageSize);
  url.searchParams.append('offset', offset);

  return fetch(url.toString(), {
    method: 'GET',
  }).then(res => res.json());
}

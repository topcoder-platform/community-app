import { config } from 'topcoder-react-utils';

const v6ApiUrl = config.API.V6;

/**
 * Fetches copilot opportunities.
 *
 * @param {number} page - Page number (1-based; invalid or below 1 is sent as 1 for v6 API).
 * @param {number} pageSize - Number of items per page.
 * @param {string} sort - Sort order (e.g., 'createdAt desc').
 * @returns {Promise<Object>} The fetched data.
 */
export default function getCopilotOpportunities(page, pageSize = 20, sort = 'createdAt desc', noGrouping = true) {
  const pageNum = parseInt(page, 10);
  const safePage = Number.isFinite(pageNum) && pageNum >= 1 ? pageNum : 1;
  const url = new URL(`${v6ApiUrl}/projects/copilots/opportunities`);
  url.searchParams.append('page', safePage);
  url.searchParams.append('pageSize', pageSize);
  url.searchParams.append('sort', sort);
  if (noGrouping) url.searchParams.append('noGrouping', 'true');

  return fetch(url.toString(), {
    method: 'GET',
  }).then(res => res.json());
}

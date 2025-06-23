import { config } from 'topcoder-react-utils';

const v5ApiUrl = config.API.V5;

/**
 * Fetches copilot opportunities.
 *
 * @param {number} page - Page number (1-based).
 * @param {number} pageSize - Number of items per page.
 * @param {string} sort - Sort order (e.g., 'createdAt desc').
 * @returns {Promise<Object>} The fetched data.
 */
export default function getCopilotOpportunities(page, pageSize = 20, sort = 'createdAt desc') {
  const url = `${v5ApiUrl}/projects/copilots/opportunities?page=${page}&pageSize=${pageSize}&sort=${encodeURIComponent(sort)}`;

  return fetch(url, {
    method: 'GET',
  }).then(res => res.json());
}

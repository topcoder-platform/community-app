import { config } from 'topcoder-react-utils';

const engagementsApiUrl = config.API.ENGAGEMENTS || `${config.API.V6}/engagements`;

function buildEngagementsUrl(page, pageSize, filters = {}) {
  const offset = page * pageSize;
  const url = new URL(engagementsApiUrl);

  url.searchParams.append('limit', pageSize);
  url.searchParams.append('offset', offset);

  if (filters.status) {
    url.searchParams.append('status', filters.status);
  }

  if (filters.search) {
    url.searchParams.append('search', filters.search);
  }

  if (filters.location) {
    url.searchParams.append('location', filters.location);
  }

  if (filters.skills && filters.skills.length) {
    const skills = Array.isArray(filters.skills)
      ? filters.skills
      : [filters.skills];
    url.searchParams.append('skills', skills.join(','));
  }

  return url;
}

function getAuthHeaders(tokenV3) {
  if (!tokenV3) return undefined;
  return {
    Authorization: `Bearer ${tokenV3}`,
  };
}

function extractEngagements(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && data.result && Array.isArray(data.result.content)) return data.result.content;
  if (data && data.result && Array.isArray(data.result.data)) return data.result.data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

function extractMeta(data, engagementsCount) {
  if (!data || Array.isArray(data)) return { totalCount: engagementsCount };
  if (data.meta) return data.meta;
  if (data.result && data.result.metadata) return data.result.metadata;
  if (typeof data.totalCount === 'number') return { totalCount: data.totalCount };
  if (typeof data.total === 'number') return { totalCount: data.total };
  if (typeof data.count === 'number') return { totalCount: data.count };
  return { totalCount: engagementsCount };
}

/**
 * Fetches engagements.
 *
 * @param {number} page - Page number (0-based).
 * @param {number} pageSize - Number of items per page.
 * @param {Object} filters - Filters for engagements.
 * @param {string} tokenV3 - Optional auth token.
 * @returns {Promise<{engagements: Object[], meta: Object}>} The fetched data.
 */
export default async function getEngagements(page, pageSize, filters = {}, tokenV3) {
  const url = buildEngagementsUrl(page, pageSize, filters);
  const headers = getAuthHeaders(tokenV3);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    const engagements = extractEngagements(data);
    const meta = extractMeta(data, engagements.length);

    return { engagements, meta };
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Fetches a single engagement by ID.
 *
 * @param {string} engagementId - The engagement ID.
 * @param {string} tokenV3 - Optional auth token.
 * @returns {Promise<Object>} The engagement details.
 */
export async function getEngagementDetails(engagementId, tokenV3) {
  const url = new URL(`${engagementsApiUrl}/${encodeURIComponent(engagementId)}`);
  const headers = getAuthHeaders(tokenV3);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

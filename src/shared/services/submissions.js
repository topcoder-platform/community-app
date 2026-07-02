import { config } from 'topcoder-react-utils';

const v6ApiUrl = config.API.V6;
const DEFAULT_PER_PAGE = 500;

export const downloadSubmissions = (tokenV3, submissionId, artifactId) => fetch(`${v6ApiUrl}/submissions/${submissionId}/artifacts/${artifactId}/download`, {
  method: 'GET',
  headers: new Headers({
    Authorization: `Bearer ${tokenV3}`,
  }),
}).then(res => res.blob());

export const getSubmissionArtifacts = (tokenV3, submissionId) => fetch(`${v6ApiUrl}/submissions/${submissionId}/artifacts`, {
  method: 'GET',
  headers: new Headers({
    Authorization: `Bearer ${tokenV3}`,
  }),
}).then(res => res.json());

function getHeaders(tokenV3) {
  const headers = new Headers();
  if (tokenV3) {
    headers.set('Authorization', `Bearer ${tokenV3}`);
  }
  return headers;
}

async function fetchChallengeSubmissionsPage({
  tokenV3,
  challengeId,
  page,
  perPage,
  filters,
  aggregated,
  meta,
}) {
  const params = new URLSearchParams();
  params.set('challengeId', challengeId);
  params.set('perPage', perPage);
  params.set('page', page);
  Object.keys(filters || {}).forEach((key) => {
    const value = filters[key];
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value);
    }
  });
  const url = `${v6ApiUrl}/submissions?${params.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(tokenV3),
  });

  if (!response.ok) {
    const error = new Error(`Failed to fetch submissions: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  const data = payload.data || [];
  const combined = [...aggregated, ...data];
  const latestMeta = payload.meta || meta;
  const totalPages = payload.meta && (payload.meta.totalPages || payload.meta.total_pages);
  const reachedEnd = !data.length
    || (totalPages ? page >= totalPages : data.length < perPage);

  if (reachedEnd) {
    return {
      data: combined,
      meta: latestMeta,
    };
  }

  return fetchChallengeSubmissionsPage({
    tokenV3,
    challengeId,
    page: page + 1,
    perPage,
    filters,
    aggregated: combined,
    meta: latestMeta,
  });
}

/**
 * Fetches every submission page for a challenge from the v6 submissions API.
 *
 * The challenge details service only embeds the first page of submissions, so
 * Marathon Match views use this helper when they need complete member attempt
 * history.
 *
 * @param {String} tokenV3 Topcoder auth token v3 used for private challenge access.
 * @param {String|Number} challengeId Challenge identifier used by the submissions API.
 * @param {Object} options Optional pagination settings.
 * @param {Number} options.perPage Number of records requested per API page.
 * @param {Boolean} options.isLatest When true, fetch only the latest submission per member.
 * @param {String|Number} options.memberId Optional member id used to fetch one member's history.
 * @return {Promise<{data: Array, meta: Object}>} Aggregated submissions and
 * final response metadata.
 * @throws {Error} Throws when any submissions API page returns a non-2xx status.
 */
export async function getChallengeSubmissions(tokenV3, challengeId, options = {}) {
  const {
    isLatest,
    memberId,
    perPage = DEFAULT_PER_PAGE,
  } = options;
  const { data, meta } = await fetchChallengeSubmissionsPage({
    tokenV3,
    challengeId,
    page: 1,
    perPage,
    filters: {
      isLatest: isLatest === undefined ? undefined : isLatest,
      memberId,
    },
    aggregated: [],
    meta: null,
  });

  return {
    data,
    meta: {
      ...(meta || {}),
      totalItems: data.length,
      perPage,
    },
  };
}

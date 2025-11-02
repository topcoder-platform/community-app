import _ from 'lodash';
import { config } from 'topcoder-react-utils';

const baseUrl = config.URL.REVIEW_SUMMATIONS_API_URL;
const v6ApiUrl = config.API.V6;
const DEFAULT_PER_PAGE = 500;

async function fetchReviewSummationsPage({
  challengeId,
  headers,
  page,
  aggregated,
  meta,
}) {
  const url = `${v6ApiUrl}${baseUrl}?challengeId=${encodeURIComponent(challengeId)}&perPage=${DEFAULT_PER_PAGE}&page=${page}`;
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch review summations: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const data = payload.data || [];
  const combined = [...aggregated, ...data];
  const latestMeta = payload.meta || meta;

  const totalPages = _.get(payload, 'meta.totalPages')
    || _.get(payload, 'meta.total_pages');
  const reachedEnd = !data.length
    || (totalPages && page >= totalPages)
    || data.length < DEFAULT_PER_PAGE;

  if (reachedEnd) {
    return {
      aggregated: combined,
      meta: latestMeta,
    };
  }

  return fetchReviewSummationsPage({
    challengeId,
    headers,
    page: page + 1,
    aggregated: combined,
    meta: latestMeta,
  });
}

export default async function getReviewSummations(tokenV3, challengeId) {
  const headers = new Headers({
    Authorization: `Bearer ${tokenV3}`,
  });

  const { aggregated, meta } = await fetchReviewSummationsPage({
    challengeId,
    headers,
    page: 1,
    aggregated: [],
    meta: null,
  });

  return {
    data: aggregated,
    meta: {
      ...(meta || {}),
      totalItems: aggregated.length,
      perPage: DEFAULT_PER_PAGE,
    },
  };
}

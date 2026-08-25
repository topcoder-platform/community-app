/**
 * Server-side Payload CMS compatibility services.
 *
 * Contentful-shaped route and configuration names are intentionally retained
 * while callers migrate, but every outbound request is sent only to an
 * explicitly configured Topcoder Payload host.
 */

import _ from 'lodash';
import config from 'config';
import resolveResponse from 'contentful-resolve-response';
import https from 'https';
import fetch from 'isomorphic-fetch';
import stringifySafe from 'json-stringify-safe';
import qs from 'qs';
import {
  getContentfulApiBaseUrl,
  getContentfulApiHost,
} from './contentful-endpoints';
import { assertNoRetiredCmsUrls } from './cms-urls';

const cmsHttpsAgent = new https.Agent({ keepAlive: true });
const MAX_FETCH_RETRIES = 5;

function threeSecondDelay() {
  return new Promise(resolve => setTimeout(resolve, 3000));
}

function decodeQuery(value) {
  if (_.isArray(value)) return value.map(decodeQuery);
  if (_.isPlainObject(value)) return _.mapValues(value, decodeQuery);
  return typeof value === 'string' ? decodeURIComponent(value) : value;
}

function toSerializableEntryCollection(data) {
  const collection = {
    ...data,
    items: resolveResponse(data, { itemEntryPoints: ['fields'] }),
  };
  return JSON.parse(stringifySafe(collection, null, 0, (key, value) => ({
    sys: {
      circular: true,
      id: _.get(value, 'sys.id'),
      linkType: 'Entry',
      type: 'Link',
    },
  })));
}

/** HTTP client for Payload's Contentful-compatible API routes. */
export class ApiService {
  constructor(baseUrl, key) {
    this.private = { baseUrl, key };
  }

  async fetch(endpoint, query) {
    let url = `${this.private.baseUrl}${endpoint}`;
    if (query) url += `?${qs.stringify(query)}`;
    let res;
    for (let i = 0; i < MAX_FETCH_RETRIES; i += 1) {
      /* eslint-disable no-await-in-loop */
      res = await fetch(url, {
        agent: cmsHttpsAgent,
        headers: { Authorization: `Bearer ${this.private.key}` },
        redirect: 'manual',
      });
      if (res.status !== 429) break;
      await threeSecondDelay();
      /* eslint-enable no-await-in-loop */
    }
    if (!res.ok) {
      throw new Error(`Payload CMS compatibility request failed with status ${res.status}.`);
    }
    const data = await res.json();
    return assertNoRetiredCmsUrls(data);
  }

  async getAsset(id) {
    return this.fetch(`/assets/${encodeURIComponent(id)}`);
  }

  async getEntry(id) {
    return this.fetch(`/entries/${encodeURIComponent(id)}`);
  }

  async queryAssets(query) {
    return this.fetch('/assets', query);
  }

  async queryEntries(query) {
    const data = await this.fetch('/entries', decodeQuery(query));
    return toSerializableEntryCollection(data);
  }
}

/**
 * Writes article votes through Payload. There is deliberately no management
 * API fallback: incomplete configuration fails before any network request.
 */
export function articleVote(body, spaceName = 'EDU', environment = 'master') {
  const payloadUrl = config.SECRET.CONTENTFUL.PAYLOAD_VOTE_API_URL;
  const apiKey = config.SECRET.CONTENTFUL.PAYLOAD_MANAGEMENT_API_KEY;
  if (!payloadUrl) {
    return Promise.reject(new Error('CONTENTFUL_PAYLOAD_VOTE_API_URL is required; external CMS fallbacks are disabled.'));
  }
  if (!apiKey) {
    return Promise.reject(new Error('CONTENTFUL_PAYLOAD_MANAGEMENT_API_KEY is required for article voting.'));
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(payloadUrl);
  } catch (error) {
    return Promise.reject(new TypeError('CONTENTFUL_PAYLOAD_VOTE_API_URL must be a valid URL.'));
  }
  const allowedHost = parsedUrl.hostname === 'localhost'
    || parsedUrl.hostname === '127.0.0.1'
    || parsedUrl.hostname.endsWith('.topcoder.com')
    || parsedUrl.hostname.endsWith('.topcoder-dev.com');
  if (parsedUrl.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(parsedUrl.hostname)) {
    return Promise.reject(new Error('CONTENTFUL_PAYLOAD_VOTE_API_URL must use HTTPS.'));
  }
  if (!allowedHost) {
    return Promise.reject(new Error('CONTENTFUL_PAYLOAD_VOTE_API_URL must target an approved Topcoder Payload CMS host.'));
  }

  const spaceId = _.get(config, `SECRET.CONTENTFUL.${spaceName}.SPACE_ID`);
  if (!spaceId) {
    return Promise.reject(new Error(`Space '${spaceName}' is not configured for Payload CMS voting.`));
  }

  return fetch(parsedUrl.href, {
    agent: cmsHttpsAgent,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    redirect: 'manual',
    body: JSON.stringify({
      spaceId,
      environment,
      entryId: body.id,
      votes: body.votes,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Payload article vote update failed with status ${response.status}.`);
    }
    return response.json();
  });
}

const services = {};

/**
 * Returns a lazily-created compatibility service. Unsupported legacy spaces
 * with no Payload host fail only when requested and never use a default host.
 */
export function getService(spaceName, environment, preview) {
  const name = spaceName || config.CONTENTFUL.DEFAULT_SPACE_NAME;
  const envName = environment || config.CONTENTFUL.DEFAULT_ENVIRONMENT;
  const environmentConfig = _.get(config, `SECRET.CONTENTFUL.${name}.${envName}`);
  const spaceId = _.get(config, `SECRET.CONTENTFUL.${name}.SPACE_ID`);

  if (!environmentConfig || !spaceId) {
    throw new Error(`Space '${name}' environment '${envName}' is not configured.`);
  }

  const host = getContentfulApiHost(environmentConfig, preview);
  const key = preview
    ? environmentConfig.PREVIEW_API_KEY
    : environmentConfig.CDN_API_KEY;
  if (!key) {
    throw new Error(`Space '${name}' environment '${envName}' is missing its Payload compatibility API key.`);
  }

  const cacheKey = `${name}:${envName}:${preview ? 'preview' : 'published'}`;
  if (!services[cacheKey]) {
    services[cacheKey] = new ApiService(
      getContentfulApiBaseUrl(host, spaceId, envName),
      key,
    );
  }
  return services[cacheKey];
}

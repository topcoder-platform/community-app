/**
 * Server-side functions necessary for effective integration
 * with Contentful CMS
 */

import _ from 'lodash';
import config from 'config';
import { createClient } from 'contentful';
import https from 'https';
import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';
import { isomorphy } from 'topcoder-react-utils';
import { qs } from 'qs';
import {
  getContentfulApiBaseUrl,
  getContentfulApiHost,
} from './contentful-endpoints';

const contentful = require('contentful-management');

/**
 * Process-wide HTTPS connection pool shared by every server-side Contentful
 * Delivery, Preview, and Management SDK client. Node 10 does not enable
 * keep-alive on its default agent, so reusing this agent avoids a new TCP/TLS
 * connection for each CMS request while leaving browser requests unchanged.
 * @type {https.Agent}
 */
const contentfulHttpsAgent = new https.Agent({ keepAlive: true });

export const ASSETS_DOMAIN = 'assets.ctfassets.net';
export const IMAGES_DOMAIN = 'images.ctfassets.net';

export const ALLOWED_DOMAINS = [ASSETS_DOMAIN, IMAGES_DOMAIN];
const MAX_FETCH_RETRIES = 5;

/**
 * Generic logger for errors and warnings
 * from Contentful API calls
 * @param {String} level
 * @param {String} data
 */
function logHandler(level, data) {
  if (isomorphy.isDev) {
    logger.log('Contentful logHandler', level, data);
  }
}

/**
 * Creates a promise that resolves two second after its creation.
 * @return {Promise}
 */
function threeSecondDelay() {
  return new Promise(resolve => setTimeout(resolve, 3000));
}

/**
 * Auxiliary class that handles communication with Contentful CDN and preview
 * APIs in the same uniform manner.
 */
class ApiService {
  /**
   * Creates a new service instance.
   * @param {String} baseUrl The base API endpoint.
   * @param {String} key API key.
   * @param {String} spaceId The space id.
   * @param {Boolean} preview Use the preview API?
   * @param {String} host Contentful-compatible API hostname.
   */
  constructor(baseUrl, key, spaceId, preview, host) {
    this.private = {
      baseUrl, key, spaceId, preview, host,
    };
    // client config
    const clientConf = {
      accessToken: key,
      httpsAgent: contentfulHttpsAgent,
      space: spaceId,
      logHandler,
      host,
    };
    // create the client to work with
    this.client = createClient(clientConf);
  }

  /**
   * Gets data from the specified endpoing.
   * @param {String} endpoint
   * @param {Object} query Optional. URL query to append to the request.
   * @return {Promise}
   */
  async fetch(endpoint, query) {
    let url = `${this.private.baseUrl}${endpoint}`;
    if (query) url += `?${qs.stringify(query)}`;
    let res;
    for (let i = 0; i < MAX_FETCH_RETRIES; i += 1) {
      /* The loop is here to retry async operation multiple times in case of
       * failures due to violation of Contentful API rate limits, which are
       * 78 requests within 1 second. Thus, it is a valid use of await inside
       * loop. */
      /* eslint-disable no-await-in-loop */
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${this.private.key}` },
      });
      /* 429 = "Too Many Requests" */
      if (res.status !== 429) break;
      await threeSecondDelay();
      /* eslint-enable no-await-in-loop */
    }
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  /**
   * Gets the specified asset.
   * @param {String} id Asset ID.
   * @return {Promise}
   */
  async getAsset(id) {
    const res = await this.client.getAsset(id);
    return res.stringifySafe ? JSON.parse(res.stringifySafe()) : res;
  }

  /**
   * Gets the specified content entry.
   * @param {String} id Entry ID.
   * @return {Promise}
   */
  async getEntry(id) {
    const res = await this.client.getEntry(id);
    return res.stringifySafe ? JSON.parse(res.stringifySafe()) : res;
  }

  /**
   * Queries assets.
   * @param {Object} query Optional. Query.
   * @return {Promise}
   */
  async queryAssets(query) {
    const res = await this.client.getAssets(query);
    return res.stringifySafe ? JSON.parse(res.stringifySafe()) : res;
  }

  /**
   * Gets an array of content entries.
   * @param {Object} query Optional. Query for filtering / sorting of entries.
   * @return {Promise}
   */
  async queryEntries(query) {
    const decode = o => _.mapValues(o, prop => (typeof prop === 'object' ? decode(prop) : decodeURIComponent(prop)));
    const decoded = decode(query);
    const res = await this.client.getEntries(decoded);
    return res.stringifySafe ? JSON.parse(res.stringifySafe()) : res;
  }
}

/**
 * Updates votes count in Contentful articles
 * @param {Object} body Vote update submitted by Community App.
 * @param {String} body.id EDU article entry identifier.
 * @param {Object} body.votes Updated upvote and downvote totals.
 * @return {Promise<Object>} The updated Contentful entry when using Contentful,
 *  or the Payload endpoint's JSON response when write-through is configured.
 *  This is used by the authenticated article vote proxy route.
 * @throws {Error} If Payload write-through is enabled without an API key, the
 *  Payload endpoint rejects the request, or the Contentful update fails.
 */
export function articleVote(body) {
  const payloadUrl = config.SECRET.CONTENTFUL.PAYLOAD_VOTE_API_URL;
  if (payloadUrl) {
    const apiKey = config.SECRET.CONTENTFUL.PAYLOAD_MANAGEMENT_API_KEY;
    if (!apiKey) {
      return Promise.reject(new Error('CONTENTFUL_PAYLOAD_MANAGEMENT_API_KEY is required when Payload article voting is enabled.'));
    }
    return fetch(payloadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spaceId: config.SECRET.CONTENTFUL.EDU.SPACE_ID,
        environment: 'master',
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

  const client = contentful.createClient({
    accessToken: config.SECRET.CONTENTFUL.MANAGEMENT_TOKEN,
    httpsAgent: contentfulHttpsAgent,
  });
  return client.getSpace(config.SECRET.CONTENTFUL.EDU.SPACE_ID)
    .then(space => space.getEnvironment('master'))
    .then(environment => environment.getEntry(body.id))
    .then((entry) => {
      if (!entry.fields.upvotes) {
        // eslint-disable-next-line no-param-reassign
        entry.fields.upvotes = {
          'en-US': body.votes.upvotes,
        };
      } else {
        // eslint-disable-next-line no-param-reassign
        entry.fields.upvotes['en-US'] = body.votes.upvotes;
      }
      if (!entry.fields.downvotes) {
        // eslint-disable-next-line no-param-reassign
        entry.fields.downvotes = {
          'en-US': body.votes.downvotes,
        };
      } else {
        // eslint-disable-next-line no-param-reassign
        entry.fields.downvotes['en-US'] = body.votes.downvotes;
      }
      return entry.update();
    })
    .then(entry => entry.publish());
}

let services;

function initServiceInstances() {
  const contentfulConfig = _.omit(config.SECRET.CONTENTFUL, [
    'DEFAULT_SPACE_NAME', 'DEFAULT_ENVIRONMENT', 'MANAGEMENT_TOKEN',
    'PAYLOAD_VOTE_API_URL', 'PAYLOAD_MANAGEMENT_API_KEY',
  ]);
  services = {};
  _.map(contentfulConfig, (spaceConfig, spaceName) => {
    services[spaceName] = {};
    _.map(spaceConfig, (env, name) => {
      if (name !== 'SPACE_ID') {
        const environment = name;
        const spaceId = spaceConfig.SPACE_ID;
        const previewHost = getContentfulApiHost(env, true);
        const cdnHost = getContentfulApiHost(env, false);
        const previewBaseUrl = getContentfulApiBaseUrl(previewHost, spaceId, environment);
        const cdnBaseUrl = getContentfulApiBaseUrl(cdnHost, spaceId, environment);
        const svcs = {};

        svcs.previewService = new ApiService(
          previewBaseUrl, env.PREVIEW_API_KEY, spaceId, true, previewHost,
        );
        svcs.cdnService = new ApiService(
          cdnBaseUrl, env.CDN_API_KEY, spaceId, false, cdnHost,
        );
        services[spaceName][environment] = svcs;
      }
    });
  });
  return services;
}

/**
 * get space id for the given space name.
 * @param {String} spaceName
 */
export function getSpaceId(spaceName) {
  const name = spaceName || config.CONTENTFUL.DEFAULT_SPACE_NAME;
  return _.get(config, `SECRET.CONTENTFUL.${name}.SPACE_ID`);
}

/**
 * exports Contentful CDN/Preview services.
 * @param {String} spaceName
 * @param {String} environment
 * @param {Boolean} preview
 */
export function getService(spaceName, environment, preview) {
  if (!services) {
    services = initServiceInstances();
  }
  const name = spaceName || config.CONTENTFUL.DEFAULT_SPACE_NAME;
  const env = environment || config.CONTENTFUL.DEFAULT_ENVIRONMENT;

  if (!services[name]) {
    throw new Error(`space : '${name}' is not configured.`);
  }
  if (!services[name][env]) {
    throw new Error(`environment  : '${env}' is not configured for space : '${name}.`);
  }

  const service = services[name][env];
  return preview ? service.previewService : service.cdnService;
}

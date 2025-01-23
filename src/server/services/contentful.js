/**
 * Server-side functions necessary for effective integration
 * with Contentful CMS
 */

import _ from 'lodash';
import config from 'config';
import { createClient } from 'contentful';
import { logger } from 'topcoder-react-lib';
import { isomorphy } from 'topcoder-react-utils';
import { qs } from 'qs';

const contentful = require('contentful-management');

/* Holds Contentful CDN URL. */
const CDN_URL = 'https://cdn.contentful.com/spaces';

/* Holds Contentful Preview URL. */
const PREVIEW_URL = 'https://preview.contentful.com/spaces';

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
   */
  constructor(baseUrl, key, spaceId, preview) {
    this.private = {
      baseUrl, key, spaceId, preview,
    };
    // client config
    const clientConf = {
      accessToken: key,
      space: spaceId,
      logHandler,
    };
    if (preview) clientConf.host = 'preview.contentful.com';
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
 * @param {Object} body
 * @param {String} body.id
 * @param {Object} body.votes
 */
export function articleVote(body) {
  const client = contentful.createClient({
    accessToken: config.SECRET.CONTENTFUL.MANAGEMENT_TOKEN,
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
  ]);
  services = {};
  _.map(contentfulConfig, (spaceConfig, spaceName) => {
    services[spaceName] = {};
    _.map(spaceConfig, (env, name) => {
      if (name !== 'SPACE_ID') {
        const environment = name;
        const spaceId = spaceConfig.SPACE_ID;
        const previewBaseUrl = `${PREVIEW_URL}/${spaceId}/environments/${environment}`;
        const cdnBaseUrl = `${CDN_URL}/${spaceId}/environments/${environment}`;
        const svcs = {};

        svcs.previewService = new ApiService(
          previewBaseUrl.toString(), env.PREVIEW_API_KEY, spaceId, true,
        );
        svcs.cdnService = new ApiService(cdnBaseUrl.toString(), env.CDN_API_KEY, spaceId);
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
  console.log('getService');
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
  console.log(service, 'service debug');
  return preview ? service.previewService : service.cdnService;
}

/**
 * Isomorphic service for Contentful CMS integration.
 *
 * Unlike the server side server, that has direct access to Contentful API,
 * this service does not have access to Contentful API keys, and works via
 * Community App CDN, thus reducing the load on the Contentful APIs.
 */

import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';
import qs from 'qs';
import { config, isomorphy } from 'topcoder-react-utils';

/* Service-side Contentful services module. Some of its functionality will be
 * reused by our isomorphic code when executed at the server-side. */
let ss;
if (isomorphy.isServerSide()) {
  /* eslint-disable global-require */
  ss = require('server/services/contentful');
  /* eslint-enable global-require */
}

const LOCAL_MODE = Boolean(config.CONTENTFUL.LOCAL_MODE);

/* Holds URL of Community App CDN (and the dedicated Contentful endpoint
 * there). */
// const CDN_URL = `${config.CDN.PUBLIC}/contentful`;

/* Holds the base URL of Community App endpoints that proxy HTTP request to
 * Contentful APIs. */
const PROXY_ENDPOINT = `${LOCAL_MODE ? '' : config.URL.APP}/api/cdn/public/contentful/${config.CONTENTFUL.DEFAULT_SPACE_NAME}/${config.CONTENTFUL.DEFAULT_ENVIRONMENT}`;

/* At the client-side only, it holds the cached index of published Contentful
 * assets and content. Do not use it directly, use getIndex() function below
 * instead (it takes care about updating this when necessary). */
// let cachedIndex;

/* Holds the maximal index age [ms].
 *
 * Set to 1 minute, which means ~100k API requests to Contentful from our dev
 * and prod environments (preview API calls apart, but there should be not that
 * many of them, as the circle of potential editors is edit, compared to that of
 * the regular website visitors). */
// export const INDEX_MAXAGE = 60 * 1000;

/**
 * Generates the last version for the content index and dash announcement ID.
 * @return {Number}
 */
/*
function getLastVersion() {
  const now = Date.now();
  return now - (now % INDEX_MAXAGE);
}
*/

/**
 * Client-side only. Updates, if necessary, the cached index of Contentful
 * assets and entries, and the cached ID of the current dashboard announcement.
 * @return {Promise} Resolves once everything is up-to-date.
 */
/*
async function updateCache() {
  const now = Date.now();
  const version = getLastVersion();
  if (cachedIndex && now - cachedIndex.timestamp < INDEX_MAXAGE) return;
  let res = await Promise.all([
    fetch(`${CDN_URL}/index?version=${version}`),
    fetch(`${CDN_URL}/current-dashboard-announcement-id?version=${version}`),
  ]);
  if (!res[0].ok || !res[1].ok) {
    const error = new Error('Failed to update the cache');
    logger.error(error);
    throw error;
  }
  res = await Promise.all([res[0].json(), res[1].text()]);
  [
    cachedIndex,
    cachedCurrentDashboardAnnouncementId,
  ] = res;
  cachedIndex.timestamp = now;
}
*/

/**
 * Gets the index of assets and entries via Community App CDN.
 * @param {Number} version Optional. The version of index to fetch. Defaults to
 *  the latest index version.
 * @return {Promise}
 */
/*
async function getIndex() {
  if (isomorphy.isServerSide()) return ss.getIndex();
  await updateCache();
  return cachedIndex;
}
*/

class Service {
  /**
   * Creates a new Service instance.
   * @param {Boolean} preview Optional. If true, the service is configured to
   *  work against Contentful Preview API; otherwise - against their CDN API.
   */
  constructor(preview) {
    this.private = { preview };
  }

  /**
   * Gets the specified content entry from Contentful CMS.
   * @param {String} id Asset ID.
   * @return {Promise} Resolves to the asset data.
   */
  async getAsset(id) {
    let res;
    if (this.private.preview) {
      if (isomorphy.isServerSide()) {
        return ss.previewService.getAsset(id, true);
      }
      res = await fetch(`${PROXY_ENDPOINT}/preview/assets/${id}`);
    } else {
      if (isomorphy.isServerSide()) {
        return ss.cdnService.getAsset(id, true);
      }
      res = await fetch(`${PROXY_ENDPOINT}/published/assets/${id}`);

      /*
      const index = await getIndex();
      res = `${CDN_URL}/published/assets/${id}?version=${index.assets[id]}`;
      res = await fetch(res);
      */
    }
    if (!res.ok) {
      const error = new Error('Failed to get an asset');
      logger.error(error);
    }
    return res.json();
  }

  /**
   * Gets the specified content entry from Contentful CMS.
   * @param {String} id Entry ID.
   * @return {Promise} Resolves to the content.
   */
  async getEntry(id) {
    let res;
    if (this.private.preview) {
      if (isomorphy.isServerSide()) {
        return ss.previewService.getEntry(id);
      }
      res = await fetch(`${PROXY_ENDPOINT}/preview/entries/${id}`);
    } else {
      if (isomorphy.isServerSide()) {
        return ss.cdnService.getEntry(id);
      }
      res = await fetch(`${PROXY_ENDPOINT}/published/entries/${id}`);

      /*
      const index = await getIndex();
      let version = index.entries[id];
      if (!version) {
        version = Date.now() - INDEX_MAXAGE;
        version -= version % INDEX_MAXAGE;
      }
      res = `${CDN_URL}/published/entries/${id}?version=${version}`;
      res = await fetch(res);
      */
    }
    if (!res.ok) {
      const error = new Error('Failed to get a content entry');
      logger.error(error);
    }
    return res.json();
  }

  /**
   * Queries assets.
   * @param {Object|String} query Optional. See reference of Contentful content
   *  delivery API for supported parameters.
   * @return {Promise}
   */
  async queryAssets(query) {
    /* At server-side we just directly call server-side service,
     * to query assets from Contentful API. */
    if (isomorphy.isServerSide()) {
      const service = this.private.preview ? ss.previewService : ss.cdnService;
      return service.queryAssets(query, true);
    }

    /* At client-side we send HTTP request to Community App server,
     * which proxies it to Contentful API, via the same server-side service
     * used above. */
    let url = this.private.preview ? 'preview' : 'published';
    url = `${PROXY_ENDPOINT}/${url}/assets`;
    if (query) url += `?${_.isString(query) ? query : qs.stringify(query)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('Failed to get assets.');
      logger.error(error);
    }
    return res.json();
  }

  /**
   * Queries entries.
   * @param {Object} query Optional. See reference of Contentful content
   *  delivery API for supported parameters.
   * @return {Promise}
   */
  async queryEntries(query) {
    /* At server-side we just directly call server-side service,
     * to query entries from Contentful API. */
    if (isomorphy.isServerSide()) {
      const service = this.private.preview ? ss.previewService : ss.cdnService;
      return service.queryEntries(query);
    }

    /* At client-side we send HTTP request to Community App server,
     * which proxies it to Contentful API via the same server-side service
     * used above. */
    let url = this.private.preview ? 'preview' : 'published';
    url = `${PROXY_ENDPOINT}/${url}/entries`;
    if (query) url += `?${qs.stringify(query)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('Failed to get entries.');
      logger.error(error);
    }
    return res.json();
  }
}

export const cdnService = new Service();
export const previewService = new Service(true);

/**
 * Returns an intance of CDN or Preview service.
 * @param {Boolean} preview
 */
export function getService(preview) {
  return preview ? previewService : cdnService;
}

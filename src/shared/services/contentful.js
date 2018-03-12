/**
 * Isomorphic service for Contentful CMS integration.
 *
 * Unlike the server side server, that has direct access to Contentful API,
 * this service does not have access to Contentful API keys, and works via
 * Community App CDN, thus reducing the load on the Contentful APIs.
 */

import config from 'utils/config';
import fetch from 'isomorphic-fetch';
import logger from 'utils/logger';
import { isServerSide } from 'utils/isomorphy';

/* Service-side Contentful services module. Some of its functionality will be
 * reused by our isomorphic code when executed at the server-side. */
let ss;
if (isServerSide()) {
  /* eslint-disable global-require */
  ss = require('server/services/contentful');
  /* eslint-enable global-require */
}

/* Holds URL of Community App CDN (and the dedicated Contentful endpoint
 * there). */
const CDN_URL = `${config.CDN.PUBLIC}/contentful`;

/* Holds URL of the Community App proxy endpoint that works with the Contentful
 * preview API. */
const PREVIEW_URL = `${config.URL.APP}/api/cdn/contentful`;

/* At the client-side only, it holds the cached index of published Contentful
 * assets and content. Do not use it directly, use getIndex() function below
 * instead (it takes care about updating this when necessary). */
let cachedIndex;

/* At the client-side only, it holds the cached ID of the current dashboard
 * announcement. Do not use it directly, use getCurrentDashboardAnnouncementId()
 * function below instead (it takes care about updating this when necessary). */
let cachedCurrentDashboardAnnouncementId;

/* Holds the maximal index age [ms].
 *
 * Set to 1 minute, which means ~100k API requests to Contentful from our dev
 * and prod environments (preview API calls apart, but there should be not that
 * many of them, as the circle of potential editors is edit, compared to that of
 * the regular website visitors). */
export const INDEX_MAXAGE = 60 * 1000;

/**
 * Generates the last version for the content index and dash announcement ID.
 * @return {Number}
 */
function getLastVersion() {
  const now = Date.now();
  return now - (now % INDEX_MAXAGE);
}

/**
 * Client-side only. Updates, if necessary, the cached index of Contentful
 * assets and entries, and the cached ID of the current dashboard announcement.
 * @return {Promise} Resolves once everything is up-to-date.
 */
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
  cachedIndex = res[0];
  cachedIndex.timestamp = now;
  cachedCurrentDashboardAnnouncementId = res[1];
}

/**
 * Gets the index of assets and entries via Community App CDN.
 * @param {Number} version Optional. The version of index to fetch. Defaults to
 *  the latest index version.
 * @return {Promise}
 */
async function getIndex() {
  if (isServerSide()) return ss.getIndex();
  await updateCache();
  return cachedIndex;
}

/**
 * Gets ID of the current dashboard announcement.
 * @return {Promise} Resolves to the ID string.
 */
export async function getCurrentDashboardAnnouncementId() {
  if (isServerSide()) return ss.getCurrentDashboardAnnouncementId();
  await updateCache();
  return cachedCurrentDashboardAnnouncementId;
}

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
      if (isServerSide()) return ss.previewService.getAsset(id, true);
      res = await fetch(`${PREVIEW_URL}/assets/${id}/preview`);
    } else {
      const index = await getIndex();
      res = `${CDN_URL}/assets/${id}?version=${index.assets[id]}`;
      res = await fetch(res);
    }
    if (!res.ok) {
      const error = new Error('Failed to get an asset');
      logger.error(error);
      throw error;
    }
    return res.json();
  }

  /**
   * Gets an array of content entries.
   * @param {Object} query Optional. Query for filtering / sorting of the
   *  content.
   * @return {Promise}
   */
  /*
  async getContentEntries(query) {
    const url = `${this.private.baseUrl}/spaces/${
      config.CONTENTFUL_CMS.SPACE}/entries?${qs.stringify(query)}`;
    let res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.private.key}` },
    });
    res = await res.json();
    if (!res.includes) return res;

    if (res.includes.Asset) {
      const assets = {};
      res.includes.Asset.forEach((asset) => {
        assets[asset.sys.id] = asset;
      });
      res.assets = assets;
      delete res.includes.Asset;
    }
    return res;
  }
  */

  /**
   * Gets the specified content entry from Contentful CMS.
   * @param {String} id Entry ID.
   * @return {Promise} Resolves to the content.
   */
  async getContentEntry(id) {
    let res;
    if (this.private.preview) {
      if (isServerSide()) return ss.previewService.getContentEntry(id);
      res = await fetch(`${PREVIEW_URL}/entries/${id}/preview`);
    } else {
      const index = await getIndex();
      res = `${CDN_URL}/entries/${id}?version=${index.entries[id]}`;
      res = await fetch(res);
    }
    if (!res.ok) {
      const error = new Error('Failed to get a content entry');
      logger.error(error);
      throw error;
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

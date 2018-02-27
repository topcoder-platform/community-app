/**
 * POC of Contentful CMS integration.
 */

import _ from 'lodash';
import config from 'utils/config';
import fetch from 'isomorphic-fetch';
import logger from 'utils/logger';
import qs from 'qs';

export const CONTENTFUL_CDN =
  `https://cdn.contentful.com/spaces/${config.CONTENTFUL_CMS.SPACE}`;

/* The maximal index age [ms]. */
export const INDEX_MAXAGE = 5 * 60 * 1000;

/**
 * Maps contentful file url into our CDN file url.
 * @param {String} url
 * @return {String}
 */
export function getFileUrl(url) {
  const x = url.split('/');
  return `${config.CDN.PUBLIC}/contentful/images/${
    x[3]}/${x[4]}/${x[5]}/${x[6]}`;
}

/**
 * Gets the index of assets and entries via Community App CDN.
 * @param {Number} version Optional. The version of index to fetch. Defaults to
 *  the latest index version.
 * @return {Promise}
 */
export async function getIndex(version) {
  let v = version;
  if (!v) {
    v = Date.now();
    v -= v % INDEX_MAXAGE;
  }
  const res = await fetch(`${config.CDN.PUBLIC}/contentful/index?version=${v}`);
  if (!res.ok) {
    logger.error('Failed to get the index', res);
    throw new Error('Failed to get the index');
  }
  return res.json();
}

export async function getCurrentDashboardAnnouncementId() {
  let v = Date.now();
  v -= v % INDEX_MAXAGE;
  const res = await fetch(`${config.CDN.PUBLIC}/contentful/current-dashboard-announcement-id?version=${v}`);
  if (!res.ok) throw new Error('Failed to get the current dashboard announcement id');
  return res.json();
}

let index;
let currentDashboardAnnouncementId;

class Service {
  /**
   * Creates a new Service instance.
   * @param {Boolean} preview Optional. If true, the service is configured to
   *  work against Contentful Preview API; otherwise - against their CDN API.
   */
  constructor(preview) {
    if (preview) {
      this.private = {
        baseUrl: 'https://preview.contentful.com',
        key: config.CONTENTFUL_CMS.PREVIEW_API_KEY,
        preview: true,
      };
    } else {
      this.private = {
        baseUrl: 'https://cdn.contentful.com',
        key: config.CONTENTFUL_CMS.CDN_API_KEY,
      };
    }
  }

  async update() {
    const now = Date.now();
    if (!index || now - index.timestamp > INDEX_MAXAGE) {
      index = await getIndex();
      currentDashboardAnnouncementId =
        await getCurrentDashboardAnnouncementId();
    }
    _.noop(this);
  }

  /**
   * Gets the specified content entry from Contentful CMS.
   * @param {String} id Asset ID.
   * @return {Promise} Resolves to the asset data.
   */
  async getAsset(id) {
    if (!this.private.preview) {
      await this.update();
      const res =
        await fetch(`${config.CDN.PUBLIC}/contentful/assets/${id}?version=${
          index.assets[id]}`);
      return res.json();
    }
    return fetch(`${this.private.baseUrl}/spaces/${
      config.CONTENTFUL_CMS.SPACE}/assets/${id}`, {
      headers: {
        Authorization: `Bearer ${this.private.key}`,
      },
    }).then(res => res.json());
  }

  /**
   * Gets an array of content entries.
   * @param {Object} query Optional. Query for filtering / sorting of the
   *  content.
   * @return {Promise}
   */
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

  /**
   * Gets the specified content entry from Contentful CMS.
   * @param {String} id Entry ID.
   * @return {Promise} Resolves to the content.
   */
  async getContentEntry(id) {
    if (!this.private.preview) {
      await this.update();
      const res =
        await fetch(`${config.CDN.PUBLIC}/contentful/entries/${id}?version=${
          index.entries[id]}`);
      return res.json();
    }
    return fetch(`${this.private.baseUrl}/spaces/${
      config.CONTENTFUL_CMS.SPACE}/entries/${id}`, {
      headers: {
        Authorization: `Bearer ${this.private.key}`,
      },
    }).then(res => res.json());
  }

  async getCurrentDashboardAnnouncementId() {
    await this.update();
    return currentDashboardAnnouncementId;
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

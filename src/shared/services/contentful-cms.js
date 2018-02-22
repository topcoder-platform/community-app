/**
 * POC of Contentful CMS integration.
 */

import config from 'utils/config';
import fetch from 'isomorphic-fetch';
import qs from 'qs';

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
      };
    } else {
      this.private = {
        baseUrl: 'https://cdn.contentful.com',
        key: config.CONTENTFUL_CMS.CDN_API_KEY,
      };
    }
  }

  /**
   * Gets the specified content entry from Contentful CMS.
   * @param {String} id Asset ID.
   * @return {Promise} Resolves to the asset data.
   */
  getAsset(id) {
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
  getContentEntry(id) {
    return fetch(`${this.private.baseUrl}/spaces/${
      config.CONTENTFUL_CMS.SPACE}/entries/${id}`, {
      headers: {
        Authorization: `Bearer ${this.private.key}`,
      },
    }).then(res => res.json());
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

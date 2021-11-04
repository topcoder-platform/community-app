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
let ssContentfull;
if (isomorphy.isServerSide()) {
  /* eslint-disable global-require */
  ssContentfull = require('server/services/contentful');
  /* eslint-enable global-require */
}

// Education Center Taxonomy
const EDU_TAXONOMY_ID = '15caxocitaxyK65K9oSd91';
// The keys for subcategory lists/references
// If need to add new track add its fieldID here to be autopickuped
const EDU_TRACK_KEYS = ['dataScience', 'competitiveProgramming', 'design', 'development', 'qualityAssurance', 'topcoder', 'gigWork'];

const EDU_ARTICLE_TYPES = ['Article', 'Video', 'Forum post'];

/* Holds URL of Community App CDN (and the dedicated Contentful endpoint
 * there). */
// const CDN_URL = `${config.CDN.PUBLIC}/contentful`;

/* Holds the base URL of Community App endpoints that proxy HTTP request to
 * Contentful APIs. */
const PROXY_ENDPOINT = '/api/cdn/public/contentful';
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
   * @param {Object} spaceConfig Contentful space configuration details.
   * @param {String} spaceName Optional. If not provided, the service is
   * configured to work against default configured space; otherwise - against provided
   * spaceName.
   * @param {String} environment Optional. If not provided, the service is
   * configured to work against default configured environment; otherwise - against
   * provided contentful environment.
   * @param {Boolean} preview Optional. If true, the service is configured to
   *  work against Contentful Preview API; otherwise - against their CDN API.
   */
  constructor(spaceConfig) {
    const { spaceName, environment, preview } = spaceConfig;

    let ss;
    if (isomorphy.isServerSide()) {
      ss = ssContentfull.getService(spaceName, environment, preview);
    }
    this.private = {
      spaceName: spaceName || config.CONTENTFUL.DEFAULT_SPACE_NAME,
      environment: environment || config.CONTENTFUL.DEFAULT_ENVIRONMENT,
      preview,
      ss,
    };

    this.private.baseUrl = `${PROXY_ENDPOINT}/${this.private.spaceName}/${this.private.environment}`;
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
        return this.private.ss.getAsset(id, true);
      }
      res = await fetch(`${this.private.baseUrl}/preview/assets/${id}`);
    } else {
      if (isomorphy.isServerSide()) {
        return this.private.ss.getAsset(id, true);
      }
      res = await fetch(`${this.private.baseUrl}/published/assets/${id}`);

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
        return this.private.ss.getEntry(id);
      }
      res = await fetch(`${this.private.baseUrl}/preview/entries/${id}`);
    } else {
      if (isomorphy.isServerSide()) {
        return this.private.ss.getEntry(id);
      }
      res = await fetch(`${this.private.baseUrl}/published/entries/${id}`);

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
      return this.private.ss.queryAssets(query, true);
    }

    /* At client-side we send HTTP request to Community App server,
     * which proxies it to Contentful API, via the same server-side service
     * used above. */
    let url = this.private.baseUrl;
    url += this.private.preview ? '/preview' : '/published';
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
      return this.private.ss.queryEntries(query);
    }

    /* At client-side we send HTTP request to Community App server,
     * which proxies it to Contentful API via the same server-side service
     * used above. */
    let url = this.private.baseUrl;
    url += this.private.preview ? '/preview' : '/published';
    url += '/entries';
    if (query) url += `?${qs.stringify(query)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('Failed to get entries.');
      logger.error(error);
    }
    return res.json();
  }

  /**
   * Vote on article
   * @param {String} id Entry ID.
   * @param {Array} data The updated data array
   * @param {String} tokenV3 user's auth token
   * @returns {Promise<void>}
   */
  async articleVote(id, votes, tokenV3) {
    // eslint-disable-next-line prefer-template
    const url = this.private.baseUrl + '/votes';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenV3}`,
      },
      body: JSON.stringify({
        id, votes,
      }),
    });
    if (!res.ok) {
      const error = new Error('Failed to update article votes.');
      logger.error(error);
    }
    return res.json();
  }

  /**
   * Retrieve EDU taxonomy from Contentful by fixed id
   */
  async getEDUTaxonomy() {
    let EDUtax = await this.getEntry(EDU_TAXONOMY_ID);
    EDUtax = _.pick(EDUtax.fields, EDU_TRACK_KEYS);
    const IDs = _.flatten(
      _.map(EDUtax, items => items.map(item => item.sys.id)),
    );
    let taxonomy = await this.queryEntries({
      'sys.id[in]': IDs.join(','),
      limit: 1000,
    });
    taxonomy = _.groupBy(taxonomy.items.map(item => ({ ...item.fields, id: item.sys.id })), 'trackParent');
    return taxonomy;
  }

  /**
   * Query EDU articles
   * @param {Object} query
   */
  async getEDUContent({
    track, types, limit = 5, skip = 0, tags,
    tax, startDate, endDate, author, taxonomy, phrase, title, sortBy,
  }) {
    const query = {
      content_type: 'article',
      limit,
      skip,
    };
    if (author && author !== 'All authors') {
      // author based articles query need the authorID
      // thus we need to find it first
      await this.queryEntries({
        content_type: 'person',
        query: author,
      })
        .then((result) => {
          query['fields.contentAuthor.sys.id'] = result.total ? result.items[0].sys.id : 'NO_SUCH_ID';
        });
    }
    if (tax && track && taxonomy && taxonomy[track]) {
      // tax query is based on linked items
      // we need to find all articles that link to that specific tax[s]
      const taxIDs = [];
      if (_.isArray(tax)) {
        _.map(taxonomy[track], (contentTax) => {
          if (_.indexOf(tax, contentTax.name) !== -1) {
            taxIDs.push(contentTax.id);
          }
        });
      } else {
        const taxId = _.find(taxonomy[track], ['name', tax]);
        if (taxId) taxIDs.push(taxId.id);
      }
      if (taxIDs.length) query['fields.contentCategory.sys.id[in]'] = taxIDs.join(',');
    }
    if (track) query['fields.trackCategory'] = track;
    if (!_.isEmpty(tags)) {
      query['fields.tags[all]'] = tags.map(t => t).join(',');
    }
    if (startDate) query['fields.creationDate[gte]'] = startDate;
    if (endDate) query['fields.creationDate[lte]'] = endDate;
    if (phrase) query.query = phrase;
    if (title) query['fields.title[match]'] = title;
    if (sortBy) {
      switch (sortBy) {
        case 'Likes': query.order = '-fields.upvotes,-fields.creationDate'; break;
        default: query.order = '-fields.creationDate'; break;
      }
    }
    const content = {};
    await Promise.all(
      _.map(types || EDU_ARTICLE_TYPES,
        type => this.queryEntries({ ...query, 'fields.type': type })
          // eslint-disable-next-line no-return-assign
          .then(results => content[type] = results)),
    );
    return content;
  }

  /**
   * Get a list of all EDU content authors
   */
  async getEDUAuthors() {
    const authors = await this.queryEntries({
      content_type: 'person',
      limit: 1000,
    });
    return authors;
  }
}

/**
 * Returns an intance of CDN or Preview service.
 * @param {String} spaceName
 * @param {String} environment
 * @param {Boolean} preview
 */
export function getService({ spaceName, environment, preview }) {
  return new Service({
    spaceName: spaceName || config.CONTENTFUL.DEFAULT_SPACE_NAME,
    environment: environment || config.CONTENTFUL.DEFAULT_ENVIRONMENT,
    preview,
  });
}

/* Using default export would be confusing in this case. */
export default undefined;

/**
 * This module provides a service for conventient access to Topcoder APIs.
 */

import _ from 'lodash';
import 'isomorphic-fetch'; /* global fetch */
import config from 'utils/config';

/**
 * API service object. It is reused for both Topcoder API v2 and v3,
 * as in these cases we are fine with the same interface, and the only
 * thing we need to be different is the base URL and auth token to use.
 */
export default class Api {
  /**
   * @param {String} base Base URL of the API.
   * @param {String} token Optional. Authorization token.
   */
  constructor(base, token) {
    this.private = { base, token };
  }

  /**
   * Sends a request to the specified endpoint of the API. This method just
   * wraps fetch() in a convenient way. If this object was created with the
   * auth token, it will be automatically added to auth header of all
   * requests.
   * For additional details see https://github.github.io/fetch/
   * @param {String} enpoint Should start with slash, like /endpoint.
   * @param {Object} options Optional. Fetch options.
   * @return {Promise} It resolves to the HTTP response object. To get the
   *  actual data you probably want to call .json() method of that object.
   *  Mind that this promise rejects only on network errors. In case of
   *  HTTP errors (404, etc.) the promise will be resolved successfully,
   *  and you should check .status or .ok fields of the response object
   *  to find out the response status.
   */
  fetch(endpoint, options) {
    const p = this.private;
    const headers = { 'Content-Type': 'application/json' };
    if (p.token) headers.Authorization = `Bearer ${p.token}`;
    const ops = _.merge(_.cloneDeep(options) || {}, { headers });
    return fetch(`${p.base}${endpoint}`, ops);
  }

  /**
   * Sends DELETE request to the specified endpoint.
   * @param {String} endpoint
   * @param {Blob|BufferSource|FormData|String} body
   * @return {Promise}
   */
  delete(endpoint, body) {
    return this.fetch(endpoint, { body, method: 'DELETE' });
  }

  /**
   * Sends GET request to the specified endpoint.
   * @param {String} endpoint
   * @return {Promise}
   */
  get(endpoint) {
    return this.fetch(endpoint);
  }

  /**
   * Sends POST request to the specified endpoint.
   * @param {String} endpoint
   * @param {Blob|BufferSource|FormData|String} body
   * @return {Promise}
   */
  post(endpoint, body) {
    return this.fetch(endpoint, { body, method: 'POST' });
  }

  /**
 * Sends POST request to the specified endpoint, with JSON payload.
 * @param {String} endpoint
 * @param {JSON} json
 * @return {Promise}
 */
  postJson(endpoint, json) {
    return this.post(endpoint, JSON.stringify(json));
  }

  /**
   * Sends PUT request to the specified endpoint.
   * @param {String} endpoint
   * @param {Blob|BufferSource|FormData|String} body
   * @return {Promise}
   */
  put(endpoint, body) {
    return this.fetch(endpoint, { body, method: 'PUT' });
  }

  /**
   * Sends PUT request to the specified endpoint.
   * @param {String} endpoint
   * @param {JSON} json
   * @return {Promise}
   */
  putJson(endpoint, json) {
    return this.put(endpoint, JSON.stringify(json));
  }
}

/**
 * Topcoder API v2.
 */

/**
 * Returns a new or existing Api object for Topcoder API v2.
 * @param {String} token Optional. Auth token for Topcoder API v2.
 * @return {Api} API v2 service object.
 */
let lastApiV2 = null;
export function getApiV2(token) {
  if (!lastApiV2 || lastApiV2.private.token !== token) {
    lastApiV2 = new Api(config.API.V2, token);
  }
  return lastApiV2;
}

/**
 * Topcoder API v3.
 */

/**
 * Returns a new or existing Api object for Topcoder API v3
 * @param {String} token Optional. Auth token for Topcoder API v3.
 * @return {Api} API v3 service object.
 */
let lastApiV3 = null;
export function getApiV3(token) {
  if (!lastApiV3 || lastApiV3.private.token !== token) {
    lastApiV3 = new Api(config.API.V3, token);
  }
  return lastApiV3;
}

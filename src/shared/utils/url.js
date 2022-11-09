/**
 * Various URL-related functions.
 */

/* global window */

import _ from 'lodash';
import qs from 'qs';
import { isomorphy } from 'topcoder-react-utils';
import { BUCKETS } from 'utils/challenge-listing/buckets';

/**
 * Get current URL
 */
export function getCurrentUrl() {
  if (isomorphy.isServerSide()) return null;
  return window.location.href;
}

/**
 * Get current URL hash parameters as object
 */
export function getHash() {
  if (isomorphy.isServerSide()) return null;
  return qs.parse(window.location.hash.slice(1));
}

/**
 * Get current URL query parameters as object
 */
export function getQuery() {
  if (isomorphy.isServerSide()) return {};
  return qs.parse(window.location.search.slice(1));
}

/**
 * If executed client-side (determined in this case by the presence of global
 * window object), this function updates query section of URL; otherwise does
 * nothing.
 * @param {Object} update Specifies the update to make. Current query will be
 *  parsed into JS object, then update will be merged into that object, and the
 *  result will be pushed back to the query section of URL. I.e. to unset some
 *  field of the query, that field should be explicitely mentioned inside
 *  'update' as undefined.
 */
export function updateQuery(update) {
  if (isomorphy.isServerSide()) return;

  let filterObj = {};
  // check if bucket is selected
  if (update.bucket) {
    // fetching everything else from url except bucket
    filterObj = {
      ...qs.parse(window.location.search.slice(1)),
      ...update,
    };
    if (update.bucket === BUCKETS.ALL) {
      delete filterObj.bucket; // delete bucket field for all challenges
    }
  } else {
    // fetch only bucket from url
    const query = qs.parse(window.location.search.slice(1));
    filterObj = {
      ...(query.bucket && { bucket: query.bucket }), // fetch only bucket from url
      ...update,
    };
  }

  if (filterObj.bucket === BUCKETS.REVIEW_OPPORTUNITIES) {
    delete filterObj.types;
  }

  if (filterObj.bucket !== BUCKETS.ALL_PAST && filterObj.bucket !== BUCKETS.MY_PAST) {
    delete filterObj.endDateStart;
    delete filterObj.startDateEnd;
  }

  let query = '?';
  const { hash } = window.location;
  const filterArray = [];

  /* _.merge won't work here, because it just ignores the fields explicitely
   * set as undefined in the objects to be merged, rather than deleting such
   * fields in the target object. */
  _.forIn(filterObj, (value, key) => {
    if (_.isArray(value) && value.length > 0) filterArray.push(value.map(item => `${key}[]=${item}`).join('&'));
    // eslint-disable-next-line max-len
    else if (_.isUndefined(value) || _.isEmpty(value) || (_.isArray(value) && value.length === 0)) delete query[key];
    else if (typeof value === 'object') {
      const separator = query === '?' ? '' : '&';
      query += `${separator}${qs.stringify({ tracks: value }, { encodeValuesOnly: true })}`;
    } else {
      const separator = query === '?' ? '' : '&';
      query += `${separator}${key}=${value}`;
    }
  });
  if (query === '?') {
    if (filterArray.length > 0) {
      query += `${filterArray.join('&')}`;
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (filterArray.length > 0) {
      query += `&${filterArray.join('&')}`;
    }
  }
  query = `?${query.substring(1).split('&').sort().join('&')}`;
  if (hash) {
    query += hash;
  }
  window.history.replaceState(window.history.state, '', query);
}

/**
 * Cleans/removes trailing slash from url
 *
 * @param  {String} url The url to clean
 * @return {String}
 */
export function removeTrailingSlash(url) {
  return url.charAt(url.length - 1) === '/'
    ? url.slice(0, -1)
    : url;
}

export function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(`${url}`.toLowerCase());
}

export function isVideo(url) {
  return /\.(mp4|mov|wmv|webm|avi|mkv|flv)$/.test(`${url}`.toLowerCase());
}

export const DEFAULT_AVATAR_URL = 'https://images.ctfassets.net/b5f1djy59z3a/4PTwZVSf3W7qgs9WssqbVa/4c51312671a4b9acbdfd7f5e22320b62/default_avatar.svg';

export default undefined;

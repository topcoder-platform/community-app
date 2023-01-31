/**
 * Various URL-related functions.
 */

/* global window */

import _ from 'lodash';
import qs from 'qs';
import { isomorphy, config } from 'topcoder-react-utils';
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

/**
 * Get Payment page url from header menu.
 *
 * @return {String}
 */
export function getPaymentPageUrl() {
  const headerMenu = config.HEADER_MENU || [];
  const communityMenu = headerMenu.filter(item => item.id === 'community');

  if (communityMenu && communityMenu.length) {
    const { secondaryMenu = [] } = communityMenu[0];
    const paymentLink = secondaryMenu.filter(item => item.title === 'Payments');

    if (paymentLink && paymentLink.length) {
      return paymentLink[0].href;
    }
  }

  return '';
}

export function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(`${url}`.toLowerCase());
}

export function isVideo(url) {
  return /\.(mp4|mov|wmv|webm|avi|mkv|flv)$/.test(`${url}`.toLowerCase());
}

/**
 * Get initials from user profile
 * @param {String} firstName first name
 * @param {String} lastName last name
 * @returns {String}
 */
export function getInitials(firstName = '', lastName = '') {
  return `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`;
}

export const DEFAULT_AVATAR_URL = 'https://images.ctfassets.net/b5f1djy59z3a/4PTwZVSf3W7qgs9WssqbVa/4c51312671a4b9acbdfd7f5e22320b62/default_avatar.svg';

export const getSubPageConfiguration = () => {
  let toolName = 'Community';
  let toolRoot = '/';
  let loginRedirect = '/';
  let type = 'marketing';
  let fullFooter = true;

  const url = window.location.pathname;

  if (url.includes('/gigs')) {
    toolName = 'Gigs';
    toolRoot = '/gigs';
    loginRedirect = '/gigs';
    type = 'tool';
    fullFooter = false;
  }

  if (url.includes('/thrive')) {
    toolName = 'Articles';
    toolRoot = '/thrive';
    loginRedirect = '/thrive';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/community/arena')) {
    toolName = 'SRMs (Arena)';
    toolRoot = '/community/arena';
    loginRedirect = '/community/arena';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/challenges')) {
    toolName = 'Activity Feed';
    toolRoot = '/challenges';
    loginRedirect = '/challenges';
    type = 'tool';
    fullFooter = false;
  }

  if (url.includes('/members')) {
    toolName = 'My Profile';
    toolRoot = url;
    loginRedirect = url;
    type = 'tool';
    fullFooter = false;
  }

  if (url.includes('/privacy')) {
    toolName = 'Privacy Policy';
    toolRoot = '/privacy';
    loginRedirect = '/privacy';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/community/programs-and-events')) {
    toolName = 'Announcements';
    toolRoot = '/community/programs-and-events';
    loginRedirect = '/community/programs-and-events';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/community/gig-resources')) {
    toolName = 'Gigs';
    toolRoot = '/community/gig-resources';
    loginRedirect = '/community/gig-resources';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/community/practice')) {
    toolName = 'Challenge Practice';
    toolRoot = '/community/practice';
    loginRedirect = '/community/practice';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/community/events')) {
    toolName = 'Events';
    toolRoot = '/community/events';
    loginRedirect = '/community/events';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/community/member-programs/topcoder-open')) {
    toolName = 'Topcoder Open';
    toolRoot = '/community/member-programs/topcoder-open';
    loginRedirect = '/community/member-programs/topcoder-open';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/settings')) {
    toolName = 'Account Settings';
    toolRoot = '/settings/profile';
    loginRedirect = '/settings/profile';
    type = 'tool';
    fullFooter = false;
  }

  if (url.includes('/community/statistics')) {
    toolName = 'Statistics';
    toolRoot = '/community/statistics';
    loginRedirect = '/community/statistics';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/community/safetywing')) {
    toolName = 'Healthcare';
    toolRoot = '/community/safetywing';
    loginRedirect = '/community/safetywing';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/community/timeline-wall')) {
    toolName = 'Timeline';
    toolRoot = '/community/timeline-wall';
    loginRedirect = '/community/timeline-wall';
    type = 'marketing';
    fullFooter = true;
  }

  if (url.includes('/home')) {
    toolName = 'Home';
    toolRoot = '/home';
    loginRedirect = '/home';
    type = 'marketing';
    fullFooter = true;
  }
  return {
    toolName,
    toolRoot,
    loginRedirect,
    type,
    fullFooter,
  };
};

export default undefined;

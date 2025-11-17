/**
 * Collection of small Topcoder-related functions.
 */
/* global window */

import _ from 'lodash';
import moment from 'moment-timezone';
import { isTokenExpired } from '@topcoder-platform/tc-auth-lib';
import { config, isomorphy } from 'topcoder-react-utils';
import { services, tc } from 'topcoder-react-lib';

const { api } = services;

export const {
  OLD_COMPETITION_TRACKS,
  CHALLENGE_STATUS,
} = tc;

export const REVIEW_OPPORTUNITY_TYPES = {
  REGULAR_REVIEW: 'Review',
  COMPONENT_DEV_REVIEW: 'Component Dev Review',
  SPEC_REVIEW: 'Specification Review',
  ITERATIVE_REVIEW: 'Iterative Review',
  SCENARIOS_REVIEW: 'Scenarios Review',
};

export const COMPETITION_TRACKS = {
  DS: 'DATA_SCIENCE',
  DES: 'DESIGN',
  DEV: 'DEVELOPMENT',
  QA: 'QUALITY_ASSURANCE',
};

/**
 * Possible phase types (at the moment, this map does not cover all
 * possibilities).
 */
export const CHALLENGE_PHASE_TYPES = {
  CHECKPOINT_SUBMISSION: 'Checkpoint Submission',
  SUBMISSION: 'Submission',
};

/**
 * Codes of the Topcoder communities.
 */

export const COMPETITION_TRACKS_V3 = {
  DESIGN: 'Design',
  DEVELOP: 'Development',
  DS: 'Data Science',
  QA: 'Quality Assurance',
};

/* Holds valid subtracks (only some of possible values are included into this
 * map at the moment). */
export const SUBTRACKS = {
  FIRST_2_FINISH: 'FIRST_2_FINISH',
  UI_PROTOTYPE_COMPETITION: 'UI_PROTOTYPE_COMPETITION',
  WIREFRAMES: 'WIREFRAMES',
  QA: 'BUG_HUNT',
  TEST_SUITES: 'TEST_SUITES',
  MM: 'DEVELOP_MARATHON_MATCH',
  DESIGN_FIRST_2_FINISH: 'DESIGN_FIRST_2_FINISH',
};

/**
 * Possible user roles in a challenge (at the moment it is not a full list,
 * just those we already have used in this repo for any purpose).
 */
export const USER_ROLES = {
  SUBMITTER: 'Submitter',
};

/**
 * Given metadata object of a Topcoder sub-community, returns the canonic base
 * URL of that sub-community.
 * @param {Object} community Community meta-data.
 * @return {String}
 */
export function getSubCommunityBaseUrl(community) {
  return community.mainSubdomain
    ? config.URL.BASE.replace('www', community.mainSubdomain)
    : `/community/${community.communityId}`;
}

/**
 * Given user avatar URL from TC API, returns the corresponding avatar URL in
 * Community App CDN.
 * @param {String} apiUrl Avatar URL from TC API.
 * @param {Number} size Optional. Target avatar size (width). Defaults to 100px.
 * @return {String} Avatar URL in CDN.
 */
export function getCdnAvatarUrl(apiUrl, size = 100) {
  if (!apiUrl) return '';
  return `${config.CDN.PUBLIC}/avatar/${
    encodeURIComponent(apiUrl)}?size=${size}`;
}

/**
 * Given user rating returns corresponding rating level (from 1 to 5, both
 * inclusive). The rating levels are used to group members into categories
 * by their performance, and to assign colors to their handles.
 * @param {Number} rating
 * @return {Number} Rating level.
 */
export function getRatingLevel(rating) {
  if (rating < 900) return 1;
  if (rating < 1200) return 2;
  if (rating < 1500) return 3;
  if (rating < 2200) return 4;
  return 5;
}

/**
 * Given a rating value, returns corresponding color.
 *
 * !!! DEPRECATED !!! Use the getRatingLevel(..) function above to get
 * the rating level, and then use SCSS color mixins to set corresponding colors.
 *
 * @param {Number} rating Rating.
 * @return {String} Color.
 */
/* TODO: The actual color values below are taken from topcoder-app. Probably,
 * they don't match colors in the current Topcoder style guide. */
export const RATING_COLORS = [{
  color: '#555555' /* Grey */,
  limit: 900,
}, {
  color: '#2D7E2D' /* Green */,
  limit: 1200,
}, {
  color: '#616BD5' /* Blue */,
  limit: 1500,
}, {
  color: '#F2C900' /* Yellow */,
  limit: 2200,
}, {
  color: '#EF3A3A' /* Red */,
  limit: Infinity,
}];

export function getRatingColor(rating) {
  let i = 0; const r = Number(rating);
  while (RATING_COLORS[i].limit <= r) i += 1;
  return RATING_COLORS[i].color || 'black';
}

export const HIGHLIGHTED_RATING_COLORS = [{
  color: '#464646' /* Grey */,
  limit: 900,
}, {
  color: '#00ab00' /* Green */,
  limit: 1200,
}, {
  color: '#3748ff' /* Blue */,
  limit: 1500,
}, {
  color: '#ffe879' /* Yellow */,
  limit: 2200,
}, {
  color: '#ff2a2a' /* Red */,
  limit: Infinity,
}];
export function getHighlightedColor(rating) {
  let i = 0; const r = Number(rating);
  while (HIGHLIGHTED_RATING_COLORS[i].limit <= r) i += 1;
  return HIGHLIGHTED_RATING_COLORS[i].color || 'black';
}

export const UNSELECTED_RATING_COLORS = [{
  color: '#f3f3f3' /* Grey */,
  limit: 900,
}, {
  color: '#e6f6e6' /* Green */,
  limit: 1200,
}, {
  color: '#c5c8ef' /* Blue */,
  limit: 1500,
}, {
  color: '#fff5c4' /* Yellow */,
  limit: 2200,
}, {
  color: '#f47d7d' /* Red */,
  limit: Infinity,
}];
export function getUnSelectedColors(rating) {
  let i = 0; const r = Number(rating);
  while (UNSELECTED_RATING_COLORS[i].limit <= r) i += 1;
  return UNSELECTED_RATING_COLORS[i].color || 'black';
}

/**
 * Given ExpressJS HTTP request it extracts Topcoder auth tokens from cookies,
 * if they are present there and are not expired.
 * @param {Object} req ExpressJS HTTP request. For convenience, it is allowed to
 *  call this function without "req" argument (will result in empty tokens).
 * @return {Object} It will contain two string fields: tokenV2 and tokenV3.
 *  These strings will be empty if corresponding cookies are absent, or expired.
 */
export function getAuthTokens(req = {}) {
  const cookies = req.cookies || {};
  let tokenV2 = cookies.tcjwt;
  let tokenV3 = cookies.tcjwt;

  if (!tokenV2 || isTokenExpired(tokenV2, config.AUTH_DROP_TIME)) {
    tokenV2 = '';
  }
  if (!tokenV3 || isTokenExpired(tokenV3, config.AUTH_DROP_TIME)) {
    tokenV3 = '';
  }
  return { tokenV2, tokenV3 };
}

/**
  * Get M2M Token
  * @return {Promise}
  */
export async function getM2mToken() {
  return api.getTcM2mToken().then((m2mToken => m2mToken));
}

/**
 * At the client side it redirects to Topcoder login, with the current URL used
 * as the return address. Does nothing at the server side.
 * @param {String} utmSource
 */
export function goToLogin(utmSource = '') {
  if (isomorphy.isClientSide()) {
    const retUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}`);
    window.location = `${config.URL.AUTH}/member?retUrl=${retUrl}&utm_source=${utmSource}`;
  }
}

/**
 * Calculate the difference from now to a specified date
 * adopt from topcoder-app repo
 * @param  {Date} input the date to diff
 * @param  {string} type  type to retrieve
 * @return {number|string|array} diff info depends on the type
 */
export function timeDiff(input, type) {
  const fromNow = moment(input).fromNow(true);

  // Split into components: ['an', 'hour'] || ['2', 'months']
  const timeAndUnit = fromNow.split(' ');

  if (timeAndUnit[0] === 'a' || timeAndUnit[0] === 'an') {
    timeAndUnit[0] = '1';
  }
  if (type === 'quantity') {
    return timeAndUnit[0];
  } if (type === 'unit') {
    return timeAndUnit[1];
  }
  return timeAndUnit;
}

/**
 * convert a date to specified local format
 * adopt from topcoder-app repo
 * @param  {Date} input    date to format
 * @param  {string} format date format
 * @return {string}        formated date string
 */
export function localTime(input, format) {
  return moment(input).local().format(format || 'MM/DD/YY hh:mm a z');
}

/**
 * remove the underscore character of a string
 * adopt from topcoder-app repo
 * @param  {string} string string to process
 * @return {string}        processed string
 */
export function stripUnderscore(string) {
  const map = {
    ASSEMBLY_COMPETITION: 'ASSEMBLY',
  };
  if (map[string]) {
    return map[string];
  }
  if (!string) {
    return '';
  }
  return string.replace(/_/g, ' ');
}

/**
 * process srm to populate additional infomation
 * adopt from topcoder-app repo
 * @param  {Object} s  srm to process
 * @return {Object}    processed srm
 */
export function processSRM(s) {
  const srm = _.cloneDeep(s);
  srm.userStatus = 'registered';
  if (Array.isArray(srm.rounds) && srm.rounds.length) {
    if (srm.rounds[0].userSRMDetails && srm.rounds[0].userSRMDetails.rated) {
      srm.result = srm.rounds[0].userSRMDetails;
    }
    if (srm.rounds[0].codingStartAt) {
      srm.codingStartAt = srm.rounds[0].codingStartAt;
    }
    if (srm.rounds[0].codingEndAt) {
      srm.codingEndAt = srm.rounds[0].codingEndAt;
    }
    if (srm.rounds[0].registrationStartAt) {
      srm.registrationStartAt = srm.rounds[0].registrationStartAt;
    }
    if (srm.rounds[0].registrationEndAt) {
      srm.registrationEndAt = srm.rounds[0].registrationEndAt;
    }
  }

  // determines if the current phase is registration
  let start = moment(srm.registrationStartAt).unix();
  let end = moment(srm.registrationEndAt).unix();
  let now = moment().unix();
  if (start <= now && end >= now) {
    srm.currentPhase = 'REGISTRATION';
  }
  // determines if the current phase is coding
  start = moment(srm.codingStartAt).unix();
  end = moment(srm.codingEndAt).unix();
  now = moment().unix();
  if (start <= now && end >= now) {
    srm.currentPhase = 'CODING';
  }
  return srm;
}

/**
 * Compare two strings, null/undefined/empty are considered as equal.
 * @param {String} str1 One string
 * @param {String} str2 Another string
 * @returns {Boolean} true if two strings equal, false otherwise
 */
export function looseEqual(str1, str2) {
  return (!str1 && !str2) || str1 === str2;
}

/**
 * Format a UTC date string to a more readable date string
 * @param {String} date string
 * @param {Boolean} whether to abbreviate month string
 * @param {Boolean} whether to showDay
 * @returns {String} formatted date string
 */
export function formatDate(date, abbreviate, showDay) {
  const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December',
  ];
  const [y, m, d] = date.split('T')[0].split('-');
  let month = `${monthNames[m - 1]}`;
  if (abbreviate) {
    month = month.substr(0, 3);
  }

  if (showDay) {
    return `${month} ${d}, ${y}`;
  }

  return `${month} ${y}`;
}

/**
 * Test if a string is valid email
 * @param {String} email The string to test
 */
export function isValidEmail(email) {
  const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  return pattern.test(email);
}

/**
 * Test if the file is safe for download. This patch currently checks the location of the submission
 * to determine if the file is infected or not. This is an immedaite patch, and should be updated to
 * check the review scan score for review type virus scan.
 *
 * @returns {String|Boolean} true if submission is safe for download,
 * otherwise string describing reason for not being safe for download
 */
export function safeForDownload(url) {
  if (url == null) return 'Download link unavailable';

  if (url.toLowerCase().indexOf('submissions-quarantine/') !== -1) {
    return 'Malware found in submission';
  }

  if (url.toLowerCase().indexOf('submissions-dmz/') !== -1) {
    return 'AV Scan in progress';
  }

  return true;
}

export default undefined;

/**
 * Provides misc event helper functions.
 */
import _ from 'lodash';

/**
 * Return single track list by track name
 * @param {string} track name
 * @param {array} finalists data
 * @returns {object} Contains finalist and champion data
 */
export function getSingleTrackList(track, list) {
  const result = _.filter(list, item => item.fields.track === track);
  if (result && result.length > 0) {
    return result[0];
  }
  return null;
}

/**
 * Gets x random stories
 * @param {Number} count The number of random stories to return
 * @return {Array} Array of stories objects
 */
export function getStories(count, list) {
  return _.shuffle(list).slice(0, count);
}

export default undefined;

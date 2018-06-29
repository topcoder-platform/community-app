/**
 * Provides misc track home pages helper functions.
 */
import _ from 'lodash';

/**
 * Get x random array items
 * @param {Number} count The number of random tips&quotes to return
 * @returns {Array} list of array items objects
 */
export function getItems(count, list) {
  return _.shuffle(list).slice(0, count);
}


export default undefined;

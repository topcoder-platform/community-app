import _ from 'lodash';

/**
 * Normalizes styles object to ReactJS format (camelCase property names).
 * @param {Object} style
 * @return {Object}
 */
export function fixStyle(style) {
  return style ? _.mapKeys(style, (value, key) => _.camelCase(key)) : undefined;
}

export default undefined;

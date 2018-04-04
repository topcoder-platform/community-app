/**
 * Various URL-related functions.
 */

/* global window */

import _ from 'lodash';
import qs from 'qs';
import { isomorphy } from 'topcoder-react-utils';

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

  let query = qs.parse(window.location.search.slice(1));

  /* _.merge won't work here, because it just ignores the fields explicitely
   * set as undefined in the objects to be merged, rather than deleting such
   * fields in the target object. */
  _.forIn(update, (value, key) => {
    if (_.isUndefined(value)) delete query[key];
    else query[key] = value;
  });
  query = `?${qs.stringify(query, { encodeValuesOnly: true })}`;
  window.history.replaceState(window.history.state, '', query);
}

export default undefined;

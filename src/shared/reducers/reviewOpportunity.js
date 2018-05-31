/**
 * Reducer for state.reviewOpportunity
 */

import _ from 'lodash';
import { getAuthTokens } from 'utils/tc';
import { reducers } from 'topcoder-react-lib';

/**
 * Factory which creates a new reducer with its initial state tailored to the
 * ExpressJS HTTP request, if specified (for server-side rendering). If HTTP
 * request is not specified, it creates just the default reducer.
 * @param {Object} req Optional. ExpressJS HTTP request.
 * @return Promise which resolves to the new reducer.
 */
export function factory(req) {
  const options = {};

  if (req && req.url.match(/^\/challenges\/\d{8}\/review-opportunities/)) {
    options.auth = getAuthTokens(req);
    const challengeId = req.url.match(/\d+/)[0];
    _.set(options, 'reviewOpportunity.challenge.id', challengeId);
  }

  return reducers.reviewOpportunity.factory(options);
}

/* Default reducer with empty initial state. */
export default factory();

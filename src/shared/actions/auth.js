/**
 * Auth-related actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getApiV3 } from 'services/api';
import { decodeToken } from 'tc-accounts';

/**
 * Loads profile of the authenticated user.
 * @param {String} userTokenV3 Topcoder auth token V3.
 * @return Promise which resolves to the loaded profile object.
 */
function loadProfileDone(userTokenV3) {
  if (!userTokenV3) return Promise.resolve(null);
  const username = decodeToken(userTokenV3).handle;
  return getApiV3(userTokenV3).get(`/members/${username}`)
    .then(res => res.json()).then(res => res.result.content);
}

export default createActions({
  AUTH: {
    LOAD_PROFILE: loadProfileDone,

    /* Given TC auth token V2, this action writes it into state.auth.tokenV2. */
    SET_TC_TOKEN_V2: _.identity,

    /* Given TC auth token V3 this action:
     *  - Decodes token and writes resulting user object into state.auth.user;
     *  - Writes the token itself into state.auth.tokenV3. */
    SET_TC_TOKEN_V3: _.identity,
  },
});

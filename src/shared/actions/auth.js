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
  const user = decodeToken(userTokenV3);
  const api = getApiV3(userTokenV3);
  return Promise.all([
    api.get(`/members/${user.handle}`)
      .then(res => res.json()).then(res =>
        (res.result.status === 200 ? res.result.content : {})),
    api.get(`/groups?memberId=${user.userId}&membershipType=user`)
      .then(res => res.json()).then(res =>
        (res.result.status === 200 ? res.result.content : [])),
  ]).then(([profile, groups]) => ({ ...profile, groups }));
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

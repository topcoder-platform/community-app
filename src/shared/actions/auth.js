/**
 * Auth-related actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';

export default createActions({
  AUTH: {
    /* Given TC auth token V2, this action writes it into state.auth.tokenV2. */
    SET_TC_TOKEN_V2: _.identity,

    /* Given TC auth token V3 this action:
     *  - Decodes token and writes resulting user object into state.auth.user;
     *  - Writes the token itself into state.auth.tokenV3. */
    SET_TC_TOKEN_V3: _.identity,
  },
});

/**
 * Auth-related actions.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';

export default createActions({
  AUTH: {
    /* Given TC auth token this action:
     *  - Decodes token and writes resulting user object into state.auth.user;
     *  - Writes the token itself into state.auth.token. */
    SET_TC_TOKEN: _.identity,
  },
});

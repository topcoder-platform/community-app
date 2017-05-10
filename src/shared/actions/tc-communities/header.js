/**
 * Actions for communities header.
 */

/* global fetch */

import _ from 'lodash';
import { createActions } from 'redux-actions';

function fetchDataDone(communityId) {
  /* NOTE: In the real life most likely we don't want to use fetch() directly here.
     Most likely we will use existent service for TC API v2 or v3
  */
  return fetch(`/api/tc-communities/${communityId}/header`)
    .then((res) => {
      // if community with specified communityId is not found
      // reject with 404 error
      if (res.status === 404) {
        return Promise.reject({ error: '404', communityId });
      }

      return res.json();
    });
}

export default createActions({
  TC_COMMUNITIES: {
    HEADER: {
      MOBILE_TOGGLE: _.noop,
      FETCH_DATA_INIT: _.noop,
      FETCH_DATA_DONE: fetchDataDone,
    },
  },
});

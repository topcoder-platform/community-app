/**
 * Actions for communities meta data.
 */

/* global fetch */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { isClientSide } from 'utils/isomorphy';
import { getCommunitiesMetadata } from 'utils/tc';

function fetchDataDone(communityId) {
  /*
    Now we have demo API which is served by local server

    When we make request to meta API in the browser /api/tc-communities/${communityId}/meta
    it's ok, because browser knows the host address.

    But when we make the same request on the server it doesn't know the host address.
    So instead for this demo API, we load data directly from file system on the server.
   */
  if (isClientSide()) {
    /* NOTE: In the real life most likely we don't want to use fetch() directly here.
       Most likely we will use existent service for TC API v2 or v3
    */
    return fetch(`/api/tc-communities/${communityId}/meta`)
      .then((res) => {
        // if community with specified communityId is not found
        // reject with 404 error
        if (res.status === 404) {
          return Promise.reject({ error: '404', communityId });
        }

        return res.json();
      });
  }
  return getCommunitiesMetadata(communityId);
}

export default createActions({
  TC_COMMUNITIES: {
    META: {
      MOBILE_TOGGLE: _.noop,
      FETCH_DATA_INIT: _.noop,
      FETCH_DATA_DONE: fetchDataDone,
    },
  },
});

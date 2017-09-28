/**
 * Actions for communities meta data.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getCommunitiesService } from 'services/communities';

/**
 * Corresponding action initializes loading of meta-data for the specified
 * community. communityId will be stored in the Redux, and only results of
 * fetchDataDone(..) dispatched with the matching ID will be accepted, any
 * other results will be silently dicarted.
 * @param {String} communityId
 * @return {String} Community ID.
 */
function fetchDataInit(communityId) {
  return communityId;
}

/**
 * Corresponding action loads meta-data for the specified community.
 * @param {String} communityId
 */
function fetchDataDone(communityId, tokenV3) {
  return getCommunitiesService(tokenV3).getMetadata(communityId);
}

export default createActions({
  TC_COMMUNITIES: {
    META: {
      MOBILE_TOGGLE: _.noop, /* TODO: This action should not be here. It does
        * not related to the meta-data! */
      FETCH_DATA_INIT: fetchDataInit,
      FETCH_DATA_DONE: fetchDataDone,
    },
  },
});

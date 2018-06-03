/**
 * Actions for communities meta data.
 */

import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getCommunitiesService } from 'services/communities';
import { actions } from 'topcoder-react-utils';

const itemActions = actions.item;

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
 * @param {String} tokenV3 Optional.
 * @return {Action}
 */
async function fetchDataDone(communityId, tokenV3) {
  const data = await getCommunitiesService(tokenV3).getMetadata(communityId);
  return itemActions.loadDataDone(communityId, data).payload;
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

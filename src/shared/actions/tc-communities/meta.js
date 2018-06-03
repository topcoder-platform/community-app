/**
 * Actions for communities meta data.
 */

import _ from 'lodash';
import { getService as getCommunitiesService } from 'services/communities';
import { actions, redux } from 'topcoder-react-utils';

const itemActions = actions.item;

/**
 * Corresponding action loads meta-data for the specified community.
 * @param {String} communityId
 * @param {String} tokenV3 Optional.
 * @return {Action}
 */
async function fetchDataDone(communityId, tokenV3) {
  const data = await getCommunitiesService(tokenV3).getMetadata(communityId);
  return redux.proxyAction(itemActions.loadDataDone)(communityId, data);
}

export default redux.createActions({
  TC_COMMUNITIES: {
    META: {
      MOBILE_TOGGLE: _.noop, /* TODO: This action should not be here. It does
        * not related to the meta-data! */
      FETCH_DATA_INIT: redux.proxyAction(itemActions.loadDataInit),
      FETCH_DATA_DONE: fetchDataDone,
    },
  },
});

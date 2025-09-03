import _ from 'lodash';
import { createActions } from 'redux-actions';
import { getService as getCommunitiesService } from 'services/communities';
import { services } from 'topcoder-react-lib';

const getGroupService = services.groups.getService;

/**
 * Creates the action for joining the group.
 * @param {String} token Topcoder auth token V3.
 * @param {String} groupId
 * @param {String} memberId
 */
/* TODO: Should be updated to add member to all groups related to the community.
 */
function joinDone(token, groupId, memberId) {
  const service = getGroupService(token);
  return service.addMember(groupId, memberId, 'user');
}

/**
 * Payload creator for the action that inits the loading of the list of
 * communities visible to the user.
 * @param {String} uuid Operation UUID. Only results of the matching
 *  getListDone() request will be stored to the Redux state.
 * @return {String}
 */
function getListInit(uuid) {
  return uuid;
}

/**
 * Payload creator for the action that fetches the list of communities visible
 * to the user.
 * @param {String} uuid Operation UUID. Should match with the one passed to
 *  getListInit().
 * @param {Object} auth Authorization data object.
 * @return {Promise}
 */
function getListDone(uuid, auth) {
  const groups = _.get(auth, 'profile.groups', []).map(g => g.id);
  return getCommunitiesService(auth.tokenV3)
    .getList(groups).then(list => ({ list, uuid }));
}

export default createActions({
  TC_COMMUNITY: {
    GET_LIST_INIT: getListInit,
    GET_LIST_DONE: getListDone,
    HIDE_JOIN_BUTTON: _.noop,
    JOIN_INIT: _.noop,
    JOIN_DONE: joinDone,
    RESET_JOIN_BUTTON: _.noop,
    SHOW_JOIN_CONFIRM_MODAL: _.noop,
  },
});
